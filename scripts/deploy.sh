#!/bin/bash

# 生产环境部署脚本
# 用于自动化部署君健设计师平台

set -e  # 遇到错误立即退出

# 配置变量
PROJECT_DIR="/opt/junjian-platform"
BACKUP_DIR="/opt/backups/junjian-platform"
LOG_FILE="/var/log/junjian-deploy.log"
DATE=$(date +"%Y%m%d_%H%M%S")

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✓ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ✗ $1${NC}" | tee -a "$LOG_FILE"
}

# 检查是否为root用户
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要root权限运行"
        exit 1
    fi
}

# 创建必要的目录
create_directories() {
    log "创建必要的目录..."
    mkdir -p "$PROJECT_DIR" "$BACKUP_DIR" "/var/log" "/opt/secrets"
    log_success "目录创建完成"
}

# 备份当前部署
backup_current() {
    if [ -d "$PROJECT_DIR" ]; then
        log "备份当前部署到 $BACKUP_DIR/backup_$DATE"
        cp -r "$PROJECT_DIR" "$BACKUP_DIR/backup_$DATE"
        log_success "备份完成"
    else
        log_warning "没有找到现有部署，跳过备份"
    fi
}

# 停止现有服务
stop_services() {
    log "停止现有服务..."
    cd "$PROJECT_DIR" || exit 1
    
    if [ -f "docker-compose.prod.yml" ]; then
        docker-compose -f docker-compose.prod.yml down
        log_success "Docker服务已停止"
    else
        log_warning "未找到docker-compose.prod.yml文件"
    fi
}

# 拉取最新代码
pull_code() {
    log "拉取最新代码..."
    cd "$PROJECT_DIR" || exit 1
    
    if [ -d ".git" ]; then
        git pull origin main
        log_success "代码更新完成"
    else
        log "克隆代码仓库..."
        cd /opt
        git clone https://github.com/Qsets/rj-designer-platform.git junjian-platform
        cd "$PROJECT_DIR"
        log_success "代码克隆完成"
    fi
}

# 生成密钥文件
generate_secrets() {
    log "生成密钥文件..."
    
    # 创建secrets目录
    mkdir -p "$PROJECT_DIR/secrets"
    
    # 生成MySQL密码
    if [ ! -f "$PROJECT_DIR/secrets/mysql_root_password.txt" ]; then
        openssl rand -base64 32 > "$PROJECT_DIR/secrets/mysql_root_password.txt"
        log_success "MySQL root密码已生成"
    fi
    
    if [ ! -f "$PROJECT_DIR/secrets/mysql_password.txt" ]; then
        openssl rand -base64 32 > "$PROJECT_DIR/secrets/mysql_password.txt"
        log_success "MySQL用户密码已生成"
    fi
    
    # 生成JWT密钥
    if [ ! -f "$PROJECT_DIR/secrets/jwt_secret.txt" ]; then
        openssl rand -base64 64 > "$PROJECT_DIR/secrets/jwt_secret.txt"
        log_success "JWT密钥已生成"
    fi
    
    # 生成Grafana密码
    if [ ! -f "$PROJECT_DIR/secrets/grafana_password.txt" ]; then
        openssl rand -base64 16 > "$PROJECT_DIR/secrets/grafana_password.txt"
        log_success "Grafana密码已生成"
    fi
    
    # 提示手动配置支付宝和微信密钥
    log_warning "请手动配置以下文件："
    log_warning "- $PROJECT_DIR/secrets/alipay_private_key.txt (支付宝私钥)"
    log_warning "- $PROJECT_DIR/secrets/wechat_app_secret.txt (微信应用密钥)"
    
    # 设置文件权限
    chmod 600 "$PROJECT_DIR/secrets/"*
    chown root:root "$PROJECT_DIR/secrets/"*
    log_success "密钥文件权限设置完成"
}