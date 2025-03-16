if (!window.buzzBeeInjected) {
  window.buzzBeeInjected = true;
  
  const buzzwords = ["synergy", "innovation", "disrupt", "leverage", "paradigm", "scalable"];
  let text = document.body.innerText;
  let count = 0;
  let detectedWords = {};

  buzzwords.forEach(word => {
      let matches = text.match(new RegExp(`\\b${word}\\b`, "gi"));
      if (matches) {
          count += matches.length;
          detectedWords[word] = matches.length;
      }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "getBuzzWords") {
          sendResponse({ count: count || 0, detectedWords: detectedWords || {} });
      }
      return true; // Ensures response is asynchronous
  });
}
