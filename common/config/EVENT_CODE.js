const EVENT_CODE = {}
EVENT_CODE.SOCKET_CHANNEL = function (key) {
    return `SOCKET_CHANNEL_${key}`
}
// 这里通过pid作为SocketId
EVENT_CODE.SOCKET_ID = function (pid) {
    return EVENT_CODE.SOCKET_CHANNEL(`pid=${pid}`)
}
EVENT_CODE.REDIS_KEY_SET = function (key) {
    return `REDIS_KEY_SET_${key}`
}
EVENT_CODE.REDIS_KEY_DELETE = function (key) {
    return `REDIS_KEY_DELETE_${key}`
}
EVENT_CODE.REDIS_KEY_OUT = function (key) {
    return `REDIS_KEY_OUT_${key}`
}
module.exports = EVENT_CODE
