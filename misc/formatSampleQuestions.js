"use strict";

let fs = require('fs'),
    _ = require('lodash'),
    qnas = require('./sample_questions'),
    formattedQnAs = [];

_.each(qnas, function(qna) {
    let formattedQnA = {
        question: qna.question,
        answers: []
    };

    _.each(_.omit(qna, ['question', 'answer']), function(answer) {
        formattedQnA.answers.push(answer)
    });

    formattedQnA.correctAnswer = formattedQnA.answers.indexOf(qna[qna.answer]);
    formattedQnAs.push(formattedQnA);
});

fs.writeFile('./sample_questions_formatted.json', JSON.stringify(formattedQnAs, null, 2));