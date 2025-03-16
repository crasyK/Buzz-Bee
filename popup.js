document.addEventListener("DOMContentLoaded", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "countBuzzwords" }, function(response) {
        if (response && response.count !== undefined) {
          document.getElementById("count").textContent = "Buzzword Count: " + response.count;
        } else {
          document.getElementById("count").textContent = "Error counting buzzwords.";
        }
      });
    });
  });