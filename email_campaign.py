"""
Email module for Senior Advertising Bot
Handles email campaigns with senior-friendly formatting
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import logging
from typing import List, Optional

class SeniorEmailCampaign:
    def __init__(self, config: dict):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
    def create_senior_friendly_email(self, subject: str, message: str, recipient_name: str = "Friend") -> MIMEMultipart:
        """Create an email formatted for senior audiences"""
        
        # Create multipart message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.config['platforms']['email']['username']
        
        # Create HTML version with large, clear formatting
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c5aa0; font-size: 24px;">Hello {recipient_name}!</h2>
                
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    {message.replace('\n', '<br>')}
                </div>
                
                <div style="margin: 30px 0; padding: 15px; background-color: #e8f4f8; border-left: 4px solid #2c5aa0;">
                    <h3 style="margin-top: 0; color: #2c5aa0;">Easy Ways to Reach Us:</h3>
                    <p style="margin: 10px 0; font-size: 18px;">
                        <strong>📞 Phone:</strong> (555) 123-4567<br>
                        <strong>📧 Email:</strong> help@seniorservices.com
                    </p>
                    <p style="font-size: 14px; color: #666;">
                        We're here Monday-Friday, 9 AM to 5 PM
                    </p>
                </div>
                
                <div style="margin: 30px 0; font-size: 14px; color: #888; border-top: 1px solid #ddd; padding-top: 20px;">
                    <p>You received this email because you expressed interest in services for seniors.</p>
                    <p>If you'd prefer not to receive these emails, simply reply with "UNSUBSCRIBE"</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create plain text version
        text_content = f"""
Hello {recipient_name}!

{message}

EASY WAYS TO REACH US:
Phone: (555) 123-4567
Email: help@seniorservices.com

We're here Monday-Friday, 9 AM to 5 PM

---
You received this email because you expressed interest in services for seniors.
If you'd prefer not to receive these emails, simply reply with "UNSUBSCRIBE"
        """
        
        # Attach both versions
        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")
        
        msg.attach(part1)
        msg.attach(part2)
        
        return msg
    
    def send_email_campaign(self, recipients: List[str], subject: str, message: str) -> bool:
        """Send email campaign to list of recipients"""
        
        if not self.config['platforms']['email']['enabled']:
            self.logger.info("Email campaigns disabled in config")
            return False
            
        try:
            # Create secure connection
            context = ssl.create_default_context()
            server = smtplib.SMTP(
                self.config['platforms']['email']['smtp_server'],
                self.config['platforms']['email']['smtp_port']
            )
            server.starttls(context=context)
            server.login(
                self.config['platforms']['email']['username'],
                self.config['platforms']['email']['password']
            )
            
            success_count = 0
            
            for recipient in recipients:
                try:
                    # Extract name if email is in "Name <email@domain.com>" format
                    if "<" in recipient:
                        name = recipient.split("<")[0].strip()
                        email = recipient.split("<")[1].replace(">", "").strip()
                    else:
                        name = "Friend"
                        email = recipient
                    
                    msg = self.create_senior_friendly_email(subject, message, name)
                    msg["To"] = email
                    
                    server.send_message(msg)
                    success_count += 1
                    self.logger.info(f"Email sent successfully to {email}")
                    
                except Exception as e:
                    self.logger.error(f"Failed to send email to {recipient}: {e}")
            
            server.quit()
            self.logger.info(f"Email campaign completed: {success_count}/{len(recipients)} sent successfully")
            return success_count > 0
            
        except Exception as e:
            self.logger.error(f"Email campaign failed: {e}")
            return False
    
    def add_recipient(self, email: str, name: str = ""):
        """Add a new recipient to the mailing list"""
        recipients = self.config['platforms']['email']['recipients']
        
        if name:
            formatted_email = f"{name} <{email}>"
        else:
            formatted_email = email
            
        if formatted_email not in recipients:
            recipients.append(formatted_email)
            self.logger.info(f"Added new recipient: {formatted_email}")
            return True
        else:
            self.logger.info(f"Recipient already exists: {formatted_email}")
            return False