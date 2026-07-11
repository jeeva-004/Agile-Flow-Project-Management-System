# ==========================================
# Stage 1: Build the Angular Application
# ==========================================
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency definitions and install
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve the application with Nginx
# ==========================================
FROM nginx:1.25-alpine AS run

# Copy Nginx custom configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from stage 1 browser output directory
COPY --from=build /app/dist/agileflow-frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
