# backend/app/services/evolution.py
from radioactivedecay import Inventory
import matplotlib.pyplot as plt
import io
import base64

class TimeEvolutionService:
    def generate_evolution_plot(
        self, 
        isotope: str, 
        time_period: float,
        time_unit: str
    ) -> str:
        """Generate time evolution plot"""
        try:
            # Create inventory with 1.0 Bq of isotope
            inv = Inventory({isotope: 1.0})
            
            # Create figure with larger size
            plt.figure(figsize=(12, 6))
            
            # Generate plot
            fig, ax = inv.plot(
                xmax=time_period,
                xunits=time_unit,
                xscale='log',
                yscale='log',
                yunits='Bq'
            )
            
            # Enhance plot appearance
            plt.grid(True, which="both", ls="-", alpha=0.2)
            plt.title(f"Decay Evolution of {isotope}")
            
            # Save to buffer
            buffer = io.BytesIO()
            fig.savefig(buffer, format='png', bbox_inches='tight', dpi=300)
            plt.close(fig)
            
            # Convert to base64
            image_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            return image_base64
        except Exception as e:
            raise ValueError(f"Failed to generate evolution plot: {str(e)}")