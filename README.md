# 🛡️ PrivacyMesh: A Zero-Trust AI Gateway

**PrivacyMesh** is a hardware-accelerated, local-first privacy layer that intercepts and sanitizes Personally Identifiable Information (PII) before it is transmitted to Public Cloud LLMs like ChatGPT, Claude, and Gemini.[cite: 1, 2, 3]

## 🌟 The Problem
Most AI security solutions are reactive—they monitor data as it passes through a cloud-side filter. The "Critical Gap" is that the data has already left the user's device before any protection is applied, creating a window of vulnerability.

## 🚀 Our Solution: The Sentinel Squad Approach
PrivacyMesh shifts the **Trust Boundary** to the local hardware. By intercepting data at the browser level and processing it on a local Python backend, we ensure that raw sensitive data never touches the network.[cite: 1, 3]

### Key Features:
*   **Universal DOM Interceptor:** A JavaScript content script designed to be platform-agnostic, working seamlessly across multiple AI chat interfaces.
*   **Context-Aware Scrubbing:** Employs heuristic priority shields to distinguish between sensitive entities and harmless context (e.g., protecting a name while keeping the word "Apple" intact).
*   **Zero-Trust Workflow:** Follows a "Never Trust, Always Verify" protocol, scrubbing all outgoing prompts by default.[cite: 1]
*   **Hardware Ready:** Optimized for local processing to minimize latency and keep the user experience fluid.[cite: 3]

## 📂 Project Structure
*   **`content.js`**: The browser-side engine that intercepts raw text and injects the redacted version back into the UI.[cite: 1]
*   **`manifest.json`**: Cross-platform configuration for the Chrome Extension.[cite: 2]
*   **`scrubber.py`**: The "Privacy Brain" powered by FastAPI and SpaCy for high-accuracy local redaction.[cite: 3]
*   **`test_brain.py`**: A utility script for validating Named Entity Recognition (NER) labels and logic.[cite: 4]

## 🛠️ Getting Started

### 1. Run the Local Backend
Navigate to the project directory and start the FastAPI server:
```bash
python scrubber.py
The server will run at http://127.0.0.1:8000.

2. Install the Browser Extension
       1.Open Chrome and go to chrome://extensions.
       2.Enable Developer Mode.
       3.Click Load unpacked and select your privacymesh_prototype folder.
3. Usage
       1.Open any supported AI (ChatGPT, Gemini, etc.).
       2.Use the SCAN & SEND panel to clean your prompt.
       3.The extension will automatically redact PII and send the secure version.
🛡️ Security Disclaimer
This is a prototype developed for Ideathon 26. It is designed to demonstrate local-first privacy interception and is not intended for production-level security without further hardening of the local API endpoints.
**Developed by the Sentinel Squad at SRMIST.**
