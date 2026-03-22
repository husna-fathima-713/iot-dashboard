# ============================================================
# STAGE 1: BUILD STAGE
# Use Node.js 20 Alpine (lightweight Linux) to build the app
# ============================================================

# Pull the official Node.js 20 image based on Alpine Linux
# Alpine is ~5MB vs ~900MB for full Ubuntu — much faster!
FROM node:20-alpine AS builder

# Set the working directory inside the container
# All subsequent commands run from this folder
WORKDIR /app

# Copy only package.json and package-lock.json first
# Why? Docker caches this layer — if dependencies haven't changed,
# it skips npm install on the next build (saves 30+ seconds!)
COPY package*.json ./

# Install all Node.js dependencies listed in package.json
# --legacy-peer-deps handles version conflicts in older React apps
RUN npm install --legacy-peer-deps

# Copy the entire project source code into the container
# This happens AFTER npm install to maximize Docker layer caching
COPY . .

# Build the React app for production
# This creates an optimized /app/build folder with static HTML/CSS/JS
RUN npm run build

# ============================================================
# STAGE 2: PRODUCTION STAGE
# Use Nginx Alpine to serve the built React app
# This is a FRESH image — Node.js and source code are LEFT BEHIND!
# Final image = only Nginx + built files (~25MB instead of ~500MB)
# ============================================================

# Pull the official Nginx image based on Alpine Linux
FROM nginx:alpine

# Copy ONLY the built files from Stage 1 (builder)
# /app/build → Nginx's default web serving folder
# node_modules, source code, secrets are NOT copied — more secure!
COPY --from=builder /app/build /usr/share/nginx/html

# Tell Docker this container listens on port 80 (HTTP)
# This is documentation — actual port mapping happens in docker run
EXPOSE 80

# Start Nginx in the foreground
# "daemon off" keeps the container alive (containers exit when main process exits)
CMD ["nginx", "-g", "daemon off;"]