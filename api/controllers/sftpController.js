'use strict'
let Client = require('ssh2-sftp-client');
require('dotenv').config()


class SFTPClient {
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

(async () => {
    const host = process.env.HOST
    const port = 22
    const username = process.env.USERNAME
    const password = process.env.PASSWORD

    //* Open the connection
    const client = new SFTPClient();
    await client.connect({ host, port, username, password });

    //* List working directory files
    await client.listFiles("/appl/fp_v6.0.03.15D6/lib");

    //* Upload local file to remote file
    // await client.uploadFile( "./public/licfp.dat", "/appl/fp_v6.0.03.15D6/lib/licfp.dat");
    // await client.uploadFile( "./public/licfp.bkp", "/appl/fp_v6.0.03.15D6/lib/licfp.bkp");
    // await client.uploadFile( "./public/licfp_new.dat", "/appl/fp_v6.0.03.15D6/lib/licfp.dat");
    // await client.uploadFile( "./public/licfp_new.bkp", "/appl/fp_v6.0.03.15D6/lib/licfp.bkp");

    //* Download remote file to local file
    // await client.downloadFile("./testSafe/testdirectory/testfile", "./public/downloadedFromDevLinux.txt");

    //* Delete remote file
    // await client.deleteFile("./remote.txt");

    //* Close the connection
    await client.disconnect();
})();
