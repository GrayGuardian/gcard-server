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
let template_props = getMap("template_props", 'id');

Template.template_error_info = template_error_info;
Template.template_props = template_props;

module.exports = Template;