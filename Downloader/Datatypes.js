class DownloadEntry {
    PageAddress = "";
    SaveDirRegexp = "";

    constructor(address, regexp) {
        this.PageAddress = address;
        this.SaveDirRegexp = regexp;
    }

    Address() {
        return this.PageAddress;
    }
}
