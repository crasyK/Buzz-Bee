chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "countBuzzwords") {
      chrome.storage.sync.get(["buzzwords"], function(result) {
        let buzzwords = result.buzzwords || ["synergy", "paradigm shift", "disruptive", "AI-powered", "blockchain"];
        const text = document.body.innerText.toLowerCase();
        let count = 0;
        buzzwords.forEach(word => {
          const regex = new RegExp("\\b" + word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\b", "g"); //escape special characters and use word boundaries
          const matches = text.match(regex);
          if (matches) {
            count += matches.length;
          }
        });
        sendResponse({ count: count });
      });
      return true;
    }
  });