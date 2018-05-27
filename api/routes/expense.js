var expenseCtrl = require('./../controllers/expense');

module.exports = function(appObj, authTokenLibObj, schemaValidator){
	appObj.post('/expense', authTokenLibObj.ValidateToken , schemaValidator.validate, expenseCtrl.createExpense);
	appObj.put('/expense/:id', authTokenLibObj.ValidateToken, schemaValidator.validate, expenseCtrl.updateExpense);
	appObj.get('/expense/all/:id', authTokenLibObj.ValidateToken, expenseCtrl.getAllExpense);
	appObj.get('/expense', authTokenLibObj.ValidateToken, expenseCtrl.getCategoryWiseSum);
	appObj.delete('/expense/:id', authTokenLibObj.ValidateToken, expenseCtrl.deleteExpense);
};
