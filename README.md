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
- **Database**: MongoDB for flexible data structure
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
- MongoDB

### Installation

1. Clone the repository
   ```
   git clone https://github.com/bernardSolar/allotment-planner-app.git
   cd allotment-planner-app
   ```

2. Install dependencies for frontend and backend
   ```
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   WEATHER_API_KEY=your_weather_api_key
   ```

4. Start development servers
   ```
   # Start backend server
   cd server
   npm run dev

   # In a new terminal, start frontend server
   cd client
   npm start
   ```

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
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
│
└── shared/                # Shared code between frontend and backend
    ├── constants/         # Shared constants
    └── types/             # TypeScript type definitions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
