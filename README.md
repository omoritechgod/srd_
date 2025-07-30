# SRD Consulting Ltd Website

A modern, full-stack web application for SRD Consulting Ltd - a strategic communications and public relations firm.

## 🏗️ Architecture

- **Frontend**: React + TypeScript with Vite (Deploy on Vercel)
- **Backend**: Next.js API-only (Deploy on Render)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom animations
- **Authentication**: JWT-based admin authentication

## 🚀 Features

### Public Website
- **Home Page**: Hero section with company introduction and animated elements
- **About Us**: Editable company information and mission/vision/values
- **Solutions**: Interactive service cards with detailed modals
- **Blog**: Modern blog layout with search and filtering
- **Testimonials**: Carousel display with submission form
- **Booking**: Consultation booking form with file uploads
- **Contact**: Contact form with social media integration
- **Courses**: Coming soon page with notification signup

### Admin Dashboard
- **Blog Management**: Create, edit, and delete blog posts with rich text editor
- **Testimonial Management**: Review, approve, and manage client testimonials
- **Booking Management**: View and manage consultation bookings
- **About Page Management**: Update about content and banner images
- **Payment Link Generation**: Create Paystack payment links with WhatsApp sharing
- **JWT Authentication**: Secure admin access

## 🎨 Design Features

- **Branding**: Custom color palette (#F58220, #333333, #FFFFFF, #AAAAAA)
- **Typography**: Sora font family throughout
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Responsive**: Mobile-first design with Tailwind CSS
- **Accessibility**: Semantic HTML and proper ARIA labels

## 📁 Project Structure

```
srd-consulting-frontend/
├── public/
│   ├── new_blapng.png          # Dark logo for light backgrounds
│   └── new_bla-white.png       # Light logo for dark backgrounds
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Solutions.tsx
│   │   ├── Blog/
│   │   │   ├── index.tsx
│   │   │   └── BlogPost.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Booking.tsx
│   │   ├── Contact.tsx
│   │   ├── Courses.tsx
│   │   └── Admin/
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── BlogManager.tsx
│   │       ├── TestimonialManager.tsx
│   │       ├── BookingManager.tsx
│   │       ├── AboutManager.tsx
│   │       └── PaymentLink.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.local
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Paystack account for payment integration

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Add Logo Files**
   Place the provided logo files in the `public/` directory:
   - `new_blapng.png` (dark logo for light backgrounds)
   - `new_bla-white.png` (light logo for dark backgrounds)

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

### Backend Setup (Required)

You'll need to create a separate Next.js API backend. Here's the basic structure:

1. **Create Backend Project**
   ```bash
   npx create-next-app@latest srd-backend --typescript
   cd srd-backend
   ```

2. **Install Backend Dependencies**
   ```bash
   npm install prisma @prisma/client bcryptjs jsonwebtoken multer
   npm install -D @types/bcryptjs @types/jsonwebtoken @types/multer
   ```

3. **Database Schema (prisma/schema.prisma)**
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model User {
     id        String   @id @default(uuid())
     email     String   @unique
     password  String
     createdAt DateTime @default(now())
   }

   model BlogPost {
     id        String   @id @default(uuid())
     title     String
     slug      String   @unique
     content   String
     image     String?
     tags      String[]
     createdAt DateTime @default(now())
   }

   model Testimonial {
     id        String   @id @default(uuid())
     name      String
     org       String?
     rating    Int?
     text      String
     photo     String?
     approved  Boolean  @default(false)
     createdAt DateTime @default(now())
   }

   model Booking {
     id        String   @id @default(uuid())
     name      String
     email     String
     phone     String
     service   String
     date      DateTime
     notes     String?
     file      String?
     status    String   @default("pending")
     createdAt DateTime @default(now())
   }

   model About {
     id        String   @id @default(uuid())
     content   String
     image     String?
     updatedAt DateTime @updatedAt
   }
   ```

4. **Environment Variables (.env)**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/srd_consulting"
   JWT_SECRET="your-super-secret-jwt-key"
   PAYSTACK_SECRET_KEY="your-paystack-secret-key"
   ```

5. **Required API Endpoints**
   Create these API routes in your Next.js backend:
   - `POST /api/auth/login` - Admin authentication
   - `GET/POST /api/blog` - Blog management
   - `GET /api/blog/[slug]` - Individual blog posts
   - `POST /api/testimonials` - Submit testimonials
   - `GET /api/testimonials/admin` - Admin testimonial management
   - `POST /api/bookings` - Submit bookings
   - `GET /api/bookings/admin` - Admin booking management
   - `GET/PUT /api/about` - About page content
   - `POST /api/payment-link` - Generate Paystack links
   - `POST /api/contact` - Contact form submissions

### Database Setup

1. **Initialize Prisma**
   ```bash
   npx prisma init
   ```

2. **Run Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Seed Database (Optional)**
   Create an admin user:
   ```bash
   npx prisma studio
   ```

### Paystack Integration

1. **Get API Keys**
   - Sign up at [Paystack](https://paystack.com)
   - Get your secret key from the dashboard
   - Add it to your backend `.env` file

2. **Test Integration**
   - Use test keys for development
   - Switch to live keys for production

## 🚀 Deployment

### Frontend (Vercel)

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

### Backend (Render)

1. **Prepare for Deployment**
   - Ensure all environment variables are set
   - Test all API endpoints locally

2. **Deploy to Render**
   - Create a new Web Service on Render
   - Connect your backend repository
   - Set environment variables
   - Deploy

### Database (Render PostgreSQL)

1. **Create Database**
   - Create a PostgreSQL instance on Render
   - Get the connection string
   - Update your backend environment variables

2. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Technologies

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **React Router** for navigation
- **Axios** for API communication
- **React Quill** for rich text editing
- **React DatePicker** for date selection

## 📝 Admin Access

### Default Admin Credentials
You'll need to create an admin user in your database. Use bcrypt to hash the password:

```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = bcrypt.hashSync('your-password', 10);
```

### Admin Features
- **Dashboard**: Overview of all content and statistics
- **Blog Management**: Full CRUD operations for blog posts
- **Testimonial Approval**: Review and approve client testimonials
- **Booking Management**: View and manage consultation requests
- **Content Management**: Update about page and other content
- **Payment Links**: Generate secure Paystack payment links

## 🎨 Customization

### Colors
Update the color palette in `tailwind.config.js`:
```javascript
colors: {
  primary: '#F58220',    // Orange
  dark: '#333333',       // Dark Gray
  light: '#FFFFFF',      // White
  gray: '#AAAAAA',       // Light Gray
}
```

### Fonts
The project uses the Sora font family. Update in `src/index.css` if needed.

### Animations
Customize animations in `tailwind.config.js` and use Framer Motion for complex animations.

## 🔒 Security

- JWT-based authentication for admin access
- Protected API routes with middleware
- Input validation and sanitization
- Secure file uploads with type checking
- CORS configuration for API security

## 📱 Mobile Responsiveness

The application is built with a mobile-first approach:
- Responsive navigation with mobile menu
- Optimized layouts for all screen sizes
- Touch-friendly interactive elements
- Fast loading on mobile networks

## 🤝 Support

For technical support or questions about the implementation:
1. Check the console for any error messages
2. Verify all environment variables are set correctly
3. Ensure the backend API is running and accessible
4. Test API endpoints individually if issues persist

## 📄 License

This project is proprietary software for SRD Consulting Ltd.

---

**Note**: This is the frontend application only. You must also set up the corresponding Next.js backend API for full functionality. The backend should include all the API endpoints mentioned in this README and handle database operations, authentication, and external integrations like Paystack.