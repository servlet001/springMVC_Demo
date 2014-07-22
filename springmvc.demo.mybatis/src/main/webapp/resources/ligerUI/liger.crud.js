/**
 * @author luoting
 * @version 1.0.0
 */
var globalDatagrid = null;
(function($){
	var options={
		saveUrl:"",									// 新增url
		updateUrl:"",								// 修改url
		removeUrl:"",								// 删除url
		formInitUrl:"",                             // 初始化表单验证信息
		tipTimeout:5000,							// 提示消息显示的时间（毫秒）
		grid:{
			addable:true,							// 是否可新增
			updateable:true,						// 是否可修改
			deleteable:true,						// 是否可删除
			bulkDeleteable:false,					// 是否可以批量删除
			idField:null,							// 主键列
			render:null,							// 单元格渲染
			
	        title: null,							// 标题
	        align:'center',
	        width: 'auto',                          // 宽度值
	        height: 'auto',                         // 宽度值
	        dataUrl: false,                         // ajax url
	        pagination: true,                       // 是否分页
	        pageSize: 10,                           // 每页默认的结果数
	        pageList: [10, 20, 30, 40, 50],  		// 可选择设定的每页结果数
	        checkbox: false,                        // 是否显示复选框
	        singleSelect:false,						// 是否单选模式
	        rowHeight: 26,                           //行默认的高度
	        headerRowHeight: 27,                    //表头行的高度
	        
	        pageParmName: 'page',               	// 页索引参数名，(提交给服务器)
	        pagesizeParmName: 'rows',        		// 页记录数参数名，(提交给服务器)
	        sortnameParmName: 'sort',        		// 页排序列名(提交给服务器)
	        sortorderParmName: 'order',     		// 页排序方向(提交给服务器)
	        tree : null,
	        // root: 'rows', //数据源字段名
	        // record: 'total', //数据源记录数字段名
	        
	        toolbars: null,                          // 工具条,参数同 ligerToolbar的
	        validateDelete:function(){return true;}	 // 删除校验，默认校验通过
	     	},
		search:{
			inputWidth: 170, 
			labelWidth: 50, 
			space: 20,
			// field:[{ display: "类别 ", name: "CategoryID", newline: true, type:
			// "select", comboboxName: "CategoryName", options: { valueFieldID:
			// "CategoryID" }, width: 240 }]
			field:[],
			buttons:[],
			beforeSubmit:function(){return true;}},
			// fields:[{ title: "类别 ", field:
			// "CategoryID"(field的字段属性参考ligerForm),
					// gridShow:true,addShow:true,updateable:true }]
			// gridShow:是否在grid里显示,addShow:是否在新增页面里显示,updateable:该字段是否可以被修改
		fields:[],
		dialog:{
			inputWidth: 170, 
			labelWidth: 50, 
			space: 40,
			width: 600, 										// 弹出框宽度
			height: 400,										// 弹出框高度
			addTitle:'新增',										// 弹出框新增标题
			updateTitle:'修改',								// 弹出框修改标题
			addValidate:function(){return true;}, 				// 新增校验方法
			updateValidate:function(){return true;}				// 修改校验方法
		},
		validate:{
			rules:{},
			message:{}
		}
	};
	
	$.fn.crud = function(){
		var render = new Render(this);
		var handle = new Handle(this);
		if(arguments.length == 1 && typeof arguments[0] == "object"){
			this.setting = $.extend(true,options,arguments[0]);
		}else if(arguments.length>=1 || typeof arguments[0] == "string"){
			var methodName = arguments[0];
			return !!eval(methodName)?eval(methodName).call(this,render,handle,arguments):this;
		}
		
		this.setUrl = function(url){
			this.globalURL = url;
		};
		this.getUrl = function(){
			return this.globalURL;
		};
		this.init = function(){
			render.createSearch();
			render.createDatagrid();
			// if(options.validate&&options.validate.rules){
			// handle.validate();
			// }
		};
		// 对外接口，返回datagrid
		function getDatagrid(render,handle,args){
			return options.globalDatagrid;
		}
		function getSearchform(){
			return options.globalSearchform;
		}
		this.getRender = function(){
			return render;
		};
		this.getHandle = function(){
			return handle;
		};
		this.init();
		return this;
	};
	
	/**
	 * 页面构造器,创建页面上各种组件
	 */
	function Render(plugin){
		this.plugin = plugin;
	}
	
	Render.prototype.createDatagrid=function(){
		columns = $([]),$this = this,selectObj=null,buttons=null;
		// frozenColumns = $([])
		buttons = $([]);
		
		// 判断是否可以进行新增操作
		if(options.grid.addable){
			buttons = buttons.add({
				id:'btnAdd',
				text:'新增',
				icon:'add',
				click:$this.plugin.getHandle().edit
			});
		}
		
		// 判断是否可以进行删除操作
		if(options.grid.deleteable){
			buttons = buttons.add({
				id:'btnDelete',
				text:'删除',
				icon:'delete',
				click:$this.plugin.getHandle().remove
			});
		}
		
		// 判断是否可以进行修改操作
		if(options.grid.updateable){
			buttons = buttons.add({
				id:'btnModify',
				text:'修改',
				icon:'modify',
				click:$this.plugin.getHandle().edit
			});
		}
		
		if(this.plugin.setting.grid.toolbars!=null){
			buttons = buttons.add($(this.plugin.setting.grid.toolbars.items));
		}
		
		
		// fields:[{name:'First
		// Name',field:'firstName',class:'',show:true,frozen:false,type:'input',required,validateType:'',sortable:true}]
		// show:是否在grid里显示,frozen:是否在grid里冻结
		
		$.each(options.fields,function(i,f){
			var c = $.extend({display:f.title,name:f.field,width:f.gridWidth,checkbox:false},f);
			// if(f.frozen == true){
			// frozenColumns = frozenColumns.add(c);
			// }else
			if(f.gridShow != false){
				columns = columns.add(c);				
			}
			
		});
		
		globalDatagrid = options.globalDatagrid = $(this.plugin.selector).ligerGrid({
			title:options.grid.title,
			url:options.grid.dataUrl,
			pageSize: options.grid.pageSize, 
			pageSizeOptions:options.grid.pageList,
            width: options.grid.width,
            height: options.grid.height, 
            checkbox: options.grid.checkbox,
            columns:columns,
            usePager: options.grid.pagination,
            render:options.grid.render,
            align:options.grid.align,
            rowHeight:options.grid.rowHeight,                           
	        headerRowHeight:options.grid.headerRowHeight,   
            
            pageParmName: options.grid.pageParmName,               		// 页索引参数名，(提交给服务器)
	        pagesizeParmName: options.grid.pagesizeParmName,        	// 页记录数参数名，(提交给服务器)
	        sortnameParmName: options.grid.sortnameParmName,        	// 页排序列名(提交给服务器)
	        sortorderParmName: options.grid.sortorderParmName,     		// 页排序方向(提交给服务器)
	        root: options.grid.root,                       				// 数据源字段名
	        record: options.grid.record,                    			// 数据源记录数字段名
	        tree: options.grid.tree,
	        
	        onCheckRow: function(checked, rowdata, rowindex) {
	        	if(options.grid.singleSelect){
	        		if(selectObj==rowindex && !checked){
	        			this.unselect(rowindex);
	        		}else{
	        			for (var rowid in this.records)
	        				this.unselect(rowid);
	        			this.select(rowindex);
	        			selectObj = rowindex;
	        		}
	        	}
            },
            onSelectRow:function(rowdata, rowindex, rowDomElement){
            	if(options.globalDatagrid.getSelectedRows().length==options.globalDatagrid.recordNumber){
            		if(!$(".l-grid-hd-row").hasClass('l-checked')) $(".l-grid-hd-row").addClass('l-checked');
            	}
            	$this.plugin.getHandle().selectHandle();
            	
            },
            onUnSelectRow:function(rowdata, rowindex, rowDomElement){
            	if(options.globalDatagrid.getSelectedRows().length<options.globalDatagrid.recordNumber){
            		if($(".l-grid-hd-row").hasClass('l-checked')) $(".l-grid-hd-row").removeClass('l-checked');
            	}
            	$this.plugin.getHandle().selectHandle();
            },
            onAfterShowData:function(){
            	// 加载完数据判断复选框是否选中，如是，则取消选中
            	$this.plugin.getHandle().initGrid();
            	if($(".l-grid-hd-row").hasClass('l-checked')) $(".l-grid-hd-row").removeClass('l-checked');
            },
            toolbar:{items:buttons}
		});
		
		$this.plugin.getHandle().initGrid();
		$this.plugin.getHandle().createForm();
	};
	
	/**
	 * 创建查询
	 */
	Render.prototype.createSearch = function(){
		if(options.search.field.length==0)return;
		
		var searchDiv = "<div id='mainsearch' style='width:98%'><div class='searchtitle'>" +
				"<span>搜索</span><img src='"+rootPath+"/resources/images/icons/32X32/searchtool.gif' />" +
				"<div class='togglebtn'></div> </div><div class='navline' style='margin-bottom:4px; margin-top:4px;'>" +
				"</div><div class='searchbox'><form ligerform='search-form' id='formsearch' class='l-form'></form></div></div>";
		$(searchDiv).prependTo($(this.plugin.selector).parent());
		var searchPanel= $("#formsearch"),
		selector = $(this.plugin.selector);
		
		var searchField = $.extend(true,[],options.search.field);
		
		// 改变查询表单字段的name属性值
		$.each(searchField,function(i,dom){
			dom.name = "searchForm_"+dom.name;
		});
		
		// 构造form查询表单
		if(options.search.field.length>0){
			
			searchPanel.ligerForm({
				inputWidth: options.search.inputWidth, 
				labelWidth: options.search.labelWidth, 
				space: options.search.space,
				fields:searchField
			});
			// 自定义按钮
			if(options.search.buttons.length>0){
				$.each(options.search.buttons,function(i,n){
					searchPanel.append("<li style='width:100px;text-align:left;'>" +
							"<input type='button' value='"+n.text+"' " +
							"id='"+n.id+"' style=' margin-top: 0px;' class='l-button'/></li> ");
					$("#"+n.id).click(n.handle);
				});
			}
			// 默认按钮：查询、重置
			searchPanel.append("<li style='width:100px;text-align:left;'>" +
				"<input type='button' value='搜索' id='lbtn-query' style=' margin-top: 0px;' class='l-button'/></li> ");
			searchPanel.append("<li style='width:100px;text-align:left;'>" +
				"<input type='button' value='重置' id='lbtn-reset' style=' margin-top: 0px;' class='l-button'/></li> ");
			
			
			$("#lbtn-query").click(function(){
				if(options.search.beforeSubmit){
					if(options.search.beforeSubmit.call(this.searchPanel)){
						var queryFormNode = $("form[ligerform='search-form']");
						var data= $([]);
						data = $.map(options.search.field,function(n,i){
							var temp = {name:null,value:null};
							temp.name = n.name;
							if(n.type=="select"||n.type=="combobox"){
								if(n.options.valueFieldID)temp.value = queryFormNode.find("[name='"+n.options.valueFieldID+"']").val();
								else temp.value = queryFormNode.find("[name='"+searchField[i].name+"']").val();
							}else{
								temp.value = queryFormNode.find("[name='"+searchField[i].name+"']").val();
							}
							return temp;
						});
						var gridManager = selector.ligerGetGridManager(); 
						gridManager.setOptions({parms:data,newPage:1});
						gridManager.loadData(true);
					}
				}
			});
			
			$("#lbtn-reset").click(function(){
				$.map(options.search.field,function(dom,i){
					$("[name=searchForm_"+dom.name+"]").val("");
					if(dom.type=="select" || dom.type=="combobox"){
						$("[name=searchForm_"+dom.name+"_val]").val("");
						//下面是更新表单的样式
			        	updateStyle();
					}
				});
			});
		}
		
		options.globalSearchform = searchPanel;
	};
	
	/**
	 * 页面处理器,处理页面的操作
	 */
	function Handle(plugin){
		this.plugin = plugin;
	}
	
	/**
	 * 删除选中行
	 */
	Handle.prototype.remove=function(){
		var rows = options.globalDatagrid.getSelectedRows();
		if(!options.grid.validateDelete())return ;
		
		if(rows.length>0){
			$.ligerDialog.confirm('是否删除该行', 
				function (yes){
		            if(yes){
						$.ajax({
							url:options.removeUrl,
							dataType:'json',
							data:{ids:$.map(rows,function(n){return n[options.grid.idField];}).join(',')},
							success: function(data){
								if(data.success){
									$this.plugin.getHandle().tip(data);
									options.globalDatagrid.loadData(true);// 重新加载数据
								}else{
									   $this.plugin.getHandle().tip(data);
								 }
							}
						});
		            }
		        });	
		}else{
			var tip = $.ligerDialog.tip({ title: '提示信息',timeout:1200, content: '请选中要删除的行' });
	  	    tip.show();
	  	    setTimeout(function (){tip.hide();}, 1500);
		}
	};

	/**
	 * 新增处理函数
	 */
	Handle.prototype.edit=function(item){
		$(".errorInput").removeClass('errorInput');
		var editFormNode = $("#liger_editform");
		if(item.id == "btnAdd"){
			$.each(options.globalFormData,function(i,n){
				if(n.type=="select"||n.type=="combobox"){
					if(n.options.initValue!==""&&n.options.initValue!="undefined"&&n.options.initValue!=null){
						editFormNode.find("[name='"+n.name+"']").val(n.options.initValue);
					}else{
						editFormNode.find("[name='"+n.name+"']").val("");
						if(n.comboboxName){
							editFormNode.find("[name='"+n.comboboxName+"']").val("");
						}
					}
				}else{
					if(n.initData!==""&&n.initData!="undefined"&&n.initData!=null){
						editFormNode.find("[name='"+n.name+"']").val(n.initData);
					}else{
						if(n.type=="digits") editFormNode.find("[name='"+n.name+"']").val("0");
						else editFormNode.find("[name='"+n.name+"']").val("");
					} 
				} 
				
			});
			//下面是更新表单的样式
        	updateStyle();
			options.globalSaveType="add";
            $this.plugin.getHandle().createDialog(options.dialog.addTitle);
        } else {
        	$.each(options.globalFormData,function(i,n){
    			var o = editFormNode.find("[name='"+n.name+"']").val(options.globalDatagrid.getSelectedRow()[n.name]);
        		if(!n.updateable)editFormNode.find("[name='"+n.name+"']").attr("disabled",true);
			});
        	//下面是更新表单的样式
        	updateStyle();
        	options.globalSaveType="update";
        	$this.plugin.getHandle().createDialog(options.dialog.updateTitle);
        }
		
	};
	/**
	 * 构造form表单
	 */
	Handle.prototype.createForm = function(){
		// 构建editFrame的target
		if(options.grid.addable || options.grid.updateable){
			$("body").append("<div id='liger_editTarget' style='width:550px; margin:3px; display:none;'></div>");
			$("#liger_editTarget").append(" <form id='liger_editform' name='liger_editform'></form>");
			
			var formData = $([]);
			formData = $.map(options.fields,function(dom,i){
				dom = $.extend({addShow:true,updateable:true,addable:true,display:dom.title,
								name:dom.field,width:dom.fieldWidth},dom);
				if(dom.addShow)return dom;
			});
			
			$("#liger_editform").ligerForm({
				inputWidth: options.dialog.inputWidth, 
				labelWidth: options.dialog.labelWidth, 
				space: options.dialog.space,
				fields:formData
			});
			
			options.globalFormData = formData;
		}
	};
	/**
	 * 处理选中checkbox
	 */
	Handle.prototype.selectHandle=function(){
		var removeable = false;
		if($("[toolbarid='btnDelete']").data("del_event") == undefined)$("[toolbarid='btnDelete']").data("del_event",false);
		if(options.grid.bulkDeleteable){
			removeable = options.globalDatagrid.getSelectedRows().length>0;
		}else{
			removeable = options.globalDatagrid.getSelectedRows().length==1;
		}
		
		if(removeable){
    		$("[toolbarid='btnDelete']").hover(function(){$(this).addClass('l-panel-btn-over');}
    											,function(){$(this).removeClass('l-panel-btn-over');});
    		$(".l-icon.l-icon-undelete").removeClass('l-icon-undelete').toggleClass('l-icon-delete');
    		if(!$("[toolbarid='btnDelete']").data("del_event")){
    			$("[toolbarid='btnDelete']").bind('click',$this.plugin.getHandle().remove);
    			$("[toolbarid='btnDelete']").data("del_event",true);	
    		}
    	}else{
    		$(".l-icon.l-icon-delete").removeClass('l-icon-delete').toggleClass('l-icon-undelete');
    		$("[toolbarid='btnDelete']").unbind('mouseenter mouseleave click');
    		$("[toolbarid='btnDelete']").data("del_event",false);
    	}
		
		if(options.globalDatagrid.getSelectedRows().length==1){
    		$("[toolbarid='btnModify']").hover(function(){$(this).addClass('l-panel-btn-over');}
    											,function(){$(this).removeClass('l-panel-btn-over');});
    		$(".l-icon.l-icon-unmodify").removeClass('l-icon-unmodify').toggleClass('l-icon-modify');
    		$("[toolbarid='btnModify']").bind('click',$this.plugin.getHandle().edit);
		}else{
			$(".l-icon.l-icon-modify").removeClass('l-icon-modify').toggleClass('l-icon-unmodify');
    		$("[toolbarid='btnModify']").unbind('mouseenter mouseleave click'); 
		}
	};
	
	/**
	 * 创建dialog
	 */
	Handle.prototype.createDialog=function(title){
		
		if(options._dialog!=null && options._dialog.options.title==title){
			options._dialog.show();
		}else{
			// 增加验证
			this.plugin.getHandle().validateRules();
			if(options.validate&&options.validate.rules){
				this.plugin.getHandle().validate();
			}
			options._dialog = $.ligerDialog.open({
				target:$("#liger_editform"),
				title: title, 
				name:'editItemFrame',
				width: options.dialog.width, 
				height: options.dialog.height,
				buttons:[{text:'确定' ,onclick: function (i, d) { $this.plugin.getHandle().save(); }},
				         {text:'取消' , onclick: function (i, d) {
				        	 //$("input,.l-text,.l-textarea").ligerHideTip(); d.hide();
				        	 d.hide();
				        	 $(".l-text-invalid").removeClass('l-text-invalid'); 
				        	 $(".l-box-select").hide();
				        }}]
			});
			
		   $(".l-dialog-close").bind('mousedown',
				   function(){
	                    $("input").ligerHideTip(); 
	                    options._dialog.hide();
	                    $(".errorInput").removeClass('errorInput');
	                }); 
		   
		   $(".l-dialog-title").bind('mousedown',function()   // 移动dialog时,隐藏tip
	                {$("input").ligerHideTip();});
		}
	};
	
	Handle.prototype.save=function(){
		if(options._globalFormValidator){
			if(!options._globalFormValidator.form())return;
		}
		var editFormNode = $("#liger_editform");
		var url,params={};
		if(options.globalSaveType == "add"){
			if(options.dialog.addValidate()){
				url = options.saveUrl;
				$.map(options.globalFormData,function(n,i){
						if(n.strutsFieldName){
							if(n.type=="select"||n.type=="combobox"){
								if(n.options.valueFieldID)return params[n.strutsFieldName]= editFormNode.find("[name='"+n.options.valueFieldID+"']").val();
								else return params[n.strutsFieldName]=editFormNode.find("[name='"+n.name+"']").val();
							}else{
								return params[n.strutsFieldName]=editFormNode.find("[name='"+n.name+"']").val();
							}
						}else{
							if(n.type=="select"||n.type=="combobox"){
								if(n.options.valueFieldID)return params[n.name]=editFormNode.find("[name='"+n.options.valueFieldID+"']").val();
								else return params[n.name]=editFormNode.find("[name='"+n.name+"']").val();
							}else{
								return params[n.name]=editFormNode.find("[name='"+n.name+"']").val();
							}
						}
					}).join(',');
			}else{
				return;
			}
		}else if(options.globalSaveType == "update"){
			if(options.dialog.updateValidate()){
				// options._dialog.hide();
				url = options.updateUrl;
				$.map(options.globalFormData,function(n,i){
						if(n.updateable){
							if(n.strutsFieldName){
								if(n.type=="select"||n.type=="combobox"){
									if(n.options.valueFieldID)return params[n.strutsFieldName]=editFormNode.find("[name='"+n.options.valueFieldID+"']").val();
									else return params[n.strutsFieldName]=editFormNode.find("[name='"+n.name+"']").val();
								}else{
									return params[n.strutsFieldName]=editFormNode.find("[name='"+n.name+"']").val();
								}
							}else{
								if(n.type=="select"||n.type=="combobox"){
									if(n.options.valueFieldID)return params[n.name]=editFormNode.find("[name='"+n.options.valueFieldID+"']").val();
									else return params[n.name]=editFormNode.find("[name='"+n.name+"']").val();
								}else{
									return params[n.name]=editFormNode.find("[name='"+n.name+"']").val();
								}
							}
						}
						return ;
					}).join(',');
			}else{
				return;
			}
		}else{
			return;
		}
		$.ajax({
			   type: "POST",
			   url: url,
			   dataType:'json',
			   async: false,
			   data: params,
			   success: function(data){
				   // 回调
				   if(data.valid==false){
						$.each(data.fields,function(i,f){
							$this.plugin.getHandle().showServerSideValidationError(f.field,f.defMessage);
						});
					   // 验证失败{"fields":[{"field":"email","rejectedValue":"servlet.1@163.com","defMessage":"the
						// length must be in 5-10."}],"valid":false}
				   }else if(data.success){
						   options._dialog.hide();
						   $this.plugin.getHandle().tip(data);
						   options.globalDatagrid.loadData(true);// 重新加载数据
				   }else{
					   $this.plugin.getHandle().tip(data);
				   }
			   }
			});
	};
	
	Handle.prototype.showServerSideValidationError=function(fieldName,message){
        var target =$("#liger_editform").find("[name='" + fieldName + "']");
        $this.plugin.getHandle().errorMessageHandle(target,message);
        target.focus();
	};
	// 表单验证不通过时提示消息
	Handle.prototype.errorMessageHandle=function(element,message){
		var element = $(element);
		if (element.hasClass("l-textarea")){
			//element.ligerTip({content: message}); 
			element.toggleClass('errorInput');
        }else if (element.hasClass("l-text-field")){
        	//element.parent().ligerTip({content: message});
        	element.parent().toggleClass('errorInput');
        }
	};
	
	Handle.prototype.tip=function(data){
	  	if(data.success){
	  		var tip = $.ligerDialog.tip({ title: '提示信息',timeout:1200, content: data.msg });
	  	    tip.show();
	  	    setTimeout(function (){
	  	    		tip.hide();
	  	    		// options.globalDatagrid.loadData(true);
	  	    		//$this.plugin.getHandle().initGrid();
	  	    		if($(".l-grid-hd-row").hasClass('l-checked')) $(".l-grid-hd-row").removeClass('l-checked');
	  	    		if(typeof data == "string") data = eval('(' + data + ')');
	  	    	}, options.tipTimeout);
		}else{
	  		var tip = $.ligerDialog.tip({ title: '提示信息',timeout:1200, content: data.msg });
	  	    tip.show();
	  	    setTimeout(function (){
	  	    		tip.hide();
	  	    	}, options.tipTimeout);
		}
};
	
	Handle.prototype.initGrid=function(){
		if(options.grid.singleSelect){
			$(".l-grid-hd-cell-btn-checkbox").css("display", "none");// 隐藏checkAll
		}
		$("#pageloading").hide();
		
		$(".l-icon.l-icon-delete").removeClass('l-icon-delete').toggleClass('l-icon-undelete');
		$("[toolbarid='btnDelete']").unbind('mouseenter mouseleave click');  
		$("[toolbarid='btnDelete']").data("del_event",false);
		
		$(".l-icon.l-icon-modify").removeClass('l-icon-modify').toggleClass('l-icon-unmodify');
		$("[toolbarid='btnModify']").unbind('mouseenter mouseleave click'); 
	};
	
	Handle.prototype.validate=function(){
		options._globalFormValidator=$("#liger_editform").validate({
			 rules: options.validate.rules,
			 messages: options.validate.messages,
			 /**
			 showErrors:function(errorMap,errorList) {
				$(".errorInput").removeClass('errorInput');
				$("#liger_editform").find(".l-text,.l-textarea").ligerHideTip();
				if(errorList.length>0){
					$.each(errorList,function(i,dom){
						$this.plugin.getHandle().errorMessageHandle(dom.element,dom.message);
					});
					$.ligerDialog.error("存在"+ errorList.length +"个字段验证不通过，请检查!");
				}
			},*/
			 errorPlacement: function (lable, element) {
                 if (element.hasClass("l-textarea")){
                     element.addClass("l-textarea-invalid");
                 }
                 else if (element.hasClass("l-text-field")){
                	 if(element.prev(".l-text-combobox")) element.prev(".l-text-combobox").addClass("l-text-invalid");
                     element.parent().addClass("l-text-invalid");
                 }
                 $(element).removeAttr("title").ligerHideTip();
                 $(element).attr("title", lable.html()).ligerTip();
             },
             invalidHandler: function (form, validator) {
                 var errors = validator.numberOfInvalids();
                 if (errors) {
                     var message = errors == 1
                       ? '存在 1个字段验证不通过，请检查!'
                       : '存在 ' + errors + '个字段验证不通过，请检查!';
                     $.ligerDialog.error(message);
                 }
             },
             success: function (lable) {
                 var element = $("#" + lable.attr("for"));
                 var nextCell = element.parents("td:first").next("td");
                 if (element.hasClass("l-textarea")) {
                     element.removeClass("l-textarea-invalid");
                 }
                 else if (element.hasClass("l-text-field")) {
                	 if(element.prev(".l-text-combobox")) element.prev(".l-text-combobox").removeClass("l-text-invalid");
                     element.parent().removeClass("l-text-invalid");
                 }
                 nextCell.find("div.l-exclamation").remove();
             },

			onkeyup:false
		});
	};
	
	Handle.prototype.validateRules=function(){
		if(options.formInitUrl){
			$.ajax({
				url:options.formInitUrl,
				type:'post',
				cache:false,
				dataType:'json',
				async:false,
				success:function(data){
					var validateRules = "";
					$.map(data.field,function(dom,i){
						var validateStr = "";
						if(dom.validate != null){
							validateStr = dom.validate;
							if(validateStr.indexOf("composit") == 0){
								var temp = validateStr.substring(validateStr.indexOf("["),validateStr.lastIndexOf("]")+1);
								temp = eval('(' + temp + ')');
								$.each(temp, function(i,n){
									if(i == 0){
										validateStr = validateResolving(n.fn);
									}else{
										validateStr = validateStr + "," + validateResolving(n.fn);
									}
								});
							}else{
								validateStr = validateResolving(validateStr);
							}
						}
						var rule = dom.name +":{'required':"+dom.required+","+ validateStr +"}";
						validateRules = validateRules + rule + ",";
					});
					validateRules = "{" + validateRules + "}";
					options.validate.rules = eval('(' + validateRules + ')');
				}
			});
		}
	};
})(jQuery);

