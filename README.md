# Insightful Advisor

A comprehensive platform for generating and managing AI-powered insights.

## Project Structure

```
insightful-advisor/
├── frontend/          # React + TypeScript + Vite application
├── backend/          # FastAPI application
└── README.md         # This file
```

## Quick Start

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- Yarn (for frontend package management)
- Poetry (for backend package management)

### Frontend Setup

```bash
cd frontend
yarn install
yarn dev
```

Frontend runs on: http://localhost:5173

### Backend Setup

```bash
cd backend
poetry install
uvicorn main:app --reload
```

Backend runs on: http://localhost:8000

## Development

- Frontend documentation: [frontend/README.md](frontend/README.md)
- Backend documentation: [backend/README.md](backend/README.md)

## Environment Variables

Create `.env` files in both frontend and backend directories. See respective README files for required variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)
