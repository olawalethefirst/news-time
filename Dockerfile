# Use the official Node.js image with Alpine for a smaller footprint
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install dependencies separately for caching
COPY package.json  ./
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the development port
EXPOSE 3000

# Start Next.js in development mode with hot-reloading
CMD ["npm", "run", "dev"]
