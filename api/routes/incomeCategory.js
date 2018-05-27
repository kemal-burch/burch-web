var incomeCategoryCtrl = require('./../controllers/incomeCategory');

module.exports = function(appObj, authTokenLibObj, schemaValidator){
	appObj.post('/income_category',  authTokenLibObj.ValidateToken, incomeCategoryCtrl.createIncomeCategory);
	appObj.put('/income_category/:id', authTokenLibObj.ValidateToken, schemaValidator.validate, incomeCategoryCtrl.updateIncomeCategory);
	appObj.get('/income_category',  authTokenLibObj.ValidateToken, incomeCategoryCtrl.getAllIncomeCategory);
	appObj.delete('/income_category/:id',  authTokenLibObj.ValidateToken, incomeCategoryCtrl.deleteIncomeCategory);
};
