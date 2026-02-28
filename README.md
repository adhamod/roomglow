# RoomGlow

AI-powered interior design tips from your room photos.

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env   # if .env doesn't exist
# Edit .env and add your OPENAI_API_KEY=sk-...
./run.sh
```

The backend runs at **http://localhost:8000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**

### 3. Use it

1. Open http://localhost:5173
2. Upload a photo of a room
3. Get AI design tips + product recommendations

## Troubleshooting

- **500 / "Cannot reach backend"**: The backend isn't running. Start it with `cd backend && ./run.sh`
- **503 / "OPENAI_API_KEY is not configured"**: Add your OpenAI API key to `backend/.env`
