# SRD Consulting Ltd Backend

This is the backend API application for SRD Consulting Ltd, built with Next.js (API-only), Prisma ORM, and PostgreSQL. It includes Swagger documentation, admin user seeding, and local file upload handling.

## Project Structure

```
srd-backend/
├── pages/
│   └── api/
│       ├── auth/
│       │   └── login.ts
│       ├── blog/
│       │   ├── index.ts       (GET list, POST create)
│       │   └── [id].ts        (GET single, PUT update, DELETE)
│       ├── testimonials/
│       │   ├── index.ts       (GET approved, POST submit)
│       │   ├── admin.ts       (GET all for admin)
│       │   ├── [id]/
│       │   │   ├── approve.ts (POST approve)
│       │   │   └── delete.ts  (DELETE)
│       ├── bookings/
│       │   ├── index.ts       (POST submit)
│       │   └── admin.ts       (GET all, PUT status update)
│       ├── about.ts           (GET/PUT about content)
│       ├── payment-link.ts    (POST generate Paystack link)
│       └── docs.ts            (Swagger UI endpoint)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts              (Admin user seeding script)
├── public/
│   └── uploads/             (Local storage for uploaded files - **NOT FOR PRODUCTION**)
├── lib/
│   └── prisma.ts            (Prisma client initialization)
├── utils/
│   ├── auth.ts              (JWT and password utilities)
│   ├── paystack.ts          (Paystack API integration)
│   └── upload.ts            (Multer configuration for file uploads)
├── middleware/
│   └── authMiddleware.ts    (JWT authentication middleware)
├── swagger.js               (Swagger JSDoc configuration)
├── .env.example             (Environment variables template)
├── package.json
├── tsconfig.json
└── next-env.d.ts
```

## Setup and Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url> srd-backend
    cd srd-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `srd-backend` root directory based on `.env.example`.
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/srd_db?schema=public"
    JWT_SECRET="your_strong_jwt_secret_key" # Use a strong, random string
    PAYSTACK_SECRET_KEY="your_paystack_secret_key" # Get from Paystack dashboard
    ```
    **Note:** For `DATABASE_URL`, replace `user`, `password`, `localhost:5432`, and `srd_db` with your PostgreSQL database credentials and host.

4.  **Database Setup (PostgreSQL):**
    *   Ensure you have a PostgreSQL server running.
    *   Create a new database (e.g., `srd_db`).
    *   Run Prisma migrations to create tables:
        ```bash
        npx prisma migrate dev --name init
        ```
    *   Generate Prisma client:
        ```bash
        npx prisma generate
        ```

5.  **Seed Admin User:**
    The project includes a seeding script to create an initial admin user.
    *   **Email:** `info@adminsrd.com`
    *   **Password:** `SchAdmin@11`
    Run the seed script:
    ```bash
    npm run prisma:seed
    ```

6.  **Create Uploads Directory:**
    Create a directory for local file uploads:
    ```bash
    mkdir -p public/uploads
    ```
    **Important:** This local storage is **not suitable for production** environments like Render, which use ephemeral file systems. For production, you must integrate with a cloud storage service (e.g., AWS S3, Cloudinary).

7.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The backend API will be accessible at `http://localhost:3001/api`.

## API Documentation (Swagger UI)

Once the backend development server is running, you can access the interactive Swagger UI at:
`http://localhost:3001/api/docs`

This interface allows you to explore all available API endpoints, their parameters, request/response schemas, and even test them directly.

## Deployment (Render)

This backend application is designed to be deployed on Render.
1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Create a new Web Service on Render.
3.  Connect your Git repository.
4.  Configure build and start commands:
    *   Build Command: `npm install && npm run build`
    *   Start Command: `npm run start`
5.  **Environment Variables:** Add all variables from your `.env` file (e.g., `DATABASE_URL`, `JWT_SECRET`, `PAYSTACK_SECRET_KEY`) to Render's environment variables.
6.  **Database Connection:** Ensure your `DATABASE_URL` points to a persistent PostgreSQL database (e.g., a Render PostgreSQL instance).
7.  **File Storage (Critical for Production):**
    *   **DO NOT** rely on `public/uploads` for production.
    *   Before deploying to Render, you **MUST** modify `utils/upload.ts` and related API routes to use a cloud storage solution (e.g., AWS S3, Cloudinary). This is crucial for persistent file storage across deployments and scaling.

---