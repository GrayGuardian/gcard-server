var Template = {};

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 工具生成代码 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
let template_test = require('./manager/template_test').create()
let template_test1 = require('./manager/template_test1').create()
let template_props = require('./manager/template_props').create()
let template_error_info = require('./manager/template_error_info').create()
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 工具生成代码 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

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

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 工具生成代码 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
Template.template_test = template_test
Template.template_test1 = template_test1
Template.template_props = template_props
Template.template_error_info = template_error_info
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 工具生成代码 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

module.exports = Template;