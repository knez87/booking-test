FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY libs/ libs/
COPY apps/content-service/ apps/content-service/

# Build the application
RUN npx nx build content-service --prod

EXPOSE 3003

CMD ["node", "dist/apps/content-service/main.js"]
