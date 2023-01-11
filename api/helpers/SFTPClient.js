const Client = require("ssh2-sftp-client");
module.exports = class SFTPClient {
    constructor() {
        this.client = new Client();
    }

    async connect(options) {
        console.log(`Connecting to ${options.host}:${options.port}`);
        try {
            await this.client.connect(options);
        } catch (err) {
            console.log('Failed to connect:', err);
        }
    }

    async disconnect() {
        await this.client.end();
    }

    async listFiles(remoteDir, fileGlob) {
        console.log(`Listing ${remoteDir} ...`);
        let fileObjects;
        try {
            fileObjects = await this.client.list(remoteDir, fileGlob);
        } catch (err) {
            console.log('Listing failed:', err);
        }

        const fileNames = [];

        for (const file of fileObjects) {
            if (file.type === 'd') {
                console.log(`${new Date(file.modifyTime).toISOString()} PRE ${file.name}`);
            } else {
                console.log(`${new Date(file.modifyTime).toISOString()} ${file.size} ${file.name}`);
            }

            fileNames.push(file.name);
        }

        return fileNames;
    }

    async uploadFile(localFile, remoteFile) {
        console.log(`Uploading ${localFile} to ${remoteFile} ...`);
        try {
            await this.client.put(localFile, remoteFile);
        } catch (err) {
            console.error('Uploading failed:', err);
        }
    }

    async downloadFile(remoteFile, localFile) {
        console.log(`Downloading ${remoteFile} to ${localFile} ...`);
        try {
            await this.client.get(remoteFile, localFile);
        } catch (err) {
            console.error('Downloading failed:', err);
        }
    }
};
