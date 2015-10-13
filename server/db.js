"use strict";

let _ = require('lodash'),
    async = require('async'),
    Sequelize = require('sequelize'),
    passportLocalSequelize = require('passport-local-mysequelize'),
    config = require('./server_config'),
    sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, config.db),
    db = {
        sequelize: sequelize,
        models: {
            correctAnswer: sequelize.define('correctAnswer'),
            answeredQuestion: sequelize.define('answeredQuestion'),
            user: passportLocalSequelize.defineUser(
                sequelize,
                {
                    isAdmin: {
                        type: Sequelize.BOOLEAN,
                        defaultValue: false
                    },
                    templateInfo: {
                        type: new Sequelize.VIRTUAL,
                        get: function() {
                            return {
                                username: this.get('username'),
                                isAdmin: this.get('isAdmin')
                            };
                        }
                    }
                }
            ),
            question: sequelize.define('question', {
                image: Sequelize.STRING(2000),
                disabled: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                question: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true
                    }
                }
            }),
            answer: sequelize.define('answer', {
                answer: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true
                    }
                }
            })
        },
        qna: {
            mapAnswers(data, question) {
                return _.map(data.answers, function(answer) {
                    return {
                        id: _.contains(answer.id, '-') ? null : answer.id,
                        questionId: question.get('id'),
                        answer: answer.answer || answer
                    };
                });
            },
            isCorrectAnswer(answer, data) {
                let correctAnswer = data.answers[data.correctAnswer] ||
                    _.result(_.find(data.answers, {id: data.correctAnswer.answerId}), 'answer');

                return answer.get('answer') === correctAnswer;
            },
            get(id, cb) {
                db.models.question.findOne({
                    where: {id},
                    include: [db.models.answer, db.models.correctAnswer]
                }).then(function(qna) {
                    cb(null, qna);
                }).catch(cb);
            },
            add(data, cb) {
                db.models.question.create(data).then(function(question) {
                    async.each(db.qna.mapAnswers(data, question), function(answer, done) {
                        db.models.answer.create(answer).then(function(answer) {
                            if (!db.qna.isCorrectAnswer(answer, data)) {
                                return done();
                            }

                            db.models.correctAnswer
                                .create({questionId: question.get('id'), answerId: answer.get('id')})
                                .then(function() {done();})
                                .catch(done);
                        }).catch(done);
                    }, cb);
                }).catch(cb);
            },
            upload(file, cb) {
                try {
                    var qnas = JSON.parse(file.buffer);
                }
                catch (err) {
                    return cb(new Error('Unable to parse QnA'));
                }

                async.each(qnas, db.qna.add, cb);
            },
            edit(data, cb) {
                db.models.question.findOne({where: {id: data.id}}).then(function(question) {
                    question.update(data).then(function() {
                        let opt = {onDuplicate: 'UPDATE answer=VALUES(answer)'};

                        async.each(db.qna.mapAnswers(data, question), function(answer, done) {
                            db.models.answer
                                .create(answer, opt)
                                .then(function(answer) {
                                    if (!db.qna.isCorrectAnswer(answer, data)) {
                                        return done();
                                    }

                                    db.models.correctAnswer
                                        .update({answerId: answer.get('id')}, {where: {questionId: question.get('id')}})
                                        .then(function() {done();})
                                        .catch(done);
                                }).catch(done);
                        }, function(err) {
                            if (err) {
                                return cb(err);
                            }

                            db.models.answer.destroy({
                                where: {
                                    questionId: question.get('id'),
                                    answer: {$notIn: _.map(data.answers, 'answer')}
                                }
                            }).then(function() {
                                cb();
                            }).catch(cb);
                        });
                    }).catch(cb);
                }).catch(cb);
            },
            remove(ids, cb) {
                db.models.question
                    .destroy({where: {id: {$in: ids}}})
                    .then(function() {cb();})
                    .catch(cb);
            }
        },
        question: {
            getGridData(req, cb) {
                db.models.answeredQuestion.findAll({
                    raw: true,
                    attributes: ['questionId'],
                    where: {UserId: req.user.get('id')}
                }).then(function(answeredQuestions) {
                    let excludedQuestions = _.union(_.map(answeredQuestions, 'questionId'), req.query.exclude);

                    db.models.question.findOne({
                        order: [db.sequelize.fn('RAND')],
                        attributes: ['id', 'image'],
                        where: _.omit({
                            disabled: false,
                            id: excludedQuestions.length ? {$notIn: excludedQuestions} : null
                        }, _.isNull)
                    }).then(function(gridData) {
                        cb(null, gridData);
                    }).catch(cb);
                }).catch(cb);
            },
            search(req, cb) {
                db.models.question.findAndCountAll({
                    order: [[req.query.order.replace('-', ''), _.contains(req.query.order, '-') ? 'DESC' : 'ASC']],
                    attributes: ['id', 'disabled', 'question'],
                    offset: (req.query.page - 1) * req.query.limit,
                    limit: req.query.limit,
                    where: _.omit({
                        id: req.query.id ? req.query.id : undefined,
                        question: req.query.question ? {$like: '%' + req.query.question + '%'} : undefined,
                        image: req.query.missingImage === 'true' ? null : undefined,
                        disabled: req.query.disabled === 'true' ? true : undefined
                    }, _.isUndefined)
                }).then(function(question) {
                    cb(null, question);
                }).catch(cb);
            }
        },
        answeredQuestion: {
            add(req, cb) {
                db.models.answeredQuestion
                    .create(_.merge(req.body, {UserId: req.user.get('id')}))
                    .then(function() {cb();})
                    .catch(cb);
            }
        },
        user: {
            get(id, cb) {
                db.models.user
                    .findOne({where: {id}})
                    .then(function(user) {
                        cb(null, user)
                    }).catch(cb);
            },
            edit(data, cb) {
                db.models.user
                    .update(data, {where: {id: data.id}})
                    .then(function() {cb();})
                    .catch(cb);
            },
            remove(ids, cb) {
                db.models.user
                    .destroy({where: {id: {$in: ids}}})
                    .then(function() {cb();})
                    .catch(cb);
            },
            search(req, cb) {
                db.models.user.findAndCountAll({
                    order: [[req.query.order.replace('-', ''), _.contains(req.query.order, '-') ? 'DESC' : 'ASC']],
                    attributes: ['id', 'isAdmin', 'username'],
                    offset: (req.query.page - 1) * req.query.limit,
                    limit: req.query.limit,
                    where: _.omit({
                        id: req.query.id ? req.query.id : null,
                        username: req.query.username ? {$like: '%' + req.query.username + '%'} : null,
                        isAdmin: req.query.isAdmin === 'true' ? true : null
                    }, _.isNull)
                }).then(function(users) {
                    cb(null, users);
                }).catch(cb);
            }
        }
    };

db.models.question.hasMany(db.models.answer);
db.models.question.hasOne(db.models.correctAnswer, {onDelete: 'cascade'});
db.models.question.belongsToMany(db.models.user, {through: db.models.answeredQuestion, onDelete: 'cascade'});
db.models.answer.belongsTo(db.models.question, {onDelete: 'cascade'});
db.models.correctAnswer.belongsTo(db.models.answer);
db.models.answeredQuestion.belongsTo(db.models.answer);

sequelize.sync();

module.exports = db;