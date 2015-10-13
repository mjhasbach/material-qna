"use strict";

let googleImages = require('google-images2');

module.exports = function(req, cb) {
    googleImages.search(
        req.query.query,
        {
            page: req.query.index,
            rawQuery: {
                rsz: 1,
                safe: 'active',
                imgsz: 'large',
                userip: req.ip
            },
            callback: function(err, images) {
                if (err) {
                    return cb(err);
                }

                let image = images[0];

                image ? cb(null, image.url) : cb(new Error('No images found'));
            }
        });
};