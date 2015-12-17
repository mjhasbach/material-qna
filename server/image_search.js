"use strict";

let config = require('./server_config'),
    Search = require('bing.search'),
    search = new Search(config.bing.accountKey);

module.exports = function(req, cb) {
    search.images(
        req.query.query,
        {
            top: 1,
            skip: req.query.index
        },
        function(err, images) {
            if (err) {
                return cb(err);
            }

            let image = images[0];

            image ? cb(null, image.url) : cb(new Error('No images found'));
        }
    );
};