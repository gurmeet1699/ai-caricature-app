# Sikh Children Day 2026 - Caricature Studio 🍌

Welcome to the **Caricature Studio**, built for **Sikh Children Day 2026** by the **Sikh AI Club**. This application allows users to capture a photo via their webcam or upload an image file, choose an artistic style, and transform it into a unique caricature using the privacy-protected Google Gemini API (`gemini-3.1-flash-image-preview`).

## Features
* **Multi-Style AI Engine**: Choose between **3D Animation**, **Classic Pencil Sketch**, and **Superhero Comic** styles.
* **Privacy Guardrails**: Built-in instructions forcing the AI engine to handle images transiently without using data for model training.
* **Legal Consent Gatekeeper**: Explicit workflow requiring a parent/guardian signature (via email verification) for minors under 18.
* **Session Gallery**: A temporary, horizontal scrolling bar displaying all creations generated during the active browser session.
* **Tamper-Proof Delivery**: The application automatically locks the verified consent email address upon approval, sending the asset securely to that address only.

---

## Installation & Setup

Follow these steps to run the application locally on your laptop or tablet kiosk:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Clone and Install Dependencies
Extract the project folder or clone the repository, open your terminal inside the directory, and run:
```bash
npm install


## Configure Environment Variables

Create a file named .env in the root directory of the project. Add your secure keys to it:

GEMINI_API_KEY=your_google_ai_studio_api_key
EMAIL_USER=your_gmail_username@gmail.com
EMAIL_PASS=your_16_character_gmail_app_password
Note: For EMAIL_PASS, you must generate a 16-character App Password from your Google Account security settings. Do not use your regular account login password.

## Run the Application

Start your local Node.js backend server:
```bash
node server.js

The server will start running at http://localhost:3000. Open this address in any modern web browser to access the application.