const sshClient = require('../helpers/SSHClient')
const sftpClient = require('../helpers/SFTPClient')

require('dotenv').config()

const queryName = 'testoutput'
const fpTable = 'kitmat'

const ssh = new sshClient()
const sftp = new sftpClient()
const listGoodsByKitNumber = async (req, res) => {
    // eventually these txt files should be JSON files
    let query = "\nselect @1,@2\n" +
        "from " +
        fpTable + "\nwhere @2 = " +
        req.params['kitNumber']

    await ssh.generateNewQuery(query, queryName)
    await ssh.runFPSQLQuery(queryName)

    let data = await sftp.getSingleFile(queryName)
    res.json(data)
}

exports.listGoodsByKitNumber = listGoodsByKitNumber
