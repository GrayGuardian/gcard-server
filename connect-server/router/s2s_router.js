var Router = function () { }

Router.prototype.test = async function (socket, s2sdata, data, next) {
    console.log("test logic event")
    next({ code: SUCCESS_CODE });
}

module.exports = Router;