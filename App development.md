# Project Structure

```
radioactive-decay/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── decay_chain.py   # Decay chain visualization service
│   │   │   └── evolution.py     # Time evolution service
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── requests.py      # Pydantic models for requests
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── plotting.py      # Common plotting utilities
│   ├── tests/
│   │   └── __init__.py
│   ├── requirements.txt
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   └── page.tsx         # Main page component
    │   ├── components/
    │   │   ├── ui/              # shadcn components
    │   │   ├── DecayVisualizer.tsx
    │   │   ├── IsotopeInput.tsx
    │   │   ├── TimeControl.tsx
    │   │   └── PlotDisplay.tsx
    │   ├── lib/
    │   │   └── utils.ts         # Utility functions
    │   └── types/
    │       └── index.d.ts       # TypeScript definitions
    ├── public/
    │   └── assets/
    ├── .env.local
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    └── README.md
```

# Setup Instructions

## Backend Setup

1. Create backend directory and virtual environment:
```bash
mkdir radioactive-decay
cd radioactive-decay
mkdir backend
cd backend
python -m venv venv
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Create requirements.txt:
```txt
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
radioactivedecay==0.5.1
matplotlib==3.8.2
numpy==1.26.2
pydantic==2.5.1
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create main.py:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add your routes here
```

## Frontend Setup

1. Create frontend using create-next-app:
```bash
cd ..
yarn create next-app frontend --typescript --tailwind --eslint
cd frontend
```

2. Install dependencies:
```bash
yarn add @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-tabs
yarn add @shadcn/ui class-variance-authority clsx lucide-react tailwind-merge
```

3. Initialize shadcn-ui:
```bash
npx shadcn-ui@latest init
```

When prompted, choose:
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind CSS config: Yes
- Components directory: src/components/ui
- Utility functions: src/lib/utils.ts

4. Install required shadcn components:
```bash
npx shadcn-ui@latest add card tabs input button select alert
```

5. Create .env.local:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

6. Update next.config.js:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
```

7. Create components:
- Copy the DecayVisualizer component from previous response to src/components/DecayVisualizer.tsx
- Create minimal IsotopeInput.tsx
- Create minimal TimeControl.tsx
- Create minimal PlotDisplay.tsx

8. Update src/app/page.tsx:
```typescript
import DecayVisualizer from '@/components/DecayVisualizer'

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <DecayVisualizer />
    </main>
  )
}
```

# Running the Application

1. Start the backend:
```bash
cd backend
uvicorn app.main:app --reload
```

2. Start the frontend (in a new terminal):
```bash
cd frontend
yarn dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API documentation: http://localhost:8000/docs
```