var expenseCategoryCtrl = require('./../controllers/expenseCategory');

module.exports = function(appObj, authTokenLibObj, schemaValidator){
	appObj.post('/expense_category', authTokenLibObj.ValidateToken, schemaValidator.validate, expenseCategoryCtrl.createExpenseCategory);
	appObj.put('/expense_category/:id',  authTokenLibObj.ValidateToken, schemaValidator.validate, expenseCategoryCtrl.updateExpenseCategory);
	appObj.get('/expense_category',  authTokenLibObj.ValidateToken, expenseCategoryCtrl.getAllExpenseCategory);
	appObj.delete('/expense_category/:id',  authTokenLibObj.ValidateToken, expenseCategoryCtrl.deleteExpenseCategory);
};
