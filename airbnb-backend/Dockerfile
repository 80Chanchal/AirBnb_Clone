# Stage 1: Build the Spring Boot JAR with Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/airbnb-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
