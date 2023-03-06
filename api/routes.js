'use strict';
const index = require('./controllers/indexController')
const sftp = require('./controllers/sftpController')
const goods = require('./controllers/goodsByKitNumberController')
// const user =  require('./controllers/userController')
const liveDeliverySchedule = require('./controllers/liveDeliveryScheduleController')

module.exports = function (app) {
    app.route('/')
        .get(index.index)

    app.route('/sftp/list')
        .get(sftp.listFiles)

    app.route('/goods/:kitNumber')
        .get(goods.listGoodsByKitNumber)

    //should be refactored to accept query, not URL params
    // app.route('/user/:email/:permissionLevel')
    //     .get(user.)

    //should be refactored to accept query, not URL params
    app.route('/liveDelivery/:teacherNumber/:permissionLevel')
        .get(liveDeliverySchedule.orderNumberByTeacherEmail)
}