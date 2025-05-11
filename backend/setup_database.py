#!/usr/bin/env python
"""
SQL Server Database Setup Script

This script helps set up the SQL Server database for the Django project.
It checks the database connection and provides instructions on how to
configure SQL Server to work with Django.
"""

import os
import sys
import pyodbc
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

# Check Python version
print(f"Python version: {sys.version}")

# Get database configuration from environment variables
db_name = os.environ.get('DB_NAME', 'knowledgebase')
db_user = os.environ.get('DB_USER', '')
db_password = os.environ.get('DB_PASSWORD', '')
db_host = os.environ.get('DB_HOST', 'localhost\\SQLEXPRESS')
db_port = os.environ.get('DB_PORT', '1433')
driver = os.environ.get('DB_DRIVER', 'ODBC Driver 17 for SQL Server')

# Check if using SQLite instead
use_sqlite = os.environ.get('USE_SQLITE', 'False') == 'True'
if use_sqlite:
    print("\n*** Using SQLite database for development ***")
    print("If you want to use SQL Server, set USE_SQLITE=False in your .env file")
    sys.exit(0)

# Print database configuration
print("\nDatabase Configuration:")
print(f"Database Name: {db_name}")
print(f"Database Host: {db_host}")
print(f"Database Port: {db_port}")
print(f"Database User: {db_user}")
print(f"Database Password: {'*' * len(db_password) if db_password else 'Not set'}")
print(f"ODBC Driver: {driver}")

# List available ODBC drivers
print("\nAvailable ODBC Drivers:")
drivers = [x for x in pyodbc.drivers()]
for index, driver_name in enumerate(drivers, 1):
    print(f"{index}. {driver_name}")

if not drivers:
    print("No ODBC drivers found. Please install the SQL Server ODBC driver.")

# Try to connect to the database
print("\nAttempting to connect to SQL Server...")
try:
    connection_string = f"DRIVER={{{driver}}};SERVER={db_host};DATABASE={db_name};UID={db_user};PWD={db_password}"
    conn = pyodbc.connect(connection_string)
    print("Connection successful!")
    
    # Get SQL Server version
    cursor = conn.cursor()
    cursor.execute("SELECT @@version")
    version = cursor.fetchone()[0]
    print(f"SQL Server Version: {version[:50]}...")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Connection failed: {e}")
    print("\nPossible issues and solutions:")
    print("1. Make sure SQL Server is running")
    print("2. Check that the credentials in .env are correct")
    print("3. Ensure SQL Server is configured to allow SQL Server authentication")
    print("4. Create the database if it doesn't exist")
    print("5. Verify the SQL Server ODBC driver is installed")
    
    print("\nSQL Server Configuration Steps:")
    print("1. Open SQL Server Management Studio")
    print("2. Right-click on the server and select 'Properties'")
    print("3. Go to 'Security' and ensure 'SQL Server and Windows Authentication mode' is selected")
    print("4. Create a login with SQL Server authentication")
    print("5. Create a database and grant appropriate permissions to the login")

print("\nNext Steps:")
print("1. Make sure Django is using the correct database engine in settings.py")
print("2. Run 'python manage.py migrate' to create the database schema")
print("3. Run 'python manage.py initialize_data' to load initial data")
print("4. Run 'python manage.py createsuperuser' to create an admin user")
print("5. Start the Django server with 'python manage.py runserver'")