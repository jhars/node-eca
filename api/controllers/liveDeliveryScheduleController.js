const sshClient = require('../helpers/SSHClient')
const sftpClient = require('../helpers/SFTPClient')

require('dotenv').config()

//JH-NOTE: create new tmp file and query file location w/ better nomenclature
const fpTable = 'kitorder'
const queryName = 'kitOrdersByTeacherNumber'

const ssh = new sshClient();
const sftp = new sftpClient();

const findKitOrderNumberByTeacherNumber = async (teacherNumber) =>  {
    let queryStatement = "\nselect @RN,@1 from" + " " + fpTable + "\nwhere @55 = 'Y'\n" + "and @50 <> ''\n" + "and @2 = " + teacherNumber.toString()
    await ssh.generateNewQuery(queryStatement, queryName)
    await sftp.getSingleFile(queryName)
}

const getOrderNumberByTeacherEmail = async (req, res) => {
    const teacherNumber = req.params['teacherNumber']
    const permissionLevel = req.params['permissionLevel']

    await findKitOrderNumberByTeacherNumber(teacherNumber, permissionLevel)
    //JH-NOTE: respond with dummy response for now
    if (req.params['permissionLevel'] == 'T') {
        res.json("user is teacher!")
    } else {
        res.json("user is not a teacher")
    }
}
exports.orderNumberByTeacherEmail = getOrderNumberByTeacherEmail

