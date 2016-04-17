var natural = require('natural');
var fs = require('fs');

var jobs =  fs.readFileSync('./documents/jobs.txt').toString();
var finance =  fs.readFileSync('./documents/finance.txt').toString();
var newsletter =  fs.readFileSync('./documents/newsletter.txt').toString();
var social =  fs.readFileSync('./documents/social.txt').toString();

var classifier = new natural.BayesClassifier();
train(classifier);

function process(text) {
    var classification = classify(text);
    var result = Object.assign({}, {
        category: classification
    });
    var details = getDetails(text, classification[0].label);
    result = Object.assign({}, result,{details: details});
    return result;
}

function classify(text) {
    return classifier.getClassifications(text);
}

function train(classifier) {
    classifier.addDocument(jobs, 'jobs');
    classifier.addDocument(finance , 'finance');
    classifier.addDocument(newsletter , 'newsletter');
    classifier.addDocument(social, 'social');
    classifier.train();
}


function getDetails(text, category) {
    if(category === 'jobs') {
        strip(text);
    }
    return {};
}

function strip(text) {
    console.log(text);
}










module.exports = {
    process: process
}
