# backend/app/models/requests.py
from pydantic import BaseModel

class IsotopeRequest(BaseModel):
    isotope: str

class EvolutionRequest(BaseModel):
    isotope: str
    time_period: float
    time_unit: str