document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0 || tabs[0].url.startsWith("chrome://")) {
          console.error("Invalid tab.");
          return;
      }

      chrome.scripting.executeScript(
          {
              target: { tabId: tabs[0].id },
              func: () => window.buzzBeeInjected || false,
          },
          (results) => {
              if (results && results[0].result) {
                  // Content script already injected, send message
                  sendMessageToContentScript(tabs[0].id);
              } else {
                  // Inject content script
                  chrome.scripting.executeScript(
                      {
                          target: { tabId: tabs[0].id },
                          files: ["content.js"]
                      },
                      () => {
                          if (chrome.runtime.lastError) {
                              console.error("Script injection failed:", chrome.runtime.lastError.message);
                              return;
                          }
                          sendMessageToContentScript(tabs[0].id);
                      }
                  );
              }
          }
      );
  });
});

function sendMessageToContentScript(tabId) {
  chrome.tabs.sendMessage(tabId, { action: "getBuzzWords" }, (response) => {
      if (chrome.runtime.lastError) {
          console.error("Message sending failed:", chrome.runtime.lastError.message);
          return;
      }
      document.getElementById("buzz-score").innerText = `Buzzwords found: ${response.count}`;
      let list = document.getElementById("word-list");
      list.innerHTML = "";
      Object.keys(response.detectedWords).forEach(word => {
          let li = document.createElement("li");
          li.innerText = `${word}: ${response.detectedWords[word]}`;
          list.appendChild(li);
      });
  });
}
