/*
    文件说明：
        icon选取

    接口方法：
        1，打开窗口方法：f_openIconsWin
        2，保存下拉框ligerui对象：currentComboBox

    例子：
        可以这样使用(选择ICON完了以后，会把icon src保存到下拉框的inputText和valueField)：
        onBeforeOpen: function ()
        {
            currentComboBox = this;
            f_openIconsWin();
            return false;
        }
        
        //使用例子
        { display: '图标', name: 'MenuIcon', align: 'left', width: 230, minWidth: 50 , editor: { type: 'select',
            ext:function (rowdata){
                return {
                    onBeforeOpen: function ()
                    {
                        currentComboBox = this;
                        f_openIconsWin();
                        return false;
                    },
                    render: function ()
                    {
                        return rowdata.MenuIcon;
                    }
                };
            } }, 
			render: function (item){
				return "<div style='width:100%;height:100%;'><img src='../" + item.MenuIcon + "' /></div>";
			}
        }

*/

//图标
var jiconlist, winicons, currentComboBox;
$(function ()
{
    jiconlist = $("body > .iconlist:first");
    if (!jiconlist.length) jiconlist = $('<ul class="iconlist"></ul>').appendTo('body');
});
 
$(".iconlist li").live('mouseover', function ()
{
    $(this).addClass("over");
}).live('mouseout', function ()
{
    $(this).removeClass("over");
}).live('click', function ()
{
    if (!winicons) return;
    var src = $("img", this).attr("src");
    src = src.replace(/^([\.\/]+)/, '');
    var editingrow = grid.getEditingRow();
    if (editingrow)
    {
        if (currentComboBox)
        {
            currentComboBox.inputText.val(src);
            currentComboBox.valueField.val(src);
        }
    }
    winicons.hide();
});

function f_openIconsWin()
{
    if (winicons)
    {
        winicons.show();
        return;
    }
    winicons = $.ligerDialog.open({
        title: '选取图标',
        target: jiconlist,
        width: 470, height: 280, modal: true
    });
    if (!jiconlist.attr("loaded"))
    {
        LG.ajax({
            type: 'AjaxSystem',
            method: 'GetIcons',
            loading: '正在加载图标中...',
            data: { HttpContext: true },
            success: function (data)
            {
                for (var i = 0, l = data.length; i < l; i++)
                {
                    var src = data[i];
                    var reg = /(lib\\icons)(.+)/;
                    var match = reg.exec(src);
                    if (!match) continue;
                    var s = "../lib/icons" + match[2].replace(/\\/g, '/');
                    jiconlist.append("<li><img src='" + s + "' /></li>");
                }
                jiconlist.attr("loaded", true);
            }
        });
    }
}


//打开grid
function  f_openGridWin(options)
{
	var g = this, p = this.options;
    options = $.extend({
        title: '选择数据',     //窗口标题
        width: 800,            //窗口宽度     
        height: 420,           //窗口高度
        top: null,
        left: null,
        valueField: null,    //接收表格的value字段名
        textField: null,    //接收表格的text字段名
        grid: null,          //表格的参数 同ligerGrid
        form: null            //搜索表单的参数 同ligerForm
    }, options || {});


    //需要指定表格参数
    if (!options.grid) return;
    
    g.wrapper.addClass("l-text-openselect");

    //三个 ligerui 对象
    var win, grid, form;
    show();
    return false;


    function getGridHeight()
    {
        if (options.grid.height) return options.grid.height;
        var height = options.height - 60;
        if (options.search)
        {
            height -= 70;
        }
        return height;
    }

    function show()
    {
        if (win)
        {
            win.show();
        }
        else
        {
            var panle = $("<div></div>");
            var formPanle = $("<form></form>");
            var gridPanle = $("<div></div>");

            panle.append(formPanle).append(gridPanle);

            options.grid.width = options.grid.width || "99%";
            options.grid.height = getGridHeight();

            //grid
            grid = gridPanle.ligerGrid(options.grid);

            grid.bind('dblClickRow', function (rowdata)
            {
                grid.select(rowdata);
                toSelect();
                win.hide();
            });

            //dialog
            win = $.ligerDialog.open({
                title: options.title,
                width: options.width,
                height: options.height,
                isResize: true,
                top: options.top,
                left: options.left,
                target: panle,
                buttons: [
                 { text: '选择', onclick: function (item, dialog) { toSelect(); dialog.hide(); } },
                 { text: '取消', onclick: function (item, dialog) { dialog.hide(); } }
                ]
            });
            if (options.search)
            {
                //搜索
                form = formPanle.ligerForm(options.search);
                //搜索按钮、高级搜索按钮 
                var containerBtn1 = $('<li style="margin-right:9px"></li>');
                var containerBtn2 = $('<li></li>');
                $("ul:first", formPanle).append(containerBtn1).append(containerBtn2).after('<div class="l-clear"></div>');

                LG.addSearchButtons(formPanle, grid, containerBtn1, containerBtn2);
            }
            else
            {
                formPanle.remove();
            }
        }
    }



    function toSelect(){
        var selected = grid.selected;
        var appended = false;
        var ids = "", texts = "";
        $(selected).each(function (){
            if (appended) ids += p.split;

            ids += this[options.valueField];

            texts += this[options.textField];

            appended = true;
        });
        //为下拉文本框赋值
        if (currentComboBox){
            currentComboBox._changeValue(ids, texts);
        }
    }

};