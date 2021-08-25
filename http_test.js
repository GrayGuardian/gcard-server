var pb = new (require('./common/pb/pb'))()
var http = require('http');

const HOST = '127.0.0.1'
const PORT = 8200

var token = '';

var send = async function (router, data) {
    return new Promise((resolve) => {
        data = data || {}
        var dataPack = {}
        dataPack.router = router;
        dataPack[router] = data;
        var buff = pb.encode("http.rpc", dataPack);
        var options = {
            hostname: HOST,
            port: PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream;',
                'Token': token
            }
        };
        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.on('data', function (buff) {
                let dataPack = pb.decode('http.rpc', buff);
                let router = dataPack.router;
                let data = dataPack[router];

                if (data['token'] != null) {
                    token = data['token']
                    console.log("更新token", ">>>", token)
                }

                console.log(router, ">>>", data);
                resolve({ router: router, data: data })
            });
        });
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        req.write(buff);
        req.end();
    })
}
var main = async () => {
    await send('login', { username: 'vsdf123', password: '1djkfls' })
    // await send('register', { username: 'vsdf123', password: '1djkfls' })
}

main();






