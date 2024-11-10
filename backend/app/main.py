# backend/app/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.decay_chain import DecayChainService  # Updated import path
from app.services.evolution import TimeEvolutionService
from typing import List, Dict

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency injection functions
def get_decay_chain_service() -> DecayChainService:
    return DecayChainService()

def get_evolution_service() -> TimeEvolutionService:
    return TimeEvolutionService()

# Request models
class DecayChainRequest(BaseModel):
    isotope: str

class NuclideEntry(BaseModel):
    isotope: str
    quantity: str
    unit: str

class EvolutionRequest(BaseModel):
    nuclides: List[NuclideEntry]
    time_period: float
    time_unit: str

# Endpoints
@app.post("/api/decay-chain")
async def generate_decay_chain(
    request: DecayChainRequest,
    chain_service: DecayChainService = Depends(get_decay_chain_service)
):
    try:
        return chain_service.generate_decay_chain(request.isotope)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/evolution")
async def generate_evolution(
    request: EvolutionRequest,
    evolution_service: TimeEvolutionService = Depends(get_evolution_service)
):
    try:
        # Convert request to format expected by service
        nuclides = [
            {
                "isotope": entry.isotope,
                "quantity": entry.quantity,
                "unit": entry.unit
            }
            for entry in request.nuclides
        ]
        
        return evolution_service.generate_evolution_plot(
            nuclides=nuclides,
            time_period=request.time_period,
            time_unit=request.time_unit
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)