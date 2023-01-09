'use strict'
const Client = require('ssh2-sftp-client');
const request = require('request')
const rp = require('request-promise')
const path = require('path');


require('dotenv').config()

const host = process.env.HOST
const port = 22
const username = process.env.USERNAME
const password = process.env.PASSWORD

var client;

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

const connectSftp = async () => {
    //* Open the connection
    client = new SFTPClient();
    await client.connect({ host, port, username, password });
}

const listFiles = async (req, res) => {
    await connectSftp()

    //* List working directory files
    let list = await client.listFiles("/appl/fp_v6.0.03.15D6/lib");

    //* Close the connection
    await client.disconnect();

    res.json(list)
};

const readFile = async (goodsFile) => {
    await connectSftp()
    await client.downloadFile(goodsFile, "./public/goodsList.txt");
    await client.disconnect();
}

exports.readFile = readFile
exports.listFiles = listFiles
