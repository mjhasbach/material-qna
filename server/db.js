"use strict";

let _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    Sequelize = require('sequelize'),
    passportLocalSequelize = require('passport-local-mysequelize'),
    config = require('./server_config'),
    sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, config.db),
    db = {
        sequelize: sequelize,
        models: {
            answeredQuestion: sequelize.define('answeredQuestion'),
            correctAnswer: sequelize.define('correctAnswer', {
                questionId: {
                    type: Sequelize.INTEGER,
                    unique: true
                }
            }),
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
        createAdminIfNoUsersExist() {
            let username = 'admin',
                password = 'password';

            db.models.user.count().then(function(count) {
                if (count < 1) {
                    db.models.user.register(username, password, function(err, user) {
                        if (err) {
                            throw new Error('Unable to create administrator');
                        }

                        db.models.user.update({isAdmin: true}, {where: {id: user.get('id')}}).then(function() {
                            console.log(`Administrator created | Username: ${username} | Password: ${password}`);
                        }).catch(function() {
                            throw new Error('Unable to make user an administrator');
                        });
                    });
                }
            }).catch(function() {
                throw new Error('Unable to get user count');
            });
        },
        getOrder(req) {
            return [[req.query.order.replace('-', ''), _.contains(req.query.order, '-') ? 'DESC' : 'ASC']];
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
                let correctAnswer = data.correctAnswer ?
                    data.answers[data.correctAnswer] ||
                    _.result(_.find(data.answers, {id: data.correctAnswer.answerId}), 'answer') :
                    false;

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
                                        .upsert({questionId: question.get('id'), answerId: answer.get('id')})
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
                                if (data.correctAnswer) {
                                    cb();
                                }
                                else {
                                    db.models.correctAnswer.destroy({
                                        where: {questionId: question.get('id')}
                                    }).then(function() {
                                        cb();
                                    }).catch(cb);
                                }
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
                    let excludedQuestions = _.union(
                        _.map(answeredQuestions, 'questionId'),
                        _.isString(req.query.exclude) ? [req.query.exclude] : req.query.exclude
                    );

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
                    order: db.getOrder(req),
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
            },
            remove(ids, cb) {
                db.models.answeredQuestion
                    .destroy({where: {questionId: {$in: ids}}})
                    .then(function() {cb();})
                    .catch(cb);
            },
            search(req, cb) {
                db.models.answeredQuestion.findAndCountAll({
                    order: db.getOrder(req),
                    attributes: [
                        'questionId',
                        'updatedAt',
                        [
                            sequelize.fn('DATE_FORMAT', sequelize.col('answeredQuestion.updatedAt'), '%m/%d/%Y'),
                            'formattedDate'
                        ]
                    ],
                    offset: (req.query.page - 1) * req.query.limit,
                    limit: req.query.limit,
                    include: [
                        {
                            model: db.models.user,
                            attributes: ['username']
                        },
                        {
                            model: db.models.question,
                            attributes: ['question']
                        },
                        {
                            model: db.models.answer,
                            attributes: ['answer']
                        }
                    ],
                    where: _.omit({
                        questionId: req.query.questionId ? req.query.questionId : null,
                        answerId: req.query.answerId ? req.query.answerId : null,
                        UserId: req.query.UserId ? req.query.UserId : null,
                        updatedAt: req.query.from || req.query.to ? _.omit({
                            $gt: req.query.from ? new Date(req.query.from) : null,
                            $lt: req.query.to ? moment(req.query.to).add(1, 'day').toDate() : null
                        }, _.isNull) : null
                    }, _.isNull)
                }).then(function(answeredQuestions) {
                    cb(null, answeredQuestions);
                }).catch(cb);
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
                    order: db.getOrder(req),
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

db.models.question.hasMany(db.models.answer, {onDelete: 'cascade'});
db.models.question.hasOne(db.models.correctAnswer, {onDelete: 'cascade', foreignKey: 'questionId'});
db.models.question.belongsToMany(db.models.user, {through: db.models.answeredQuestion, onDelete: 'cascade'});
db.models.answer.belongsTo(db.models.question);
db.models.correctAnswer.belongsTo(db.models.answer);
db.models.answeredQuestion.belongsTo(db.models.user);
db.models.answeredQuestion.belongsTo(db.models.question);
db.models.answeredQuestion.belongsTo(db.models.answer);

sequelize.sync().then(db.createAdminIfNoUsersExist);

module.exports = db;