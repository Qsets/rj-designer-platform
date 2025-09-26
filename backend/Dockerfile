# 多阶段构建
FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# 复制Maven配置文件
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# 下载依赖
RUN ./mvnw dependency:go-offline -B

# 复制源代码
COPY src src

# 构建应用
RUN ./mvnw clean package -DskipTests

# 生产阶段
FROM openjdk:17-jre-slim

WORKDIR /app

# 创建非root用户
RUN groupadd -r spring && useradd -r -g spring spring

# 复制jar文件
COPY --from=builder /app/target/*.jar app.jar

# 创建上传目录
RUN mkdir -p /app/uploads && chown -R spring:spring /app

# 切换到非root用户
USER spring:spring

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# 启动应用
ENTRYPOINT ["java", "-jar", "/app/app.jar"]