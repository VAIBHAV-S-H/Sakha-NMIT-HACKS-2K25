# Sakha Safety App

## Overview

Sakha is a safety app designed to help users navigate their journey safely, especially in areas with potential safety concerns. The app uses MongoDB to store and retrieve data such as threat locations, emergency contacts, travel requests, and more.

## Features

- **Safety Map**: View areas with reported safety concerns
- **Threat Locations**: User-reported locations with safety risks
- **Emergency Contacts**: Manage contacts for emergency situations
- **Route Planning**: Plan safe routes that avoid high-threat areas

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/sakha-app.git
cd sakha-app
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following:
```
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
```

4. Initialize the database
```bash
npm run init-db
```

5. Start the development server
```bash
npm run dev
```

## MongoDB Integration

The application uses MongoDB Atlas for storing and retrieving data. The integration is set up in the following files:

- `lib/mongodb.ts`: Database connection utility
- `app/api/*`: API routes that interact with MongoDB
- `scripts/setup-database.js`: Database initialization script

### Collections

The database has the following collections:

- `users`: User account information
- `emergency_contacts`: Emergency contacts for users
- `travel_requests`: Travel requests made by users
- `threat_locations`: Reported unsafe locations
- `notifications`: User notifications

### Database Scripts

The application includes several database scripts:

- `npm run init-db`: Initialize the database and collections
- `node scripts/fetch-data.js users`: View all users
- `node scripts/fetch-data.js threats`: View all threat locations
- `node scripts/db-admin.js list-collections sakha_app`: List all collections

## API Endpoints

### Threat Locations

- `GET /api/threat-locations`: Get all threat locations
- `GET /api/threat-locations?id={id}`: Get a specific threat location
- `POST /api/threat-locations`: Create a new threat location
- `PUT /api/threat-locations`: Update a threat location
- `DELETE /api/threat-locations?id={id}`: Delete a threat location

### Emergency Contacts

- `GET /api/emergency-contacts`: Get emergency contacts for current user
- `POST /api/emergency-contacts`: Add a new emergency contact
- `PUT /api/emergency-contacts`: Update an emergency contact
- `DELETE /api/emergency-contacts?id={id}`: Delete an emergency contact

### Route Planning

- `POST /api/route-planning`: Calculate a safe route that avoids threat areas

## License

[MIT License](LICENSE)

## Acknowledgments

- This project was created as part of [relevant context]
- Icon and design resources from [sources]
- Special thanks to the contributors and supporters