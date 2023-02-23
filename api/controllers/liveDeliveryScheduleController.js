const fs = require('fs')
const sshClient = require('../helpers/SSHClient')
const sftpClient = require('../helpers/SFTPClient')

require('dotenv').config()

//JH-NOTE: create new tmp file and query file location w/ better nomenclature
const remoteOutputFile = '/tmp/testoutput.txt'
const queryFileLocation = '/appl/fp_v6.0.03.15D6/sql/testoutput'
const fpTable = 'TBD- userTable'
const userDataFile = './public/userData.json'

//liveMaterialDeliveryScheduleByTeacher
    //JH-NOTE: do i need to create inital variables here?
    // this.teacher = {
    //     "email": "",
    //     "id": "",
    //     "userType": ""
    // }

const createQuery = (email) =>  {
    let query = "set output" + "'" +
        remoteOutputFile + "'" +
        "\nset lines 0\nset delimiter '!'\nselect @1,@2\n" +
        "from " +
        fpTable + "\nwhere @2 = " +
        email
}

const getOrderNumberByTeacherEmail = async (req, res) => {
    let ssh = new sshClient()
    await ssh.connectSSH()
    await ssh.resetQuery(queryFileLocation)

    //JH-NOTE: respond with dummy response for now
    if (req.params['permissionLevel'] == 'T') {
        res.json("user is teacher!")
    } else {
        res.json("user is not a teacher")
    }
}

const getUserIdByEmail = async (req, res) => {
    let ssh = new sshClient()
    await ssh.connectSSH()
    await ssh.resetQuery(queryFileLocation)
    await ssh.disconnect()
    //JH-NOTE: respond with dummy response for now
    res.json("dummy email response")
}

exports.orderNumberByTeacherEmail = getOrderNumberByTeacherEmail

