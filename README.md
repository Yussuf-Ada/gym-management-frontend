# Gym Management Frontend

A modern React application for gym management with enterprise-grade authentication, responsive design, and seamless API integration.

## 🏋️ Overview

This frontend provides a complete user interface for gym management, including member administration, class scheduling, membership management, and dashboard analytics.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, Vite, and TailwindCSS
- **Enterprise Authentication**: JWT-based login with password reset
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Real-time Dashboard**: Live statistics and activity monitoring
- **Member Management**: Complete CRUD operations with image uploads
- **Class Booking System**: Interactive class scheduling and booking
- **Profile Management**: User profile updates with Cloudinary integration
- **Professional UI/UX**: Modern, intuitive interface design

## 📋 Prerequisites

- Node.js 18+
- npm
- Modern web browser
- Backend API deployed and running (see backend README)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Yussuf-Ada/gym-management-frontend.git
cd gym-management-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file with the following variables:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000/api
```

For production deployment:
```bash
VITE_API_URL=https://gym-management-api-me3d.onrender.com/api
```

### 4. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Architecture

### Project Structure
```
gym-management-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/            # React context providers
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Application entry point
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

### Key Components

#### Authentication System
- **Login Page**: User authentication with JWT tokens
- **Registration Page**: New user registration
- **Password Reset**: Forgot password flow with email verification
- **Protected Routes**: Route guards for authenticated users

#### Dashboard
- **Statistics Overview**: Real-time gym metrics
- **Recent Activity**: Latest member and booking activities
- **Quick Actions**: Easy access to common tasks

#### Member Management
- **Member List**: Searchable, filterable member directory
- **Member Details**: Complete member information management
- **Profile Images**: Cloudinary integration for photo uploads
- **Membership Status**: Active and expired subscription tracking

#### Class Management
- **Class Schedule**: Interactive calendar view
- **Booking System**: Real-time class reservations
- **Instructor Management**: Staff assignment and scheduling

## 🔐 Authentication Flow

### Login Process
1. User enters email and password
2. Frontend sends credentials to `/api/auth/login/`
3. Backend validates and returns JWT tokens
4. Tokens stored in localStorage
5. User redirected to dashboard

### Password Reset Flow
1. User clicks "Forgot Password"
2. Enter email address
3. Backend sends reset email via SendGrid
4. User clicks email link
5. Set new password on reset page
6. Tokens updated automatically

## 🎨 UI/UX Features

### Design System
- **TailwindCSS**: Utility-first CSS framework
- **Lucide Icons**: Consistent iconography
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Accessibility consideration

### User Experience
- **Loading States**: Smooth transitions and feedback
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation
- **Success Notifications**: Confirmation messages

## 🔧 Technical Implementation

### State Management
- **React Context**: Global authentication state
- **Local State**: Component-level state with useState
- **Server State**: API calls with Axios

### API Integration
- **Axios Instance**: Configured HTTP client
- **Token Management**: Automatic token refresh
- **Error Handling**: Centralised error management
- **Request Interceptors**: Authentication headers

### File Uploads
- **Cloudinary Integration**: Profile image storage
- **FormData Handling**: Multipart form submissions
- **Progress Indicators**: Upload progress feedback
- **Image Preview**: Before upload preview

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Component testing with React Testing Library
- Integration testing for API calls
- User interaction testing
- Accessibility testing

## 🚀 Deployment

### Environment Variables for Production
```bash
VITE_API_URL=https://your-production-api.com/api
```

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📊 Performance Optimisation

### Code Splitting
- **Lazy Loading**: Route-based code splitting
- **Component Splitting**: Dynamic imports
- **Bundle Optimisation**: Vite build optimisation

### Caching Strategy
- **API Caching**: Response caching where appropriate
- **Image Caching**: Cloudinary CDN optimisation
- **Browser Caching**: Proper cache headers

## 🔧 Technical Decisions

### Framework Choice
- **React 18**: Latest features and performance improvements
- **Vite**: Fast development server and optimised builds
- **TailwindCSS**: Rapid UI development with consistent design
- **React Router**: Client-side routing with protected routes

### UI Library
- **Lucide Icons**: Modern, consistent icon set
- **Custom Components**: Reusable, accessible components
- **CSS-in-JS**: Tailwind utility classes for maintainability

### State Management
- **React Context**: Lightweight global state
- **Local State**: Component-level state management
- **Server State**: API-driven state updates

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Support

For support and queries, please contact:
- Email: support@gymmanagement.com
- GitHub Issues: [Create an issue](https://github.com/Yussuf-Ada/gym-management-frontend/issues)

## 🌐 Live Deployment

- **Frontend**: https://gym-management-frontend-zeta.vercel.app
- **Backend**: https://gym-management-api-me3d.onrender.com

---

