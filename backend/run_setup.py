"""
Complete setup script for Stock Prediction Platform
Run this to set up everything from scratch
"""

import os
import sys
import subprocess

def run_command(command, description):
    """Run a command and print status"""
    print(f"\n{'='*60}")
    print(f"🔧 {description}")
    print(f"{'='*60}")
    
    result = subprocess.run(command, shell=True)
    
    if result.returncode == 0:
        print(f"✅ {description} - SUCCESS")
        return True
    else:
        print(f"❌ {description} - FAILED")
        return False

def main():
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║     Stock Prediction Platform - Complete Setup          ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    # Step 1: Initialize database
    if not run_command('python scripts/init_db.py', 'Initializing database'):
        print("\n❌ Setup failed at database initialization")
        return
    
    # Step 2: Fetch stock data
    print("\n📊 This will fetch data for ~40 popular stocks (may take 5-10 minutes)")
    response = input("Continue? (y/n): ")
    
    if response.lower() == 'y':
        if not run_command('python scripts/fetch_stock_data.py', 'Fetching stock data'):
            print("\n⚠️  Warning: Stock data fetch failed, but you can continue")
    
    # Step 3: Train ML models
    print("\n🤖 Training ML models for predictions")
    response = input("Train models now? (y/n): ")
    
    if response.lower() == 'y':
        if not run_command('python scripts/train_models.py --all', 'Training ML models'):
            print("\n⚠️  Warning: Model training failed, but you can continue")
    
    print("""
    
    ✨ Setup Complete! ✨
    
    🚀 To start the backend server:
       python run.py
    
    👤 Default Admin Account:
       Username: admin
       Password: admin123
    
    💰 Starting Balance: $100,000 (virtual money)
    
    📝 Next Steps:
       1. Start the backend: python run.py
       2. Start the frontend: cd ../frontend && npm run dev
       3. Login at http://localhost:5173/login
    
    """)

if __name__ == '__main__':
    main()
