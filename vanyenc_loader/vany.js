let triggered = false;
async function ws(p) {
    if (triggered) return;
    triggered = true;
    let sacuvantop = "15%";
    let sacuvanleft = "35%";
    
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let header = document.getElementById(elmnt.id + "header");
        if (header) {
            header.addEventListener("mousedown", dragMouseDown);
        } else {
            elmnt.addEventListener("mousedown", dragMouseDown);
        }
      
        function dragMouseDown(e) {
            e = e || window.event;
            // Prevent dragging from input elements
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') {
                return;
            }
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener("mouseup", closeDragElement);
            document.addEventListener("mousemove", elementDrag);
        }
      
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            sacuvantop = (elmnt.offsetTop - pos2) + "px";
            sacuvanleft = (elmnt.offsetLeft - pos1) + "px";
        }
      
        function closeDragElement() {
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);
        }
    }

    let exits = false; // Toggle encryption activity
    let activeTab = "general"; // Settings active tab

    function showToast(message, type = "info") {
        let toast = document.createElement("div");
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10001;
            padding: 12px 24px;
            border-radius: 12px;
            font-family: 'Outfit', sans-serif;
            font-weight: 500;
            font-size: 14px;
            color: white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            transform: translateY(100px);
            opacity: 0;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
        `;
        
        if (type === "success") {
            toast.style.background = "linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))";
        } else if (type === "error") {
            toast.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))";
        } else {
            toast.style.background = "linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9))";
        }
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = "translateY(0)";
            toast.style.opacity = "1";
        }, 50);
        
        setTimeout(() => {
            toast.style.transform = "translateY(100px)";
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ----------------------------------------------------
    // POST-QUANTUM CRYPTOGRAPHY CORE (RING-LWE)
    // ----------------------------------------------------
    const N = 256;
    const Q = 12289;

    function generate_a(n, q) {
        let a = new Array(n);
        let seed = 123456789;
        function rand() {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            return seed;
        }
        for (let i = 0; i < n; i++) {
            a[i] = rand() % q;
        }
        return a;
    }

    const A = generate_a(N, Q);

    function poly_mul(poly1, poly2, n, q) {
        let result = new Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let index = i + j;
                let val = poly1[i] * poly2[j];
                if (index >= n) {
                    result[index - n] = (result[index - n] - val) % q;
                } else {
                    result[index] = (result[index] + val) % q;
                }
            }
        }
        for (let i = 0; i < n; i++) {
            result[i] = (result[i] % q + q) % q;
        }
        return result;
    }

    function poly_add(p1, p2) {
        let res = new Array(N);
        for (let i = 0; i < N; i++) {
            res[i] = (p1[i] + p2[i]) % Q;
        }
        return res;
    }

    function poly_sub(p1, p2) {
        let res = new Array(N);
        for (let i = 0; i < N; i++) {
            res[i] = (p1[i] - p2[i] + Q) % Q;
        }
        return res;
    }

    function sample_small(n) {
        let poly = new Array(n);
        for (let i = 0; i < n; i++) {
            let val = 0;
            for (let j = 0; j < 2; j++) {
                val += Math.floor(Math.random() * 3) - 1;
            }
            poly[i] = val;
        }
        return poly;
    }

    function encode_key_to_poly(keyBytes) {
        let m = new Array(N).fill(0);
        for (let i = 0; i < 32; i++) {
            let byte = keyBytes[i];
            for (let bit = 0; bit < 8; bit++) {
                let bitVal = (byte >> bit) & 1;
                m[i * 8 + bit] = bitVal ? 6144 : 0;
            }
        }
        return m;
    }

    function decode_poly_to_key(m) {
        let keyBytes = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            let byte = 0;
            for (let bit = 0; bit < 8; bit++) {
                let val = m[i * 8 + bit];
                let dist_zero = Math.min(val, Q - val);
                let dist_half = Math.abs(val - 6144);
                let bitVal = dist_half < dist_zero ? 1 : 0;
                byte |= (bitVal << bit);
            }
            keyBytes[i] = byte;
        }
        return keyBytes;
    }

    function generate_keypair() {
        let s = sample_small(N);
        let e = sample_small(N);
        let b = poly_add(poly_mul(A, s, N, Q), e);
        return { publicKey: b, privateKey: s };
    }

    function rlwe_encrypt(publicKeyB, keyBytes) {
        let r = sample_small(N);
        let e1 = sample_small(N);
        let e2 = sample_small(N);
        let m = encode_key_to_poly(keyBytes);
        
        let u = poly_add(poly_mul(A, r, N, Q), e1);
        let v = poly_add(poly_add(poly_mul(publicKeyB, r, N, Q), e2), m);
        return { u, v };
    }

    function rlwe_decrypt(privateKeyS, ciphertext) {
        let u = ciphertext.u;
        let v = ciphertext.v;
        let u_s = poly_mul(u, privateKeyS, N, Q);
        let dec = poly_sub(v, u_s);
        return decode_poly_to_key(dec);
    }

    // Serialization utilities
    function arrayBufferToBase64(buffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function base64ToArrayBuffer(base64) {
        let binary_string = atob(base64);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function pack14(poly) {
        let octets = new Uint8Array(448);
        let bitBucket = 0;
        let bitCount = 0;
        let octetIndex = 0;
        for (let i = 0; i < 256; i++) {
            let val = poly[i] & 0x3FFF; // 14 bits
            bitBucket |= (val << bitCount);
            bitCount += 14;
            while (bitCount >= 8) {
                octets[octetIndex++] = bitBucket & 0xFF;
                bitBucket >>>= 8;
                bitCount -= 8;
            }
        }
        return octets;
    }

    function unpack14(octets) {
        let poly = new Array(256);
        let bitBucket = 0;
        let bitCount = 0;
        let octetIndex = 0;
        for (let i = 0; i < 256; i++) {
            while (bitCount < 14) {
                bitBucket |= (octets[octetIndex++] << bitCount);
                bitCount += 8;
            }
            poly[i] = bitBucket & 0x3FFF;
            bitBucket >>>= 14;
            bitCount -= 14;
        }
        return poly;
    }

    function serialize_rlwe_ciphertext(u, v) {
        let uBytes = pack14(u);
        let vBytes = pack14(v);
        let combined = new Uint8Array(896);
        combined.set(uBytes, 0);
        combined.set(vBytes, 448);
        return arrayBufferToBase64(combined.buffer);
    }

    function deserialize_rlwe_ciphertext(base64) {
        let buf = base64ToArrayBuffer(base64);
        if (buf.byteLength === 1024) {
            let combined = new Uint16Array(buf);
            let u = Array.from(combined.subarray(0, 256));
            let v = Array.from(combined.subarray(256, 512));
            return { u, v };
        } else if (buf.byteLength === 896) {
            let combined = new Uint8Array(buf);
            let uBytes = combined.subarray(0, 448);
            let vBytes = combined.subarray(448, 896);
            let u = unpack14(uBytes);
            let v = unpack14(vBytes);
            return { u, v };
        }
        throw new Error("Invalid ciphertext length");
    }

    // Safe storage using IndexedDB to bypass Discord's aggressive localStorage purging
    const safeStorage = {
        cache: {},
        db: null,
        init: function() {
            return new Promise((resolve) => {
                try {
                    let request = indexedDB.open("VanyEncStorageDB_v2", 1);
                    request.onupgradeneeded = function(e) {
                        let db = e.target.result;
                        if (!db.objectStoreNames.contains("kv")) {
                            db.createObjectStore("kv");
                        }
                    };
                    request.onsuccess = (e) => {
                        this.db = e.target.result;
                        try {
                            let tx = this.db.transaction("kv", "readonly");
                            let store = tx.objectStore("kv");
                            let cursorReq = store.openCursor();
                            cursorReq.onsuccess = (ev) => {
                                let cursor = ev.target.result;
                                if (cursor) {
                                    this.cache[cursor.key] = cursor.value;
                                    cursor.continue();
                                } else {
                                    // Also migrate old localStorage data if present --- todo: remove
                                    try {
                                        if (typeof window !== "undefined" && window.localStorage) {
                                            ["vany_my_keypair", "vany_contacts_public_keys", "vany_trust_state"].forEach(k => {
                                                let val = window.localStorage.getItem(k);
                                                if (val && !this.cache[k]) this.setItem(k, val);
                                            });
                                        }
                                    } catch(err) {}
                                    resolve();
                                }
                            };
                            cursorReq.onerror = () => resolve();
                        } catch(err) { resolve(); }
                    };
                    request.onerror = () => resolve();
                } catch(e) {
                    resolve();
                }
            });
        },
        getItem: function(key) {
            return this.cache[key] || null;
        },
        setItem: function(key, value) {
            this.cache[key] = value;
            if (this.db) {
                try {
                    let tx = this.db.transaction("kv", "readwrite");
                    tx.objectStore("kv").put(value, key);
                } catch(e) {}
            }
        }
    };

    // Keypair storage logic
    function saveMyKeypair(keypair) {
        let keypairData = {
            publicKey: arrayBufferToBase64(new Uint16Array(keypair.publicKey).buffer),
            privateKey: arrayBufferToBase64(new Uint16Array(keypair.privateKey).buffer)
        };
        safeStorage.setItem("vany_my_keypair", JSON.stringify(keypairData));
    }

    function loadMyKeypair() {
        let data = safeStorage.getItem("vany_my_keypair");
        if (!data) return null;
        try {
            let keypairData = JSON.parse(data);
            let pubBuf = base64ToArrayBuffer(keypairData.publicKey);
            let privBuf = base64ToArrayBuffer(keypairData.privateKey);
            return {
                publicKey: Array.from(new Uint16Array(pubBuf)),
                privateKey: Array.from(new Uint16Array(privBuf))
            };
        } catch (e) {
            console.error("Error loading keypair:", e);
            return null;
        }
    }

    // Auto-generate keypair if not present
    await safeStorage.init();
    let myKeypair = loadMyKeypair();
    if (!myKeypair) {
        myKeypair = generate_keypair();
        saveMyKeypair(myKeypair);
    }

    // ----------------------------------------------------
    // AES-256-GCM SYMMETRIC CRYPTOGRAPHY
    // ----------------------------------------------------
    async function aesGcmEncrypt(plaintext, keyBytes) {
        let cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "AES-GCM" },
            false,
            ["encrypt"]
        );
        let iv = crypto.getRandomValues(new Uint8Array(12));
        let encodedText = new TextEncoder().encode(plaintext);
        let ciphertextBuffer = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            encodedText
        );
        
        let ciphertextBytes = new Uint8Array(ciphertextBuffer);
        let packageBytes = new Uint8Array(iv.length + ciphertextBytes.length);
        packageBytes.set(iv, 0);
        packageBytes.set(ciphertextBytes, iv.length);
        
        return arrayBufferToBase64(packageBytes.buffer);
    }

    async function aesGcmDecrypt(packageBase64, keyBytes) {
        let packageBytes = new Uint8Array(base64ToArrayBuffer(packageBase64));
        let iv = packageBytes.slice(0, 12);
        let ciphertextBytes = packageBytes.slice(12);
        
        let cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );
        
        let decryptedBuffer = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            ciphertextBytes
        );
        
        return new TextDecoder().decode(decryptedBuffer);
    }

    // ----------------------------------------------------
    // WIP, api for key mngr fallback sys
    // ----------------------------------------------------
    async function getPublicKeyFromId(userId) {
    //     // query the api (will be built later;;; mby lol)
    //     try {
    //         let res = await fetch(`https://api.vanyenc.com/keys/${userId}`); // non ex domain
    //         if (res.ok) {
    //             let data = await res.json();
    //             let pubBuf = base64ToArrayBuffer(data.publicKey);
    //             return Array.from(new Uint16Array(pubBuf));
    //         }
    //     } catch (e) {
    //         console.warn(`Could not fetch public key for user ${userId} from API:`, e);
    //     }
        
    //     // Fallback to local storage
    //     let storedKeys = JSON.parse(safeStorage.getItem("vany_contacts_public_keys") || "{}");
    //     let base64Key = storedKeys[userId];
    //     if (base64Key) {
    //         try {
    //             let pubBuf = base64ToArrayBuffer(base64Key);
    //             return Array.from(new Uint16Array(pubBuf));
    //         } catch(e) {
    //             console.error("Failed parsing fallback public key", e);
    //         }
    //     }
        return null;
    }

    // ----------------------------------------------------
    // COMMITMENT SCHEME & SAS (EMOJI) VERIFICATION
    // ----------------------------------------------------
    const SAS_EMOJIS = [
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
        "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞",
        "🐜", "🦟", "🦗", "🕷", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡",
        "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪"
    ];

    async function computeSAS(pubKeyABase64, pubKeyBBase64) {
        let sortedKeys = [pubKeyABase64, pubKeyBBase64].sort();
        let combined = sortedKeys[0] + "|" + sortedKeys[1];
        let hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(combined));
        let hashBytes = new Uint8Array(hashBuffer);
        let emojis = "";
        for(let i=0; i<5; i++) {
            emojis += SAS_EMOJIS[hashBytes[i] % 64] + " ";
        }
        return emojis.trim();
    }

    async function generateCommitment(pubKeyBase64) {
        let salt = new Uint8Array(16);
        crypto.getRandomValues(salt);
        let saltBase64 = arrayBufferToBase64(salt.buffer);
        let combined = pubKeyBase64 + "|" + saltBase64;
        let hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(combined));
        let hashBase64 = arrayBufferToBase64(hashBuffer);
        return { hash: hashBase64, salt: saltBase64 };
    }

    let kexState = {}; // channelId -> { state, myCommitHash, mySalt, theirCommitHash, theirPubKey, theirSalt }
    
    async function sendDiscordMessage(channelId, content) {
        let res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
            method: "POST",
            headers: { // todo: add more headers and nounce support for msgs
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: content,
                nonce: Date.now().toString()
            })
        });
        return res.ok;
    }

    window.vany_start_kex = async function() {
        let channelId = window.location.pathname.split("/").pop();
        let check = isDMChannelSync(channelId, token);
        if (!check.isDM) {
            showToast("Key Exchange can only be initiated in DMs", "error");
            return;
        }

        let myPubBase64 = arrayBufferToBase64(new Uint16Array(myKeypair.publicKey).buffer);
        let commit = await generateCommitment(myPubBase64);
        let sessionId = Math.floor(Math.random() * 999999999).toString();
        
        kexState[channelId] = {
            sessionId: sessionId,
            state: "WAITING_ACK",
            myCommitHash: commit.hash,
            mySalt: commit.salt
        };
        showToast("Key Exchange Initiated. Waiting for partner...", "info");
        await sendDiscordMessage(channelId, `vanypq:kex:req:${sessionId}:${commit.hash}`);
    };

    let processedKex = new Set();
    let alertedNonces = new Set();
    
    async function handleKexMessage(msgData) {
        if (processedKex.has(msgData.id)) return;
        processedKex.add(msgData.id);

        let channelId = msgData.channel_id;
        let authorId = msgData.author.id;
        
        let base64Id = token.split('.')[0];
        base64Id = base64Id.replace(/-/g, '+').replace(/_/g, '/');
        while (base64Id.length % 4) base64Id += '=';
        
        let myUserId = null;
        try {
            myUserId = atob(base64Id);
        } catch(e) {}
        
        if (myUserId && authorId === myUserId) return; // fuk ts

        let content = msgData.content;
        let parts = content.split(":");
        if (parts.length < 4) return;
        
        let type = parts[2];
        let sessionId = parts[3];
        
        let currentState = kexState[channelId] || { state: "IDLE" };
        let myPubBase64 = arrayBufferToBase64(new Uint16Array(myKeypair.publicKey).buffer);
        
        if (type === "req") {
            if (parts.length < 5) return;
            let theirHash = parts[4];
            
            if (currentState.state !== "IDLE") {
                if (currentState.sessionId === sessionId) return;
                if (parseInt(sessionId) < parseInt(currentState.sessionId)) return; // Tie breaker
            }
            
            let commit = await generateCommitment(myPubBase64);
            kexState[channelId] = {
                sessionId: sessionId,
                state: "WAITING_FIN",
                theirCommitHash: theirHash,
                myCommitHash: commit.hash,
                mySalt: commit.salt
            };
            await sendDiscordMessage(channelId, `vanypq:kex:ack:${sessionId}:${commit.hash}:${myPubBase64}:${commit.salt}`);
            
        } else if (type === "ack") {
            if (parts.length < 7) return;
            if (currentState.state !== "WAITING_ACK" || currentState.sessionId !== sessionId) return;
            
            let theirHash = parts[4];
            let theirPub = parts[5];
            let theirSalt = parts[6];
            
            let combined = theirPub + "|" + theirSalt;
            let hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(combined));
            let hashBase64 = arrayBufferToBase64(hashBuffer);
            
            if (hashBase64 !== theirHash) {
                showToast("MitM ALERT! Key Exchange Verification Failed!", "error");
                kexState[channelId] = { state: "IDLE" };
                return;
            }
            
            let storedKeys = JSON.parse(safeStorage.getItem("vany_contacts_public_keys") || "{}");
            storedKeys[authorId] = theirPub;
            safeStorage.setItem("vany_contacts_public_keys", JSON.stringify(storedKeys));
            
            let trustStore = JSON.parse(safeStorage.getItem("vany_trust_state") || "{}");
            trustStore[authorId] = "unverified";
            safeStorage.setItem("vany_trust_state", JSON.stringify(trustStore));
            
            showToast("Exchange Secure! Verify emojis in Key Management tab.", "success");
            kexState[channelId] = { state: "IDLE" };
            if (document.getElementById("vany-settings-menu")) kastommeni();
            
            await sendDiscordMessage(channelId, `vanypq:kex:fin:${sessionId}:${myPubBase64}:${currentState.mySalt}`);
            
        } else if (type === "fin") {
            if (parts.length < 6) return;
            if (currentState.state !== "WAITING_FIN" || currentState.sessionId !== sessionId) return;
            
            let theirPub = parts[4];
            let theirSalt = parts[5];
            
            let combined = theirPub + "|" + theirSalt;
            let hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(combined));
            let hashBase64 = arrayBufferToBase64(hashBuffer);
            
            if (hashBase64 !== currentState.theirCommitHash) {
                showToast("MitM ALERT! Key Exchange Verification Failed!", "error");
                kexState[channelId] = { state: "IDLE" };
                return;
            }
            
            let storedKeys = JSON.parse(safeStorage.getItem("vany_contacts_public_keys") || "{}");
            storedKeys[authorId] = theirPub;
            safeStorage.setItem("vany_contacts_public_keys", JSON.stringify(storedKeys));
            
            let trustStore = JSON.parse(safeStorage.getItem("vany_trust_state") || "{}");
            trustStore[authorId] = "unverified";
            safeStorage.setItem("vany_trust_state", JSON.stringify(trustStore));
            
            showToast("Exchange Secure! Verify emojis in Key Management tab.", "success");
            kexState[channelId] = { state: "IDLE" };
            if (document.getElementById("vany-settings-menu")) kastommeni();
        }
    }

    // ----------------------------------------------------
    // DM CHANNEL DETECTION
    // ----------------------------------------------------
    let channelCache = {};
    function isDMChannelSync(channelId, token) {
        if (channelCache[channelId] !== undefined) {
            return channelCache[channelId];
        }
        try {
            let xhr = new XMLHttpRequest();
            // Fetch channel object synchronously
            xhr.open("GET", `https://discord.com/api/v9/channels/${channelId}`, false);
            xhr.setRequestHeader("Authorization", token);
            xhr.send(null);
            if (xhr.status === 200) {
                let channelInfo = JSON.parse(xhr.responseText);
                // type 1 is DM: https://docs.discord.com/developers/resources/channel#channel-object-channel-types
                let isDM = channelInfo.type === 1;
                let recipientId = isDM && channelInfo.recipients && channelInfo.recipients[0] ? channelInfo.recipients[0].id : null;
                channelCache[channelId] = { isDM, recipientId };
                return channelCache[channelId];
            }
        } catch (e) {
            console.error("Error checking channel type synchronously:", e);
        }
        return { isDM: false, recipientId: null };
    }

    // ----------------------------------------------------
    // CHAT HYBRID ENCRYPTION & DECRYPTION ROUTINES
    // ----------------------------------------------------
    async function encryptPQCMessage(plaintext, recipientPublicKey) {
        let aesKeyBytes = crypto.getRandomValues(new Uint8Array(32));
        let aesGcmBase64 = await aesGcmEncrypt(plaintext, aesKeyBytes);
        
        // encapsulate symmetric key using Ring-LWE for the recipient
        let cipherRecip = rlwe_encrypt(recipientPublicKey, aesKeyBytes);
        let recipRLWEBase64 = serialize_rlwe_ciphertext(cipherRecip.u, cipherRecip.v);
        
        // save plaintext locally in safeStorage so we can view our sent history without sending a self-RLWE packet over the network
        // this saves about 1k chars per msg and is abs necessary for non nitro users
        safeStorage.setItem("sent_" + aesGcmBase64, plaintext);
        
        return `vanypq:${recipRLWEBase64}:${aesGcmBase64}`;
    }

    async function decryptPQCMessage(packet, privateKeyS) {
        if (!packet.startsWith("vanypq:")) return packet;
        
        let parts = packet.split(":");
        if (parts.length < 3) return "[Error: Invalid encrypted packet format]";
        
        if (parts.length === 4) {
            let recipRLWE = parts[1];
            let selfRLWE = parts[2];
            let aesGcm = parts[3];
            
            try {
                let cipher = deserialize_rlwe_ciphertext(recipRLWE);
                let aesKeyBytes = rlwe_decrypt(privateKeyS, cipher);
                return await aesGcmDecrypt(aesGcm, aesKeyBytes);
            } catch (e) {}
            
            try {
                let cipher = deserialize_rlwe_ciphertext(selfRLWE);
                let aesKeyBytes = rlwe_decrypt(privateKeyS, cipher);
                return await aesGcmDecrypt(aesGcm, aesKeyBytes);
            } catch (e) {}
        } else {
            let recipRLWE = parts[1];
            let aesGcm = parts[2];
            
            // first check local for plaintext
            let localPlain = safeStorage.getItem("sent_" + aesGcm);
            if (localPlain) {
                return localPlain;
            }
            
            // otherwise, decrypt as the recipient
            try {
                let cipher = deserialize_rlwe_ciphertext(recipRLWE);
                let aesKeyBytes = rlwe_decrypt(privateKeyS, cipher);
                return await aesGcmDecrypt(aesGcm, aesKeyBytes);
            } catch (e) {}
        }
        
        return "[Decryption Failed: Key mismatch or corrupted data]";
    }

    // ----------------------------------------------------
    // UI & shiii
    // ----------------------------------------------------
    async function kastommeni() {
        // Remove existing menu if present
        let existing = document.getElementById("vany-settings-menu");
        if (existing) existing.remove();

        let menu = document.createElement("div");
        menu.id = "vany-settings-menu";
        document.body.appendChild(menu);
        
        // Ultimate Premium Glassmorphism styling
        menu.style.cssText = `
            position: fixed;
            width: 420px;
            height: 520px;
            z-index: 10000;
            padding: 24px;
            background: rgba(22, 23, 30, 0.82);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
            font-family: 'Outfit', sans-serif;
            color: #f3f4f6;
            display: flex;
            flex-direction: column;
            user-select: none;
            transition: opacity 0.2s ease, width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        menu.style.top = sacuvantop;
        menu.style.left = sacuvanleft;

        dragElement(menu);

        // Header Title Bar
        let header = document.createElement("div");
        header.id = "vany-settings-menuheader";
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            cursor: move;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        `;
        
        let title = document.createElement("span");
        title.innerHTML = `VanyEnc <span style="background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;">Quantum</span>`;
        title.style.cssText = "font-size: 20px; font-weight: 600; letter-spacing: 0.5px;";
        header.appendChild(title);

        let closeBtn = document.createElement("button");
        closeBtn.innerHTML = "&times;";
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #9ca3af;
            font-size: 24px;
            cursor: pointer;
            transition: color 0.2s ease, transform 0.2s ease;
            line-height: 1;
        `;
        closeBtn.onmouseenter = () => { closeBtn.style.color = "#ff4d4d"; closeBtn.style.transform = "scale(1.15)"; };
        closeBtn.onmouseleave = () => { closeBtn.style.color = "#9ca3af"; closeBtn.style.transform = "scale(1)"; };
        closeBtn.onclick = () => menu.remove();
        header.appendChild(closeBtn);
        menu.appendChild(header);

        // Navigation Tabs
        let tabs = document.createElement("div");
        tabs.style.cssText = `
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            background: rgba(255, 255, 255, 0.04);
            padding: 4px;
            border-radius: 10px;
        `;
        
        let genTab = document.createElement("button");
        let keyTab = document.createElement("button");
        
        const setTabStyle = (btn, active) => {
            btn.style.cssText = `
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 8px;
                font-family: 'Outfit', sans-serif;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                background: ${active ? "rgba(255, 255, 255, 0.1)" : "transparent"};
                color: ${active ? "#ffffff" : "#9ca3af"};
                box-shadow: ${active ? "0 2px 8px rgba(0,0,0,0.15)" : "none"};
            `;
        };
        
        genTab.textContent = "General Settings";
        keyTab.textContent = "Key Management";
        
        tabs.appendChild(genTab);
        tabs.appendChild(keyTab);
        menu.appendChild(tabs);

        // Body content container
        let content = document.createElement("div");
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            padding-right: 4px;
        `;
        menu.appendChild(content);

        // Custom Scrollbar styling
        let styleSheet = document.createElement("style");
        styleSheet.innerText = `
            #vany-settings-menu div::-webkit-scrollbar {
                width: 6px;
            }
            #vany-settings-menu div::-webkit-scrollbar-track {
                background: transparent;
            }
            #vany-settings-menu div::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 10px;
            }
            #vany-settings-menu div::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        `;
        document.head.appendChild(styleSheet);

        // Render functions for tabs
        function renderGeneralTab() {
            content.innerHTML = "";
            
            // Encryption Active Switch
            let switchContainer = document.createElement("div");
            switchContainer.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 12px;";
            
            let switchLabel = document.createElement("div");
            switchLabel.innerHTML = `<div style="font-weight: 600; font-size: 15px;">Secure Encryption</div>
                                     <div style="font-size: 12px; color: #9ca3af;">Encrypt outbound direct messages</div>`;
            switchContainer.appendChild(switchLabel);
            
            let toggle = document.createElement("button");
            const updateToggleState = () => {
                toggle.style.cssText = `
                    width: 52px;
                    height: 28px;
                    border-radius: 15px;
                    border: none;
                    cursor: pointer;
                    position: relative;
                    transition: background 0.3s ease;
                    background: ${exits ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.15)"};
                `;
                toggle.innerHTML = `<div style="
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 4px;
                    left: ${exits ? "28px" : "4px"};
                    transition: left 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                "></div>`;
            };
            
            toggle.onclick = () => {
                exits = !exits;
                updateToggleState();
                let mainBtn = document.getElementById("vany-main-toggle-btn");
                if (mainBtn) mainBtn.style.background = exits ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255, 255, 255, 0.15)";
                showToast(`PQC Encryption ${exits ? "Enabled" : "Disabled"}`, exits ? "success" : "info");
            };
            
            updateToggleState();
            switchContainer.appendChild(toggle);
            content.appendChild(switchContainer);

            // Information details
            let infoBox = document.createElement("div");
            infoBox.style.cssText = `
                padding: 16px;
                background: rgba(99, 102, 241, 0.08);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 14px;
                font-size: 13px;
                line-height: 1.6;
                color: #c7d2fe;
            `;
            infoBox.innerHTML = `
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    PQC Active in DMs
                </div>
                Your communications are secured with a hybrid combination of <strong>Ring-LWE</strong> (lattice-based, quantum-resistant) for public key exchange and <strong>AES-256-GCM</strong> for symmetric encryption.
                <br><br>
                Encryption only executes in 1-on-1 Direct Messages. In servers and groups, messages are sent completely unencrypted.
            `;
            content.appendChild(infoBox);

            // Start Key Exchange Button
            let kexBtn = document.createElement("button");
            kexBtn.textContent = "Start Secure Key Exchange (Active DM)";
            kexBtn.style.cssText = `
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                border: none;
                border-radius: 12px;
                color: white;
                padding: 12px;
                font-family: 'Outfit', sans-serif;
                font-weight: 600;
                cursor: pointer;
                margin-top: 16px;
                transition: transform 0.2s, box-shadow 0.2s;
                width: 100%;
                font-size: 14px;
            `;
            kexBtn.onmouseenter = () => kexBtn.style.transform = "scale(1.02)";
            kexBtn.onmouseleave = () => kexBtn.style.transform = "scale(1)";
            kexBtn.onclick = async () => {
                await window.vany_start_kex();
            };
            content.appendChild(kexBtn);
        }

        async function renderKeyTab() {
            content.innerHTML = "";

            // User's own public key
            let ownKeyLabel = document.createElement("label");
            ownKeyLabel.textContent = "Your Public Key (Share this with friends)";
            ownKeyLabel.style.cssText = "font-size: 12px; color: #9ca3af; font-weight: 600; margin-bottom: 6px; display: block;";
            content.appendChild(ownKeyLabel);

            let keyContainer = document.createElement("div");
            keyContainer.style.cssText = "display: flex; gap: 8px; margin-bottom: 18px;";

            let ownKeyBase64 = arrayBufferToBase64(new Uint16Array(myKeypair.publicKey).buffer);
            
            let ownKeyVal = document.createElement("input");
            ownKeyVal.value = ownKeyBase64;
            ownKeyVal.readOnly = true;
            ownKeyVal.style.cssText = `
                flex: 1;
                background: rgba(0,0,0,0.25);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 10px;
                color: #e5e7eb;
                padding: 10px;
                font-family: monospace;
                font-size: 11px;
                outline: none;
            `;
            ownKeyVal.onclick = () => ownKeyVal.select();
            keyContainer.appendChild(ownKeyVal);

            let copyBtn = document.createElement("button");
            copyBtn.textContent = "Copy";
            copyBtn.style.cssText = `
                background: linear-gradient(135deg, #6366f1, #a855f7);
                border: none;
                border-radius: 10px;
                color: white;
                padding: 0 16px;
                font-family: 'Outfit', sans-serif;
                font-weight: 500;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            `;
            copyBtn.onmouseenter = () => copyBtn.style.transform = "scale(1.03)";
            copyBtn.onmouseleave = () => copyBtn.style.transform = "scale(1)";
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(ownKeyBase64);
                showToast("Public key copied to clipboard!", "success");
            };
            keyContainer.appendChild(copyBtn);
            content.appendChild(keyContainer);

            // Generate new Keypair
            let regenBtn = document.createElement("button");
            regenBtn.textContent = "Generate New PQC Keypair";
            regenBtn.style.cssText = `
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                color: white;
                padding: 10px;
                font-family: 'Outfit', sans-serif;
                font-weight: 500;
                cursor: pointer;
                margin-bottom: 24px;
                transition: background 0.2s, color 0.2s;
            `;
            regenBtn.onmouseenter = () => { regenBtn.style.background = "#ff4d4d"; regenBtn.style.color = "white"; };
            regenBtn.onmouseleave = () => { regenBtn.style.background = "rgba(255,255,255,0.05)"; regenBtn.style.color = "white"; };
            regenBtn.onclick = () => {
                if (confirm("Are you sure you want to generate a new key pair? Your friends won't be able to decrypt your future messages until they add your new public key!")) {
                    myKeypair = generate_keypair();
                    saveMyKeypair(myKeypair);
                    ownKeyBase64 = arrayBufferToBase64(new Uint16Array(myKeypair.publicKey).buffer);
                    ownKeyVal.value = ownKeyBase64;
                    showToast("New PQC keypair generated!", "success");
                }
            };
            content.appendChild(regenBtn);

            // Saved Contacts section
            let contactLabel = document.createElement("label");
            contactLabel.textContent = "Manage Friends' Public Keys";
            contactLabel.style.cssText = "font-size: 13px; font-weight: 600; margin-bottom: 10px; display: block; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;";
            content.appendChild(contactLabel);

            // Add new contact form
            let addForm = document.createElement("div");
            addForm.style.cssText = "display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04);";
            
            let fId = document.createElement("input");
            fId.placeholder = "Friend's Discord User ID";
            fId.style.cssText = "background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; color: white; padding: 8px; font-size: 13px; outline: none;";
            
            let fKey = document.createElement("input");
            fKey.placeholder = "Paste Friend's PQC Public Key";
            fKey.style.cssText = "background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; color: white; padding: 8px; font-size: 13px; outline: none;";
            
            let fSubmit = document.createElement("button");
            fSubmit.textContent = "Add Contact Key";
            fSubmit.style.cssText = `
                background: linear-gradient(135deg, #10b981, #059669);
                border: none;
                border-radius: 8px;
                color: white;
                padding: 8px;
                font-family: 'Outfit', sans-serif;
                font-weight: 600;
                cursor: pointer;
            `;
            fSubmit.onclick = () => {
                let idVal = fId.value.trim();
                let keyVal = fKey.value.trim();
                if (!idVal || !keyVal) {
                    showToast("Please fill in both fields!", "error");
                    return;
                }
                let storedKeys = JSON.parse(safeStorage.getItem("vany_contacts_public_keys") || "{}");
                storedKeys[idVal] = keyVal;
                safeStorage.setItem("vany_contacts_public_keys", JSON.stringify(storedKeys));
                fId.value = "";
                fKey.value = "";
                showToast("Contact key saved successfully!", "success");
                renderKeyTab(); // Re-render to update the list
            };
            
            addForm.appendChild(fId);
            addForm.appendChild(fKey);
            addForm.appendChild(fSubmit);
            content.appendChild(addForm);

            // Contacts List
            let listContainer = document.createElement("div");
            listContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px; padding-bottom: 12px;";
            
            let storedKeys = JSON.parse(safeStorage.getItem("vany_contacts_public_keys") || "{}");
            let trustStore = JSON.parse(safeStorage.getItem("vany_trust_state") || "{}");
            let entries = Object.entries(storedKeys);
            
            if (entries.length === 0) {
                let empty = document.createElement("div");
                empty.textContent = "No friends' keys added yet.";
                empty.style.cssText = "font-size: 12px; color: #6b7280; text-align: center; padding: 12px;";
                listContainer.appendChild(empty);
            } else {
                for (let [cid, ckey] of entries) {
                    let trustState = trustStore[cid] || "unverified";
                    let sasEmojis = await computeSAS(ownKeyBase64, ckey);
                    
                    let contactRow = document.createElement("div");
                    contactRow.style.cssText = "display: flex; flex-direction: column; gap: 6px; padding: 10px; background: rgba(0,0,0,0.15); border-radius: 8px; font-size: 12px;";
                    
                    let topRow = document.createElement("div");
                    topRow.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
                    
                    let contactInfo = document.createElement("span");
                    contactInfo.innerHTML = `ID: <span style="font-family: monospace;">${cid}</span>`;
                    if (trustState === "verified") {
                        contactInfo.innerHTML += ` <span style="color: #10b981; font-size: 14px; cursor: help;" title="Verified">🛡️</span>`;
                    } else {
                        contactInfo.innerHTML += ` <span style="color: #fbbf24; font-size: 14px; cursor: help;" title="Unverified">⚠️</span>`;
                    }
                    
                    let delBtn = document.createElement("button");
                    delBtn.innerHTML = "🗑️";
                    delBtn.style.cssText = "background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px;";
                    delBtn.onclick = () => {
                        if (confirm(`Remove public key for user ID ${cid}?`)) {
                            let stored = JSON.parse(safeStorage.getItem("vany_contacts_public_keys") || "{}");
                            delete stored[cid];
                            safeStorage.setItem("vany_contacts_public_keys", JSON.stringify(stored));
                            showToast("Contact deleted.", "info");
                            renderKeyTab();
                        }
                    };
                    
                    topRow.appendChild(contactInfo);
                    topRow.appendChild(delBtn);
                    contactRow.appendChild(topRow);
                    
                    let sasRow = document.createElement("div");
                    sasRow.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 6px 8px; border-radius: 6px;";
                    sasRow.innerHTML = `<span style="font-size: 16px; letter-spacing: 2px;">${sasEmojis}</span>`;
                    
                    let verifyBtn = document.createElement("button");
                    verifyBtn.textContent = trustState === "verified" ? "Revoke" : "Verify";
                    verifyBtn.style.cssText = `
                        background: ${trustState === "verified" ? "rgba(239, 68, 68, 0.2)" : "linear-gradient(135deg, #10b981, #059669)"};
                        border: ${trustState === "verified" ? "1px solid rgba(239, 68, 68, 0.5)" : "none"};
                        border-radius: 6px;
                        color: white;
                        padding: 4px 10px;
                        font-family: 'Outfit', sans-serif;
                        font-size: 11px;
                        cursor: pointer;
                    `;
                    verifyBtn.onclick = () => {
                        let tStore = JSON.parse(safeStorage.getItem("vany_trust_state") || "{}");
                        tStore[cid] = trustState === "verified" ? "unverified" : "verified";
                        safeStorage.setItem("vany_trust_state", JSON.stringify(tStore));
                        renderKeyTab();
                    };
                    
                    sasRow.appendChild(verifyBtn);
                    contactRow.appendChild(sasRow);
                    listContainer.appendChild(contactRow);
                }
            }
            content.appendChild(listContainer);
        }

        // Initialize Tab Click Handlers
        genTab.onclick = () => {
            activeTab = "general";
            setTabStyle(genTab, true);
            setTabStyle(keyTab, false);
            menu.style.width = "420px";
            menu.style.height = "520px";
            renderGeneralTab();
        };

        keyTab.onclick = async () => {
            activeTab = "key";
            setTabStyle(genTab, false);
            setTabStyle(keyTab, true);
            menu.style.width = "500px";
            menu.style.height = "650px";
            await renderKeyTab();
        };

        // Render active tab initially
        if (activeTab === "general") {
            setTabStyle(genTab, true);
            setTabStyle(keyTab, false);
            menu.style.width = "420px";
            menu.style.height = "520px";
            renderGeneralTab();
        } else {
            setTabStyle(genTab, false);
            setTabStyle(keyTab, true);
            menu.style.width = "500px";
            menu.style.height = "650px";
            renderKeyTab();
        }
    }

    // ----------------------------------------------------
    // inject btn into chat/text box
    // ----------------------------------------------------
    function updateChatUI() {
        let form = document.querySelector("form");
        
        // --- 1. Toggle Button Injection ---
        let existingBtn = document.getElementById("vany-main-toggle-btn");
        if (existingBtn) {
            existingBtn.style.background = exits ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255, 255, 255, 0.15)";
        } else {
            let onoff = null;
            let gift = document.querySelector('[aria-label="Send a gift"], [aria-label="Send a Gift"]');
            if (gift) onoff = gift.parentElement;
            if (!onoff && form) {
                let inner = form.querySelector('[class*="inner_"]');
                if (inner) {
                    let buttons = inner.querySelector('[class*="buttons_"]');
                    if (buttons) onoff = buttons;
                    else onoff = inner;
                }
            }
            if (onoff) {
                let btn = document.createElement("button");
                btn.id = "vany-main-toggle-btn";
                onoff.appendChild(btn);
                
                btn.style.cssText = `
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.15);
                    margin-left: 8px;
                    margin-right: 8px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                    background: ${exits ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255, 255, 255, 0.15)"};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                btn.innerHTML = `<span style="font-size: 11px; color: white;">🛡️</span>`;
                btn.title = "VanyEnc Settings (Alt+V)";
                
                btn.onmouseenter = () => btn.style.transform = "scale(1.15)";
                btn.onmouseleave = () => btn.style.transform = "scale(1)";
                
                btn.onclick = (e) => {
                    e.preventDefault();
                    let existing = document.getElementById("vany-settings-menu");
                    if (existing) existing.remove();
                    else kastommeni();
                };
            }
        }

        // --- 2. Chat Border Styling ---
        if (form) {
            let targetBox = form.querySelector('[class*="scrollableContainer_"]');
            if (!targetBox) targetBox = form.querySelector('[class*="inner_"]');
            
            if (targetBox) {
                let channelId = window.location.pathname.split("/").pop();
                if (channelId && !isNaN(channelId)) {
                    let check = isDMChannelSync(channelId, p);
                    if (check.isDM) {
                        let hasKey = false;
                        if (check.recipientId) {
                            // Synchronously check cache for key
                            let storedKeys = JSON.parse(safeStorage.getItem("vany_contacts_public_keys") || "{}");
                            if (storedKeys[check.recipientId]) hasKey = true;
                        }

                        // Use box-shadow on the outermost container to ensure it wraps the injected shield icon perfectly
                        targetBox.style.border = "transparent";
                        if (exits && hasKey) {
                            targetBox.style.boxShadow = "inset 0 0 0 2px rgba(16, 185, 129, 0.6), 0 0 12px rgba(16, 185, 129, 0.2)"; // Green
                        } else {
                            targetBox.style.boxShadow = "inset 0 0 0 2px rgba(239, 68, 68, 0.6), 0 0 12px rgba(239, 68, 68, 0.2)"; // Red
                        }
                        targetBox.style.borderRadius = "8px"; 
                        return;
                    }
                }
                // Default fallback for Servers/Groups
                targetBox.style.border = "";
                targetBox.style.boxShadow = "";
            }
        }
    }

    // Run interval to ensure UI state is persistent and reacts to tab switching
    setInterval(updateChatUI, 500);
    updateChatUI();

    // Global Keybind to toggle UI (Alt + V)
    document.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === 'v') {
            e.preventDefault();
            let existing = document.getElementById("vany-settings-menu");
            if (existing) {
                existing.remove();
            } else {
                kastommeni();
            }
        }
    });

    // ----------------------------------------------------
    // HOOK (XHR INTERCEPTION) - w vany
    // ----------------------------------------------------
    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    
    var newSend = async function(vData) {
        let isJSON = false;
        try {
            JSON.parse(vData);
            isJSON = true;
        } catch(e) {}
        
        if (!isJSON || !exits) {
            return this.realSend(vData);
        }
        
        let url = this.__sentry_xhr_v3__.url;
        let method = this.__sentry_xhr_v3__.method;
        
        if (url.includes("/messages") && method === "POST") {
            let channelIdMatch = url.match(/\/channels\/(\d+)\/messages/);
            if (channelIdMatch) {
                let channelId = channelIdMatch[1];
                
                // check if channel is DM and fetch recipient ID
                let chanInfo = isDMChannelSync(channelId, p);
                if (chanInfo.isDM && chanInfo.recipientId) {
                    let parsedData = null;
                    try {
                        parsedData = JSON.parse(vData);
                    } catch (e) {}

                    let friendPub = await getPublicKeyFromId(chanInfo.recipientId);
                    if (friendPub) {
                        if (parsedData) {
                            try {
                                let encryptedText = await encryptPQCMessage(parsedData["content"], friendPub);
                                parsedData["content"] = encryptedText;
                                vData = JSON.stringify(parsedData);
                                showToast("Message encrypted using Post-Quantum cryptography!", "success");
                            } catch (err) {
                                console.error("Encryption error:", err);
                            }
                        }
                    } else {
                        let nonce = parsedData ? parsedData["nonce"] : null;
                        if (nonce && alertedNonces.has(nonce)) {
                            this.realSend(vData);
                            return;
                        }
                        if (!confirm("VanyEnc Warning!\n\nNo Post-Quantum key was found for this contact. Your message will be sent in vulnerable PLAINTEXT.\n\nAre you sure you want to send this message?")) {
                            return; // block the msg from being sent
                        }
                        if (nonce) {
                            alertedNonces.add(nonce); // todo: fix; somthing about this is fuked but idk what so this is the fix for now
                        }
                        showToast("Warning: Message sent in plaintext.", "error");
                    }
                }
            }
        }
        this.realSend(vData);
    };
    
    XMLHttpRequest.prototype.send = newSend;

    // ----------------------------------------------------
    // HOOK (DOM REPLACEMENT)
    // ----------------------------------------------------
    let id = [];
    let decryptedIds = new Set();

    async function updatez() {
        if (id.length === 0) return;
        
        for (let i = 0; i < id.length; i++) {
            let msgId = id[i];
            if (decryptedIds.has(msgId)) continue;
            
            try {
                let msgElement = document.querySelector(`#message-content-${msgId}`);
                if (msgElement) {
                    let text = msgElement.textContent.trim();
                    if (text.startsWith("vanypq:kex:")) {
                        msgElement.textContent = "🔒 Secure Key Exchange Message (Hidden)";
                        msgElement.style.color = "#6366f1";
                        msgElement.style.fontStyle = "italic";
                        msgElement.style.fontSize = "12px";
                        decryptedIds.add(msgId);
                    } else if (text.startsWith("vanypq:")) {
                        // Perform the post-quantum decryption asynchronously
                        let decryptedText = await decryptPQCMessage(text, myKeypair.privateKey);
                        msgElement.textContent = decryptedText;
                        decryptedIds.add(msgId);
                    }
                }
            } catch (err) {
                console.error("Error decrypting element:", err);
            }
        }
    }

    const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)); };
    
    async function decryptionDaemon() {
        while (true) {
            await updatez();
            await sleep(100);
        }
    }
    decryptionDaemon();

    // Hook XHR to capture loaded history messages
    XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener("readystatechange", () => {
            if (this.readyState === 4 && (this.responseURL.includes("before=") || this.responseURL.includes("messages?limit=50"))) {
                try {
                    let messages = JSON.parse(this.responseText);
                    if (Array.isArray(messages)) {
                        for (let i = 0; i < messages.length; i++) {
                            let msg = messages[i];
                            if (msg && msg.content && msg.content.includes("vanypq:")) {
                                if (!id.includes(msg.id)) {
                                    id.push(msg.id);
                                }
                            }
                        }
                    }
                } catch(e) {}
            }
        });
        return this.realOpen(method, url, async, user, password);
    };

    // ----------------------------------------------------
    // WEBSOCKET - https://github.com/notyml/discord-ws-base
    // ----------------------------------------------------
    async function hb(socket, interval) {
        while (true) {
            let hbpayload = {
                'op': 1,
                'd': 'null'
            };
            try {
                socket.send(JSON.stringify(hbpayload));
                await sleep(interval);
            } catch {
                break;
            }
        }
    }

    function connectWebSocket() {
        let socket = new WebSocket("wss://gateway.discord.gg/?encoding=json");
        
        socket.onclose = () => {
            // Reconnect on close after a short delay
            setTimeout(connectWebSocket, 1000);
        };
        
        socket.onopen = () => {
            socket.send(JSON.stringify({
                "op": 2,
                "d": {
                    "token": p,
                    "capabilities": 509,
                    "properties": {
                        "os": "Windows",
                        "browser": "Chrome",
                        "device": "",
                        "system_locale": "en-US",
                        "browser_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                        "browser_version": "100.0.4896.127",
                        "os_version": "10",
                        "referrer": "",
                        "referring_domain": "",
                        "referrer_current": "",
                        "referring_domain_current": "",
                        "release_channel": "stable",
                        "client_build_number": 125308,
                        "client_event_source": null
                    },
                    "presence": {
                        "status": "online",
                        "since": 0,
                        "activities": [],
                        "afk": false
                    },
                    "compress": false,
                    "client_state": {
                        "guild_hashes": {},
                        "highest_last_message_id": "0",
                        "read_state_version": 0,
                        "user_guild_settings_version": -1,
                        "user_settings_version": -1
                    }
                }
            }));
        };
        
        socket.onmessage = (x) => {
            try {
                let ejson = JSON.parse(x.data);
                if (ejson["d"] != null && ejson["d"].hasOwnProperty("heartbeat_interval")) {
                    var interval = JSON.parse(ejson['d']['heartbeat_interval']);
                    hb(socket, interval);
                } else if (ejson["t"] === "MESSAGE_CREATE") {
                    let content = ejson["d"]["content"];
                    if (content && content.includes("vanypq:")) {
                        if (content.startsWith("vanypq:kex:")) {
                            handleKexMessage(ejson["d"]);
                            id.push(ejson["d"]["id"]);
                        } else {
                            id.push(ejson["d"]["id"]);
                        }
                    }
                }
            } catch(e) {}
        };
    }
    connectWebSocket();
}
let token;
ws(token = t = (window.webpackChunkdiscord_app.push([[Symbol()],{},o=>{for(let e of Object.values(o.c))try{if(!e.exports||e.exports===window)continue;e.exports?.getToken&&(token=e.exports.getToken());for(let o in e.exports)e.exports?.[o]?.getToken&&"IntlMessagesProxy"!==e.exports[o][Symbol.toStringTag]&&(token=e.exports[o].getToken())}catch{}}]),window.webpackChunkdiscord_app.pop(),token));