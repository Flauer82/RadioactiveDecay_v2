# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.decay_chain import DecayChainService  # Updated import path

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IsotopeRequest(BaseModel):
    isotope: str

@app.post("/api/decay-chain")
async def generate_decay_chain(request: IsotopeRequest):
    try:
        service = DecayChainService()
        result = service.generate_decay_chain(request.isotope)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")