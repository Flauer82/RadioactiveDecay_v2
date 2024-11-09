# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .services.decay_chain import DecayChainService
from .services.evolution import TimeEvolutionService
from .models.requests import IsotopeRequest, EvolutionRequest

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
decay_chain_service = DecayChainService()
evolution_service = TimeEvolutionService()

@app.post("/api/decay-chain")
async def create_decay_chain(request: IsotopeRequest):
    try:
        image = decay_chain_service.generate_decay_chain(request.isotope)
        return {"image": image}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/evolution")
async def create_evolution_plot(request: EvolutionRequest):
    try:
        image = evolution_service.generate_evolution_plot(
            request.isotope,
            request.time_period,
            request.time_unit
        )
        return {"image": image}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))