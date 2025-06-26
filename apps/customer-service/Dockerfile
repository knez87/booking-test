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
COPY apps/customer-service/ apps/customer-service/

# Build the application
RUN npx nx build customer-service --prod

EXPOSE 3005

CMD ["node", "dist/apps/customer-service/main.js"]
