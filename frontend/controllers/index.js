var url = require('url');
exports.index = function(req, res, next) {
    res.sendFile('index.html', {root: __dirname+'./../public'});
};