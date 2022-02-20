let saveButton = document.getElementById("saveButton");
let addButton = document.getElementById("addOptionButton")

saveButton.addEventListener("click", handleSaveButtonClick);
addButton.addEventListener("click", handleAddButtonClick);

let optCount = 0;

function handleSaveButtonClick() {
    let downloadEntriesDivs = document.getElementById("DownloadEntriesDiv").getElementsByTagName("div");
    let downloadEntries = [];

    if (downloadEntriesDivs) {
        for (var i = 0; i < downloadEntriesDivs.length; i++) {
            let inputBoxes = downloadEntriesDivs[i].getElementsByTagName("input");
            if (inputBoxes) {
                let downloadEntry = new DownloadEntry("", "", "");

                for (var j = 0; j < inputBoxes.length; j++) {
                    if (inputBoxes[j].id.includes("address")) {
                        downloadEntry.PageAddress = inputBoxes[j].value;
                    }
                    else if (inputBoxes[j].id.includes("subdir")) {
                        downloadEntry.DownloadSubDirectory = inputBoxes[j].value;
                    }
                    else if (inputBoxes[j].id.includes("regexp")) {
                        downloadEntry.SaveDirRegexp = inputBoxes[j].value;
                    }
                    else {
                        console.log(`Found unexpected textbox ${inputBoxes[j].id}`);
                    }
                }

                if (!downloadEntry.PageAddress || (!downloadEntry.DownloadSubDirectory && !downloadEntry.SaveDirRegexp)) {
                    console.log(`Invalid download entry specified: ${downloadEntry}`);
                }
                else {
                    downloadEntries[downloadEntries.length] = downloadEntry;
                    console.log(`Download entry: PageAddress: ${downloadEntry.PageAddress} ::: SaveRegexp: ${downloadEntry.SaveDirRegexp} ::: SubDir: ${downloadEntry.DownloadSubDirectory}`);
                }
            }
        }
    }

    if (downloadEntries.length > 0) {
        chrome.storage.sync.set({ "downloadSettings": downloadEntries });
    }
}

function handleAddButtonClick() {
    let blankOption = new DownloadEntry("", "", "");

    drawOptions(blankOption, optCount++);
}

function handleRemoveButtonClick(evt) {
    console.log(`Remove button click: ${evt.currentTarget.id}`);
    console.log(`Remove button click: ${evt.currentTarget.uniqueId}`);

    let optionsDiv = document.getElementById(`DownloadEntriesDiv`);
    let optionDiv = document.getElementById(`optionDiv${evt.currentTarget.uniqueId}}`);
    optionsDiv.removeChild(optionDiv);
}

async function drawOptions(_options, _id) {
    let masterDiv = document.getElementById("DownloadEntriesDiv");

    let downloadEntriesDiv = document.createElement(`div`);
    downloadEntriesDiv.id = `optionDiv${_id}`;
    downloadEntriesDiv.innerHTML = `<text>Page address: </text>
        <input type="text" size="40" maxlength="40" id="addressTextBox${_id}">
        <text>Save subdirectory: </text>
        <input type="text" size="40" maxlength="40" id="subdirTextBox${_id}">
        <text> Save dir regexp: </text>
        <input type="text" size="40" maxlength="40" id="regexpTextBox${_id}"> 
        <button id="saveButton">save</button> <button id="removeButton${_id}">remove</button>`;

    masterDiv.appendChild(downloadEntriesDiv);

    document.getElementById(`addressTextBox${_id}`).value = _options.PageAddress;
    document.getElementById(`subdirTextBox${_id}`).value = _options.DownloadSubDirectory;
    document.getElementById(`regexpTextBox${_id}`).value = _options.SaveDirRegexp;
    let remButton = document.getElementById(`removeButton${_id}`);
    remButton.addEventListener("click", handleRemoveButtonClick, false);
    remButton.uniqueId = _id;
}

async function Initialize() {
    let downloadSettings = await loadStoredDownloadSettings();
    downloadSettings = Object.values(downloadSettings);

    if (downloadSettings && downloadSettings.length > 0) {
        downloadSettings.forEach(setting => {
            drawOptions(setting, optCount++);
        });
    }
    else {
        drawOptions(new DownloadEntry("", "", ""));
    }
}

Initialize();