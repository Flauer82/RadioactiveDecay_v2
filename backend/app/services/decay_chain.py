from radioactivedecay import Nuclide
import matplotlib.pyplot as plt
import io
import base64
import logging

logger = logging.getLogger(__name__)

class DecayChainService:
    def get_nuclide_info(self, nuclide: Nuclide) -> dict:
        """Gather detailed information about a nuclide"""
        try:
            info = {
                'name': nuclide.nuclide,
                'half_life': nuclide.half_life('readable'),
                'atomic_mass': round(nuclide.atomic_mass, 6),
                'atomic_number': nuclide.Z,
                'mass_number': nuclide.A,
            }
            
            # Add decay modes and branching fractions if radioactive
            decay_modes = nuclide.decay_modes()
            if decay_modes:
                info['decay_modes'] = decay_modes
                info['branching_fractions'] = [
                    round(bf * 100, 2) for bf in nuclide.branching_fractions()
                ]
                
            return info
        except Exception as e:
            logger.error(f"Error getting nuclide info: {str(e)}")
            return {'name': nuclide.nuclide}

    def generate_decay_chain(self, isotope: str) -> dict:
        """Generate enhanced decay chain visualization with interactive data"""
        try:
            initial_nuclide = Nuclide(isotope)
            
            # Create figure with larger size for better readability
            fig = plt.figure(figsize=(12, 8))
            
            # Generate decay chain plot with enhanced spacing
            fig, ax = initial_nuclide.plot(label_pos=0.66)
            
            # Get figure dimensions
            width_inches, height_inches = fig.get_size_inches()
            dpi = fig.dpi
            width_pixels = width_inches * dpi
            height_pixels = height_inches * dpi
            
            # Get the graph and nodes
            graph = None
            try:
                graph = ax.get_figure().get_axes()[0].graph
            except AttributeError:
                logger.warning("Could not access graph data for interactive features")
            
            # Collect node positions and data
            node_info = {}
            if graph:
                for node in graph.nodes():
                    try:
                        # Get node position
                        pos = graph.nodes[node].get('pos', [0, 0])
                        nuclide = Nuclide(node)
                        
                        # Store detailed information
                        node_info[node] = {
                            'position': {
                                'x': float(pos[0]), 
                                'y': float(pos[1])
                            },
                            'data': self.get_nuclide_info(nuclide)
                        }
                    except Exception as e:
                        logger.error(f"Error processing node {node}: {str(e)}")
            
            # Save plot to buffer
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', bbox_inches='tight', 
                       dpi=dpi, facecolor='white', edgecolor='none')
            plt.close('all')  # Make sure to close all figures
            buffer.seek(0)
            
            # Convert to base64
            image_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            return {
                'image': image_base64,
                'nodes': node_info,
                'metadata': {
                    'width': width_pixels,
                    'height': height_pixels,
                    'dpi': dpi
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating decay chain: {str(e)}")
            raise ValueError(f"Failed to generate decay chain: {str(e)}")
        finally:
            plt.close('all')  # Ensure all figures are closed