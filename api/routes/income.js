var incomeCtrl = require('./../controllers/income');

module.exports = function(appObj, authTokenLibObj, schemaValidator){
	appObj.post('/income', authTokenLibObj.ValidateToken , schemaValidator.validate, incomeCtrl.createIncome);
	appObj.put('/income/:id', authTokenLibObj.ValidateToken ,schemaValidator.validate, incomeCtrl.updateIncome);
	appObj.get('/income/all/:id', authTokenLibObj.ValidateToken, incomeCtrl.getAllIncome);
	appObj.get('/income', authTokenLibObj.ValidateToken , incomeCtrl.getCategoryWiseSum);
	appObj.delete('/income/:id',authTokenLibObj.ValidateToken , incomeCtrl.deleteIncome);
};
