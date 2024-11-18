# 🔬 Radioactive Decay Chain Visualizer

<div align="center">

<!-- Replace this comment with your banner image -->
<!-- Recommended: Create a banner (1200x300) using Canva or Adobe Express -->
<!-- Example: ![Radioactive Decay Banner](frontend/public/banner.png) -->
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

## 🎯 Project Overview

The Radioactive Decay Chain Visualizer is designed to:
- Provide intuitive visualization of radioactive decay chains
- Calculate and display time evolution of isotope quantities
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
  - Accessibility considerations

- **Performance** ⚡
  - Optimized calculations on the backend
  - Efficient data transfer between layers
  - Client-side caching where appropriate

## 🌟 Features

### Core Capabilities
- 📊 Interactive decay chain visualization
- 📈 Time evolution plotting
- 🔍 Detailed isotope information
- 💾 Data export functionality
- 🎨 Customizable visualizations

### Technical Features
- 🚀 Real-time calculations using Python's radioactivedecay library
- 🔄 WebSocket support for live updates
- 📱 Responsive design with Tailwind CSS
- 🌙 Dark/light mode theme support
- 🔌 RESTful API endpoints with FastAPI

## 📁 Project Structure

```
RadioactiveDecay_v2/
├── 📂 frontend/                # Next.js frontend application
│   ├── 📂 src/                # Source code
│   │   ├── 📂 app/           # Next.js 13+ app directory
│   │   ├── 📂 components/    # Reusable UI components
│   │   └── 📂 lib/          # Utility functions and hooks
│   ├── 📂 public/            # Static assets
│   └── 📄 package.json       # Frontend dependencies
│
├── 📂 backend/                # FastAPI backend application
│   ├── 📂 app/               # Main application code
│   │   ├── 📂 api/          # API routes and handlers
│   │   ├── 📂 core/         # Business logic
│   │   └── 📂 models/       # Data models and schemas
│   ├── 📂 rad_decay/         # Decay calculation module
│   └── 📂 tests/             # Backend tests
│
└── 📄 README.md              # Project documentation
```

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

## 🙏 Acknowledgments

- [radioactivedecay](https://github.com/radioactivedecay/radioactivedecay) library for decay calculations
- [Next.js](https://nextjs.org/) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<div align="center">
Made with ❤️ by Flauer82 
</div>