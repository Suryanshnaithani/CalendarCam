import os
import uuid
import requests
import shutil
import logging
from datetime import datetime, timedelta
from flask import Flask, redirect, url_for, session, request, render_template, jsonify
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import openai

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initiate Flask application
app = Flask(__name__)
app.secret_key = os.urandom(24)  # Secure secret key

# Configure OpenAI (optional, you can set this as an environment variable)
openai.api_key = "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"

# Disable insecure transport warning for OAuth
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# OAuth2 Credentials
CLIENT_SECRETS_FILE = "client_secret.json"
SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/photoslibrary.readonly'
]
REDIRECT_URI = 'http://localhost:5000/oauth2callback'

# Create OAuth2 flow
flow = Flow.from_client_secrets_file(
    CLIENT_SECRETS_FILE,
    scopes=SCOPES,
    redirect_uri=REDIRECT_URI
)

def parse_photo_date(photo):
    """
    Attempt to parse date from various photo metadata sources
    """
    try:
        # Try multiple methods to extract date
        date_sources = [
            # Method 1: mediaMetadata creationTime
            lambda p: p.get('mediaMetadata', {}).get('creationTime'),
            # Method 2: metadata creationTime
            lambda p: p.get('metadata', {}).get('creationTime'),
            # Method 3: Google Photos API date field
            lambda p: p.get('creationTime')
        ]

        for date_getter in date_sources:
            creation_time = date_getter(photo)
            if creation_time:
                try:
                    # Remove 'Z' and parse
                    parsed_date = datetime.fromisoformat(creation_time.replace('Z', ''))
                    return parsed_date.strftime('%Y-%m-%d')
                except Exception as e:
                    logger.warning(f"Date parsing error: {e}")
        
        return None
    except Exception as e:
        logger.error(f"Unexpected error parsing photo date: {e}")
        return None

def generate_event_summary(events):
    """Generate event summary using OpenAI"""
    if not events:
        return "No events found for this month."
    
    try:
        # Prepare event details
        event_details = []
        for event in events:
            summary = event.get('summary', 'Untitled Event')
            start = event.get('start', {})
            date = start.get('dateTime', start.get('date', 'Unknown Date'))
            event_details.append(f"Event: {summary} on {date}")
        
        events_text = "\n".join(event_details)
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Summarize these events concisely."},
                {"role": "user", "content": events_text}
            ],
            max_tokens=200
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        logger.error(f"OpenAI Summary Generation Error: {e}")
        return f"Unable to generate summary: {e}"
    
# Routes
@app.route('/')
def index():
    """Landing page"""
    return render_template('login.html')

@app.route('/auth')
def auth():
    """Initiate Google OAuth2 authentication"""
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        prompt='consent'
    )
    session['state'] = state
    return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
    """Handle OAuth2 callback"""
    try:
        # Fetch token using the full URL
        flow.fetch_token(authorization_response=request.url)
        
        # Get credentials
        credentials = flow.credentials
        
        # Store credentials in session
        session['credentials'] = {
            'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes
        }
        
        return redirect(url_for('calendar_events'))
    
    except Exception as e:
        logger.error(f"OAuth Callback Error: {e}")
        return f"Authentication failed: {e}", 401

@app.route('/calendar_events', methods=['GET', 'POST'])
def calendar_events():
    """Fetch and display calendar events and photos"""
    if 'credentials' not in session:
        return redirect(url_for('auth'))

    # Recreate credentials
    credentials = Credentials(**session['credentials'])
    
    # Build Google API services
    calendar_api = build('calendar', 'v3', credentials=credentials)
    photos_api = build('photoslibrary', 'v1', credentials=credentials, static_discovery=False)

    # Determine selected month
    if request.method == 'POST':
        selected_month = int(request.form.get('month', datetime.now().month))
    else:
        selected_month = datetime.now().month

    # Prepare time range
    now = datetime.now()
    start_time = datetime(now.year, selected_month, 1)
    end_time = start_time + timedelta(days=32)
    end_time = end_time.replace(day=1)

    # Convert times to ISO format
    start_time_iso = start_time.isoformat() + 'Z'
    end_time_iso = end_time.isoformat() + 'Z'

    # Fetch calendar events
    events_result = calendar_api.events().list(
        calendarId='primary',
        timeMin=start_time_iso,
        timeMax=end_time_iso,
        maxResults=50,
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    events = events_result.get('items', [])

    # Parse event dates
    for event in events:
        start = event.get('start', {})
        if start.get('dateTime'):
            try:
                event['parsed_date'] = datetime.fromisoformat(start['dateTime'].replace('Z', '')).strftime('%Y-%m-%d')
            except:
                event['parsed_date'] = None
        elif start.get('date'):
            try:
                event['parsed_date'] = datetime.fromisoformat(start['date']).strftime('%Y-%m-%d')
            except:
                event['parsed_date'] = None

    # Fetch photos
    photos_result = photos_api.mediaItems().search(body={
        'filters': {
            'dateFilter': {
                'ranges': [{
                    'startDate': {
                        'year': start_time.year,
                        'month': selected_month,
                        'day': 1
                    },
                    'endDate': {
                        'year': end_time.year,
                        'month': end_time.month,
                        'day': end_time.day
                    }
                }]
            }
        }
    }).execute()
    
    # Parse photo dates
    photos = photos_result.get('mediaItems', [])
    for photo in photos:
        photo['parsed_date'] = parse_photo_date(photo)

    # Generate event summary
    event_summary = generate_event_summary(events)

    # Prepare month selection
    MONTHS = ["January", "February", "March", "April", "May", "June", "July", 
              "August", "September", "October", "November", "December"]
    month_options = ''.join([
        f'<option value="{i+1}" {"selected" if i+1 == selected_month else ""}>{month}</option>' 
        for i, month in enumerate(MONTHS)
    ])

    # Debug logging
    logger.debug(f"Total Events: {len(events)}")
    logger.debug(f"Total Photos: {len(photos)}")
    
    for event in events:
        logger.debug(f"Event: {event.get('summary', 'No Summary')}, Date: {event.get('parsed_date', 'No Date')}")
    
    for photo in photos:
        logger.debug(f"Photo ID: {photo.get('id', 'No ID')}, Date: {photo.get('parsed_date', 'No Date')}")

    return render_template('index.html', 
        events=events, 
        photos=photos, 
        month_options=month_options,
        selected_month_name=MONTHS[selected_month - 1],
        event_summary=event_summary
    )

@app.route('/save_photos', methods=['POST'])
def save_photos():
    """Save selected photos"""
    data = request.get_json()
    tag_name = data.get('tagName', 'Untitled')
    photos = data.get('photos', [])

    save_directory = os.path.join(os.path.expanduser('~'), 'Documents', tag_name)
    os.makedirs(save_directory, exist_ok=True)

    try:
        for i, photo in enumerate(photos, 1):
            photo_url = photo.get('baseUrl')
            if photo_url:
                response = requests.get(photo_url, stream=True)
                if response.status_code == 200:
                    photo_path = os.path.join(save_directory, f"{i}.jpg")
                    with open(photo_path, 'wb') as file:
                        shutil.copyfileobj(response.raw, file)
        
        return jsonify({'message': f'Photos saved in {save_directory}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/logout')
def logout():
    """Clear session and logout"""
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)