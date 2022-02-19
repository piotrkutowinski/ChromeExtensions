const downloadSettingsp = loadStoredDownloadSettings();

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    let downloadSettings = {};
    let downloadSetting = {};
    downloadSettingsp.then((d)=>{
        Object.assign(downloadSettings, d);
    });

    // temp WA for not finnished work.
    if (Array.isArray(downloadSettings)) {
        downloadSetting = downloadSettings[0];
    } else {
        downloadSetting = downloadSettings;
    }
    
    console.log('Page address pattern is ' + downloadSetting.PageAddress);
    console.log('Save subdirectory is ' + downloadSetting.DownloadSubDirectory);
    console.log('Save directory regexp is ' + downloadSetting.SaveDirRegexp);

    console.log(`Downloading file: ${downloadItem.filename}`);

    getCurrentTabUrl().then((url) => {
        console.log(`Tab url: "${url}"`);

        if (url.includes(downloadSetting.PageAddress)) {
            console.log("Hsd url");

            let regex = new RegExp(downloadSetting.SaveDirRegexp);
            let m = url.match(regex);

            if (m != null) {
                let filePath = `${m[0]}\\${downloadItem.filename}`;
                
                // Tests undefined, null or empty. If sub dir is not empty then append to path.
                if (downloadSetting.DownloadSubDirectory)
                {
                    filePath = `${downloadSetting.DownloadSubDirectory}\\${filePath}`
                }

                console.log(`Saving as: ${filePath}`);

                suggest({ filename: `${filePath}` });
            }
        }
    });

    return true;
});

async function getCurrentTabUrl() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(`url ${tab.url}`);
    return tab.url;
}

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