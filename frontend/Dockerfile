# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the source code
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install all dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application using vite
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "3000"] 