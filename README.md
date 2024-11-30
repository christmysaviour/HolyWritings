# Holy Writings

A blog website built with React for the frontend, Cloudflare Workers for the backend, Zod for validation, TypeScript, Prisma ORM with connection pooling, and PostgreSQL as the database. Users can sign up, sign in, view, edit, or delete their own blog posts.

## Features

- **User Authentication**: Sign up, sign in, and secure authentication via JWT.
- **Blog Management**: Users can view all blogs, and edit or delete their own blogs.
- **Validation**: Zod used for frontend validation and type inference.
- **Database**: PostgreSQL used as the database, accessed via Prisma ORM with connection pooling.

## Technologies Used

- **Frontend**: React, TypeScript
- **Backend**: Cloudflare Workers, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod

## Project Structure

- `frontend/`: Contains the React frontend for the blog website.
- `backend/`: Contains Cloudflare Workers backend API logic.
- `common/`: Shared code and types between frontend and backend.

## Setup Instructions

To run the project locally:

1. **Clone the repository**
    ```bash
    git clone <repository-url>
    cd holy-writings
    ```

2. **Install dependencies for both frontend and backend**

    - Frontend
        ```bash
        cd frontend
        npm install
        ```

    - Backend
        ```bash
        cd backend
        npm install
        ```

3. **Setup environment variables**
   Make sure you have the necessary environment variables set up for both frontend and backend (like JWT secrets, database URL, etc.).

4. **Run the frontend and backend servers**

    - **Run frontend server**
        ```bash
        cd frontend
        npm run dev
        ```

    - **Run backend server**
        ```bash
        cd backend
        npm run dev
        ```

Now, the app should be running locally. The frontend will usually be available at `http://localhost:3000`, and the backend at a URL provided by Cloudflare Workers.

## Folder Structure

- `frontend/`: Contains React components, pages, and frontend logic.
- `backend/`: Contains Cloudflare Workers logic for API endpoints.
- `common/`: Shared types, validation schemas, and utilities used in both frontend and backend.

