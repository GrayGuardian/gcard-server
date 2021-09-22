
const http = require('http');

var HttpClient = function (host, port) {
    this.host = host;
    this.port = port;

    this.token = ''
}
HttpClient.prototype.send = async function (router, data) {
    return new Promise((resolve) => {
        data = data || {}
        var dataPack = {}
        dataPack.router = router;
        dataPack[router] = data;
        var buff = pb.encode("http.rpc", dataPack);
        var options = {
            hostname: this.host,
            port: this.port,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream;',
                'Token': this.token
            }
        };
        var req = http.request(options, (res) => {
            // console.log('STATUS: ' + res.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.on('data', (buff) => {
                let dataPack = pb.decode('http.rpc', buff);
                let router = dataPack.router;
                let data = dataPack[router];

                if (data['token'] != null) {
                    this.token = data['token']
                    // log.print(`更新token >>> ${JSON.stringify(jwt.decode(token))}`)
                }

                // log.print(`HttpClient 接收到数据 >>> ${router} ${JSON.stringify(data)}`)
                resolve({ router: router, data: data })
            });
        });
        req.on('error', function (e) {
            log.error(`HttpClient Error >>> ${e.message}`)
        });
        req.write(buff);
        req.end();
    })
}

module.exports = HttpClient;
