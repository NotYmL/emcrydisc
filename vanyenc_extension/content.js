const script = document.createElement('script');
script.src = chrome.runtime.getURL('vany.js');
script.onload = function() {
    // Clean up the script tag after the script finishes executing
    this.remove();
};
(document.head || document.documentElement).appendChild(script);