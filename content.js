(function() {
    // Prevent multiple panels from loading
    if (document.getElementById('sentinel-panel')) return;

    // 1. Create the floating UI Panel
    const panel = document.createElement('div');
    panel.id = 'sentinel-panel';
    panel.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2147483647; 
        background: #1a1a1a;
        padding: 15px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        border: 2px solid #10a37f;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 220px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    panel.innerHTML = `
        <div style="color: #10a37f; font-size: 14px; font-weight: bold; text-align: center; letter-spacing: 1px;">🛡️ PRIVACY MESH</div>
        <button id="pm-scan-btn" style="padding: 12px; background: #10a37f; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;">SCAN & SEND</button>
        <div id="pm-status" style="color: #888; font-size: 11px; text-align: center;">System Ready</div>
    `;

    document.body.appendChild(panel);

    const scanBtn = document.getElementById('pm-scan-btn');
    const status = document.getElementById('pm-status');

    // 2. The Logic Engine
    scanBtn.onclick = async () => {
        // Find the input field using a "Brute Force" approach for all AI bots
        const inputField = document.querySelector('#prompt-textarea') || 
                           document.querySelector('div[contenteditable="true"]') || 
                           document.querySelector('textarea') ||
                           document.querySelector('div[role="textbox"]');
        
        if (!inputField) {
            status.innerText = "❌ No Chatbox Detected";
            status.style.color = "#ef4444";
            return;
        }

        // Get text from either a textarea or a contenteditable div
        let originalText = "";
        if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
            originalText = inputField.value;
        } else {
            originalText = inputField.innerText;
        }
        
        if (!originalText || originalText.trim().length === 0) {
            status.innerText = "⚠️ Box is Empty!";
            status.style.color = "#fbbf24";
            return;
        }

        status.innerText = "⌛ Scrubbing Data...";
        status.style.color = "#fbbf24";

        try {
            // Talk to the local Python Sentinel
            const response = await fetch('http://127.0.0.1:8000/scrub', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: originalText })
            });
            
            if (!response.ok) throw new Error("Server Error");
            
            const data = await response.json();

            // Inject the redacted text back into the UI
            if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
                inputField.value = data.scrubbed_text;
            } else {
                inputField.innerText = data.scrubbed_text;
            }

            // Important: Trigger 'input' so the website's JS knows we changed the text
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            inputField.dispatchEvent(new Event('change', { bubbles: true }));

            // Automatically find and click the AI site's send button
            setTimeout(() => {
                const sendBtn = document.querySelector('button[data-testid*="send"], button[aria-label*="Send"], [class*="send"] button');
                if (sendBtn) {
                    sendBtn.click();
                    status.innerText = "✅ Securely Sent";
                    status.style.color = "#10a37f";
                } else {
                    status.innerText = "✅ Scrubbed! (Press Enter)";
                    status.style.color = "#10a37f";
                }
            }, 150);

        } catch (err) {
            status.innerText = "❌ Server Offline!";
            status.style.color = "#ef4444";
            console.error("Sentinel Squad Error:", err);
        }

        // Reset status after 3 seconds
        setTimeout(() => {
            status.innerText = "System Ready";
            status.style.color = "#888";
        }, 3000);
    };

    // Style the button on hover
    scanBtn.onmouseover = () => { scanBtn.style.background = "#1a7f64"; };
    scanBtn.onmouseout = () => { scanBtn.style.background = "#10a37f"; };

})();