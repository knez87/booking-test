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
COPY apps/order-service/ apps/order-service/

# Build the application
RUN npx nx build order-service --prod

EXPOSE 3004

CMD ["node", "dist/apps/order-service/main.js"]
