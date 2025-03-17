document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0 || tabs[0].url.startsWith("chrome://")) {
            console.error("Invalid tab or cannot access chrome:// pages.");
            document.getElementById("buzz-score").innerText = "Cannot scan this page.";
            return;
        }

        // Send message to content script
        chrome.tabs.sendMessage(tabs[0].id, { action: "getBuzzWords" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                document.getElementById("buzz-score").innerText = "Error retrieving data.";
                return;
            }

            if (!response || !response.detectedWords) {
                document.getElementById("buzz-score").innerText = "No buzzwords found.";
                return;
            }

            updatePopup(response);
        });
    });
});

function updatePopup(response) {
    document.getElementById("buzz-score").innerText = `Buzzwords found: ${response.count}`;
    let list = document.getElementById("word-list");
    list.innerHTML = "";

    Object.entries(response.detectedWords).forEach(([word, data]) => {
        let li = document.createElement("li");
        li.innerText = `${word} (${data.category}): ${data.count}`;
        list.appendChild(li);
    });
}
