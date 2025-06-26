# Booking Journey Monorepo

> **AI-First Development**: This project is optimized for AI-assisted development. See `llm.txt` and `.cursorrules` for AI tool configuration.

A comprehensive full-stack booking journey application built with NestJS microservices architecture and React frontend, based on the MeetingPackage.com API specification.

## 🤖 AI Development Support

This codebase is designed to work seamlessly with AI development tools:

- **LLM Context**: See `llm.txt` for comprehensive project context
- **Cursor Rules**: See `.cursorrules` for Cursor-specific development guidelines
- **AI Guide**: See `docs/ai-development-guide.md` for detailed AI assistance patterns

## 🏗️ Architecture

This project follows a microservices architecture using NestJS and is organized as an Nx monorepo:

### Backend Services (NestJS + PostgreSQL)

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

### Database

- **PostgreSQL** - Primary database for all services
- **Redis** - Caching layer for performance optimization

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

3. **Start with Docker (Recommended)**
   \`\`\`bash
   npm run docker:up
   \`\`\`

4. **Or run locally**
   \`\`\`bash
   # Start database services
   docker-compose up postgres redis -d
   
   # Run all services
   npm run dev
   \`\`\`

5. **Access the application**
   - Frontend: http://localhost:4200
   - API Gateway: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

## 📋 API Endpoints (16 Total)

### Search & Content
- `GET /api/venues` - Search venues by location
- `GET /api/venues/{id}` - Get venue details
- `GET /api/venues/{id}/addons` - Get venue addons
- `GET /api/rooms/{id}` - Get room details

### Availability
- `GET /api/availability/venues` - Search available venues
- `GET /api/availability/venues/{id}` - Get venue room availability
- `GET /api/availability/venues/{id}/packages` - Get venue package availability
- `GET /api/availability/venues/{id}/day` - Get day availability
- `GET /api/availability/meetingrooms/{id}` - Get meeting room availability
- `GET /api/availability/packages/{id}` - Get package availability

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}` - Update order status
- `GET /api/orders/{id}/messages` - Get order messages
- `POST /api/orders/{id}/messages` - Send order message

### Customers
- `POST /api/customers` - Create new customer

## 🗄️ Database Schema (PostgreSQL)

### Core Tables
- **venues** - Meeting venues and event spaces
- **rooms** - Meeting rooms within venues
- **packages** - Event packages offered by venues
- **addons** - Additional services and products
- **customers** - Customer profiles and information
- **orders** - Booking orders and reservations
- **order_items** - Order line items
- **order_messages** - Order communication

## 🧪 Testing

### Unit Tests
\`\`\`bash
npm test
\`\`\`

### E2E Tests (Playwright)
\`\`\`bash
npm run test:e2e
npm run test:e2e:ui  # Interactive mode
\`\`\`

### API Testing
All endpoints are tested with comprehensive test suites covering:
- Happy path scenarios
- Error handling
- Input validation
- Authentication
- Performance

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
# Build and start all services
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Environment Variables

#### API Gateway
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS

#### Microservices
- `PORT` - Service port
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` - PostgreSQL connection
- `REDIS_HOST`, `REDIS_PORT` - Redis connection

#### Frontend
- `REACT_APP_API_URL` - API Gateway URL
- `REACT_APP_API_KEY` - API Key for authentication

## 🔧 Development Guidelines

### For AI Tools
- Follow patterns in `.cursorrules`
- Reference `llm.txt` for project context
- Use shared types from `@booking-journey/shared/types`
- Follow NestJS and React best practices

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Consistent naming conventions (kebab-case files, PascalCase classes)

### Architecture Patterns
- Microservices with single responsibility
- Repository pattern for data access
- DTO pattern for API contracts
- Error handling with proper HTTP status codes

## 📚 Documentation

- **API Documentation**: http://localhost:3000/api/docs (Swagger)
- **AI Development Guide**: `docs/ai-development-guide.md`
- **Database Schema**: `scripts/seed-data.sql`
- **Architecture Decisions**: `docs/architecture.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding conventions in `.cursorrules`
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

### AI-Assisted Development
This project is optimized for AI-assisted development. When using tools like Cursor:
1. Reference the `.cursorrules` file for coding standards
2. Use `llm.txt` for project context
3. Follow the patterns in `docs/ai-development-guide.md`

## 🆘 Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3000-3005, 4200, 5432, 6379 are available
2. **Database connection**: Check PostgreSQL credentials and network access
3. **Service discovery**: Verify all microservices are running
4. **CORS errors**: Check API Gateway CORS configuration

### Debug Commands
\`\`\`bash
# View service logs
docker-compose logs -f service-name

# Access database
docker-compose exec postgres psql -U postgres -d booking_journey

# Restart all services
npm run docker:down && npm run docker:up
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using NestJS, React, PostgreSQL, and AI-first development practices**

> 🤖 **AI Developers**: This codebase includes comprehensive AI assistance files. Check `llm.txt`, `.cursorrules`, and `docs/ai-development-guide.md` for optimal AI-assisted development experience.
\`\`\`

### 5. **Project Context File for AI Tools:**
