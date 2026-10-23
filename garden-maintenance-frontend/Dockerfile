# Stage 1: Build React application
FROM node:20-alpine AS build
#It is a node js software image is being pulled from dockerhub nae is alpine(least version of nodejs) and version is 20
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .
#copy .. represents from source->to destination


# Build Vite application
RUN npm run build
#by running this we gonna create dist folder.output of stage-1 is dist folder


# Stage 2: Serve application using Nginx
FROM nginx:alpine

# Copy React build files to Nginx
COPY --from=build /app/dist /usr/share/nginx/html
#/usr/share/nginx/html is the defaualt directory for deployment.
EXPOSE 80
#default port do docker is 80 for nginx server.
#we use 2 images nginx and node.js

CMD ["nginx", "-g", "daemon off;"]
#We are hiding all internal running so we use daemon off to keep the container running in the foreground.