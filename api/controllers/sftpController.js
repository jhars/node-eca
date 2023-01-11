'use strict'

const sftpClient = require('../helpers/SFTPClient')

require('dotenv').config()

const host = process.env.HOST
const port = 22
const username = process.env.USERNAME
const password = process.env.PASSWORD

var client

const connectSftp = async () => {
    //* Open the connection
    client = new sftpClient()
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
