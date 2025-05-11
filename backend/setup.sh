#!/bin/bash

# Set up a Django project with SQL Server backend

echo "Setting up the Django project with SQL Server..."

# Create directories for uploads and media
mkdir -p media/notice_attachments
mkdir -p media/article_attachments

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
if [ -d "venv/Scripts" ]; then
    # Windows
    source venv/Scripts/activate
else
    # Linux/Mac
    source venv/bin/activate
fi

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check database connection
echo "Checking database connection..."
python setup_database.py

# Ask if the user wants to continue with migrations
read -p "Do you want to run database migrations? (y/n) " run_migrations

if [ "$run_migrations" = "y" ]; then
    echo "Running migrations..."
    python manage.py makemigrations
    python manage.py migrate
    
    # Load initial data
    echo "Initializing data..."
    python manage.py initialize_data
    
    read -p "Do you want to create a superuser? (y/n) " create_superuser
    
    if [ "$create_superuser" = "y" ]; then
        echo "Creating superuser..."
        python manage.py createsuperuser
    fi
    
    # Run the server
    read -p "Do you want to start the server? (y/n) " start_server
    
    if [ "$start_server" = "y" ]; then
        echo "Starting server..."
        python manage.py runserver 0.0.0.0:8000
    fi
else
    echo "Skipping migrations."
fi

echo "Setup completed!"