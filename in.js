window.onblur = () => {
    fetch("https://canary.discord.com/api/v9/users/@me/settings-proto/1", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US",
        "authorization": "ODkyNDgyNjQ0Mjc1NzY1Mjg5.GyXyYW.4xuurXyLI6jA6_FuCsJB6KLh3umDZiBiRKo244",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-debug-options": "bugReporterEnabled",
        "x-discord-locale": "en-US",
        "x-discord-timezone": "Europe/Warsaw",
        "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJjYW5hcnkiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC42MyIsIm9zX3ZlcnNpb24iOiIxMC4wLjE5MDQ1Iiwib3NfYXJjaCI6Ing2NCIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdPVzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBkaXNjb3JkLzEuMC42MyBDaHJvbWUvMTA4LjAuNTM1OS4yMTUgRWxlY3Ryb24vMjIuMy4yIFNhZmFyaS81MzcuMzYiLCJicm93c2VyX3ZlcnNpb24iOiIyMi4zLjIiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoyMDA5NjksIm5hdGl2ZV9idWlsZF9udW1iZXIiOjMzMDI1LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsLCJkZXNpZ25faWQiOjB9"
      },
      "referrer": "https://canary.discord.com/channels/@me",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"settings\":\"Wj0KCwoJaW52aXNpYmxlEiwKD2h0dHBzOi8veW1sLmxvbBEVANLaujz/ChoQc2VsZXhpdW1fTWFuVmliZRoA\"}",
      "method": "PATCH",
      "mode": "cors",
      "credentials": "include"
    });
}

window.onfocus = () => { 
    fetch("https://canary.discord.com/api/v9/users/@me/settings-proto/1", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US",
        "authorization": "ODkyNDgyNjQ0Mjc1NzY1Mjg5.GyXyYW.4xuurXyLI6jA6_FuCsJB6KLh3umDZiBiRKo244",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-debug-options": "bugReporterEnabled",
        "x-discord-locale": "en-US",
        "x-discord-timezone": "Europe/Warsaw",
        "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJjYW5hcnkiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC42MyIsIm9zX3ZlcnNpb24iOiIxMC4wLjE5MDQ1Iiwib3NfYXJjaCI6Ing2NCIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdPVzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBkaXNjb3JkLzEuMC42MyBDaHJvbWUvMTA4LjAuNTM1OS4yMTUgRWxlY3Ryb24vMjIuMy4yIFNhZmFyaS81MzcuMzYiLCJicm93c2VyX3ZlcnNpb24iOiIyMi4zLjIiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoyMDA5NjksIm5hdGl2ZV9idWlsZF9udW1iZXIiOjMzMDI1LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsLCJkZXNpZ25faWQiOjB9"
      },
      "referrer": "https://canary.discord.com/channels/@me",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"settings\":\"WjoKCAoGb25saW5lEiwKD2h0dHBzOi8veW1sLmxvbBEVANLaujz/ChoQc2VsZXhpdW1fTWFuVmliZRoA\"}",
      "method": "PATCH",
      "mode": "cors",
      "credentials": "include"
    });
}
