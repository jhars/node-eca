const sshClient = require('../helpers/SSHClient');
const sftpClient = require('../helpers/SFTPClient');
const jsonFormatter = require('../helpers/JSONFormatter');
const kitOrderDataMap = require('../dataMaps/kitOrder.js');
const kitAniOrderDataMap = require('../dataMaps/kitAniOrder.js');

// require('dotenv').config(); // can probably be deleted

const ssh = new sshClient();
const sftp = new sftpClient();
const jsonData = new jsonFormatter();

// leading func name w/ 'query' implies querying filepro DB
const queryKitOrderNumberByTeacherNumber = async (teacherNumber) =>  {
    const fpFileName = 'kitorder';
    const queryName = 'kitOrdersByTeacherNumber';

    let selectFields = `@${kitOrderDataMap.kitOrderNumber}`;
    let queryStatement =`\nselect ${selectFields}` +
        `\nfrom ` + fpFileName +
        `\nwhere @${kitOrderDataMap.teacherNumber} = ` + teacherNumber.toString() +
        `\nand @${kitOrderDataMap.isLiveOrder} = 'Y'` +
        `\nand @${kitOrderDataMap.dateAniOrderProcessed} <> ''`;

    await ssh.generateNewQuery(queryStatement, queryName)
    await ssh.runFPSQLQuery(queryName)
    return await sftp.readQueryDataResult(queryName)
}

const queryAniOrderNumberByKitOrderNumber = async (kitOrderNumber) =>  {
    const fpFileName = 'kitaniorder';
    const queryName = 'kitAniOrderByKitOrderNumber';

    let selectFields = `@${kitAniOrderDataMap.kitOrderNumber},@${kitAniOrderDataMap.aniCode},@${kitAniOrderDataMap.orderCode}`;
    let queryStatement =`\nselect ${selectFields}` +
        `\nfrom ` + fpFileName +
        `\nwhere @${kitAniOrderDataMap.kitOrderNumber} = ` + kitOrderNumber.toString();

    await ssh.generateNewQuery(queryStatement, queryName)
    await ssh.runFPSQLQuery(queryName)
    return await sftp.readQueryDataResult(queryName)
}

const getKitAniOrderNumberByTeacherNumber = async (req, res) =>  {
    const teacherNumber = req.params['teacherNumber']
    const kitOrderNumber = await queryKitOrderNumberByTeacherNumber(teacherNumber);
    const formattedKitOrderNumberData = jsonData.transformQueryResultsToArray(kitOrderNumber);

    const kitAniOrderNumber = await queryAniOrderNumberByKitOrderNumber(formattedKitOrderNumberData[0]);
    const kitAniOrderDataArray = jsonData.transformQueryResultsToArrayOfArrays(kitAniOrderNumber)
    //JH-NOTE: proabably makes sense to do some formatting here, as this data will ultimately be served directly to CS Site
    res.json(kitAniOrderDataArray)
}

const createLiveDeliverySchedule = (data) => {
    let jsonObject = {
        "customer_number": "",
        "kit_title": "",
        "kit_number": "",
        "kit_start_date": "",
        "live_item_description": "",
        "quantity": "",
        "lesson_number": "",
        "delivery_window": ""
    }

    return jsonObject;
}
// ############################################################# //
// ############### Could Be Useful Later ####################### //

// const getOrderNumberByTeacherNumber = async (req, res) => {
//     const teacherNumber = req.params['teacherNumber'];
//     const permissionLevel = req.params['permissionLevel'];
//
//     const kitOrderNumber = await queryKitOrderNumberByTeacherNumber(teacherNumber);
//     const formattedData = jsonData.transformQueryResultsToArray(kitOrderNumber);
//
//     if (permissionLevel == 'T') {
//         // ["orderNumber"]
//         res.json(formattedData[0])
//     } else {
//         res.json("user is not a teacher, data: " + data)
//     }
// }
// ############################################################# //

// exports.getOrderNumberByTeacherNumber = getOrderNumberByTeacherNumber
exports.getKitAniOrderNumberByTeacherNumber = getKitAniOrderNumberByTeacherNumber

