var natural = require('natural');
var fs = require('fs');
var jobs =  fs.readFileSync('./documents/jobs.txt').toString();
var finance =  fs.readFileSync('./documents/finance.txt').toString();
var social =  fs.readFileSync('./documents/social.txt').toString();
var ner = require('ner');

var classifier = new natural.BayesClassifier();
train(classifier);

function process(email, text, cb) {
    var classification = classify(email, text);

    var result = Object.assign({}, {
        category: classification
    });

    getDetails(text, classification[0].label, function(err, entities) {
        result = Object.assign({}, result,{details: {},entities: entities});
        result.details.total = 0;
        var total = text.match(/total.*?(\d\S*)/i)
        result.details.total = (total)? +total[1] : 0;
        result.details.seller = email.addresses.from.name;
        cb(result);
    });
}

function classify(email, text) {
    var sender = email.addresses.from.name + '  ' + email.addresses.email;
    var subject =  email.subject;

    var meta = classifier.getClassifications(sender + '  ' + subject);
    var body =  classifier.getClassifications(text);

    return body;
}

function train(classifier) {
    classifier.addDocument(jobs, 'jobs');
    classifier.addDocument(finance, 'finance');
    classifier.addDocument(social, 'social');
    classifier.train();
}


function getDetails(text, category, cb) {
    if(category === 'finance') {
        return cb(undefined, []);
    } else{
        ner.get({
            port:8080,
            host:'localhost'
        }, text.replace(/\r?\n|\r|\t/g, ' '), function(err, resp) {
            cb(err, resp.entities);
        });
    }
}


function getTemplate(category) {
    var templates =  {
        jobs: ['job', 'location', 'experience']
    }
    return templates[category];
}



module.exports = {
    process: process
}
