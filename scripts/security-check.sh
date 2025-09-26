#!/bin/bash

# 安全检查脚本
# 用于检查系统安全状态和潜在威胁

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

# 检查可疑IP
check_suspicious_ips() {
    log "检查可疑IP连接..."
    
    # 检查大量连接的IP
    netstat -an | grep :80 | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -10 > /tmp/top_ips.txt
    
    if [ -s /tmp/top_ips.txt ]; then
        log_warning "发现以下高频访问IP："
        cat /tmp/top_ips.txt
    else
        log_success "未发现异常IP连接"
    fi
    
    rm -f /tmp/top_ips.txt
}

# 检查文件完整性
check_file_integrity() {
    log "检查关键文件完整性..."
    
    PROJECT_DIR="/opt/junjian-platform"
    
    if [ -d "$PROJECT_DIR" ]; then
        # 检查配置文件是否被修改
        find "$PROJECT_DIR" -name "*.yml" -o -name "*.conf" -o -name "*.json" | while read file; do
            if [ -f "$file" ]; then
                # 检查文件权限
                perms=$(stat -c "%a" "$file")
                if [ "$perms" != "644" ] && [ "$perms" != "600" ]; then
                    log_warning "文件权限异常: $file ($perms)"
                fi
            fi
        done
        
        log_success "文件完整性检查完成"
    else
        log_error "项目目录不存在: $PROJECT_DIR"
    fi
}

# 检查端口扫描
check_port_scan() {
    log "检查端口扫描活动..."
    
    # 检查最近的连接日志
    if [ -f "/var/log/auth.log" ]; then
        # 检查SSH暴力破解尝试
        failed_ssh=$(grep "Failed password" /var/log/auth.log | tail -20)
        if [ -n "$failed_ssh" ]; then
            log_warning "发现SSH登录失败记录："
            echo "$failed_ssh" | tail -5
        else
            log_success "未发现SSH暴力破解尝试"
        fi
    fi
    
    # 检查开放端口
    open_ports=$(netstat -tuln | grep LISTEN)
    log "当前开放端口："
    echo "$open_ports"
}

# 检查系统资源
check_system_resources() {
    log "检查系统资源使用情况..."
    
    # CPU使用率
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    log "CPU使用率: ${cpu_usage}%"
    
    # 内存使用率
    mem_usage=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
    log "内存使用率: ${mem_usage}%"
    
    # 磁盘使用率
    disk_usage=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
    log "磁盘使用率: ${disk_usage}%"
    
    # 检查是否有异常高的资源使用
    if (( $(echo "$cpu_usage > 80" | bc -l) )); then
        log_warning "CPU使用率过高: ${cpu_usage}%"
    fi
    
    if (( $(echo "$mem_usage > 80" | bc -l) )); then
        log_warning "内存使用率过高: ${mem_usage}%"
    fi
    
    if [ "$disk_usage" -gt 80 ]; then
        log_warning "磁盘使用率过高: ${disk_usage}%"
    fi
}

# 检查Docker容器状态
check_docker_status() {
    log "检查Docker容器状态..."
    
    if command -v docker &> /dev/null; then
        # 检查运行中的容器
        running_containers=$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}")
        log "运行中的容器："
        echo "$running_containers"
        
        # 检查容器资源使用
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
    else
        log_warning "Docker未安装或不可用"
    fi
}

# 主函数
main() {
    log "开始安全检查..."
    
    check_suspicious_ips
    check_file_integrity
    check_port_scan
    check_system_resources
    check_docker_status
    
    log_success "安全检查完成！"
}

# 执行主函数
main