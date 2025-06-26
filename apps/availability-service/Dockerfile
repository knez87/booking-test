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
COPY apps/availability-service/ apps/availability-service/

# Build the application
RUN npx nx build availability-service --prod

EXPOSE 3002

CMD ["node", "dist/apps/availability-service/main.js"]
