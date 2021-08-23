var pb = new (require('./common/pb/pb'))()

var http = require('http');

var post_data = {
    router: 'test',
    test: {}
};//这是需要提交的数据
var content = pb.encode("http.rpc", post_data);
var options = {
    hostname: '127.0.0.1',
    port: 8200,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream;'
    }
};
var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    // res.setEncoding('utf8');
    res.on('data', function (chunk) {
        let dataPack = pb.decode('http.rpc', chunk);
        let router = dataPack.router;
        let data = dataPack[router];
        console.log(router, ">>>", data);
    });
});
req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});
// write data to request body
req.write(content);
req.end();