/**
* jQuery ligerUI 1.1.9
* 
* http://ligerui.com
*  
* Author daomi 2012 [ gd_star@163.com ] 
* 
*/
(function ($)
{
    $.fn.ligerFile = function ()
    {
        return $.ligerui.run.call(this, "ligerFile", arguments);
    };

    $.fn.ligerGetFileManager = function ()
    {
        return $.ligerui.run.call(this, "ligerGetFileManager", arguments);
    };

    $.ligerDefaults.File = {
        onChangeValue: null,
        width: null,
        disabled: false,
        value: null,     //初始化值 
        nullText: null,   //不能为空时的提示
        digits: false,     //是否限定为数字输入框
        number: false    //是否限定为浮点数格式输入框
    };


    $.ligerui.controls.File = function (element, options)
    {
        $.ligerui.controls.File.base.constructor.call(this, element, options);
    };

    $.ligerui.controls.File.ligerExtend($.ligerui.controls.Input, {
        __getType: function ()
        {
            return 'File'
        },
        __idPrev: function ()
        {
            return 'File';
        },
        _init: function ()
        {
            $.ligerui.controls.File.base._init.call(this);
            var g = this, p = this.options;
			
            if (!p.width)
            {
                p.width = $(g.element).width();
            }
            if ($(this.element).attr("readonly"))
            {
                p.disabled = true;
            }
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.inputText = $(this.element);
            //外层
            g.wrapper = g.inputText.wrap('<div class="l-text"></div>').parent();
            
			g.inputText.attr("disabled","disabled");
            g.wrapper.append('<div class="l-text-l"></div><div class="l-text-r"></div>');

            if (!g.inputText.hasClass("l-text-field"))
                g.inputText.addClass("l-text-field");
            this._setEvent();
            g.set(p);
            g.checkValue();
            g.handleFileUpload(p.fields,g.inputText)
        },
        _getValue: function ()
        {
            return this.inputText.val();
        },
        _setNullText: function ()
        {
            this.checkNotNull();
        },
        checkValue: function ()
        {
            var g = this, p = this.options;
            var v = g.inputText.val();
            if (p.number && !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(v) || p.digits && !/^\d+$/.test(v))
            {
                g.inputText.val(g.value || 0);
                return;
            } 
            g.value = v;
        },
        checkNotNull: function ()
        {
            var g = this, p = this.options;
            if (p.nullText && !p.disabled)
            {
                if (!g.inputText.val())
                {
                    g.inputText.addClass("l-text-field-null").val(p.nullText);
                }
            }
        },
        _setEvent: function ()
        {
            var g = this, p = this.options;
            g.inputText.bind('blur.textBox', function ()
            {
                g.trigger('blur');
                g.checkNotNull();
                g.checkValue();
                g.wrapper.removeClass("l-text-focus");
            }).bind('focus.textBox', function ()
            {
                g.trigger('focus');
                if (p.nullText)
                {
                    if ($(this).hasClass("l-text-field-null"))
                    {
                        $(this).removeClass("l-text-field-null").val("");
                    }
                }
                g.wrapper.addClass("l-text-focus");
            })
            .change(function ()
            { 
                g.trigger('changeValue', [this.value]);
            });
            g.wrapper.hover(function ()
            {
                g.trigger('mouseOver');
                g.wrapper.addClass("l-text-over");
            }, function ()
            {
                g.trigger('mouseOut');
                g.wrapper.removeClass("l-text-over");
            });
        },
        _setDisabled: function (value)
        {
            if (value)
            {
                this.inputText.attr("readonly", "readonly");
                this.wrapper.addClass("l-text-disabled");
            }
            else
            {
                this.inputText.removeAttr("readonly");
                this.wrapper.removeClass('l-text-disabled');
            }
        },
        _setWidth: function (value)
        {
            if (value > 20)
            {
                this.wrapper.css({ width: value });
                this.inputText.css({ width: value - 4 });
            }
        },
        _setHeight: function (value)
        {
            if (value > 10)
            {
                this.wrapper.height(value);
                this.inputText.height(value - 2);
            }
        },
        _setValue: function (value)
        {
            if (value != null)
                this.inputText.val(value);
        },
        _setLabel: function (value)
        {
            var g = this, p = this.options;
            if (!g.labelwrapper)
            {
                g.labelwrapper = g.wrapper.wrap('<div class="l-labeltext"></div>').parent();
                var lable = $('<div class="l-text-label" style="float:left;">' + value + ':&nbsp</div>');
                g.labelwrapper.prepend(lable);
                g.wrapper.css('float', 'left');
                if (!p.labelWidth)
                {
                    p.labelWidth = lable.width();
                }
                else
                {
                    g._setLabelWidth(p.labelWidth);
                }
                lable.height(g.wrapper.height());
                if (p.labelAlign)
                {
                    g._setLabelAlign(p.labelAlign);
                }
                g.labelwrapper.append('<br style="clear:both;" />');
                g.labelwrapper.width(p.labelWidth + p.width + 2);
            }
            else
            {
                g.labelwrapper.find(".l-text-label").html(value + ':&nbsp');
            }
        },
        _setLabelWidth: function (value)
        {
            var g = this, p = this.options;
            if (!g.labelwrapper) return;
            g.labelwrapper.find(".l-text-label").width(value);
        },
        _setLabelAlign: function (value)
        {
            var g = this, p = this.options;
            if (!g.labelwrapper) return;
            g.labelwrapper.find(".l-text-label").css('text-align', value);
        },
        updateStyle: function ()
        {
            var g = this, p = this.options;
            if (g.inputText.attr('disabled') || g.inputText.attr('readonly'))
            {
                g.wrapper.addClass("l-text-disabled");
                g.options.disabled = true;
            }
            else
            {
                g.wrapper.removeClass("l-text-disabled");
                g.options.disabled = false;
            }
            if (g.inputText.hasClass("l-text-field-null") && g.inputText.val() != p.nullText)
            {
                g.inputText.removeClass("l-text-field-null");
            }
            g.checkValue();
        },
        
        //处理上传
		handleFileUpload:function(fields,element){
			var field;
			$.each(fields,function(i,dom){
				if(element[0].id == dom.name)field = dom;
			});
			var uploadBrowseId = "liger_uploadBrowse_"+field.name;
			var uploadSubmitId = "liger_uploadSubmit_"+field.name;
			if(field.upload){
				if(field.upload.uploadBrowseId)uploadBrowseId=field.upload.uploadBrowseId;
				if(field.upload.uploadSubmitId)uploadSubmitId=field.upload.uploadSubmitId;
			}
			var setting = field.upload;
			var liger_upload = new AjaxUpload("#"+uploadBrowseId,{
				 action:setting.action,  
				 autoSubmit:setting.autoSubmit!="undefined"?setting.autoSubmit:false,  
				 name:setting.name,  
				 onChange:function(file, extension){
					 setting.onChange?setting.onChange.call(this,file,extension):element.val(file);
				 },
				 onComplete:function(data,ex){
					 if(setting.onComplete){
						 setting.onComplete.call(this,data,ex); 
					 }else{
						 var tip = $.ligerDialog.tip({ title: '提示信息',timeout:1200,content: '上传成功!' });
							tip.show();
							setTimeout(function (){tip.hide();},1500);
					 }
				 }
			});
			
			if(!field.upload.autoSubmit){
				$("#"+uploadSubmitId).click(function(){
					if(setting.beforeSubmit){
						setting.beforeSubmit.call(this);
					}
					
					if(element.val()!="" && element.val()!="undefined"&& element.val()!=null){
						liger_upload.submit();
					}else{
						var tip = $.ligerDialog.tip({ title: '提示信息',timeout:1200,content: '请浏览您要上传的文件!' });
				  	    tip.show();
				  	    setTimeout(function (){tip.hide();},1500);
					}
				});
			}
			
		}
    });
})(jQuery);