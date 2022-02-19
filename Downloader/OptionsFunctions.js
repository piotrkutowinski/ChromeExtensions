async function loadStoredDownloadSettings() {
    let opt = {};

    await getLocalStorageValue("downloadSettings").then((options) => {
        Object.assign(opt, options.downloadSettings);
    });

    console.log(opt);
    return opt
}

async function getLocalStorageValue(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, function (value) {
                resolve(value);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}