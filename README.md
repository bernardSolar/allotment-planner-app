# Allotment Planner & Gardening App

An interactive web application for planning and tracking allotment gardens with planting calendar and gardening knowledge base.

## Features

### Core Features

1. **Interactive Garden Planner**
   - Drag-and-drop interface for garden layout
   - Customizable plot sizes and shapes
   - Library of structural elements (raised beds, flat beds, paths, etc.)
   - Plant library with accurate spacing requirements

2. **Planting Calendar & Diary**
   - Personalized planting schedule based on location/hardiness zone
   - Growth tracking from seed to harvest
   - Notification system for key gardening tasks
   - Journal feature for notes and observations

3. **Knowledge Base**
   - Plant care guides
   - Companion planting suggestions
   - Pest and disease identification/solutions
   - Seasonal advice based on location

### Weather Integration

- Real-time weather alerts (frost warnings, heat alerts, etc.)
- Proactive gardening recommendations based on weather forecasts
- Smart watering schedule
- Historical weather data tracking

## Subscription Tiers

### Free Tier
- Basic garden planning with limited templates
- Simple planting calendar
- Access to basic plant information
- Ability to track up to 20 plants

### Premium Tier (£5/month)
- Unlimited garden designs and templates
- Advanced planting calendar with reminders
- Full access to knowledge base
- Harvest forecasting
- Weather integration
- Photo journal for growth tracking
- Export/print garden plans
- Community features (sharing designs, tips)

### Annual Tier (£40/year - save £20)
- All premium features
- Early access to new features
- Seasonal planting guides
- Priority support

## Tech Stack

- **Frontend**: React.js with SVG for the interactive planner
- **Backend**: Node.js with Express
- **Database**: MySQL with Sequelize ORM
- **Hosting**: GoDaddy web hosting

## Development Roadmap

1. **MVP (Minimum Viable Product)**
   - Basic garden planner with common vegetables and structures
   - Simple planting calendar
   - Basic plant database
   - User accounts and save functionality

2. **Phase 2**
   - Enhanced planting calendar with notifications
   - Weather integration
   - Expanded plant database
   - Journal feature
   - Mobile responsiveness

3. **Phase 3**
   - Community features
   - Advanced analytics (yield tracking, success rates)
   - Garden plan sharing
   - Integration with seed suppliers
   - AI recommendations based on past successes

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- MySQL (v5.7 or later)

### Database Setup
1. Create a MySQL database:
   ```sql
   CREATE DATABASE allotment_planner;
   ```

2. Optionally, create a dedicated user:
   ```sql
   CREATE USER 'allotment_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON allotment_planner.* TO 'allotment_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/bernardSolar/allotment-planner-app.git
   cd allotment-planner-app
   ```

2. Install dependencies for the server and client
   ```
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. Set up environment variables
   Copy the .env.example file to .env and update with your details:
   ```
   cp .env.example .env
   ```
   Edit the .env file with your MySQL credentials and other settings:
   ```
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=yourjwtsecretkey

   # MySQL Database
   DB_HOST=localhost
   DB_NAME=allotment_planner
   DB_USER=root
   DB_PASSWORD=your_password

   # Weather API
   WEATHER_API_KEY=youropenweatherapikey
   ```

4. Start development servers
   ```
   # To run both the backend and frontend concurrently
   npm run dev

   # Or, to run them separately:
   # Backend only
   npm run server

   # Frontend only
   npm run client
   ```

   The server should start on http://localhost:5000 and the client on http://localhost:3000.

## Project Structure

```
/
├── client/                # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── assets/        # Images, icons, etc.
│       ├── components/    # Reusable components
│       ├── contexts/      # React contexts
│       ├── hooks/         # Custom React hooks
│       ├── pages/         # Application pages
│       ├── services/      # API service calls
│       └── utils/         # Utility functions
│
├── server/                # Backend Node.js/Express application
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models (Sequelize)
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
│
└── shared/                # Shared code between frontend and backend
    ├── constants/         # Shared constants
    └── types/             # TypeScript type definitions
```

## Frontend Development

The frontend is built with React and includes:
- Interactive garden planner built with SVG and drag-and-drop functionality
- Redux for state management
- Styled-components for styling
- React Router for navigation

## API Endpoints

### Users
- `POST /api/users` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Gardens
- `GET /api/gardens` - Get all gardens for a user
- `POST /api/gardens` - Create a new garden
- `GET /api/gardens/:id` - Get a garden by ID
- `PUT /api/gardens/:id` - Update a garden
- `DELETE /api/gardens/:id` - Delete a garden
- `POST /api/gardens/:id/elements` - Add element to garden
- `PUT /api/gardens/:id/elements/:elementId` - Update garden element
- `DELETE /api/gardens/:id/elements/:elementId` - Delete garden element

### Plants
- `GET /api/plants` - Get all plants
- `GET /api/plants/:id` - Get plant by ID
- `POST /api/plants` - Create a new plant
- `PUT /api/plants/:id` - Update a plant
- `DELETE /api/plants/:id` - Delete a plant
- `GET /api/plants/season/:month` - Get plants by season

## License

This project is licensed under the MIT License - see the LICENSE file for details.
