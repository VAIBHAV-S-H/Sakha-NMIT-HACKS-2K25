from flask import Flask, render_template, request, jsonify
import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()  # Load Twilio credentials from .env

app = Flask(__name__)

# Twilio Credentials
TWILIO_ACCOUNT_SID = "ACd7d92cde826c1e7e9519a6c0811d4e53"
TWILIO_AUTH_TOKEN = "c457d017fd5921d89593385ddd452ec9"
TWILIO_PHONE_NUMBER = "+17155788944"
EMERGENCY_CONTACT = "+918431297102"
# Twilio Client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@app.route('/')
def index():
    return render_template("index.html")  # Ensure index.html is in 'templates/' folder

@app.route('/send-sos', methods=['POST'])
def send_sos():
    try:
        data = request.json
        latitude = data.get("latitude", "12.9719")  # Default lat
        longitude = data.get("longitude", "77.5937")  # Default long
        google_maps_link = f"https://www.google.com/maps?q={latitude},{longitude}"

        message_body = f"🚨 SOS Alert! I need help! My location: {google_maps_link}"

        # Send SOS SMS
        sms = client.messages.create(
            body=message_body,
            from_=TWILIO_PHONE_NUMBER,
            to=EMERGENCY_CONTACT
        )
        print(f"SMS Sent! SID: {sms.sid}")  # Debugging

        # Make an emergency call
        call = client.calls.create(
            twiml=f'<Response><Say>{message_body}</Say></Response>',
            from_=TWILIO_PHONE_NUMBER,
            to=EMERGENCY_CONTACT
        )
        print(f"Call Initiated! SID: {call.sid}")  # Debugging

        return jsonify({"status": "success", "message": "SOS alert sent successfully."}), 200

    except Exception as e:
        print(f"Twilio Error: {e}")  # Debugging
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
