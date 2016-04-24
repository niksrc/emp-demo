var emailtext = require('./emailtext');
var ctx = require('./ctxapi');
var emp = require('./emp');

module.exports = {
	get: get
};

function get (id, sender, month, cb) {
	getMessages(id, sender, month, function(mails) {
		// getExpenses(messages, function(expenses) {
		// 	var total = getTotalExpense(expenses);
		// 	cb(total);
		// });
	});
}

function getMessages (id, sender, month, cb) {
	var options = {};
	options.from = sender;
	var dates = getDate(month);
	options.date_before = dates.before;
	options.date_after = dates.after;
	options.include_body = 1;

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
	return cb(messages
		.map(function(msg) {
			return emp.process(mail, emailtext(messages.body).join(), function(res) {
				return res;
			});
		}));
}

function getTotalExpense(expenses) {
	expenses
		.reduce(function (first, next) {
			return first + next;
		});
}




