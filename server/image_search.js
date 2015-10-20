"use strict";

let googleImage = require('google-image');

module.exports = function(req, cb) {
    new googleImage(req.query.query)
        .page(req.query.index)
        .options({
            safe: 'active',
            imgsz: 'large',
            userip: req.ip
        })
        .search()
        .then(function(images) {
            let image = images[0];

            image ? cb(null, image.url) : cb(new Error('No images found'));
        })
        .catch(cb);
};