var Template = {};

let modelMap = {};

let getDatas = function (name) {
    return require("./data/" + name);
}
let getModel = function (name) {
    return require("./model/" + name);
}
let getMap = function (name, key) {
    let map = {}
    let datas = getDatas(name);
    datas.forEach(data => {
        if (data[key] != null) {
            let tag = {}
            tag[key] = data[key];
            map[data[key]] = Template.createModel(name, tag);
            console.log([data[key]].baseInfo);
        }
    });
    return map;
}

Template.createModel = function (name, tag, data) {
    let model = getModel(name)
    data = data || Template.getData(name, tag);
    console.log(data);
    model = model.create(data);

    modelMap[tag] = model;
    return model;
}
Template.getData = function (name, tag) {
    let datas = getDatas(name);
    for (let index = 0; index < datas.length; index++) {
        const data = datas[index];
        let flag = true
        for (const key in tag) {
            const value = tag[key];
            if (data[key] != value) {
                flag = false;
                break;
            }
        }
        if (flag) {
            return data;
        }
    }
    return null;
}

let error_info = getMap('error_info', "code");
let props = getMap("props", 'id');

Template.error_info = error_info;
Template.props = props;

module.exports = Template;