#!/bin/bash

# 系统安全配置脚本
# 用于配置防火墙、SSL证书和系统安全参数

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✓ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠ $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ✗ $1${NC}"
}

# 检查root权限
if [[ $EUID -ne 0 ]]; then
    log_error "此脚本需要root权限运行"
    exit 1
fi

# 配置防火墙
setup_firewall() {
    log "配置防火墙规则..."
    
    # 安装ufw（如果未安装）
    if ! command -v ufw &> /dev/null; then
        apt-get update
        apt-get install -y ufw
    fi
    
    # 重置防火墙规则
    ufw --force reset
    
    # 默认策略
    ufw default deny incoming
    ufw default allow outgoing
    
    # 允许SSH（请根据实际SSH端口修改）
    ufw allow 22/tcp comment 'SSH'
    
    # 允许HTTP和HTTPS
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    
    # 允许本地MySQL和Redis访问（仅本地）
    ufw allow from 127.0.0.1 to any port 3306 comment 'MySQL local'
    ufw allow from 127.0.0.1 to any port 6379 comment 'Redis local'
    
    # 启用防火墙
    ufw --force enable
    
    log_success "防火墙配置完成"
}

# 生成SSL证书
generate_ssl() {
    log "生成SSL证书..."
    
    SSL_DIR="/opt/junjian-platform/nginx/ssl"
    mkdir -p "$SSL_DIR"
    
    # 生成自签名证书（生产环境建议使用Let's Encrypt）
    if [ ! -f "$SSL_DIR/server.crt" ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$SSL_DIR/server.key" \
            -out "$SSL_DIR/server.crt" \
            -subj "/C=CN/ST=Beijing/L=Beijing/O=JunJian/OU=IT/CN=localhost"
        
        chmod 600 "$SSL_DIR/server.key"
        chmod 644 "$SSL_DIR/server.crt"
        
        log_success "SSL证书生成完成"
        log_warning "生产环境请使用正式的SSL证书"
    else
        log "SSL证书已存在，跳过生成"
    fi
}

# 配置系统安全参数
setup_system_security() {
    log "配置系统安全参数..."
    
    # 禁用不必要的服务
    systemctl disable --now avahi-daemon 2>/dev/null || true
    systemctl disable --now cups 2>/dev/null || true
    
    # 配置网络安全参数
    cat > /etc/sysctl.d/99-security.conf << EOF
# 网络安全配置
net.ipv4.ip_forward = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1
net.ipv4.tcp_syncookies = 1
EOF
    
    # 应用系统参数
    sysctl -p /etc/sysctl.d/99-security.conf
    
    # 配置文件系统安全参数
    echo "* hard nofile 65536" >> /etc/security/limits.conf
    echo "* soft nofile 65536" >> /etc/security/limits.conf
    
    log_success "系统安全参数配置完成"
}

# 主函数
main() {
    log "开始系统安全配置..."
    
    setup_firewall
    generate_ssl
    setup_system_security
    
    log_success "系统安全配置完成！"
    log "请重启系统以确保所有配置生效"
}

# 执行主函数
main