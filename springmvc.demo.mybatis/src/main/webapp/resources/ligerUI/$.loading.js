(function($){
$.extend($.fn, {
	loading:function(setting){
		var options = $.extend({msg:'正在加载数据,请稍候.....',win:'_self'},setting);
		if(options.win=="_self"){
			$("#wait").remove();
		}else{
			$("#wait",top.document).remove();
		}
		if(options.close==true){
			return;
		}
		var wait;
		var div='<div id="loading" style="position: absolute; top: 50%;'
				+' left: 50%;margin:-22px 0 0 -100px;'
				+'padding:13px 0px 10px 30px;width:270px;height:37px;font-size:14px;font-weight:bold;z-index:1002;'
				+'background:url(\'../images/bg_loading.png\') top left no-repeat;" >'
				+'<img width="32" height="32" src="../images/loading_32x32.gif" '
				+' style="margin-right:8px;border: medium none;vertical-align: middle;">'
				+'<span>'+options.msg+'</span></div>';
		if(options.win=="_self"){
			wait=$(div);
		}else{
			wait=$(div,top.document);
		}
		return wait;
	},
	overlay:function(){
		if($.browser.msie&&$.browser.version<7)return;
		$('<div class="ui-widget-overlay overlay" style="height:'+$("body").height()+'px;"/>').appendTo("body");
	}
});
})(jQuery);