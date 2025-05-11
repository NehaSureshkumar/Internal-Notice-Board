# Internal Notice Board and Knowledge Management System

An internal system for managing company notices and knowledge articles with Django backend and React frontend.

## Features

- **Notice Board**: Post, view, and manage notices with different priority levels
- **Knowledge Base**: Organize articles by categories with search functionality
- **File Attachments**: Upload and manage files for both notices and articles
- **User Authentication**: Secure access to the system
- **Comments**: Add comments to knowledge articles

## Backend Setup (Django with SQL Server)

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Configure the database:
   - Create a `.env` file in the `backend` directory (use `.env.example` as a template)
   - Set up SQL Server connection details in the `.env` file
   - For development, you can use SQLite by setting `USE_SQLITE=True` in the `.env` file

3. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

4. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

5. Run the server:
   ```
   python manage.py runserver
   ```

## Frontend Setup (React)

1. Install Node.js dependencies:
   ```
   cd ../client
   npm install
   ```

2. Build the frontend:
   ```
   npm run build
   ```

3. For development with hot-reloading:
   ```
   npm run dev
   ```

## SQL Server Setup Requirements

1. Install SQL Server Express or Developer Edition
2. Enable SQL Server authentication (mixed mode)
3. Create a database named 'knowledgebase'
4. Create a user with appropriate permissions
5. Install ODBC Driver 17 for SQL Server
6. Update the `.env` file with your SQL Server details

## API Endpoints

- `/api/notices/` - CRUD operations for notices
- `/api/categories/` - CRUD operations for knowledge categories
- `/api/articles/` - CRUD operations for knowledge articles
- `/api/comments/` - CRUD operations for article comments
- `/api/users/` - View users
- `/api/stats/` - System statistics

## Additional Configuration

Check `settings.py` for more configuration options:
- `MEDIA_ROOT` and `MEDIA_URL` for file uploads
- `REST_FRAMEWORK` settings for API configuration
- `CORS_ALLOW_ALL_ORIGINS` for CORS settings