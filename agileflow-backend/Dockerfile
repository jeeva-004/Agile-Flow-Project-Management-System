# ==========================================
# Stage 1: Build the Spring Boot Application
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies first to optimize Docker cache layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the JAR, skipping tests
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Minimal Runtime Environment
# ==========================================
FROM eclipse-temurin:17-jre-alpine AS run
WORKDIR /app

# Create a non-root system group and user for security
RUN addgroup -S agileflow && adduser -S agileflow -G agileflow

# Copy the built JAR from the build stage, ensuring non-root owner has access
COPY --from=build --chown=agileflow:agileflow /app/target/agileflow-backend-0.0.1-SNAPSHOT.jar app.jar

# Switch container execution to the non-root user
USER agileflow

# Expose the application port
EXPOSE 8080

# Run the Spring Boot JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
