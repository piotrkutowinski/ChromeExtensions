const downloadSettingsp = loadStoredDownloadSettings();

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    let downloadSettings = {};
    downloadSettingsp.then((d)=>{
        Object.assign(downloadSettings, d);
    });
    
    console.log('Page address pattern is ' + downloadSettings.PageAddress);
    console.log('Save subdirectory is ' + downloadSettings.DownloadSubDirectory);
    console.log('Save directory regexp is ' + downloadSettings.SaveDirRegexp);

    console.log(`Downloading file: ${downloadItem.filename}`);

    getCurrentTabUrl().then((url) => {
        console.log(`Tab url: "${url}"`);

        if (url.includes(downloadSettings.PageAddress)) {
            console.log("Hsd url");

            let regex = new RegExp(downloadSettings.SaveDirRegexp);
            let m = url.match(regex);

            if (m != null) {
                let filePath = `${m[0]}\\${downloadItem.filename}`;
                
                // Tests undefined, null or empty. If sub dir is not empty then append to path.
                if (downloadSettings.DownloadSubDirectory)
                {
                    filePath = `${downloadSettings.DownloadSubDirectory}\\${filePath}`
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