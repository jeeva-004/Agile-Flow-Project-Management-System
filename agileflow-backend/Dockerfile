# Stage 1: Build the Spring Boot application using Maven wrapper
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml first for dependency caching
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Normalize line endings and set execution permissions for Maven wrapper
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Pre-fetch dependencies to utilize Docker caching
RUN ./mvnw dependency:go-offline -B || true

# Copy application source code
COPY src ./src

# Package application into an executable JAR
RUN ./mvnw clean package -DskipTests

# Stage 2: Minimal Java 17 runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render assigns a dynamic PORT environment variable (default fallback 8080)
EXPOSE 8080

# Environment defaults
ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080

# Launch the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
