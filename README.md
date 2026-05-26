# PlaylistIQ

PlaylistIQ er et full-stack Spotify playlist management værktøj med AI-song suggestions via Groq.

## Hvad er inkluderet

- Spotify OAuth 2.0 PKCE login
- Playlist oversigt og detaljer
- Kategoristyring med emoji, farve og kategoritildeling
- AI-sangforslag via backend Groq proxy
- Kategori-filter og kategori-baseret afspilning
- Spotify Web Playback SDK integration

## Filstruktur

- `backend/` – Express server og Groq proxy
- `frontend/` – React + Vite + Tailwind frontend

## Opsætning

1. Kopiér `backend/.env.example` til `backend/.env`
2. Tilføj din Groq API-nøgle i `backend/.env`
3. Kopiér `frontend/.env.example` til `frontend/.env`
4. Tilføj din Spotify Client ID og redirect URI i `frontend/.env`
5. Kør `npm install` fra projektroden
6. Start backend med `npm run start-backend`
7. Start frontend med `npm run dev`

## Groq backend

Backend proxyen bruger `groq-sdk` og `llama-3.3-70b-versatile` til at generere sangforslag.

## Bemærkninger

- Gem aldrig rigtige API-nøgler i git.
- `frontend/.env` og `backend/.env` er udeladt via `.gitignore`.
