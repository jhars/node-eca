const fs = require('fs')
const path = require('path')
const {NodeSSH} = require('node-ssh')
const request = require('request')
const rp = require('request-promise')
const sftp = require('./sftpController')

require('dotenv').config()

const connectSSH = async (req, res) => {
    const ssh = new NodeSSH()

    await ssh.connect({
        host: process.env.HOST,
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    })

    // await ssh.exec('/appl/fp_v6.0.03.15D6/fpsql testoutputBang',[])

    let queryFileLocation = "/appl/fp_v6.0.03.15D6/sql/testoutput"

    await ssh.exec(`> ${queryFileLocation}`,[])
    // 1064000
    let query = "set output '/tmp/testoutput.txt'\nset lines 0\nset delimiter '!'\nselect @1,@2\nfrom kitmat\nwhere @2 = " + req.params['kitNumber']
    await ssh.exec(`echo "${query}" > ${queryFileLocation}`,[])
    await ssh.exec('/appl/fp_v6.0.03.15D6/fpsql testoutput',[])
    await ssh.dispose()

    let resultsFileLocation = "/tmp/testoutput.txt"
    // let result = await ssh.exec('cat /tmp/testoutput.txt',[])
    await sftp.readFile(resultsFileLocation)

    fs.readFile('./public/goodsList.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            // return;
        }
        console.log(data);
        res.json(data)
    });

    // console.log(result)
    //
    // res.json(result)


}

exports.goodsList = connectSSH
