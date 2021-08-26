var Template = {};

let getInfos = function (name) {
    return require("./" + name);
}
let getMap = function (name, key) {
    let map = {}
    let infos = getInfos(name);
    infos.forEach(info => {
        if (info[key] != null) {
            map[info[key]] = info;
        }
        else {
            //未找到标识
        }
    });
    return map;
}

let template_error_info = getMap('template_error_info', "code");

Template.template_error_info = template_error_info;

module.exports = Template;