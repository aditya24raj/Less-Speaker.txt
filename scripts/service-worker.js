chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "muteTab") {
        if (sender.tab && sender.tab.id !== undefined) { 
            try {
                chrome.tabs.update(sender.tab.id, { url: "resume-playback.html" });
            } catch (error) {
                console.log("Sorry, failed to stop playback: ", error);
            }   

        }
    }
});
