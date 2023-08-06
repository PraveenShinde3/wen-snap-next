# FROM node:alpine As deps
# WORKDIR /usr/scr/app
# COPY package*.json ./
# RUN npm install

# #STEP 2 - BUILD

# FROM node:alpine As builder
# WORKDIR /usr/scr/app
# COPY . .
# COPY --from=deps /usr/scr/app/node_modules ./node_modules
# RUN npm build




# FROM ghcr.io/puppeteer/puppeteer:20.9.0
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# WORKDIR /usr/scr/app

# COPY package*.json ./

# RUN npm ci

# FROM node:19.5.0-alpine
# RUN npm run build
# #
# COPY . .


# CMD ["npm","run" "start"]


# Use an official Node.js runtime as the base image
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a lightweight Node.js image for production
FROM node:14-slim

# Set the working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Install production dependencies
RUN npm install --only=production

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Expose the application port (adjust if needed)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
