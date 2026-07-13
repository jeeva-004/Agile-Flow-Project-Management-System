FROM eclipse-temurin:17-jre-alpine AS run
WORKDIR /app

# Create a non-root system group and user for security
RUN addgroup -S agileflow && adduser -S agileflow -G agileflow

# Copy the pre-built JAR from the context
COPY app.jar app.jar
RUN chown agileflow:agileflow app.jar

# Switch container execution to the non-root user
USER agileflow

# Expose the application port
EXPOSE 8080

# Run the Spring Boot JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
