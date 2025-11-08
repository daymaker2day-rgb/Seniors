"""
Senior-Focused Advertising Bot
A respectful automation tool for reaching senior communities
"""

import time
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json
import logging

class SeniorAdvertisingBot:
    def __init__(self, config_file: str = "config.json"):
        """Initialize the senior advertising bot"""
        self.config = self.load_config(config_file)
        self.setup_logging()
        self.senior_friendly_times = [
            (9, 11),   # Morning coffee time
            (13, 15),  # After lunch
            (18, 20),  # Early evening
        ]
        
    def load_config(self, config_file: str) -> Dict:
        """Load bot configuration"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Create default config
            default_config = {
                "business_name": "Your Business",
                "target_message": "Helping seniors with technology and services",
                "contact_info": "Contact us at: your-email@example.com",
                "platforms": {
                    "facebook": {"enabled": False, "group_ids": []},
                    "email": {"enabled": False, "smtp_server": "", "recipients": []},
                    "community_sites": {"enabled": False, "urls": []}
                },
                "posting_schedule": {
                    "frequency_hours": 24,
                    "max_posts_per_day": 3,
                    "respect_quiet_hours": True
                }
            }
            with open(config_file, 'w') as f:
                json.dump(default_config, f, indent=2)
            return default_config
    
    def setup_logging(self):
        """Setup logging for bot activities"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('senior_bot.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def is_senior_friendly_time(self) -> bool:
        """Check if current time is appropriate for senior outreach"""
        current_hour = datetime.now().hour
        
        # Avoid very early morning or late night
        if current_hour < 8 or current_hour > 21:
            return False
            
        # Prefer specific senior-friendly times
        for start, end in self.senior_friendly_times:
            if start <= current_hour <= end:
                return True
        return False
    
    def create_senior_friendly_message(self, template: str = None) -> str:
        """Create respectful, clear messaging for seniors"""
        if template:
            return template
            
        templates = [
            f"🌟 {self.config['business_name']} - {self.config['target_message']}\n\n"
            f"We understand the importance of clear communication and reliable service.\n"
            f"{self.config['contact_info']}\n\n"
            f"Feel free to call or email with any questions!",
            
            f"Hello! 👋 {self.config['business_name']} here.\n\n"
            f"{self.config['target_message']}\n\n"
            f"We believe in taking time to explain everything clearly.\n"
            f"{self.config['contact_info']}\n\n"
            f"Looking forward to helping you!",
            
            f"Good day! ☀️\n\n"
            f"{self.config['business_name']} specializes in {self.config['target_message']}\n\n"
            f"• Clear explanations\n• Patient service\n• Fair pricing\n\n"
            f"{self.config['contact_info']}"
        ]
        
        return random.choice(templates)
    
    def post_to_facebook_groups(self, message: str):
        """Post to Facebook groups (requires Facebook API setup)"""
        if not self.config['platforms']['facebook']['enabled']:
            self.logger.info("Facebook posting disabled in config")
            return
            
        # Note: This would require Facebook Graph API setup
        # For now, this is a placeholder showing the structure
        self.logger.info("Facebook posting would happen here")
        self.logger.info(f"Message: {message[:50]}...")
    
    def send_email_campaign(self, message: str):
        """Send email to senior mailing list"""
        if not self.config['platforms']['email']['enabled']:
            self.logger.info("Email campaigns disabled in config")
            return
            
        # Email implementation would go here
        self.logger.info("Email campaign would be sent here")
        self.logger.info(f"Message: {message[:50]}...")
    
    def post_to_community_sites(self, message: str):
        """Post to senior community websites/forums"""
        if not self.config['platforms']['community_sites']['enabled']:
            self.logger.info("Community site posting disabled in config")
            return
            
        # Community site posting implementation
        self.logger.info("Community site posting would happen here")
        self.logger.info(f"Message: {message[:50]}...")
    
    def run_advertising_cycle(self):
        """Run one complete advertising cycle"""
        self.logger.info("Starting advertising cycle...")
        
        if not self.is_senior_friendly_time():
            self.logger.info("Not an optimal time for senior outreach. Waiting...")
            return
        
        message = self.create_senior_friendly_message()
        self.logger.info(f"Generated message: {message}")
        
        # Post to enabled platforms
        self.post_to_facebook_groups(message)
        self.send_email_campaign(message)
        self.post_to_community_sites(message)
        
        self.logger.info("Advertising cycle completed")
    
    def start_scheduled_posting(self):
        """Start the scheduled posting loop"""
        self.logger.info("Starting scheduled posting...")
        
        while True:
            try:
                self.run_advertising_cycle()
                
                # Wait for next cycle
                wait_hours = self.config['posting_schedule']['frequency_hours']
                wait_minutes = random.randint(0, 30)  # Add some randomness
                
                total_wait = (wait_hours * 3600) + (wait_minutes * 60)
                self.logger.info(f"Waiting {wait_hours} hours {wait_minutes} minutes until next cycle...")
                
                time.sleep(total_wait)
                
            except KeyboardInterrupt:
                self.logger.info("Bot stopped by user")
                break
            except Exception as e:
                self.logger.error(f"Error in posting cycle: {e}")
                time.sleep(300)  # Wait 5 minutes before retrying

def main():
    """Main function to run the bot"""
    print("🤖 Senior Advertising Bot Starting...")
    print("This bot is designed to respectfully reach senior communities")
    print("=" * 50)
    
    bot = SeniorAdvertisingBot()
    
    # Show current configuration
    print("Current Configuration:")
    print(f"Business: {bot.config['business_name']}")
    print(f"Message: {bot.config['target_message']}")
    print(f"Posting every: {bot.config['posting_schedule']['frequency_hours']} hours")
    print("=" * 50)
    
    choice = input("Choose an option:\n1. Run one advertising cycle\n2. Start scheduled posting\n3. Exit\nEnter choice (1-3): ")
    
    if choice == "1":
        bot.run_advertising_cycle()
    elif choice == "2":
        bot.start_scheduled_posting()
    else:
        print("Goodbye!")

if __name__ == "__main__":
    main()