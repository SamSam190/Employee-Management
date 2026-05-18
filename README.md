# AI-Based Employee Performance Analytics & Recommendation System

## Overview
This is a full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations using the OpenRouter AI API.

## Project Structure
- `/backend`: Node.js, Express, MongoDB REST API.
- `/frontend`: React.js, Vite, Vanilla CSS.

## Getting Started

### 1. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Configure the `.env` file with your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Start the server: `npm run dev` (or `node server.js`)

### 2. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

### 3. OpenRouter API Setup
To use the AI recommendations, sign up at [OpenRouter](https://openrouter.ai/) and generate an API key. Add this key to your `backend/.env` file. The application is configured to use a fast/free model for demo purposes.

## Deployment on Render
For Render deployment:
1. Create a Web Service for the Backend. Set the Root Directory to `backend`. Build command: `npm install`. Start command: `node server.js`. Add all `.env` variables to Render.
2. Create a Static Site for the Frontend. Set the Root Directory to `frontend`. Build command: `npm run build`. Publish directory: `dist`.
3. In your `frontend/src/api/axios.js`, change the `baseURL` from `http://localhost:5000/api` to your Render Backend URL once deployed.

## Generating the Final PDF
To complete your assignment, you need to compile a PDF with:
1. Complete code zip/link.
2. Screenshots of the application running (Frontend).
3. Screenshots of Postman or Thunder Client testing all API endpoints.
4. Screenshots of MongoDB Atlas showing the stored user and employee data.
5. Screenshot of Render deployment success.
6. The live URLs for the frontend and backend.
