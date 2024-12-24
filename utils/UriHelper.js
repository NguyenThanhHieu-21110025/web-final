const getLocalUri = (path = "") => {
    return 'http://' + process.env.APP_HOST + ':' + process.env.APP_PORT + "/" + path;
}
module.exports = getLocalUri;