var userCtrl = require('./../controllers/user');

module.exports = function(appObj, authTokenLibObj, schemaValidator){
	appObj.post('/user', schemaValidator.validate, userCtrl.createUser);
	appObj.post('/user/login', userCtrl.userLogin);
	appObj.put('/user/:id', authTokenLibObj.ValidateToken, schemaValidator.validate, userCtrl.updateUser);
	appObj.delete('/user/:id', userCtrl.deleteUser);
	appObj.delete('/user/logout/:id',  authTokenLibObj.ValidateToken, userCtrl.logoutUser);
	appObj.get('/user/getUserToken/:id/:isApiUser', userCtrl.getUserToken);
};
