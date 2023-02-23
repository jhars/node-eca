const sshClient = require("../helpers/SSHClient");
const getUserIdByEmail = async (req, res) => {
    let ssh = new sshClient()
    await ssh.connectSSH()
    await ssh.resetQuery(queryFileLocation)

    //JH-NOTE: respond with dummy response for now

    res.json("dummy email response")
}