const Koa = require('koa');
const static = require('koa-static');
const range = require('koa-range');

const app = new Koa();

//http
app.use(range);
app.use(static(__dirname + '/public'));

const SERVER_IP = "127.0.0.1"
const SERVER_PORT = 80

app.listen(SERVER_PORT, () => {
    console.log(`Web服务器创建成功 http://${SERVER_IP}:${SERVER_PORT}`);
});
