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
COPY apps/api-gateway/ apps/api-gateway/

# Build the application
RUN npx nx build api-gateway --prod

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/main.js"]