// 解析验证规则
function validateResolving(validateStr){
	var str = "";
	if(validateStr.indexOf("length") == 0){
		str = "rangelength:" + validateStr.substring(validateStr.indexOf("["),validateStr.indexOf("]")+1);
	}else if(validateStr.indexOf("email") == 0){
		str = "email:true";
	}else if(validateStr.indexOf("mobile") == 0){
		str = "mobile:true";
	}else if(validateStr.indexOf("idCard") == 0){
		str = "idCard:true";
	}else if(validateStr.indexOf("ipaddress") == 0){
		str = "ipaddress:true";
	}
	return str;
};

//更新表单样式。
function updateStyle(){
	//下面是更新表单的样式
    var managers = $.ligerui.find($.ligerui.controls.Input);
    for (var i = 0, l = managers.length; i < l; i++)
    {
        //改变了表单的值，需要调用这个方法来更新ligerui样式
        var o = managers[i];
        o.updateStyle();
        if (managers[i] instanceof $.ligerui.controls.TextBox)
            o.checkValue();
    }
}

//将form表单值封装成json对象
function formtoJson(formObj){  
    var paramObject = new Object();  
     if(formObj){  
    	 var elementsObj=formObj.elements;  
    	 var obj;  
    	 if(elementsObj){  
    		 // 将表单中所有参数转换为json对象
    		 for(var i=0; i<elementsObj.length;i+=1){  
    			 obj=elementsObj[i];  
    			 if(obj.name!=undefined&&obj.name!=""){  
    				 paramObject[obj.name] = obj.value;  
    			 }  
    		 }
    		 return paramObject;
	     }else{  
	        return ;  
	    }  
	}else{  
	    return ;  
	} 
}
