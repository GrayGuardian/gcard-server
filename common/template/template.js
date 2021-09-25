// 该文件通过工具生成，请勿更改

var Template = {};

Template.template_props = require('./manager/template_propsManager').create()
Template.template_error_info = require('./manager/template_error_infoManager').create()

Template.refresh = function () {
	Template.template_props.refresh()
	Template.template_error_info.refresh()
}

module.exports = Template;