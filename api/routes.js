'use strict';
const sftp = require('./controllers/sftpController')
const goods = require('./controllers/goodsByKitNumberController')

module.exports = function (app) {
    app.route('/sftp/list')
        .get(sftp.listFiles)

    app.route('/goods/:kitNumber')
        .get(goods.goodsList)
}