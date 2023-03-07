'use strict';
const index = require('./controllers/indexController')
const goods = require('./controllers/goodsByKitNumberController')
const liveDeliverySchedule = require('./controllers/liveDeliveryScheduleController')

module.exports = function (app) {
    app.route('/')
        .get(index.index)

    app.route('/goods/:kitNumber')
        .get(goods.listGoodsByKitNumber)

    //should be refactored to accept query, not URL params
    // format - '/fpFileContainingKeyData/descriptionOfDesiredResponseData/dataFieldUsedFor(initial)Query'
    app.route('/kitaniorder/liveDeliverySchedule/:teacherNumber')
        .get(liveDeliverySchedule.getLiveDeliveryScheduleByTeacherNumber)
}