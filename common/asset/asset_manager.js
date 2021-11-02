var fs = require('fs');
let AssetManager = {}

// 客户端资源版本信息
AssetManager.Version = fs.readFileSync(__dirname + '/Version', 'utf8');

module.exports = AssetManager