let downloadSettings = {};

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    console.log(`Downloading file: ${downloadItem.filename}`);
    console.log(`Download settings: ${downloadSettings}`);

    getCurrentTabUrl().then((url) => {
        console.log(`Tab url: "${url}"`);

        let downloadSetting = {};
        for (var i = 0; i < downloadSettings.length; i++) {
            if (url.includes(downloadSettings[i].PageAddress)) {
                downloadSetting = downloadSettings[i];
                break;
            }
        }

        console.log('Page address pattern is ' + downloadSetting.PageAddress);
        console.log('Save subdirectory is ' + downloadSetting.DownloadSubDirectory);
        console.log('Save directory regexp is ' + downloadSetting.SaveDirRegexp);

        let filePath = updateFilePath(downloadItem.filename, url, downloadSetting);

        console.log(`Saving as: ${filePath}`);
        suggest({ filename: `${filePath}` });
    });

    return true;
});

function updateFilePath(_fileName, _url, _downloadSettings) {
    let regex = new RegExp(_downloadSettings.SaveDirRegexp);
    let m = _url.match(regex);

    let filePath = "";
    if (m != null && m.length > 0) {
        filePath = `${m[0]}\\${_fileName}`;

        // Tests undefined, null or empty. If sub dir is not empty then append to path.
        if (_downloadSettings.DownloadSubDirectory) {
            filePath = `${_downloadSettings.DownloadSubDirectory}\\${filePath}`
        }
    }
    else {
        filePath = _fileName
    }

    return filePath;
}

async function getCurrentTabUrl() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(`url ${tab.url}`);
    return tab.url;
}

async function loadStoredDownloadSettings() {
    await getLocalStorageValue("downloadSettings").then((options) => {
        // awkward conver object to array.
        downloadSettings =  Object.values(options.downloadSettings);
        console.log(`Download settings loaded.`);
    });

    console.log(downloadSettings);
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

loadStoredDownloadSettings();