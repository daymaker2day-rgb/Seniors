"""
Setup script for Senior Advertising Bot
Helps users configure the bot for their specific needs
"""

import json
import getpass
import os
from pathlib import Path

def setup_bot():
    """Interactive setup for the senior advertising bot"""
    print("🤖 Welcome to Senior Advertising Bot Setup!")
    print("=" * 50)
    print("This setup will help you configure your bot for respectful senior outreach.\n")
    
    # Load existing config or create new one
    config_file = "config.json"
    if os.path.exists(config_file):
        with open(config_file, 'r') as f:
            config = json.load(f)
        print("Found existing configuration. We'll update it.\n")
    else:
        config = {}
    
    # Basic business information
    print("📋 STEP 1: Business Information")
    print("-" * 30)
    
    business_name = input(f"Business name [{config.get('business_name', 'Your Business')}]: ").strip()
    if business_name:
        config['business_name'] = business_name
    elif 'business_name' not in config:
        config['business_name'] = 'Your Business'
    
    target_message = input(f"What do you help seniors with? [{config.get('target_message', 'Helping seniors with technology and services')}]: ").strip()
    if target_message:
        config['target_message'] = target_message
    elif 'target_message' not in config:
        config['target_message'] = 'Helping seniors with technology and services'
    
    phone = input("Phone number (optional): ").strip()
    email = input("Contact email (optional): ").strip()
    
    contact_parts = []
    if phone:
        contact_parts.append(f"📞 Call: {phone}")
    if email:
        contact_parts.append(f"📧 Email: {email}")
    
    if contact_parts:
        config['contact_info'] = " | ".join(contact_parts)
    elif 'contact_info' not in config:
        config['contact_info'] = "Contact us for more information"
    
    # Platform setup
    print("\n📱 STEP 2: Platform Setup")
    print("-" * 30)
    
    if 'platforms' not in config:
        config['platforms'] = {
            'facebook': {'enabled': False},
            'email': {'enabled': False},
            'community_sites': {'enabled': False}
        }
    
    # Email setup
    setup_email = input("Do you want to set up email campaigns? (y/n): ").lower().strip()
    if setup_email == 'y':
        print("\n📧 Email Setup:")
        email_config = config['platforms'].get('email', {})
        
        smtp_server = input(f"SMTP server [{email_config.get('smtp_server', 'smtp.gmail.com')}]: ").strip()
        if smtp_server:
            email_config['smtp_server'] = smtp_server
        elif 'smtp_server' not in email_config:
            email_config['smtp_server'] = 'smtp.gmail.com'
        
        smtp_port = input(f"SMTP port [{email_config.get('smtp_port', 587)}]: ").strip()
        if smtp_port:
            email_config['smtp_port'] = int(smtp_port)
        elif 'smtp_port' not in email_config:
            email_config['smtp_port'] = 587
        
        username = input(f"Email username [{email_config.get('username', '')}]: ").strip()
        if username:
            email_config['username'] = username
        
        if username:
            password = getpass.getpass("Email password (hidden): ")
            if password:
                email_config['password'] = password
                print("⚠️  Note: Password saved in config.json. Consider using app-specific passwords.")
        
        # Recipients
        print("\nEmail Recipients:")
        print("Enter email addresses one by one (press Enter with empty line to finish)")
        recipients = email_config.get('recipients', [])
        
        while True:
            recipient = input("Email address (or press Enter to finish): ").strip()
            if not recipient:
                break
            name = input(f"Name for {recipient} (optional): ").strip()
            
            if name:
                recipients.append(f"{name} <{recipient}>")
            else:
                recipients.append(recipient)
        
        email_config['recipients'] = recipients
        email_config['enabled'] = True
        config['platforms']['email'] = email_config
        
        print(f"✅ Email setup complete! {len(recipients)} recipients added.")
    
    # Posting schedule
    print("\n⏰ STEP 3: Posting Schedule")
    print("-" * 30)
    
    schedule_config = config.get('posting_schedule', {})
    
    frequency = input(f"How often to post (hours) [{schedule_config.get('frequency_hours', 24)}]: ").strip()
    if frequency:
        schedule_config['frequency_hours'] = int(frequency)
    elif 'frequency_hours' not in schedule_config:
        schedule_config['frequency_hours'] = 24
    
    max_posts = input(f"Max posts per day [{schedule_config.get('max_posts_per_day', 3)}]: ").strip()
    if max_posts:
        schedule_config['max_posts_per_day'] = int(max_posts)
    elif 'max_posts_per_day' not in schedule_config:
        schedule_config['max_posts_per_day'] = 3
    
    schedule_config['respect_quiet_hours'] = True
    config['posting_schedule'] = schedule_config
    
    # Save configuration
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print("\n✅ Setup Complete!")
    print("=" * 50)
    print(f"Configuration saved to {config_file}")
    print("\nYour bot is configured for:")
    print(f"  • Business: {config['business_name']}")
    print(f"  • Service: {config['target_message']}")
    print(f"  • Email campaigns: {'✅' if config['platforms']['email']['enabled'] else '❌'}")
    print(f"  • Posting every: {config['posting_schedule']['frequency_hours']} hours")
    print("\nNext steps:")
    print("1. Run: python senior_advertising_bot.py")
    print("2. Choose option 1 to test a single post")
    print("3. Choose option 2 to start scheduled posting")
    print("\n⚠️  Remember to respect platform terms of service and senior community guidelines!")

def create_sample_recipients():
    """Create a sample recipients file for testing"""
    sample_recipients = [
        "John Smith <john.smith@example.com>",
        "Mary Johnson <mary.johnson@example.com>",
        "Robert Brown <robert.brown@example.com>",
        "Patricia Davis <patricia.davis@example.com>",
        "senior.center@community.org"
    ]
    
    with open("sample_recipients.txt", "w") as f:
        for recipient in sample_recipients:
            f.write(recipient + "\n")
    
    print("Sample recipients file created: sample_recipients.txt")
    print("You can use this as a template for your actual recipients.")

if __name__ == "__main__":
    choice = input("Choose an option:\n1. Run bot setup\n2. Create sample recipients file\n3. Exit\nEnter choice (1-3): ")
    
    if choice == "1":
        setup_bot()
    elif choice == "2":
        create_sample_recipients()
    else:
        print("Goodbye!")