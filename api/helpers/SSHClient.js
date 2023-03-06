const {NodeSSH} = require('node-ssh')
require('dotenv').config()

const connectionOptions = {
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: 22
}

module.exports = class SSHClient {
    constructor() {
        this.client = new NodeSSH();
    }

    async connectSSH() {
        await this.client.connect(connectionOptions)
    }

    async generateNewQuery(query, fpQueryName) {
        await this.connectSSH()
        const fileLocation = '/appl/fp_v6.0.03.15D6/sql/' + fpQueryName
        //clearQueryFileContents
        await this.client.exec(`:> ${fileLocation}`,[])
        //updateQueryString
        const queryString = this.createQuery(fpQueryName, query)
        await this.client.exec(`echo "${queryString}" > ${fileLocation}`,[])
        await this.disconnect()
        console.log('ssh disconnected')
    }

    async runFPSQLQuery(queryName) {
        await this.connectSSH()
        await this.client.exec('export TERM=linux && cd /appl/fp_v6.0.03.15D6 && ./fpsql ' + queryName,[])
        await this.disconnect()
    }

    async disconnect() {
        this.client.dispose()
    }
    //Update to JSON file format
     createQuery(queryName, queryStatement) {
         const queryString = "set output " +"'/tmp/" + queryName + ".txt'" + "\nset lines 0\nset delimiter '!'" + queryStatement
         console.log("query string: " + queryString)
         return queryString

    }

}