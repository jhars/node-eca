'use strict';
module.exports = function (app) {
    app.route('/sftp/list')
        .get(sftp.list_all)
}