# backend/app/services/decay_chain.py
from radioactivedecay import Nuclide
import matplotlib.pyplot as plt
import io
import base64

class DecayChainService:
    def generate_decay_chain(self, isotope: str) -> str:
        """Generate decay chain visualization"""
        try:
            nuclide = Nuclide(isotope)
            
            # Create figure with larger size
            plt.figure(figsize=(12, 8))
            
            # Generate plot
            fig, ax = nuclide.plot()
            
            # Save to buffer
            buffer = io.BytesIO()
            fig.savefig(buffer, format='png', bbox_inches='tight', dpi=300)
            plt.close(fig)
            
            # Convert to base64
            image_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            return image_base64
        except Exception as e:
            raise ValueError(f"Failed to generate decay chain: {str(e)}")