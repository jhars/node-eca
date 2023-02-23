const Client = require("ssh2-sftp-client");
const fs = require('fs');

//JH-NOTE: refactor to use this in initial connection function
const connectionOptions = {
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: 22
}

module.exports = class SFTPClient {
    constructor() {
        this.client = new Client();
    }

//JH-NOTE: refactor to use connectionOptions (above), dummy variable 'options' for now
    async connect(options) {
        console.log(`Connecting to ${connectionOptions.host}:${connectionOptions.port}`);
        try {
            await this.client.connect(connectionOptions);
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

    async getSingleFile(localTempFile, remoteOutputFile) {
        await this.connect()
        await this.downloadFile(remoteOutputFile,localTempFile )
        await this.disconnect();
        try {
            var data = fs.readFileSync(localTempFile, 'utf8');
            console.log(data.toString());
            return data.toString()
        } catch(e) {
            console.log('Error:', e.stack);
        }
    }
};
