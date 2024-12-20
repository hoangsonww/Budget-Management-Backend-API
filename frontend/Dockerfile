# STAGE 1: Build React App
FROM node:16-alpine AS build

# Set working directory
WORKDIR /app

# Copy only package and lock files first to leverage build cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Build production artifacts
RUN npm run build

# STAGE 2: Use Nginx to serve static content
FROM nginx:alpine

# Remove the default nginx page and replace with our app
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80

# By default, nginx:alpine image uses the following CMD
# So we don't need to specify it again:
# CMD ["nginx", "-g", "daemon off;"]
