# Stage 1: Build Spring Boot application
FROM eclipse-temurin:21-jdk AS build
#the image is being pulled from dockerhub name is eclipse-temurin and version is 21-jdk. It is a java software image.

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
#mnvw is a maven wrapper script that allows you to run Maven commands without having to install Maven on your system. It is included in the project and can be used to build the application.
#mnvw is a executable file that is used to run the maven commands in the container. 
COPY .mvn .mvn
COPY pom.xml .

# Copy source code
COPY src ./src

# Give permission to Maven wrapper
RUN chmod +x mvnw
#mvnw is a script that allows you to run Maven commands without having to install Maven on your system. It is included in the project and can be used to build the application.
#we are giving permission to mvnw file to execute the command in the container.
# +x means rwx 

# Build application
RUN ./mvnw clean package -DskipTests
#the final output of this stage is a jar file which is generated in target folder.
#existing will be removed and new build will be created. We are skipping the test cases because we don't want to run the test cases in the container. We just want to build the application.

# Stage 2: Run Spring Boot application
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy generated JAR file
COPY --from=build /app/target/*.jar app.jar
#everything from target folder is copied to app.jar file in the container.


EXPOSE 2006
#this is the port number on which the application will run. We are exposing this port so that we can access the application from outside the container.
#In application.properties file we have configured the server.port=2028. So, we are exposing the same port in the Dockerfile.

ENTRYPOINT ["java", "-jar", "app.jar"]
#run java -jar app.jar it is other way of  writing entry point
