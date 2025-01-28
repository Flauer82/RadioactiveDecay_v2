# backend/app/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.decay_chain import DecayChainService  # Updated import path
from app.services.evolution import TimeEvolutionService
from typing import List, Dict, Literal

# Configure the app with a prefix
app = FastAPI(root_path="/rad_decay/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Available units
Y_AXIS_UNITS = Literal[
    # Activity units
    "Bq", "kBq", "MBq", "GBq", "Ci", "mCi", "µCi",
    # Mass and amount units
    "g", "mol", "num",
    # Fraction units
    "activity_frac", "mass_frac", "mol_frac"
]
TIME_UNITS = Literal["s", "m", "h", "d", "y"]

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
    time_unit: TIME_UNITS
    y_unit: Y_AXIS_UNITS = "Bq"  # Default to Becquerel

# Endpoints
@app.post("/decay-chain")
async def generate_decay_chain(
    request: DecayChainRequest,
    chain_service: DecayChainService = Depends(get_decay_chain_service)
):
    try:
        return chain_service.generate_decay_chain(request.isotope)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/evolution")
async def generate_evolution(
    request: EvolutionRequest,
    evolution_service: TimeEvolutionService = Depends(get_evolution_service)
):
    try:
        # Convert nuclides to the format expected by the service
        nuclides = [{"isotope": n.isotope, "quantity": n.quantity, "unit": n.unit} 
                   for n in request.nuclides]
        
        return evolution_service.generate_evolution_plot(
            nuclides=nuclides,
            time_period=request.time_period,
            time_unit=request.time_unit,
            y_unit=request.y_unit
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/units")
async def get_available_units():
    """Get available units for time and y-axis"""
    return {
        "y_axis_units": {
            "activity": ["Bq", "kBq", "MBq", "GBq", "Ci", "mCi", "µCi"],
            "mass": ["g"],
            "amount": ["mol", "num"],
            "fraction": ["activity_frac", "mass_frac", "mol_frac"]
        },
        "time_units": ["s", "m", "h", "d", "y"]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)