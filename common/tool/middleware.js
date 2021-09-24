var Middleware = function () {
    this.actionArr = [];
}
Middleware.prototype.use = function (cb) {
    this.actionArr.push(cb);
    return this;
}
Middleware.prototype.disuse = function (cb) {
    let index = this.actionArr.indexOf(cb);
    if (index == -1) return false;
    this.actionArr.splice(index, 1);
    return true;
}
Middleware.prototype.next = async function (ctx, index) {
    ctx = ctx || {};
    index = index || 0;
    if (index < this.actionArr.length) {
        let next = async (i) => {
            i = i || (index + 1)
            await this.next(ctx, i);
        }
        let fun = this.actionArr[index];
        await fun(ctx, next)
    }
    return this;
}
Middleware.prototype.clear = function () {
    this.actionArr = [];
    return this;
}
module.exports = Middleware;