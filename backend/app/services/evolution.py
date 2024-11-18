# backend/app/services/evolution.py
from radioactivedecay import Inventory
import matplotlib.pyplot as plt
import io
import base64
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class TimeEvolutionService:
    """Service for generating time evolution plots and data"""

    def __init__(self):
        self.default_time_period = 365.25  # 1 year
        self.default_time_unit = 'd'  # days
        self.available_units = {
            'activity': ['Bq', 'kBq', 'MBq', 'GBq', 'Ci', 'mCi', 'µCi'],
            'mass': ['g'],
            'amount': ['mol', 'num'],
            'fraction': ['activity_frac', 'mass_frac', 'mol_frac']
        }

    def get_y_axis_label(self, y_unit: str) -> str:
        """Get appropriate y-axis label based on unit"""
        unit_labels = {
            # Activity units
            'Bq': 'Activity (Bq)',
            'kBq': 'Activity (kBq)',
            'MBq': 'Activity (MBq)',
            'GBq': 'Activity (GBq)',
            'Ci': 'Activity (Ci)',
            'mCi': 'Activity (mCi)',
            'µCi': 'Activity (µCi)',
            # Mass and amount units
            'g': 'Mass (g)',
            'mol': 'Amount (mol)',
            'num': 'Number of atoms',
            # Fraction units
            'activity_frac': 'Activity fraction',
            'mass_frac': 'Mass fraction',
            'mol_frac': 'Mole fraction'
        }
        return unit_labels.get(y_unit, f'Amount ({y_unit})')

    def create_inventory(self, nuclides: List[Dict[str, str]]) -> Inventory:
        """Create an inventory from list of nuclide entries"""
        try:
            # Convert list of nuclides into inventory format
            inventory_dict = {
                entry['isotope']: float(entry['quantity'])
                for entry in nuclides
                if entry['isotope'] and entry['quantity']
            }
            
            # Get the unit from the first valid entry
            unit = next((entry['unit'] for entry in nuclides 
                        if entry['isotope'] and entry['quantity']), 'Bq')
            
            # Create and return inventory
            return Inventory(inventory_dict, unit)
            
        except Exception as e:
            logger.error(f"Error creating inventory: {str(e)}")
            raise ValueError(f"Failed to create inventory: {str(e)}")

    def generate_evolution_plot(
        self,
        nuclides: List[Dict[str, str]],
        time_period: float = None,
        time_unit: str = None,
        y_unit: str = None
    ) -> Dict[str, Any]:
        """Generate time evolution plot with enhanced features
        
        Args:
            nuclides: List of dictionaries containing isotope, quantity, and unit
            time_period: Time period for evolution (default: class default)
            time_unit: Unit for time axis (default: class default)
            y_unit: Unit for y-axis. Can be:
                   - Activity units: 'Bq', 'kBq', 'MBq', 'GBq', 'Ci', 'mCi', 'µCi'
                   - Mass units: 'g'
                   - Amount units: 'mol', 'num'
                   - Fraction units: 'activity_frac', 'mass_frac', 'mol_frac'
                   (default: 'Bq')
            
        Returns:
            Dictionary containing plot image and data
        """
        try:
            # Use defaults if not specified
            time_period = time_period or self.default_time_period
            time_unit = time_unit or self.default_time_unit
            y_unit = y_unit or 'Bq'
            
            # Create inventory from nuclides
            inv = self.create_inventory(nuclides)
            
            # Create figure with larger size for better readability
            plt.figure(figsize=(12, 6))
            
            # Determine if we're plotting fractions
            is_fraction = y_unit.endswith('_frac')
            
            # Generate plot with specified parameters
            fig, ax = inv.plot(
                xmax=time_period,
                xunits=time_unit,
                xscale='log',
                yscale='log' if not is_fraction else 'linear',  # Linear scale for fractions
                yunits=y_unit,
                xmin=time_period/1000,  # Start at 0.1% of max time
                ymin=1e-6 if not is_fraction else 0,  # Different y-axis minimum for fractions
            )
            
            # Enhance plot appearance
            plt.grid(True, which="both", ls="-", alpha=0.2)
            plt.title(f"Radioactive Decay Evolution")
            
            # Add informative labels
            plt.xlabel(f"Time ({time_unit})")
            plt.ylabel(self.get_y_axis_label(y_unit))
            
            # Get the data for interactive features
            time_data, decay_data = inv.decay_time_series(
                time_period=time_period,
                time_units=time_unit,
                decay_units=y_unit,
                time_scale='log'
            )
            
            # Save plot to buffer
            buffer = io.BytesIO()
            fig.savefig(buffer, format='png', bbox_inches='tight', dpi=300)
            plt.close('all')
            buffer.seek(0)
            
            # Convert to base64
            image_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            # Prepare response with plot and data
            return {
                'image': image_base64,
                'plot_data': {
                    'time': time_data,
                    'decay': decay_data
                },
                'metadata': {
                    'time_unit': time_unit,
                    'y_unit': y_unit,
                    'nuclides': list(decay_data.keys())
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating evolution plot: {str(e)}")
            raise ValueError(f"Failed to generate evolution plot: {str(e)}")
        finally:
            plt.close('all')  # Ensure all figures are closed