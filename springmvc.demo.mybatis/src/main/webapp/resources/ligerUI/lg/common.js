//获取QueryString的数组
function getQueryString()
{
    var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
    if (result == null)
    {
        return "";
    }
    for (var i = 0; i < result.length; i++)
    {
        result[i] = result[i].substring(1);
    }
    return result;
}
//根据QueryString参数名称获取值
function getQueryStringByName(name)
{
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1)
    {
        return "";
    }
    return result[1];
}
//根据QueryString参数索引获取值
function getQueryStringByIndex(index)
{
    if (index == null)
    {
        return "";
    }
    var queryStringList = getQueryString();
    if (index >= queryStringList.length)
    {
        return "";
    }
    var result = queryStringList[index];
    var startIndex = result.indexOf("=") + 1;
    result = result.substring(startIndex);
    return result;
}
/**
 * 浮点数加法运算
 * @param arg1
 * @param arg2
 * @returns {Number}
 */
function floatAdd(arg1, arg2) {
	var r1, r2, m;
	try{
		r1 = arg1.toString().split(".")[1].length;
	} catch(e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch(e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	return (arg1 * m + arg2 * m) / m;
}

/**
 * 浮点数减法运算
 * @param arg1
 * @param arg2
 * @returns
 */
function floatSub(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch(e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch(e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2));
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 * 浮点数乘法运算
 * @param arg1
 * @param arg2
 * @returns {Number}
 */
function floatMul(arg1, arg2) {    
	var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch(e) {}
	try {
		m += s2.split(".")[1].length;
	} catch(e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 浮点数除法运算
 * @param arg1
 * @param arg2
 * @returns {Number}
 */
function floatDiv(arg1, arg2) {
	var t1 = 0, t2 = 0, r1, r2;    
	try {
		t1 = arg1.toString().split(".")[1].length;
	} catch(e) {}
	try {
		t2 = arg2.toString().split(".")[1].length;
	} catch(e) {}
	with(Math) {
		r1 = Number(arg1.toString().replace(".", ""));
		r2 = Number(arg2.toString().replace(".", ""));
		return (r1 / r2) * pow(10, t2 - t1);
	}
}

(function ($)
{

    //全局事件
    $(".l-dialog-btn").live('mouseover', function ()
    {
        $(this).addClass("l-dialog-btn-over");
    }).live('mouseout', function ()
    {
        $(this).removeClass("l-dialog-btn-over");
    });
    $(".l-dialog-tc .l-dialog-close").live('mouseover', function ()
    {
        $(this).addClass("l-dialog-close-over");
    }).live('mouseout', function ()
    {
        $(this).removeClass("l-dialog-close-over");
    });
    //搜索框 收缩/展开
    $(".searchtitle .togglebtn").live('click',function(){ 
        if($(this).hasClass("togglebtn-down")) $(this).removeClass("togglebtn-down");
        else $(this).addClass("togglebtn-down");
        var searchbox = $(this).parent().nextAll("div.searchbox:first");
        searchbox.slideToggle('fast',function(){
            if(window.grid)
            { 
                window.grid._onResize();
            }
        }); 
    }); 

})(jQuery);

