# Radioactive Decay Chain Visualizer

A modern web application for visualizing radioactive decay chains and their time evolution, built with Next.js and Python. This tool helps scientists, students, and nuclear professionals understand and analyze radioactive decay processes through interactive visualizations.

## Architecture

- **Frontend**: Next.js React application
- **Backend**: Python API using FastAPI
- **Core Engine**: `radioactivedecay` Python library for calculations

## Features

- **Interactive Decay Chain Visualization**
  - Input any isotope using standard notation (e.g., U-238, Th-232)
  - Real-time visual representations of decay chains
  - Clear display of branching ratios and decay modes
  - Interactive hover effects for detailed information
  - Half-life information for each isotope

- **Time Evolution Analysis**
  - Dynamic plots showing relative amounts of isotopes over time
  - Interactive logarithmic scale visualization
  - Complete decay chain evolution tracking
  - Real-time daughter product monitoring

- **Modern User Interface**
  - Clean, responsive design
  - Dark/light mode support
  - Mobile-friendly layout
  - Intuitive isotope input system
  - Interactive tooltips and help system

## Tech Stack

### Frontend
- Next.js 13+
- React
- Tailwind CSS for styling
- shadcn/ui components
- Recharts for data visualization

### Backend
- Python 3.8+
- FastAPI
- `radioactivedecay` library
- NumPy for calculations
- Matplotlib for graph generation

## Example Isotopes

Analyze various decay chains, including:
- U-238 (Uranium series)
- Th-232 (Thorium series)
- Ra-226 (Radium decay)
- Rn-222 (Radon decay chain)
- Mo-99 (Medical isotope)

## Installation

### Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development

### Backend Development
- API endpoints are in `main.py`
- Core decay calculations in `/utils`
- Tests in `/tests`

### Frontend Development
- Components in `/components`
- Pages in `/app`
- Styles in `/styles`
- API utilities in `/lib`

## API Endpoints

- `POST /api/decay-chain`: Generate decay chain visualization
- `POST /api/evolution`: Calculate and return time evolution data
- `GET /api/isotopes`: Get list of available isotopes

## Output Information

The visualization includes:

- **Decay Chain Graph**
  - Interactive parent-daughter relationships
  - Color-coded decay modes (α, β-, β+, EC, IT)
  - Percentage display of branching ratios
  - Formatted half-lives with appropriate units

- **Evolution Plot**
  - Interactive time evolution graph
  - Logarithmic scale representation
  - Multi-isotope tracking
  - Customizable time ranges

## Environment Variables

```env
# Backend
PORT=8000
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- `radioactivedecay` library maintainers
- Nuclear data from ICRP-107 dataset
- Open-source community for various tools and libraries used

## Current Status

This project is under active development. Check the Issues tab for planned features and known bugs.