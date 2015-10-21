"use strict";

let _ = require('lodash'),
    http = require('http'),
    path = require('path'),
    multer = require('multer'),
    express = require('express'),
    bodyParser = require('body-parser'),
    imageSearch = require('./image_search'),
    config = require('./server_config'),
    routes = module.exports = {
        isAuthenticated: function(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }

            res.status(401).send('not authorized');
        },
        isAdmin: function(req, res, next) {
            if (req.isAuthenticated() && req.user.get('isAdmin')) {
                return next();
            }

            res.status(401).send('not authorized');
        },
        init: function(app, auth, db) {
            app.set('view engine', 'jade');
            app.set('views', path.join(__dirname, 'views'));
            app.use(bodyParser.json());
            app.use(express.static(path.join(__dirname, '../', 'ui', 'build')));

            app.get('/', function(req, res) {
                if (req.user) {
                    res.locals.user = req.user.get('templateInfo');
                }

                Object.assign(res.locals, {
                    appName: 'Material QnA',
                    corsPort: config.cors.port
                });

                res.render('main');
            });

            app.post('/register', function(req, res) {
                db.models.user.register(req.body.username, req.body.password, function(err, user) {
                    if (err) {
                        return res.status(500).send('Unable to register');
                    }

                    req.logIn(user, function(err) {
                        if (err) {
                            return res.status(500).send('Unable to authenticate');
                        }

                        res.status(200).send(user.get('templateInfo'));
                    });
                });
            });

            app.post('/login', auth.passport.authenticate('local'), function(req, res) {
                res.status(200).send(req.user.get('templateInfo'));
            });

            app.get('/logout', function(req, res) {
                req.logout();
                res.status(200).send();
            });

            app.get('/qna', routes.isAuthenticated, function(req, res) {
                db.qna.get(req, function(err, qna) {
                    res.status(err ? 500 : 200).send(err ? err.message : qna);
                });
            });

            app.put('/qna', routes.isAdmin, multer().single('qna'), function(req, res) {
                if (req.body.id) {
                    db.qna.edit(req.body, function(err) {
                        res.status(err ? 500 : 200).send(err ? err.message : null);
                    });
                }
                else if (req.file) {
                    db.qna.upload(req.file, function(err) {
                        res.status(err ? 500 : 200).send(err ? err.message : null);
                    });
                }
                else {
                    db.qna.add(req.body, function(err) {
                        res.status(err ? 500 : 200).send(err ? err.message : null);
                    });
                }

            });

            app.delete('/question', routes.isAdmin, function(req, res) {
                db.question.remove(req.query.ids, function(err) {
                    res.status(err ? 500 : 200).send(err ? err.message : null);
                });
            });

            app.get('/question/grid/tile', routes.isAuthenticated, function(req, res) {
                db.question.grid.getTile(req, function(err, gridData) {
                    res.status(err ? 500 : 200).send(err ? err.message : gridData);
                });
            });

            app.get('/question/grid/invalid', routes.isAuthenticated, function(req, res) {
                db.question.grid.findInvalid(req.query.ids, function(err, ids) {
                    res.status(err ? 500 : 200).send(err ? err.message : ids);
                });
            });

            app.get('/question/search', routes.isAdmin, function(req, res) {
                db.question.search(req, function(err, question) {
                    res.status(err ? 500 : 200).send(err ? err.message : question);
                });
            });

            app.get('/image', routes.isAdmin, function(req, res) {
                imageSearch(req, function(err, image) {
                    res.status(err ? 500 : 200).send(err ? err.message : image);
                });
            });

            app.get('/user', routes.isAdmin, function(req, res) {
                db.user.get(req.query.id, function(err, user) {
                    res.status(err ? 500 : 200).send(err ? err.message : user);
                });
            });

            app.delete('/user', routes.isAdmin, function(req, res) {
                db.user.remove(req.query.ids, function(err) {
                    res.status(err ? 500 : 200).send(err ? err.message : null);
                });
            });

            app.put('/user', routes.isAuthenticated, function(req, res) {
                db.user.edit(req, function(err, user) {
                    if (err) {
                        res.status(500).send(err.message);
                    }
                    else {
                        if (user && user.get('id') === req.user.get('id')) {
                            req.logIn(user, function(err) {
                                res.status(err ? 500 : 200).send(err ? 'unable to authenticate' : null);
                            });
                        }
                        else {
                            res.status(200).send();
                        }
                    }
                });
            });

            app.get('/user/search', routes.isAdmin, function(req, res) {
                db.user.search(req, function(err, users) {
                    res.status(err ? 500 : 200).send(err ? err.message : users);
                });
            });

            app.put('/answeredQuestion', routes.isAuthenticated, function(req, res) {
                db.answeredQuestion.add(req, function(err) {
                    res.status(err ? 500 : 200).send(err ? err.message : null);
                });
            });

            app.delete('/answeredQuestion', routes.isAdmin, function(req, res) {
                db.answeredQuestion.remove(req.query.ids, function(err) {
                    res.status(err ? 500 : 200).send(err ? err.message : null);
                });
            });

            app.get('/answeredQuestion/search', routes.isAuthenticated, function(req, res) {
                db.answeredQuestion.search(req, function(err, answeredQuestions) {
                    res.status(err ? 500 : 200).send(err ? err.message : answeredQuestions);
                });
            });

            http.createServer(app).listen(config.http.port);
        }
    };