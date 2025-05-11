from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.core.management import call_command
import os

class Command(BaseCommand):
    help = 'Initialize the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting data initialization...'))
        
        # 1. Create a superuser if none exists
        try:
            if not User.objects.filter(username='admin').exists():
                User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin123'  # This is for development only, change in production
                )
                self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
            else:
                self.stdout.write(self.style.SUCCESS('Superuser already exists'))
        except IntegrityError:
            self.stdout.write(self.style.WARNING('Superuser already exists'))
        
        # 2. Load initial categories fixture
        self.stdout.write(self.style.SUCCESS('Loading initial categories...'))
        call_command('loaddata', 'initial_categories', app_label='knowledge')
        
        self.stdout.write(self.style.SUCCESS('Data initialization completed!'))
        self.stdout.write(self.style.SUCCESS('Default admin credentials:'))
        self.stdout.write(self.style.SUCCESS('  Username: admin'))
        self.stdout.write(self.style.SUCCESS('  Password: admin123'))
        self.stdout.write(self.style.WARNING('Please change the default password in production!'))