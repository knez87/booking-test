# Booking Journey Monorepo

A comprehensive full-stack booking journey application built with NestJS microservices architecture and React frontend, based on the MeetingPackage.com API specification.

## 🏗️ Architecture

This project follows a microservices architecture using NestJS and is organized as an Nx monorepo:

### Backend Services

- **API Gateway** (`apps/api-gateway`) - Main entry point, routes requests to microservices
- **Search Service** (`apps/search-service`) - Handles venue search functionality
- **Availability Service** (`apps/availability-service`) - Manages room and package availability
- **Content Service** (`apps/content-service`) - Provides venue details, rooms, and content
- **Order Service** (`apps/order-service`) - Handles booking orders and reservations
- **Customer Service** (`apps/customer-service`) - Manages customer data and profiles

### Frontend

- **React Frontend** (`apps/frontend`) - User interface built with React, TypeScript, and Tailwind CSS

### Shared Libraries

- **Shared Types** (`libs/shared/types`) - Common TypeScript interfaces and types used across services

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Redis (if running locally)

### Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd booking-journey-monorepo
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   Create `.env` files for each service or use the provided Docker setup.

4. **Database Setup**
   \`\`\`bash
   # Using Docker
   docker-compose up postgres redis -d
   
   # Or setup local PostgreSQL and Redis
   \`\`\`

5. **Run all services in development**
   \`\`\`bash
   # Run all services concurrently
   npm run dev
   
   # Or run individual services
   npm run serve:api-gateway
   npm run serve:search-service
   npm run serve:availability-service
   npm run serve:content-service
   npm run serve:order-service
   npm run serve:customer-service
   npm run serve:frontend
   \`\`\`

### Docker Setup

1. **Build and run with Docker Compose**
   \`\`\`bash
   docker-compose up --build
   \`\`\`

2. **Access the application**
   - Frontend: http://localhost:4200
   - API Gateway: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

## 📁 Project Structure

\`\`\`
booking-journey-monorepo/
├── apps/
│   ├── api-gateway/          # API Gateway service
│   ├── search-service/       # Search microservice
│   ├── availability-service/ # Availability microservice
│   ├── content-service/      # Content microservice
│   ├── order-service/        # Order microservice
│   ├── customer-service/     # Customer microservice
│   └── frontend/             # React frontend application
├── libs/
│   └── shared/
│       └── types/            # Shared TypeScript types
├── docker-compose.yml        # Docker services configuration
├── nx.json                   # Nx workspace configuration
└── package.json              # Root package.json
\`\`\`

## 🔧 API Endpoints

### Search API
- `GET /api/venues` - Search venues by location
- `GET /api/availability/venues` - Search available venues

### Content API
- `GET /api/venues/:id` - Get venue details
- `GET /api/venues/:id/addons` - Get venue addons
- `GET /api/rooms/:id` - Get room details

### Availability API
- `GET /api/availability/venues/:id` - Get venue room availability
- `GET /api/availability/venues/:id/packages` - Get venue package availability
- `GET /api/availability/venues/:id/day` - Get day availability
- `GET /api/availability/meetingrooms/:id` - Get meeting room availability

### Order API
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/:id/messages` - Get order messages
- `POST /api/orders/:id/messages` - Send order message

### Customer API
- `POST /api/customers` - Create new customer

## 🏛️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Venues** - Meeting venues and event spaces
- **Rooms** - Meeting rooms within venues
- **Packages** - Event packages offered by venues
- **Orders** - Booking orders and reservations
- **Customers** - Customer profiles and information
- **Addons** - Additional services and products

## 🔒 Authentication

The API uses API Key authentication. Include the API key in the request header:

\`\`\`
X-API-KEY: your-api-key
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run tests for specific service
npx nx test search-service
npx nx test frontend

# Run e2e tests
npx nx e2e frontend-e2e
\`\`\`

## 📦 Building for Production

\`\`\`bash
# Build all applications
npm run build

# Build specific application
npx nx build api-gateway --prod
npx nx build frontend --prod
\`\`\`

## 🚀 Deployment

### Docker Deployment

\`\`\`bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Kubernetes Deployment

Kubernetes manifests are available in the `k8s/` directory:

\`\`\`bash
kubectl apply -f k8s/
\`\`\`

## 🔧 Configuration

### Environment Variables

#### API Gateway
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS
- `*_SERVICE_HOST` - Microservice hosts
- `*_SERVICE_PORT` - Microservice ports

#### Microservices
- `PORT` - Service port
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `REDIS_HOST` - Redis host (for caching)
- `REDIS_PORT` - Redis port

#### Frontend
- `REACT_APP_API_URL` - API Gateway URL
- `REACT_APP_API_KEY` - API Key for authentication

## 🏗️ Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Consistent naming conventions

### Git Workflow
- Feature branches from `main`
- Pull requests required for `main`
- Conventional commit messages

### Testing Strategy
- Unit tests for services and components
- Integration tests for API endpoints
- E2E tests for critical user journeys

## 📚 API Documentation

Interactive API documentation is available at:
- Development: http://localhost:3000/api/docs
- Production: https://your-domain.com/api/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.
\`\`\`

## 🏷️ Version

Current version: 1.0.0

---

Built with ❤️ using NestJS, React, and Nx
