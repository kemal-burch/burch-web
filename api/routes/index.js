var authTokenLibObj = require('./../lib/tokenauth');
var schemaValidator = require('./../lib/validator');

module.exports = function(app, fs) {
	fs.readdirSync(__dirname).forEach(function (file, indexer) {
		if (file.indexOf('.js') < 0 || file == 'index.js') {
			return true;
		} else {
				require('./' + file)(app, authTokenLibObj, schemaValidator);
		}
	})
}