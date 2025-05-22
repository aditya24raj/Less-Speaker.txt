let defaultAudioOutput = null;

function detectDefaultAudioOutput(initial = false) {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => {
            if (
                device.kind === "audiooutput"
                && device.deviceId === "default"
            ) {
                if (initial) {
                    // first run, initialize defaultDevice
                    defaultAudioOutput = device;
                }
                else if (defaultAudioOutput?.groupId !== device.groupId) {
                    chrome.runtime.sendMessage({ action: "muteTab" });
                    defaultAudioOutput = device;
                }
            }
        });

        if (initial) {
            // in initial, if defaultAudioOutput is still null, ask for permission and try to initialize again
            if (defaultAudioOutput == null || defaultAudioOutput.groupId === null || defaultAudioOutput.groupId === undefined || defaultAudioOutput.groupId.trim() === "") {
                // ask for media device permission & initialize again
                navigator.mediaDevices.getUserMedia({
                    audio: true
                }).then((stream) => {
                    stream.getTracks().forEach(track => track.stop()); // immediately stops the device without revoking the permissions
                    detectDefaultAudioOutput(true); // Call once after permissions granted
                }).catch(err => {
                    console.warn("Audio device access needed to detect default device changes", err);
                });
            }
        }

    }).catch((e) => {
        console.log(e);
    });
}

detectDefaultAudioOutput(true);
navigator.mediaDevices.ondevicechange = (event) => {
    detectDefaultAudioOutput(false);
};
