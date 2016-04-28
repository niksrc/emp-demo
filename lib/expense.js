var emailtext = require('./emailtext');
var ctx = require('./ctxapi');
var emp = require('./emp');

module.exports = {
	get: get
};

function get (id, subject, month, cb) {
	getMessages(id, subject, month, function(res) {
		getExpenses(res.body, function(expenses) {
			if (expenses.length < 1) {
				cb(0,[]);
			} else {
				var total = getTotalExpense(expenses);
				cb(total, expenses);
			}
		});
	});
}

function getMessages (id, subject, month, cb) {
	var options = {};
	options.subject = subject;
	var dates = getDate(month);
	options.date_before = dates.before;
	options.date_after = dates.after;
	options.include_body = 1;
	options.limit = 100;
	ctx.accounts(id).messages().get(options, function (err, response) {
		cb(response);
	});
}

function getDate(month) {
	var cur = parseInt(month);
	var next = cur + 1;

	var year = (new Date()).getUTCFullYear();
	var before = new Date(next + '-1' + '-' + year);
	var after = new Date(cur + '-1' + '-' + year);

	return {
		before : toMs(before),
		after: toMs(after)
	};
}

function toMs (date) {
	return Date.parse(date) / 1000;
}

function getExpenses (messages, cb) {
	var expenses = [];

	if(messages.length < 1){
		cb([]);
		return;
	}

	messages
		.forEach(function(msg, index, arr) {
			var text = emailtext(msg);
			emp.process(msg, text.join(), function(res) {
				expenses.push(res.details);
				if(index === arr.length -1){
					cb(expenses);
				}
			});
		});
}

function getTotalExpense(expenses) {
	var sum = 0;
	expenses
		.forEach(function (expense) {
			if(expense.total === expense.total)
				sum += +expense.total;
		});
	return Math.round(sum);
}
