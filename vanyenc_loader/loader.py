import os
import sys
import time
import json
import urllib.request
import subprocess
import glob
import psutil
from websocket import create_connection

def find_discord_exe():
    """Find the latest Discord executable"""
    base = os.path.expandvars(r"%LocalAppData%\Discord")
    if not os.path.exists(base):
        print("Discord not found in %LocalAppData%. Is it installed?")
        sys.exit(1)
    
    # Find the newest app-* folder
    app_folders = glob.glob(os.path.join(base, "app-*"))
    if not app_folders:
        print("No Discord app folder found.")
        sys.exit(1)
    
    latest = max(app_folders, key=os.path.getmtime)
    exe = os.path.join(latest, "Discord.exe")
    
    if not os.path.exists(exe):
        print(f"Discord.exe not found at {exe}")
        sys.exit(1)
    
    print(f"Found Discord: {exe}")
    return exe

def kill_existing_discord():
    """Kill any existing Discord processes (optional, comment out if not wanted)"""
    for proc in psutil.process_iter(['name', 'pid']):
        try:
            if proc.info['name'] and 'discord' in proc.info['name'].lower():
                print(f"Killing existing Discord PID: {proc.info['pid']}")
                proc.kill()
        except:
            pass
    time.sleep(2)

def start_discord_with_debug(exe_path):
    port = 9222  # todo update ts
    cmd = [
        exe_path,
        f"--remote-debugging-port={port}",
        "--enable-logging",
        "--remote-allow-origins=*"
    ]
    
    print(f"Starting Discord with remote debugging on port {port}...")

    process = subprocess.Popen(
        cmd,
        cwd=os.path.dirname(exe_path),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    print(f"Discord started (PID: {process.pid})")
    return process, port

def wait_for_discord_ready(port, timeout=30):
    url = f"http://127.0.0.1:{port}/json/list"
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        try:
            with urllib.request.urlopen(url, timeout=5) as resp:
                targets = json.loads(resp.read().decode())
                if targets:
                    print("Discord DevTools protocol ready!")
                    return targets
        except:
            pass
        time.sleep(1)
    
    print("Timeout waiting for Discord to be ready.")
    return None

def inject_script(port, script_path):
    if not os.path.exists(script_path):
        print(f"Script not found: {script_path}")
        return False
    
    with open(script_path, "r", encoding="utf-8") as f:
        js_code = f.read()
    
    # Get list of targets
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list") as resp:
            targets = json.loads(resp.read().decode())
    except Exception as e:
        print("Failed to get targets:", e)
        return False
    
    for target in targets:
        if target.get("type") in ("page", "webContents") or "discord" in target.get("url", "").lower():
            ws_debug_url = target.get("webSocketDebuggerUrl")
            if not ws_debug_url:
                continue
                
            print(f"Injecting into target: {target.get('title')} ({target.get('url')})")
            
            try:
                ws = create_connection(ws_debug_url)

                ws.send(json.dumps({
                    "id": 1,
                    "method": "Runtime.enable"
                }))
                ws.recv()

                ws.send(json.dumps({
                    "id": 2,
                    "method": "Runtime.evaluate",
                    "params": {
                        "expression": f"(function(){{\n{js_code}\n}})()",
                        "includeCommandLineAPI": True
                    }
                }))

                result = json.loads(ws.recv())

                if "error" in result:
                    print(result["error"])
                else:
                    print("Injection succeeded")
            except Exception as e:
                print("Injection error:", e)
    
    return True

def main():
    try:
        kill_existing_discord()
    except Exception:
        ...
    
    exe = find_discord_exe()
    process, port = start_discord_with_debug(exe)
    
    targets = wait_for_discord_ready(port, timeout=15)
    if not targets:
        print("Discord didn't start properly.")
        return

    script_path = os.path.join(os.path.dirname(__file__), "vany.js")

    #todo: better wait for
    time.sleep(5)
    
    inject_script(port, script_path)

if __name__ == "__main__":
    main()