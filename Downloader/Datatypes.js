class DownloadEntry {
    PageAddress = "";
    SaveDirRegexp = "";
    DownloadSubDirectory = "";

    constructor(_address, _regexp, _downloadSubDirectory) {
        this.PageAddress = _address;
        this.SaveDirRegexp = _regexp;
        this.DownloadSubDirectory = _downloadSubDirectory;
    }

    Address() {
        return this.PageAddress;
    }
}
