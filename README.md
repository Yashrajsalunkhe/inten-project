# AI Chatbot Project (Excel/CSV Data Analysis) — Gemini API Version

This project is an AI-powered chatbot that allows users to upload Excel or CSV files, ask natural language questions about their data, and receive intelligent answers, summaries, and visualizations. It uses React (Vite) for the frontend and Flask (Python) for the backend, with Gemini API for advanced AI code generation.

---

## Features

- **Upload Excel (.xlsx) or CSV files**
- **Ask questions in natural language** about your data
- **Get instant answers**: row counts, averages, totals, column names, etc.
- **Generate charts**: bar, pie, and line charts as images
- **Trend analysis and suggestions**
- **AI-powered code-based answers** (using Gemini API)
- **Conversational AI**: responds to general chat as well as data queries

---

## Project Structure

```
ai-chatbot-project/
├── frontend/       # React + Vite (Chat UI, File Upload)
│   └── src/
│       └── components/
│           ├── ChatBox.jsx
│           ├── ChatHistory.jsx
│           └── FileUpload.jsx
├── backend/        # Flask (API, Data, AI logic)
│   ├── app.py
│   ├── requirements.txt
│   ├── utils/
│   │   ├── file_handler.py        # handles file uploads
│   │   ├── chat_handler.py        # handles user messages & AI
│   │   └── chart_generator.py     # generates charts
│   ├── uploads/                  # uploaded files
│   └── .env                      # contains GEMINI_API_KEY
```

---

## Setup Instructions

### 1. Backend (Flask)

1. **Install dependencies:**
   ```zsh
   cd backend
   pip install -r requirements.txt
   ```
2. **Set up environment variables:**
   - Create a `.env` file in the `backend/` folder:
     ```env
     GEMINI_API_KEY=your-gemini-api-key-here
     ```
3. **Run the backend server:**
   ```zsh
   python app.py
   ```
   The backend will start on `http://localhost:8000`.

### 2. Frontend (React + Vite)

1. **Install dependencies:**
   ```zsh
   cd frontend
   npm install
   ```
2. **Run the frontend dev server:**
   ```zsh
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` (or similar).

---

## Usage

1. Open the frontend in your browser.
2. Upload an Excel or CSV file.
3. Ask questions about your data (e.g., "What is the total sales?", "Show a bar chart of region").
4. Get instant answers, charts, and AI-powered insights.
5. You can also chat with the bot like a normal AI assistant.

---

## API Endpoints

### Backend (Flask)
- `POST /upload` — Upload Excel/CSV file
- `POST /chat` — Send a chat message/query

---

## Environment Variables

- `GEMINI_API_KEY` — Your Gemini API key (required for AI code generation)

---

## Technologies Used
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Flask, Pandas, Matplotlib, Python-dotenv
- **AI:** Gemini API

---

## License

MIT License

---

## Credits

- Built by Yashraj Salunkhe and contributors
- Powered by Gemini API, React, Flask, and open-source tools
