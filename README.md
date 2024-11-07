# TREL-PROOF

**TREL-PROOF** is a task management application inspired by Trello, developed as part of a technical test. This app allows you to manage boards, tasks, and subtasks with drag-and-drop functionality, as well as support for rich text in tasks.

## Requirements

Before running the project, make sure you have the following installed:

- **Node.js** (recommended version 16.x or higher)
- **Prisma** (for the database)
- **Configured database** (e.g., PostgreSQL or SQLite)

## Installation and Setup

Follow these steps to run the application locally:

1. **Install dependencies:**

   Run the following command to install all the project dependencies:

   ```sh
   npm i
   ```

2. **Migrate the database:**

   Ensure your database is properly configured and migrate the necessary tables for the project:

   ```sh
   npx prisma migrate dev
   ```

3. **Start the development server:**

   Run the following command to start the development server and launch the application:

   ```sh
   npm run dev
   ```
    
