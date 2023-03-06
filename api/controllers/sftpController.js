'use strict'

const sftpClient = require('../helpers/SFTPClient')

require('dotenv').config()

var client

const connectSftp = async () => {
    //* Open the connection
    client = new sftpClient()
    await client.connect();
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
