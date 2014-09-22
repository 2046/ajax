'use strict'

var url, router, http;

router = {};
url = require('url');
http = require('http');

http.createServer(function(req, res){
    router[url.parse(req.url).pathname](req, res);
    // var data = '';
    // var uri = 'http://' + (url.parse(req.headers.referer)).host;

    // req.setEncoding('utf-8');

    // req.addListener('data', function(chunk){
    //     data += chunk;
    // });

    // req.addListener('end', function(){
    //     res.writeHead(302, {'Content-Type' : 'text/plain','Location' : uri + '/tests/cross.html'});
    //     res.end();
    // });
}).listen('8080');

router['/get/test'] = function(req, res){
    var query = url.parse(req.url, true).query;

    res.writeHead(200, {'Content-Type' : 'text/plain'});

    if(query){
        res.end(JSON.stringify(query));
    }else{
        res.end();
    }
};

console.log('Server running at http://127.0.0.1:8080');