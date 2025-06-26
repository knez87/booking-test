# AI Development Guide

This guide provides best practices for AI-assisted development with the Booking Journey application. It's designed to help both developers and AI assistants work effectively with this codebase.

## 🤖 AI Tool Configuration

### Cursor IDE Setup
1. Install the Cursor IDE extension
2. Reference `.cursorrules` for coding standards
3. Use `llm.txt` for project context
4. Follow the patterns in this guide

### GitHub Copilot Setup
1. Install GitHub Copilot extension
2. Use inline suggestions for code completion
3. Use `Ctrl+Shift+I` for chat-based assistance
4. Reference the patterns in this guide

### Context Files
- **`.cursorrules`** - Coding standards and conventions
- **`llm.txt`** - Complete project context for LLMs
- **`.ai-context.json`** - Structured project metadata
- **`README.md`** - Human-readable project overview

## 🧠 Effective AI Prompting

When working with AI tools like GitHub Copilot, ChatGPT, or Cursor, use these strategies:

### 1. Provide Context

Always reference the architecture and existing patterns:

\`\`\`
Given the microservices architecture in this booking journey app, help me implement...
\`\`\`

### 2. Reference Types

Point to shared types for better code generation:

\`\`\`
Using the types from @booking-journey/shared/types, help me implement...
\`\`\`

### 3. Follow Established Patterns

Request code that follows existing patterns:

\`\`\`
Following the pattern in the search.controller.ts, create a similar controller for...
\`\`\`

## 📋 Development Patterns

### 1. **Component Development**
When creating new React components:

\`\`\`typescript
// Always use TypeScript with proper interfaces
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
  isLoading?: boolean;
}

// Use functional components with hooks
export function Component({ title, onAction, isLoading = false }: ComponentProps) {
  // Implementation
}
\`\`\`

### 2. **API Integration**
When adding new API endpoints:

\`\`\`typescript
// Define types first
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Create service functions
export async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
  // Implementation with error handling
}
\`\`\`

### 3. **State Management**
Use React Context for global state:

\`\`\`typescript
// Define state interface
interface AppState {
  user: User | null;
  bookings: Booking[];
  loading: boolean;
}

// Create context with reducer
const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);
\`\`\`

### 4. Adding New Features

#### Backend Service
\`\`\`typescript
// 1. Define types in libs/shared/types/src/index.ts
export interface NewFeature {
  id: number;
  name: string;
  // ... other properties
}

// 2. Create entity in service
@Entity('new_features')
export class NewFeatureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

// 3. Create controller
@Controller('new-features')
export class NewFeatureController {
  @Get()
  async findAll(): Promise<NewFeature[]> {
    // Implementation
  }
}

// 4. Add to API Gateway
@Controller('api/new-features')
export class NewFeatureGatewayController {
  // Proxy to microservice
}
\`\`\`

#### Frontend Component
\`\`\`typescript
// 1. Create service function
export async function getNewFeatures(): Promise<NewFeature[]> {
  const response = await fetch('/api/new-features');
  return response.json();
}

// 2. Create React component
export function NewFeatureList() {
  const { data, isLoading } = useQuery(['new-features'], getNewFeatures);
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-4">
      {data?.map(feature => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}
\`\`\`

### 5. Database Changes

#### Migration Pattern
\`\`\`sql
-- scripts/migration-001-add-new-feature.sql
CREATE TABLE new_features (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add seed data
INSERT INTO new_features (name) VALUES 
  ('Feature 1'),
  ('Feature 2');
\`\`\`

#### Entity Update
\`\`\`typescript
// Update entity with new fields
@Entity('existing_table')
export class ExistingEntity {
  // ... existing fields
  
  @Column({ nullable: true })
  newField?: string;
}
\`\`\`

## 🏗️ Architecture Patterns

### Microservices Structure
\`\`\`
apps/
├── api-gateway/          # Main API entry point
├── search-service/       # Venue search functionality
├── availability-service/ # Room/package availability
├── content-service/      # Venue details and content
├── order-service/        # Booking orders
├── customer-service/     # Customer management
└── frontend/            # React SPA
\`\`\`

### Database Design
- Use PostgreSQL for all services
- Follow entity relationship patterns
- Implement proper indexing for performance
- Use migrations for schema changes

## 🎯 Success Metrics

Track these metrics for AI-assisted development:
- Code quality (TypeScript strict mode compliance)
- Test coverage (aim for >80%)
- Performance (Core Web Vitals)
- Accessibility (WCAG 2.1 AA compliance)
- Documentation completeness

## 🔧 Common Development Tasks

### Adding a New Page
1. Create page component in `apps/frontend/src/app/pages/`
2. Add route to `apps/frontend/src/app/app.tsx`
3. Update navigation in `Layout.tsx`
4. Add to booking context if needed

### Adding API Endpoint
1. Define types in `libs/shared/types/`
2. Create controller method
3. Add to API Gateway
4. Update OpenAPI documentation
5. Add frontend service function

### Database Schema Changes
1. Create migration script in `scripts/`
2. Update entity classes
3. Update seed data if needed
4. Test with Docker containers

## 🧪 Testing Patterns

### Unit Tests
\`\`\`typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component title="Test" onAction={jest.fn()} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
\`\`\`

### API Testing
\`\`\`typescript
// Service testing with Jest
import { getVenues } from './api';

describe('API Service', () => {
  it('should fetch venues successfully', async () => {
    const venues = await getVenues();
    expect(venues).toBeDefined();
    expect(Array.isArray(venues.items)).toBe(true);
  });
});
\`\`\`

### E2E Testing
\`\`\`typescript
// Playwright tests
import { test, expect } from '@playwright/test';

test('booking flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="search-button"]');
  await expect(page.locator('[data-testid="venue-list"]')).toBeVisible();
});
\`\`\`

## 🚀 Deployment Assistance

### Docker Development
\`\`\`bash
# AI can help with Docker commands
npm run docker:up    # Start all services
npm run docker:down  # Stop all services
npm run docker:logs  # View logs
\`\`\`

### Environment Setup
AI can help configure:
- Environment variables
- Database connections
- Service discovery
- Load balancing

## 📖 Documentation Standards

### Code Comments
\`\`\`typescript
/**
 * Searches for available venues based on criteria
 * @param params - Search parameters including location, date, delegates
 * @returns Promise resolving to venue search results
 * @throws ApiError when search fails
 */
export async function searchVenues(params: SearchParams): Promise<VenueSearchResponse> {
  // Implementation
}
\`\`\`

### README Updates
When adding features, update:
- Feature list
- API endpoints
- Setup instructions
- Environment variables

## 🔍 Debugging with AI

When encountering issues:

1. **Provide Error Context**:
\`\`\`
I'm getting this error: [paste error]
In this file: [file path]
While trying to: [describe action]
Current code: [paste relevant code]
\`\`\`

2. **Ask for Systematic Solutions**:
\`\`\`
Please help me debug this step by step:
1. Analyze the error
2. Identify the root cause
3. Provide a fix
4. Suggest prevention measures
\`\`\`

## 📚 AI Learning Resources

### Recommended AI Tools
1. **Cursor IDE** - Best for this project
2. **GitHub Copilot** - Code completion
3. **ChatGPT/Claude** - Architecture discussions
4. **v0.dev** - UI component generation

### Project-Specific Context
- Always reference `llm.txt` for project overview
- Use `.cursorrules` for coding standards
- Check `README.md` for setup instructions
- Review existing code patterns before adding new features

## 🧪 Performance Guidelines

### Frontend Optimization
- Use React.lazy() for code splitting
- Implement virtual scrolling for large lists
- Optimize images with next/image
- Use React Query for caching

### Backend Optimization
- Implement database indexing
- Use Redis for caching
- Optimize N+1 queries
- Add request/response compression

## 🚀 Deployment

### Docker Development
\`\`\`bash
# Start all services
npm run docker:up

# Start specific service
docker-compose up api-gateway

# View logs
docker-compose logs -f service-name
\`\`\`

### Production Deployment
\`\`\`bash
# Build all applications
npm run build

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 🔍 Debugging

### Common Issues
1. **CORS errors**: Check API Gateway CORS configuration
2. **Database connection**: Verify environment variables
3. **Service discovery**: Ensure all services are running
4. **Port conflicts**: Check port availability

### Debug Commands
\`\`\`bash
# Check service health
curl http://localhost:3000/health

# View database
docker-compose exec postgres psql -U postgres -d booking_journey

# Check Redis
docker-compose exec redis redis-cli
\`\`\`

## 📝 Code Standards

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Use proper error handling
- Follow naming conventions

### React
- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for props
- Follow accessibility guidelines

### NestJS
- Use decorators properly
- Implement proper validation
- Use dependency injection
- Follow REST conventions

## 🤝 Collaboration

### Code Reviews
Use AI to:
- Check code quality before commits
- Generate comprehensive PR descriptions
- Identify potential issues
- Suggest improvements

### Knowledge Sharing
- Document AI-generated solutions
- Share successful prompting strategies
- Update this guide with new patterns
- Maintain consistency across team

## 🔄 AI Feedback Loop

To continuously improve AI assistance:

1. **Update llm.txt** when making significant architectural changes
2. **Document new patterns** in this guide
3. **Add examples** of successful AI interactions
4. **Note areas** where AI struggles with the codebase

## 📚 Domain-Specific Knowledge

When working with booking-specific concepts, provide the AI with:

- **Entity relationships**: How venues, rooms, packages, and orders relate
- **Business rules**: Availability calculations, pricing models, etc.
- **API contracts**: Expected request/response formats

Example:
\`\`\`
In our booking system, availability is calculated based on:
1. Room capacity vs. requested delegates
2. Date and time constraints
3. Existing bookings
4. Venue operating hours

Help me implement a function that checks if a room is available given these parameters...
\`\`\`

## 🛠️ AI-Assisted Testing

For generating tests:

\`\`\`
Generate unit tests for this order service function, mocking the database and ensuring we test:
1. Successful order creation
2. Validation failures
3. Database errors
4. Edge cases like minimum delegates
\`\`\`

## 📁 Project Structure Understanding

### Monorepo Architecture
\`\`\`
booking-journey-monorepo/
├── apps/
│   ├── api-gateway/          # Main API entry point
│   ├── search-service/       # Venue search microservice
│   ├── availability-service/ # Room/package availability
│   ├── content-service/      # Venue content management
│   ├── order-service/        # Booking orders
│   ├── customer-service/     # Customer management
│   └── frontend/            # React SPA application
├── libs/
│   ├── shared/types/        # TypeScript interfaces
│   └── shared/database/     # Database utilities
├── docs/                    # Documentation
├── scripts/                 # Database scripts
└── docker-compose.yml       # Container orchestration
\`\`\`

### Key Technologies
- **Backend**: NestJS, PostgreSQL, Redis, Docker
- **Frontend**: React, TypeScript, Tailwind CSS, React Query
- **Build System**: Nx monorepo
- **Testing**: Jest, Playwright
- **API**: RESTful with OpenAPI/Swagger

## 🛠️ Enhancing Frontend for Better SPA Feel

### Adding Global Loading Indicator and Page Transitions

1. **Global Loading Indicator**:
   - Implement a global loading state in `AppContext`.
   - Use this state to display a loading spinner across the application.

2. **Page Transitions**:
   - Use React Router for navigation.
   - Implement transitions using libraries like `react-transition-group` or `framer-motion`.

Example:
\`\`\`typescript
// Implement global loading state in AppContext
interface AppState {
  user: User | null;
  bookings: Booking[];
  loading: boolean;
}

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);

// Use React Router for navigation
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  const { state } = useContext(AppContext);

  return (
    <Router>
      {state.loading && <LoadingSpinner />}
      <Switch>
        <Route path="/search" component={SearchPage} />
        <Route path="/order" component={OrderPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  );
}

// Implement page transitions using framer-motion
import { motion } from 'framer-motion';

function SearchPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search page content */}
    </motion.div>
  );
}
\`\`\`

---

This guide is living documentation. Update it as you discover new AI-assisted development patterns and techniques specific to this project.
