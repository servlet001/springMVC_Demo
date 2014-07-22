
jQuery.validator.addMethod("integer", function(value, element) {
	return this.optional(element) || (/^-?\d+$/.test(value));
}, "只能输入数字!");
jQuery.validator.addMethod("imageFile",function(value, element){
	return this.optional(element) || /(.jpg|.jpeg|.gif|.bmp|.png)$/i.test(value);
}, "图片文件格式错误");

//正数验证
jQuery.validator.addMethod("positive", function(value, element) {
	if (value > 0) {
		return true;
	} else {
		return false;
	}
}, "请输入合法的正数!");

// 正整数验证
jQuery.validator.addMethod("positiveInteger", function(value, element) {
	var tel = /^[1-9]\d*$/;
	return this.optional(element) || (tel.test(value));
}, "请输入合法的正整数!");

// 手机号码验证
jQuery.validator.addMethod("mobile", function(value, element) {
	var length = value.length;
	return this.optional(element) || (/^[1][3,5,8][0-9]{9}$/.test(value));
}, "手机号码格式错误,请重新输入!");
//图片类型
jQuery.validator.addMethod("picture", function(value, element) {
	var length = value.length;
	return this.optional(element) || (/(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(value));
}, "图片类型格式,请重新输入!");

// 电话号码验证
jQuery.validator.addMethod("phone", function(value, element) {
	var phone = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
	return this.optional(element) || (phone.test(value));
}, "电话号码格式错误,请重新输入!");

// 邮政编码验证
jQuery.validator.addMethod("zipCode", function(value, element) {
	var zip = /^[0-9]{6}$/;
	return this.optional(element) || (zip.test(value));
}, "邮政编码格式错误,请重新输入!");

// 若指定元素为不为空则此元素也为必填
jQuery.validator.addMethod("requiredTo", function(value, element, param) {
	var requiredTo = $(param).val();
	if(requiredTo != "") {
		return value != "";
	} else {
		return true;
	}
}, "此内容为必填项,请输入!");

// 指定元素与此元素必须填写其中一项
jQuery.validator.addMethod("requiredOne", function(value, element, param) {
	var requiredOne = $(param).val();
	if(requiredOne == "") {
		return value != "";
	} else {
		return true;
	}
}, $.validator.format("两项必须填写一项!"));

// 用户名字符串验证
jQuery.validator.addMethod("username", function(value, element) {
	return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "只允许包含中文、英文、数字和下划线!");

// 中文字符串验证
jQuery.validator.addMethod("chinese", function(value, element) {
	return this.optional(element) || /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(value);
}, "只允许包含中文字符串!");

// 字符串前缀验证
jQuery.validator.addMethod("prefix", function(value, element, param) {
	var prefix = new RegExp("^" + param);
	return this.optional(element) || (prefix.test(value));
}, $.validator.format("请输入以 {0} 开头的字符串!"));

// 验证值不允许与特定值等于
jQuery.validator.addMethod("notEqual", function(value, element, param) {
	return value != param;
}, $.validator.format("输入值不允许为{0}!"));

//两项必须相等
jQuery.validator.addMethod("equalTo", function(value, element, param) {
	var requiredOne = $(param).val();
	if(requiredOne == value) {
		return true;
	} else {
		return false;
	}
}, $.validator.format("两项必须相等!"));