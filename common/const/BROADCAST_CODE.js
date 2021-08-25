module.exports = {
    SOCKET_ID: function (idx) {
        return `SOCKET_ID_${idx}`
    },
    SOCKET_CHANNEL: function (key) {
        return `SOCKET_CHANNEL_${key}`
    }
}
