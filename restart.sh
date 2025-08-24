#!/bin/bash

# 单文件HTML上传与导航网站重启脚本
# 使用方法: ./restart.sh restart

APP_NAME="nav-web-site"
PORT=3000
LOG_FILE="app.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 检查端口是否被占用
check_port() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -ti:$PORT
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tlnp 2>/dev/null | grep ":$PORT " | awk '{print $7}' | cut -d'/' -f1
    else
        # Windows环境
        netstat -ano | findstr ":$PORT" | awk '{print $5}' 2>/dev/null
    fi
}

# 停止应用
stop_app() {
    log "正在停止 $APP_NAME 应用..."
    
    # 查找占用端口的进程
    PIDS=$(check_port)
    
    if [ -z "$PIDS" ]; then
        warning "端口 $PORT 没有被占用"
        return 0
    fi
    
    # 停止进程
    for PID in $PIDS; do
        if [ ! -z "$PID" ] && [ "$PID" != "0" ]; then
            log "正在停止进程 PID: $PID"
            
            # 尝试优雅停止
            if kill -TERM "$PID" 2>/dev/null; then
                sleep 3
                
                # 检查进程是否还在运行
                if kill -0 "$PID" 2>/dev/null; then
                    warning "进程 $PID 未响应 SIGTERM，使用 SIGKILL 强制停止"
                    kill -KILL "$PID" 2>/dev/null
                fi
                
                success "进程 $PID 已停止"
            else
                error "无法停止进程 $PID"
            fi
        fi
    done
    
    # 再次检查端口
    sleep 1
    REMAINING_PIDS=$(check_port)
    if [ ! -z "$REMAINING_PIDS" ]; then
        error "仍有进程占用端口 $PORT: $REMAINING_PIDS"
        return 1
    fi
    
    success "$APP_NAME 应用已停止"
    return 0
}

# 启动应用
start_app() {
    log "正在启动 $APP_NAME 应用..."
    
    # 检查是否在正确的目录
    if [ ! -f "package.json" ]; then
        error "未找到 package.json 文件，请确保在项目根目录运行此脚本"
        return 1
    fi
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        log "未找到 node_modules，正在安装依赖..."
        npm install
        if [ $? -ne 0 ]; then
            error "依赖安装失败"
            return 1
        fi
    fi
    
    # 检查端口是否被占用
    EXISTING_PIDS=$(check_port)
    if [ ! -z "$EXISTING_PIDS" ]; then
        error "端口 $PORT 已被占用，进程 PID: $EXISTING_PIDS"
        return 1
    fi
    
    # 启动应用
    log "在端口 $PORT 启动应用..."
    
    # 后台启动开发服务器
    nohup npm run dev > "$LOG_FILE" 2>&1 &
    APP_PID=$!
    
    # 等待应用启动
    log "等待应用启动..."
    sleep 3
    
    # 检查应用是否成功启动
    if kill -0 "$APP_PID" 2>/dev/null; then
        # 检查端口是否可访问
        if command -v curl >/dev/null 2>&1; then
            if curl -s "http://localhost:$PORT" >/dev/null; then
                success "$APP_NAME 应用已成功启动"
                success "访问地址: http://localhost:$PORT"
                success "进程 PID: $APP_PID"
                success "日志文件: $LOG_FILE"
                return 0
            fi
        fi
        
        warning "应用进程已启动，但端口可能尚未就绪"
        success "进程 PID: $APP_PID"
        success "请稍等片刻后访问: http://localhost:$PORT"
        return 0
    else
        error "应用启动失败"
        if [ -f "$LOG_FILE" ]; then
            error "错误日志:"
            tail -20 "$LOG_FILE"
        fi
        return 1
    fi
}

# 重启应用
restart_app() {
    log "正在重启 $APP_NAME 应用..."
    
    stop_app
    if [ $? -eq 0 ]; then
        sleep 2
        start_app
        return $?
    else
        error "停止应用失败，无法重启"
        return 1
    fi
}

# 显示状态
show_status() {
    log "检查 $APP_NAME 应用状态..."
    
    PIDS=$(check_port)
    if [ ! -z "$PIDS" ]; then
        success "应用正在运行"
        success "端口: $PORT"
        success "进程 PID: $PIDS"
        success "访问地址: http://localhost:$PORT"
    else
        warning "应用未运行"
    fi
}

# 显示帮助信息
show_help() {
    echo "用法: $0 {restart|start|stop|status|help}"
    echo ""
    echo "命令:"
    echo "  restart  - 重启应用"
    echo "  start    - 启动应用"
    echo "  stop     - 停止应用"
    echo "  status   - 显示应用状态"
    echo "  help     - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 restart   # 重启应用"
    echo "  $0 status    # 查看状态"
}

# 主函数
main() {
    case "$1" in
        restart)
            restart_app
            ;;
        start)
            start_app
            ;;
        stop)
            stop_app
            ;;
        status)
            show_status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            error "无效的命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
