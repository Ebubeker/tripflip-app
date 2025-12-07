# TripFlip Web App

A modern web application that helps users quickly find realistic trip costs by combining flight and hotel options with AI-powered recommendations.

## Features

- **Smart Trip Search**: Enter your origin, destination, dates, and preferences to get instant trip packages
- **AI-Powered Recommendations**: Get intelligent suggestions for the best value, cheapest, and most comfortable options
- **Real-time Data**: Integrates with Amadeus Flights API and Hotelbeds API for live pricing
- **Mock Data Support**: Works with mock data when APIs are not configured (perfect for development)
- **Beautiful UI**: Built with Next.js 16, Tailwind CSS, and Shadcn UI components

## Tech Stack

- **Frontend & Backend**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **AI**: Google Gemini API
- **Flight Data**: Amadeus Self Service APIs
- **Hotel Data**: Hotelbeds API (or mock data)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Edit `.env` and add your API keys:
   - **GEMINI_API_KEY** (Required): Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **AMADEUS_API_KEY** & **AMADEUS_API_SECRET** (Optional): Get from [Amadeus for Developers](https://developers.amadeus.com/)
   - **HOTELBEDS_API_KEY** & **HOTELBEDS_API_SECRET** (Optional): Get from [Hotelbeds Developer Portal](https://developer.hotelbeds.com/)

> **Note**: The app will use mock data for flights and hotels if API credentials are not provided. Only the Gemini API key is required for AI summaries.

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Enter Trip Details**:
   - Origin airport code (e.g., JFK, LAX, LHR)
   - Destination airport code (e.g., CDG, FCO, NRT)
   - Departure date
   - Number of nights
   - Trip type (return or one-way)
   - Number of travelers
   - Optional budget

2. **View Results**:
   - AI summary explaining the best options
   - Trip packages sorted by recommendation type
   - Detailed flight and hotel information
   - Total cost and per-person pricing

3. **Expand Details**:
   - Click "View Details" on any package to see flight segments and hotel info

## Project Structure

```
web/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   └── trip/search/     # Trip search endpoint
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   ├── header.tsx           # App header
│   ├── trip-search-form.tsx # Search form
│   ├── trip-result-card.tsx # Result card
│   └── trip-summary.tsx     # AI summary
├── lib/                     # Utility libraries
│   ├── ai/                  # AI integrations
│   │   └── gemini.ts        # Gemini API client
│   ├── travel/              # Travel API integrations
│   │   ├── flights.ts       # Amadeus flights
│   │   └── hotels.ts        # Hotelbeds hotels
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## API Integration Details

### Gemini AI

- Model: `gemini-2.0-flash-exp`
- Used for generating trip summaries and recommendations
- Fallback to basic recommendations if API fails

### Amadeus Flights API

- Uses Flight Offers Search API
- Supports both one-way and return trips
- Falls back to mock data if not configured

### Hotelbeds API

- Searches hotels by destination and dates
- Includes pricing and ratings
- Falls back to mock data if not configured

## Environment Variables

All API keys should be stored in `.env` file (never commit this file):

```env
GEMINI_API_KEY=your_key_here
AMADEUS_API_KEY=your_key_here
AMADEUS_API_SECRET=your_secret_here
HOTELBEDS_API_KEY=your_key_here
HOTELBEDS_API_SECRET=your_secret_here
```

## Deployment

The app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Future Enhancements

- User accounts and saved trips
- Price drop notifications
- Multi-city trip support
- Local activity suggestions
- More detailed filtering options
- Mobile app version

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
