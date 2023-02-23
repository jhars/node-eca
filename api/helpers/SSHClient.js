const {NodeSSH} = require('node-ssh')
require('dotenv').config()

module.exports = class SSHClient {
    constructor() {
        this.client = new NodeSSH();
    }

    async connectSSH() {
        await this.client.connect({
            host: process.env.HOST,
            username: process.env.USERNAME,
            password: process.env.PASSWORD
        })
    }

    async resetQuery(query, queryFileLocation) {
        //clearQueryFileContents
        await this.client.exec(`:> ${queryFileLocation}`,[])
        //updateQueryString
        await this.client.exec(`echo "${query}" > ${queryFileLocation}`,[])
    }

    async runFPSQLQuery() {
        await this.client.exec('export TERM=linux && cd /appl/fp_v6.0.03.15D6 && ./fpsql testoutput',[])
    }

    async disconnect() {
        this.client.dispose()
    }

}