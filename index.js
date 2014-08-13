var async = require('async');
var request = require('request');

function batchProxy(port, host) {
    if(typeof host === 'undefined') {
        host = '127.0.0.1';
    }
    if(typeof port === 'undefined') {
        port = 80;
    }

    return function(req, res) {
        var requests = req.body.batch || [];

        // run requests in parallel
        async.map(requests, function(r, cb) {
            request({
                url         : (port === 443 ? 'https' : 'http') + '://' + host + ':' + port + r.path,
                method      : typeof r.method !== 'undefined' ? r.method : 'GET',
                body        : r.body,
                headers     : r.headers
            }, function(err, res, body) {
                // if returned content type is JSON the body is parsed
                // otherwise the body will be forwarded as string
                if(res.headers['content-type'] === 'application/json' ||
                    (typeof res.headers['content-type'] === 'string' && res.headers['content-type'].indexOf('application/json;') === 0)) {
                    body = JSON.parse(body);
                } else {
                    body = body.toString();
                }

                var batchObj = {
                    request     : r,
                    response    : {
                        headers     : res.headers,
                        body        : body,
                        status      : res.statusCode
                    }
                };

                cb(null, batchObj);
            });

        }, function(err, responses) {
            if(err) {
                return res.send(500);
            }

            res.status(200).json(responses);
        });
    };
}

exports = module.exports = batchProxy;