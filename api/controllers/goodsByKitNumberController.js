const fs = require('fs')
const {NodeSSH} = require('node-ssh')
const sftpClient = require('../helpers/SFTPClient')

require('dotenv').config()

const remoteOutputFile = '/tmp/testoutput.txt'
const queryFileLocation = '/appl/fp_v6.0.03.15D6/sql/testoutput'
const fpTable = 'kitmat'
const goodsListFile = './public/goodsList.txt'
const connectSSH = async (req, res) => {
    const ssh = new NodeSSH()
    await ssh.connect({
        host: process.env.HOST,
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    })

    //Clear Contents of Query File
    await ssh.exec(`:> ${queryFileLocation}`,[])

    let query = "set output" + "'" +
        remoteOutputFile + "'" +
        "\nset lines 0\nset delimiter '!'\nselect @1,@2\n" +
        "from " +
        fpTable + "\nwhere @2 = " +
        req.params['kitNumber']

    //Dynamically Update Query String
    await ssh.exec(`echo "${query}" > ${queryFileLocation}`,[])

    //Run FPSQL query from command line
    await ssh.exec('export TERM=linux && cd /appl/fp_v6.0.03.15D6 && ./fpsql testoutput',[])
    ssh.dispose()

    let data = await getSingleFile()
    res.json(data)
}

const getSingleFile = async () => {
    let sftp = new sftpClient()
    await sftp.connect({
        host: process.env.HOST,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        port: 22
    })

    await sftp.downloadFile(remoteOutputFile,goodsListFile )
    sftp.disconnect();
    try {
        var data = fs.readFileSync(goodsListFile, 'utf8');
        console.log(data.toString());
        return data.toString()
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

exports.goodsList = connectSSH
