
define("listPage",["util","layer","editPage","qnPage","resultPage"],function(util,layer,editPage,qnPage,resultPage){
	
	function List(){
		this.qnTitle=[];
		this.qnDeadline=[];
		this.qnState=[];
		this.qnContent=[];
	};
	
	List.prototype = {
		//刷新页面--默认为首页
		refresh : function(){
			//1.当一个问卷都没有的时候,展示new-built页面
			//即localStorage中没有数据时
			if(window.localStorage){
				if(window.localStorage.getItem("qnContent")== null || JSON.parse(window.localStorage.getItem("qnContent")).length==0){
					window.location.hash = "#newBuilt";
				}else{//2.当问卷存在时--展示问卷列表
		            //根据localStorage中的数据,动态渲染页面
					var main = document.getElementById("content");
					var ihtml="";
					ihtml = '<div id="list-page">'+
							'<div class="head">'+
							  '<div class="titText">标题</div>'+
							  '<div>时间</div>'+
							  '<div>状态</div>'+
							  '<div class="opeText">操作<button>+ 新建问卷</button></div>'+
							'</div>'+
							'<div class="body">'+
							'</div>'+
							'<div class="foot">'+
								'<input type="radio">'+
								'<span>全选</span>'+
								'<button>删除</button>'+
							'</div>'+
						  '</div>';
					main.innerHTML = ihtml;
					
					//点击新建问卷按钮,跳转至编辑页面
					this.newBuilt();
				    
					//每次根据localStorage的数据动态渲染问卷列表项
				    this.render();

					//问卷列表的操作
				    this.listBtnEvent();
					
					//批量删除
					this.deleteAll();
				}
			}else{
				alert("This brower does NOT support localStorage.Please update your brower!")
			}//IE9 localStorage不支持本地文件,部署到服务器环境中再访问变支持
		},	
		
		//根据localStorage中的数据,动态渲染列表项
		render : function(){
			var parent = document.querySelector(".body");
			parent.innerHTML="";
			//得到当前日期
			var currentDate = new Date;
			var currentYear = currentDate.getFullYear();
			var currentMonth = currentDate.getMonth()+1;
			var currentDay = currentDate.getDate();
			
			this.qnTitle = JSON.parse(window.localStorage.getItem("qnTitle"));
			this.qnDeadline = JSON.parse(window.localStorage.getItem("qnDeadline"));
			this.qnState = JSON.parse(window.localStorage.getItem("qnState"));
			this.qnContent = JSON.parse(window.localStorage.getItem("qnContent"));
			
			for (var i=0; i<this.qnTitle.length; i++){
				//判断this.qnDeadline[i]是否过期
				//若当前时间晚于问卷截止日期,问卷状态为"已结束"
				var date = this.qnDeadline[i].split("-");
				if(parseInt(date[0]) < parseInt(currentYear)){
					this.qnState[i]="已结束";
				}else if (parseInt(date[0]) == parseInt(currentYear)){
					if(parseInt(date[1]) < parseInt(currentMonth)){
						this.qnState[i]="已结束";
					}else if(parseInt(date[1]) == parseInt(currentMonth)){
						if(parseInt(date[2]) < parseInt(currentDay)){
							this.qnState[i]="已结束";
						}
					}
				} 
				var list = document.createElement("div");
				list.className = "qn-list";
				list.innerHTML = '<input type="checkbox">'+
								 '<div class="title">'+ this.qnTitle[i] +'</div>'+
								 '<div>'+ this.qnDeadline[i] +'</div>'+
								 '<div>'+ this.qnState[i] +'</div>'+
								 '<div class="operation">'+
									'<button>编辑</button>'+
									'<button>删除</button>'+
									'<button>填写问卷</button>'+
									'<button>查看数据</button>'+
								 '</div>';	 
				parent.appendChild(list);
			}
		},
		
		//点击新建问卷,跳转至问卷编辑页面
		newBuilt : function(){
			var newBtn = document.querySelector(".head button");
			util.addHandler(newBtn,"click",function(){
				window.location.hash = "#editPage";
				var edit= new editPage.Edit();
			    edit.refresh();
			});
		},
		
		//每个问卷的按钮点击事件
		listBtnEvent : function(){
			var lists = document.querySelectorAll(".qn-list");
			var _this = this;
			for (var i=0;i<lists.length;i++){
				(function(i){
					var Btns = lists[i].querySelectorAll(".operation button");
					var editQn = Btns[0];
					var delQn = Btns[1];
					var fillQn = Btns[2];
					var catResult = Btns[3];
					//编辑
					util.addHandler(editQn,"click",function(){
						_this.editBtnEvent(i);
					});
					//删除
					util.addHandler(delQn,"click",function(){
						_this.delBtnEvent(i);
					});
					//查看问卷
					util.addHandler(fillQn,"click",function(){
						_this.fillBtnEvent(i);
					})
					//查看数据
					util.addHandler(catResult,"click",function(){
						_this.catResultEvent(i);
					});
				})(i);	
			}
		},
		
		//编辑
		editBtnEvent : function(num){
			if(this.qnState[num]=="未发布"){
				window.location.hash = "#editPage";
				
				var content = JSON.parse(window.localStorage.getItem("qnContent"))[num];
				var title = JSON.parse(window.localStorage.getItem("qnTitle"))[num];
				
				var edit= new editPage.Edit({//Edit()有参数传递时,根据参数渲染页面,否则渲染无问题的初始页面
					num : num,
					storage : content,  
					head : title 
				});
			    edit.refresh();
			}else{
				layer.layerOut({
					head : "提示",
					content : "问卷发布中或已结束，无法编辑",
					callback : function(){}
				});
			}
		},
		
		//删除
		delBtnEvent : function(num){
			var _this = this;
			layer.layerOut({
					head : "提示",
					content : "确定要删除该问卷吗？",
					callback : function(){//删除本地存储中对应的数据
						_this.deleteOne(num);
						//刷新页面
						_this.refresh();
					}
			});
			
		},
		
		//填写
		fillBtnEvent : function(num){
			//根据localStorage中第num个数据渲染产生问卷页面(该页面不可编辑,只可填写)
			var content = JSON.parse(window.localStorage.getItem("qnContent"))[num];
			var title = JSON.parse(window.localStorage.getItem("qnTitle"))[num];
			var state = JSON.parse(window.localStorage.getItem("qnState"))[num];
			window.location.hash = "#qnFill";
			qnPage.qnPage({
				probList : content,
				head : title,
				state : state
			});
		},
		
		//查看数据
		catResultEvent : function(num){
			if(this.qnState[num] == "未发布"){
				layer.layerOut({
					head: "提示",
                    content : "问卷还未发布，无法查看数据！",
                    callback: function(){}					
				});
			}else{
				var content = JSON.parse(window.localStorage.getItem("qnContent"))[num];
			    var title = JSON.parse(window.localStorage.getItem("qnTitle"))[num];
				window.location.hash = "#resultPage";
				resultPage.result({
					probList : content,
				    head : title
				});
			}
		},
		
	    //3.表格最左侧有批量选择（多选）的checkbox，多选后，可以进行批量删除功能
	    deleteAll : function(){
			var delSingle = document.querySelectorAll(".qn-list input");
			var delAll = document.querySelector(".foot input");
			var delBtn = document.querySelector(".foot button");
			
			var _this = this;
			
			//点击delAll,选中所有问卷的复选框
			util.addHandler(delAll,"click",function(){
				if(delAll.checked == true){
					for(var i=0;i<delSingle.length;i++){
				        delSingle[i].checked = true;
						util.addHandler(delBtn,"click",function(){
							window.localStorage.removeItem("qnContent");
							window.localStorage.removeItem("qnTitle");
							window.localStorage.removeItem("qnDeadline");
							window.localStorage.removeItem("qnState");
							_this.refresh();
						});
				    }		
				}
			});

			//点击删除按钮时,判断哪些问卷的复选框被选中,并删除选中的问卷
			util.addHandler(delBtn,"click",function(){
				var count=0;
				for(var i=0;i<delSingle.length;i++){
				    if(delSingle[i].checked == true){
						_this.deleteOne(i-count);//删除了一个
						_this.refresh();
						count++;
					}
			    }
			});	
		},
		
		deleteOne: function(num){//删除本地存储中第i个问卷的数据
			var qnC = JSON.parse(window.localStorage.getItem("qnContent"));
			qnC.splice(num,1);
			window.localStorage.setItem("qnContent",JSON.stringify(qnC));
			
			var qnT = JSON.parse(window.localStorage.getItem("qnTitle"));
			qnT.splice(num,1);
			window.localStorage.setItem("qnTitle",JSON.stringify(qnT));
			
			var qnD = JSON.parse(window.localStorage.getItem("qnDeadline"));
			qnD.splice(num,1);
			window.localStorage.setItem("qnDeadline",JSON.stringify(qnD));
			
			var qnS = JSON.parse(window.localStorage.getItem("qnState"));
			qnS.splice(num,1);
			window.localStorage.setItem("qnState",JSON.stringify(qnS));
		}
	
	};
	
	return {
		List : List
	}
	
	
});