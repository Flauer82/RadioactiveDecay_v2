# 🔬 Radioactive Decay Chain Visualizer

<div align="center">

![Radioactive Decay Banner](frontend/public/banner.png)

> An interactive web application for visualizing and understanding radioactive decay chains through elegant visualization and real-time calculations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/next.js-13+-000000.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.68+-009688.svg)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Development Setup](#-development-setup)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Theory Behind Decay Chain Calculations](#-theory-behind-decay-chain-calculations)
- [Deployment](#-deployment)

## 🎯 Project Overview

The Radioactive Decay Chain Visualizer is designed to:
- Provide intuitive visualization of radioactive decay chains
- Calculate and display time evolution of isotope quantities with flexible unit options
- Support educational and research needs in nuclear physics
- Offer a modern, responsive user interface
- Enable easy sharing and export of results

### Design Philosophy
- **Clean Architecture** 🏗️
  - Separation of concerns between frontend and backend
  - Clear dependency boundaries
  - Testable and maintainable code structure

- **User-Centric Design** 👥
  - Intuitive interface for both beginners and experts
  - Real-time feedback and interactions
  - Comprehensive help system
  - Flexible visualization options

## ✨ Features

### Core Features
1. **Decay Chain Visualization** 🔄
   - Interactive decay chain diagrams
   - Hover tooltips with detailed isotope information
   - Clear visualization of branching fractions

2. **Time Evolution Analysis** 📈
   - Dynamic evolution plots
   - Multiple unit options for y-axis:
     - Activity units (Bq, kBq, MBq, GBq, Ci, mCi, µCi)
     - Mass units (g)
     - Amount units (mol, number of atoms)
     - Fraction units (activity, mass, and mole fractions)
   - Configurable time periods and units
   - Real-time plot updates

3. **Data Management** 📊
   - Support for multiple nuclides
   - Flexible unit conversions
   - Interactive data display

### Technical Features
- **Modern Tech Stack** 💻
  - Next.js 13+ with TypeScript
  - FastAPI backend
  - Real-time calculations using radioactivedecay library
- 🚀 Real-time calculations using Python's radioactivedecay library
- 🔄 WebSocket support for live updates
- 📱 Responsive design with Tailwind CSS
- 🌙 Dark/light mode theme support
- 🔌 RESTful API endpoints with FastAPI

## 📁 Project Structure

The project follows a modern microservices architecture with containerized frontend and backend services:

```
radioactive-decay/
├── backend/                 # FastAPI backend service
│   ├── app/
│   │   ├── services/       # Core business logic
│   │   │   ├── decay_chain.py    # Decay chain generation
│   │   │   └── evolution.py      # Time evolution calculations
│   │   └── main.py        # FastAPI application and endpoints
│   ├── Dockerfile         # Multi-stage build for backend
│   └── requirements.txt   # Python dependencies
│
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── components/   # React components
│   │   └── lib/         # Utility functions and types
│   ├── public/          # Static assets
│   ├── Dockerfile       # Multi-stage build for frontend
│   └── next.config.js   # Next.js configuration
│
├── k8s/                 # Kubernetes manifests
│   ├── frontend/       # Frontend deployment resources
│   ├── backend/        # Backend deployment resources
│   └── ingress.yaml    # Ingress configuration
│
└── README.md           # Project documentation
```

### Key Components

1. **Backend Service**
   - FastAPI framework with Python 3.8+
   - RESTful endpoints for decay chain and evolution calculations
   - Modular service architecture
   - Kubernetes-ready with health checks
   - Proper path-based routing under `/rad_decay/api`

2. **Frontend Application**
   - Next.js 13+ with TypeScript
   - Interactive visualization components
   - Responsive design with Tailwind CSS
   - Configured for `/rad_decay` base path
   - Production-optimized builds

3. **Kubernetes Deployment**
   - Containerized services with multi-stage builds
   - Ingress configuration for external access
   - Service meshes for internal communication
   - Health monitoring and auto-scaling
   - Secure and efficient routing

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Flauer82/RadioactiveDecay_v2.git
cd RadioactiveDecay_v2
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Create necessary environment files:

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend (.env):
```env
DEBUG=True
CORS_ORIGINS=http://localhost:3002
```

## 🛠️ Development Setup

### Running the Development Environment

1. Start the backend server:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Access the application:
- Frontend: http://localhost:3002
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Development Tools

- **VS Code Extensions**:
  - Python
  - Pylance
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

- **Browser Extensions**:
  - React Developer Tools
  - Redux DevTools

## 📚 API Documentation

Our API is fully documented using OpenAPI (Swagger) specifications. Access the interactive documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key API Endpoints

- `POST /api/decay-chain`: Calculate decay chain for given isotope
- `GET /api/isotopes`: List available isotopes
- `POST /api/calculate`: Perform time evolution calculations
- `GET /api/export/{format}`: Export results in various formats

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Use TypeScript for all JavaScript code
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Theory Behind Decay Chain Calculations

The radioactive decay chain calculations are based on the Bateman equations, which describe the time evolution of nuclide quantities in a decay chain. For a chain of radioactive nuclides where each nuclide decays into the next:

A₁ → A₂ → A₃ → ... → Aₙ

The amount of each nuclide at time t is given by:

N₍ᵢ₎(t) = N₁(0) × ∑ᵏ [αₖ × e⁻ᵏᵗ]

where:
- N₍ᵢ₎(t) is the amount of the i-th nuclide at time t
- N₁(0) is the initial amount of the parent nuclide
- λᵢ is the decay constant for the i-th nuclide (λ = ln(2)/t₁/₂)
- αₖ are coefficients determined by the decay constants
- t is the time

The code implements these equations using numerical methods to handle:
- Branching decay chains (where a nuclide can decay to multiple daughters)
- Multiple initial nuclides
- Different time scales (from seconds to years)
- Various units (activity, mass, moles, or atom numbers)

## 🚀 Deployment

### Kubernetes Deployment

The application is containerized and can be deployed to a Kubernetes cluster. The deployment consists of:

1. **Frontend Container**
   - Next.js application served under `/rad_decay/`
   - Built with multi-stage Docker build for optimal size
   - Configured with proper base path handling

2. **Backend Container**
   - FastAPI application served under `/rad_decay/api/`
   - Python-based calculation engine
   - RESTful API endpoints for decay chain and evolution calculations

3. **Kubernetes Resources**
   - Deployments for both frontend and backend
   - Services for internal communication
   - Ingress for external access
   - Health checks and proper routing configuration

To deploy to Kubernetes:

```bash
# Build and push container images
docker build -t ghcr.io/your-username/radioactive-decay-frontend:latest frontend/
docker build -t ghcr.io/your-username/radioactive-decay-backend:latest backend/
docker push ghcr.io/your-username/radioactive-decay-frontend:latest
docker push ghcr.io/your-username/radioactive-decay-backend:latest

# Apply Kubernetes manifests
kubectl apply -f k8s/
```

The application will be available at `https://your-domain.com/rad_decay/`

## 🙏 Acknowledgments

- [radioactivedecay](https://github.com/radioactivedecay/radioactivedecay) library for decay calculations
- [Next.js](https://nextjs.org/) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<div align="center">
  <p>
    Made with ❤️ by Flauer82<br>
    with the invaluable help of <a href="https://codeium.com/windsurf">Windsurf by Codeium</a>
  </p>
</div>
