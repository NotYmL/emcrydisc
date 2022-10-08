et triggered=false;
async function ws(p) {
    let sacuvantop="35%";
    let sacuvanleft="37%";
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
          elmnt.onmousedown = dragMouseDown;
        }
      
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
          sacuvantop=(elmnt.offsetTop - pos2) + "px";
          sacuvanleft=(elmnt.offsetLeft - pos1) + "px";
        }
      
        function closeDragElement() {
          /* stop moving when mouse button is released:*/
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }
    let custom="kastm kod"
    let kastm=false
    let exits=true;
    async function kastommeni(){
        let kastmmenu = document.createElement("div");
        document.body.appendChild(kastmmenu)
        kastmmenu.style.cssText="position: absolute; width: 25%; height: 25%; z-index: 9999; padding: 1%; background: rgba(33, 34, 45, 0.863); border-radius: 15px;"
        kastmmenu.style.top=sacuvantop;
        kastmmenu.style.left=sacuvanleft;
        let ukljucenje=document.createElement("button");
        ukljucenje.setAttribute("value","kastm")
        kastmmenu.appendChild(ukljucenje)
        ukljucenje.style.cssText="position: relative;color: red;font-size: 20px;left: 95%;top: -5%;background: transparent;margin-right: 45px;"
        ukljucenje.innerHTML="X"
        ukljucenje.onclick=x=>{
            kastmmenu.remove()
        }
        dragElement(kastmmenu)
        let prikvati= document.createElement("button");
        prikvati.setAttribute("value","kastm")
        kastmmenu.appendChild(prikvati)
        prikvati.style.position="absolute"
        prikvati.style.top="80%"
        prikvati.style.left="52%"
        prikvati.innerHTML="kastm"
        prikvati.style.background=kastm==true?"green":"red"
        let kastminput = document.createElement("input");
        kastminput.style.cssText="margin: auto; display: block; font-family: consolas; width: 30%; height: 10%; background: rgba(0, 0, 0, 0.2); border-bottom: 3px solid lightblue; color: white; padding: 0px 0px 0px 2%;"
        kastmmenu.appendChild(kastminput)
        kastminput.value=custom
        kastminput.onclick=()=>{
            kastminput.focus()
        }
        prikvati.onclick=x=>{
            kastm=!kastm
            custom=kastminput.value
            prikvati.style.background=kastm==true?"green":"red"
        }
        let iskljucenje= document.createElement("button");
        iskljucenje.setAttribute("value","kastm")
        kastmmenu.appendChild(iskljucenje)
        iskljucenje.style.cssText="position: absolute; top: 80%; right: 54%"
        iskljucenje.style.background=exits==true?"red":"green"
        iskljucenje.innerHTML=exits==true?"ukljuci":"iskljuci"
        iskljucenje.onclick=x=>{
            exits=!exits
            iskljucenje.innerHTML=exits==true?"ukljuci":"iskljuci"
            iskljucenje.style.background=exits==true?"red":"green"
        }
    }
    const onoff = document.querySelector(`[aria-label="Send a gift"]`).parentElement;
    let btn = document.createElement("button");
    onoff.appendChild(btn)
    btn.style.width="20px"
    btn.style.height="20px"
    btn.style.top="25%"
    btn.style.right="100%"
    btn.style.position="relative"
    btn.style.background=exits==false?"green":"gray"
    btn.onclick=()=>{
        kastommeni()
        btn.style.background=exits==false?"green":"gray"
    }
    const sleep = (milliseconds) => {return new Promise(resolve => setTimeout(resolve, milliseconds))};
    let oldHref=document.location.href
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                const onoff = document.querySelector(`[aria-label="Send a gift"]`).parentElement;
				let btn = document.createElement("button");
				onoff.appendChild(btn)
				btn.style.width="20px"
				btn.style.height="20px"
                btn.style.top="25%"
                btn.style.right="100%"
                btn.style.position="relative"
                btn.style.background=exits==false?"green":"gray"
				btn.onclick=()=>{
                    kastommeni()
					btn.style.background=exits==false?"green":"gray"
				}
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
    let encrypt = (plainText) =>
        {
            let chiperText = "";
            let sex=""
            if (plainText.match(/(<@)[0-9]*(>)/)) {
                sex=plainText.match(/(<@)[0-9]*(>)/)[0]
                plainText=plainText.replace(plainText.match(/(<@)[0-9]*(>)/)[0],"")
            }
            if (plainText==undefined) {
                return `${sex}`
            }
            let x = Math.floor((Math.random() * 9) + 1);
            for (let i = 0; i < plainText.length; i++)
            {
                let existingCharCode = plainText.charCodeAt(i)
                let newCharCode = existingCharCode + x
                let newChars = String.fromCharCode(newCharCode)
                chiperText += newChars
            }
            return `${x}${chiperText} ${sex}`
        }
    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    var newSend = function(vData) {
        try{
            JSON.parse(vData)
        }catch{
            return this.realSend(vData)}
		if(exits==false){
			this.addEventListener("readystatechange",()=>{
				if(this.readyState == 4){
					if(this.responseURL.includes("before=")||this.responseURL.includes("messages?limit=50")){
					for (let i = 0; i < JSON.parse(this.responseText).length; i++) {
						try{
							if (JSON.parse(this.responseText)[i]["content"].includes("bmlnZ2Vy")||JSON.parse(this.responseText)[i]["content"].includes(custom)) {
								id.push(JSON.parse(this.responseText)[i]["id"])
							}
						}catch(e){}
					}
				}
				}
			})
			if(this.__sentry_xhr__.url.includes("/messages")&&this.__sentry_xhr__.method=="POST"){
						vData=JSON.parse(vData)
						vData["content"]=(kastm==true?custom:"bmlnZ2Vy")+encrypt(vData["content"])
						vData=JSON.stringify(vData)
			}
		}
        this.realSend(vData)
    }
    XMLHttpRequest.prototype.send = newSend;
    let decrypt = (chiperText) =>
    {
        let plainText = ""
        let x = chiperText.charAt(0)
        for (let i = 1; i < chiperText.length; i++)
        {
            let existingCharCode = chiperText.charCodeAt(i)
            let newCharCode = existingCharCode - x
            let newChars = String.fromCharCode(newCharCode)
            plainText += newChars
        }
        return plainText
    }
 
    	async function updatez() {
		while (true) {
			if (id.length != 0) {
				for (let i = 0; i < id.length; i++) {
                    let regexp=new RegExp(`(?<=${custom})(.*)`,"gms")
                    try{
                    let decrypthis=document.querySelector(`#message-content-${id[i]}`).textContent.match(/(?<=bmlnZ2Vy)(.*)/gms)||document.querySelector(`#message-content-${id[i]}`).textContent.match(regexp)
                    let test=false
					for (let x = 0; x < document.querySelector(`#message-content-${id[i]}`).children.length; x++) {
						while (document.querySelector(`#message-content-${id[i]}`).children[x]!=undefined&&document.querySelector(`#message-content-${id[i]}`).children[x].classList[0] == "mention") {
							test=true
							document.querySelector(`#message-content-${id[i]}`).removeChild(document.querySelector(`#message-content-${id[i]}`).children[x])
						}
					}
					if (test==true) 
						document.querySelector(`#message-content-${id[i]}`).textContent=decrypt(decrypthis[0])
                    else
						document.querySelector(`#message-content-${id[i]}`).textContent=decrypt(decrypthis[0])		
                    }catch{}				
				}
				await sleep(100)
			}
			await sleep(100)

	}
}
    async function hb(socket, interval){
        while(true){
            let hbpayload={
                'op': 1,
                'd': 'null'
            };
            try{
            socket.send(JSON.stringify(hbpayload));
            await sleep(interval);}catch{break}
        };
    }
    let id=[]
    socket= new WebSocket("wss://gateway.discord.gg/?encoding=json");
    socket.onclose=()=>{
        ws(p)
    }
    socket.onopen=()=>{
        socket.send(JSON.stringify({"op":2,"d":{"token":p,"capabilities":509,"properties":{"os":"Windows","browser":"Chrome","device":"","system_locale":"en-US","browser_user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36","browser_version":"100.0.4896.127","os_version":"10","referrer":"","referring_domain":"","referrer_current":"","referring_domain_current":"","release_channel":"stable","client_build_number":125308,"client_event_source":null},"presence":{"status":"online","since":0,"activities":[],"afk":false},"compress":false,"client_state":{"guild_hashes":{},"highest_last_message_id":"0","read_state_version":0,"user_guild_settings_version":-1,"user_settings_version":-1}}}))}
    socket.onmessage=(x)=>{
        for (let i = 0; i < id.length; i++) {
            const element = id[i];
        }
    let ejson=JSON.parse(x.data)
    if(ejson["d"]!=null&&ejson["d"].hasOwnProperty("heartbeat_interval")){
        var interval = JSON.parse(ejson['d']['heartbeat_interval']);
        hb(socket, interval);
    }
    else if (ejson["t"]=="MESSAGE_CREATE")
        if(ejson["d"]["content"].startsWith("bmlnZ2Vy")){
            id.push(ejson["d"]["id"])
            updatez()
        }
        if (kastm==true&&ejson["d"]["content"].startsWith(custom)){
            id.push(ejson["d"]["id"])
            updatez()
        }
    }
}
ws((webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getId!==void 0).exports.default[atob("Z2V0VG9rZW4")]())
