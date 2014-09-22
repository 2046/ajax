var url = require('url');
var http = require('http');
var qs = require('querystring');
var i = 0;

http.createServer(function(req, res){
    var data = '';
    var uri = 'http://' + (url.parse(req.headers.referer)).host;

    req.setEncoding('utf-8');

    req.addListener('data', function(chunk){
        data += chunk;
    });

    req.addListener('end', function(){
        setTimeout(function(){
            res.writeHead(302, {'Content-Type' : 'text/plain','Location' : uri + '/tests/cross.html'});
            res.end();
        }, 1000);
    });
}).listen('8089');

console.log('Server running at http://127.0.0.1:8089');