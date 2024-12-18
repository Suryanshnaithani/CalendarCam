
<head>
    <title>Google Calendar & Photos Integration</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        h1 {
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 4px;
        }
        pre {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
        .container {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-top: 20px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .feature {
            background-color: #ecf0f1;
            border-radius: 8px;
            padding: 15px;
        }
        .button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 10px;
        }
        .button:hover {
            background-color: #2980b9;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Google Calendar & Photos Integration</h1>
        <p>
            This project integrates Google Calendar events with Google Photos, allowing users to easily tag and organize their photos based on calendar events.
        </p>
        <a href="#" class="button">View Demo</a>
        <a href="#" class="button">Report Bug</a>
        <a href="#" class="button">Request Feature</a>
        <h2>About The Project</h2>
        <p>
            This application provides a seamless integration between Google Calendar and Google Photos, enabling users to:
        </p>
        <div class="features">
            <div class="feature">
                <h3>Event Synchronization</h3>
                <p>Automatically fetch and display Google Calendar events.</p>
            </div>
            <div class="feature">
                <h3>Photo Integration</h3>
                <p>View and manage Google Photos associated with calendar events.</p>
            </div>
            <div class="feature">
                <h3>Auto-tagging</h3>
                <p>Automatically tag photos based on calendar events.</p>
            </div>
            <div class="feature">
                <h3>Monthly Summaries</h3>
                <p>Generate and regenerate monthly event summaries.</p>
            </div>
        </div>
        <h2>Built With</h2>
        <ul>
            <li>React</li>
            <li>TypeScript</li>
            <li>CSS</li>
            <li>Flask (Backend)</li>
        </ul>
        <h2>Getting Started</h2>
        <h3>Prerequisites</h3>
        <ul>
            <li>Node.js (v14 or later)</li>
            <li>npm</li>
            <li>Python (v3.7 or later)</li>
            <li>pip</li>
        </ul>
        <h3>Installation</h3>
        <ol>
            <li>Clone the repo
                <pre><code>git clone https://github.com/Suryanshnaithani/CalendarCam.git</code></pre>
            </li>
            <li>Install NPM packages
                <pre><code>npm install</code></pre>
            </li>
            <li>Install Python packages
                <pre><code>pip install -r requirements.txt</code></pre>
            </li>
            <li>Enter your API keys in <code>client_secret.json</code>
                <pre><code>const API_KEY = 'ENTER YOUR API';</code></pre>
            </li>
        </ol>
        <h2>Roadmap</h2>
        <ul>
            <li>Add support for multiple Google accounts</li>
            <li>Implement machine learning for improved auto-tagging</li>
            <li>Create mobile app versions (iOS and Android)</li>
            <li>Add support for other calendar and photo services</li>
        </ul>
        <h2>Contributing</h2>
        <p>
            Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
        </p>
        <ol>
            <li>Fork the Project</li>
            <li>Create your Feature Branch (<code>git checkout -b feature/AmazingFeature</code>)</li>
            <li>Commit your Changes (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
            <li>Push to the Branch (<code>git push origin feature/AmazingFeature</code>)</li>
            <li>Open a Pull Request</li>
        </ol>
    </div>
</body>
</html>

