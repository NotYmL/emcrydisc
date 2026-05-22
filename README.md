# VanyEnc

VanyEnc Quantum is a post-quantum cryptography integration for Discord DMs. It uses Ring-LWE key exchange and AES-256-GCM symmetric encryption to secure your direct messages. The project is split into a Chrome/Chromium browser extension and a Python loader that injects the script directly into the desktop Discord client via remote debugging.

The core JavaScript logic is contained in vany.js


<div id="header" align="center">
  <img src="images/general.png" width="240">
  <img src="images/key_mngmnt.png" width="240">
</div>

## Installing the Browser Extension

If you use Discord in a web browser like Chrome, Brave, or Edge, you can install the extension to run the script.

1. Open your browser and navigate to the extensions management page. In Google Chrome, go to `chrome://extensions/`. In Brave, go to `brave://extensions/`.
2. Enable the Developer mode toggle, which is usually located in the top-right corner of the page.
3. Click the Load unpacked button in the top-left corner.
4. In the file explorer window that opens, select the `vanyenc_extension` folder from this project directory.
5. Once selected, the extension will be loaded. It will automatically inject vany.js when you visit Discord.

## Running the Python Loader

If you use the Discord desktop app on Windows, you can use the Python loader to run the script. The loader automatically finds your Discord installation, kills any existing Discord processes, launches it with remote debugging enabled on port 9222, and injects vany.js.

### Installing Dependencies

```bash
pip install psutil websocket-client
```

### Launching the Loader

```bash
cd vanyenc_loader
python loader.py
```
