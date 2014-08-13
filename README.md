express-batch-proxy
===================

Batch API controller for ExpressJS.

Requires ExpressJS v4 and body parser.

## Usage

```javascript
var PORT = 8080;
var HOST = 'example.com'; // optional (default: 127.0.0.1)

var express = require('express'),
    bodyParser = require('body-parser'),
    batchProxy = require('express-batch-proxy');

var app = express();

app.use(bodyParser.json());

/* ... register other controllers ... */

app.post('/batch', batchProxy(PORT, HOST));

app.listen(8080);
```

## Example Request

JSON Request body:
```json
{"batch": [
    {"path": "/user/1234", "method": "GET", "headers": {"User-Agent": "foobar"}},
    {"path": "/user/1234/friends", "method": "GET"}]
}
```

## Example Response

```json
[{
    "request": {"path": "/user/1234", "method": "GET", "headers": {"User-Agent": "foobar"}},
    "response": {
        "headers": {
            "content-type": "application/json",
            "content-length": 1234
        },
        "body": {
            "id": 1234,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@doe.com"
        },
        "statusCode": 200
    }
}, {
    "request": {"path": "/user/1234/friends", "method": "GET", "headers": {}},
    "response": {
        "headers": {
            "content-type": "application/json",
            "content-length": 1234
        },
        "body": {
            data: [
                1235,
                1236,
                1237,
                1238
            ]
        },
        "statusCode": 200
    }
}]
```