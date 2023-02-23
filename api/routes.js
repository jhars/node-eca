'use strict';
const sftp = require('./controllers/sftpController')
const goods = require('./controllers/goodsByKitNumberController')
// const user =  require('./controllers/userController')
const liveDeliverySchedule = require('./controllers/liveDeliveryScheduleController')

module.exports = function (app) {
    app.route('/sftp/list')
        .get(sftp.listFiles)

    app.route('/goods/:kitNumber')
        .get(goods.goodsList)

    //should be refactored to accept query, not URL params
    // app.route('/user/:email/:permissionLevel')
    //     .get(user.)

    //should be refactored to accept query, not URL params
    app.route('/liveDelivery/:email/:permissionLevel')
        .get(liveDeliverySchedule.orderNumberByTeacherEmail)
}