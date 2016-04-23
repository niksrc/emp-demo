//Fetch text from email body
var html2text = require('html-to-text');

function isHTML(obj) {
	return obj.type === 'text/html';
}

module.exports = function (email) {
	var textEmail = email.body.filter(function (part) {
		return !isHTML(part);
	});

	if(textEmail.length > 0) {
		return textEmail.map(function(part) {
			return part.content;
		})
	}

	return email.body.map(function (part) {
		return html2text.fromString(part.content, {
			tables: true
		});
	})
}


