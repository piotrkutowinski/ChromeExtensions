let saveButton = document.getElementById("saveButton");
let addButton = document.getElementById("addOptionButton")

saveButton.addEventListener("click", handleSaveButtonClick);
addButton.addEventListener("click", handleAddButtonClick);

function handleSaveButtonClick() {
    let downloadEntriesDivs = document.getElementById("DownloadEntriesDiv").getElementsByTagName("div");
    let downloadEntries = [];

    if (downloadEntriesDivs) {
        for (var i = 0; i < downloadEntriesDivs.length; i++) {
            let textBoxes = downloadEntriesDivs[i].getElementsByTagName("text");
            if (textBoxes) {
                let downloadEntry = new DownloadEntry("", "", "");

                for (var j = 0; j < textBoxes.length; j++) {
                    if (textBoxes[i].id.includes("address")) {
                        downloadEntry.PageAddress = textBoxes[i].value;
                    }
                    else if (textBoxes[i].id.includes("subdir")) {
                        downloadEntry.DownloadSubDirectory = textBoxes[i].value;
                    }
                    else if (textBoxes[i].id.includes("regexp")) {
                        downloadEntry.SaveDirRegexp = textBoxes[i].value;
                    }
                    else {
                        console.log(`Found unexpected textbox ${textBoxes[i].id}`);
                    }
                }

                if (!downloadEntry.address || (!downloadEntry.subdir && !downloadEntry.regexp)) {
                    console.log(`Invalid download entry specified: ${downloadEntry}`);
                }
                else {
                    downloadEntries[downloadEntries.length] = downloadEntry;
                    console.log(`Download entry: PageAddress: ${downloadEntry.PageAddress} ::: SaveRegexp: ${downloadEntry.SaveDirRegexp} ::: SubDir: ${downloadEntry.DownloadSubDirectory}`);
                }
            }
        }
    }

    chrome.storage.sync.set({ "downloadSettings": downloadEntries });
}

function handleAddButtonClick() {
    let blankOption = new DownloadEntry("", "", "");

    drawOptions(blankOption);
}

function handleRemoveButtonClick(evt) {
    console.log(`Remove button click: ${evt.currentTarget.id}`);
    console.log(`Remove button click: ${evt.currentTarget.uniqueId}`);

    let optionsDiv = document.getElementById(`DonwloadEntriesDiv`);
    let optionDiv = document.getElementById(`optionDiv${evt.currentTarget.uniqueId}}`);
    optionsDiv.removeChild(optionDiv);
}

async function drawOptions(options) {
    let masterDiv = document.getElementById("DonwloadEntriesDiv");

    let now = Date.now();

    let downloadEntriesDiv = document.createElement(`div`);
    downloadEntriesDiv.id = `optionDiv${now}`;
    downloadEntriesDiv.innerHTML = `<text>Page address: </text>
        <input type="text" size="40" maxlength="40" id="addressTextBox${now}">
        <text>Save subdirectory: </text>
        <input type="text" size="40" maxlength="40" id="subdirTextBox${now}">
        <text> Save dir regexp: </text>
        <input type="text" size="40" maxlength="40" id="regexpTextBox${now}"> 
        <button id="saveButton">save</button> <button id="removeButton${now}">remove</button>`;

    masterDiv.appendChild(downloadEntriesDiv);

    document.getElementById(`addressTextBox${now}`).value = options.PageAddress;
    document.getElementById(`subdirTextBox${now}`).value = options.DownloadSubDirectory;
    document.getElementById(`regexpTextBox${now}`).value = options.SaveDirRegexp;
    let remButton = document.getElementById(`removeButton${now}`);
    remButton.addEventListener("click", handleRemoveButtonClick, false);
    remButton.uniqueId = now;
}

async function Initialize() {
    let downloadSettings = await loadStoredDownloadSettings();

    if (Array.isArray(downloadSettings)) {
        downloadSettings.forEach(setting => {
            drawOptions(setting);
        });
    } else if (downloadSettings) {
        drawOptions(downloadSettings);
    }
    else {
        drawOptions(new DownloadEntry("", "", ""));
    }
}

Initialize();