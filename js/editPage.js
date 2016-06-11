
define(["util","calendar","layer"],function(util,calendar,layer){
	
	//根据storage数组,动态渲染题目列表,增删改操作只是修改的storage
	/*this.storage = [ // 每份问卷的数据存储格式
		  {
			type : 1,
			title : "单选题",
			item : ["选项1","选项2"] 							
		  },
		  {
			type : 2,
			title : "多选题",
			item : ["选项1","选项2","选项3","选项4"]							
		  },
		  {
			type : 3,
			title : "文本题",
			
		  }
		];
	*/
	
	function Edit() {  
	    //判断是否有参数传入
		if(arguments.length==1){
			this.num = arguments[0].num;
		    this.head = arguments[0].head;
			this.storage = arguments[0].storage;
			this.flag = true;//代表有参数传入
		}else{
			this.flag = false;
			this.storage = [];
			this.head = "我的问卷";
		}
		this.deadline;
		this.state = "未保存";
	};
	
	//渲染edit-page页面
	Edit.prototype = { //每份问卷的公共方法
		//生成初始编辑页面
		refresh : function(){
			var main = document.getElementById("content");
			var ihtml="";
			ihtml = '<div id="edit-page">'+
						'<h3 class="head" contenteditable="true">'+this.head+'</h3>'+
						'<div class="body">'+
							'<div class="problem"></div>'+
							'<div class="add_problem">'+
								'<div class="form">'+
									'<button>单选</button>'+
									'<button>多选</button>'+
									'<button>文本题</button>'+
								'</div>'+
								'<div class="add"><span>+</span> 添加问题</div>'+
							'</div>'+ 
						'</div>'+
						'<div class="foot">'+
							'<div class="deadline">'+
								'问卷截止日期 <input type="text" name="deadline">'+
								'<div class="calendar"></div>'+
							'</div>'+
							'<button>发布问卷</button><button>保存问卷</button>'+
						'</div>'+
					'</div>';			
			main.innerHTML=ihtml;	
			
			//有参数传入时,根据storage渲染已存在的问题列表
			if(this.flag){
				this.render();
			}
			
			this.editEvent();
			this.ItemEvent(); 
            this.changeEvent();
			
			this.calendar();
			
			this.save();
			this.release();
			
		},
		
        //新建题目
		editEvent:function(){
			var head = document.querySelector(".head");
			
			var addProbBtn = document.querySelector(".add");
			var form = document.querySelector(".form");
			var probTypeBtns = form.querySelectorAll("button");
			var radioBtn = probTypeBtns[0];
			var checkBtn = probTypeBtns[1];
			var textBtn = probTypeBtns[2];
             
			//head 
			this.head = head.innerHTML;
            var _this=this;
			util.addHandler(head,"click",function(){ 
			    this.style.border="2px solid #9cf";	
			});
            //head的修改事件:			
			util.addHandler(head,"blur",function(){ 
			    this.style.border="none";
				if(head.innerHTML != _this.head){
					_this.head = head.innerHTML;
				}	
			});
			//点击添加问题按钮,显示form
			util.addHandler(addProbBtn,"click",function(){
				form.style.display="block";
			});
			//添加单选
			util.addHandler(radioBtn,"click",function(){
				form.style.display="none";
				//先storage中添加元素
				var obj={
					type : 1,
					title: "单选题",
					item : ["选项1","选项2"]	
				}
				if(_this.storage.length == 10){
					alert("最多只能添加10个问题");
					return;
				}
				_this.storage.push(obj);//----最多10个问题
				//根据storage渲染页面	
				_this.render();
			});
			//添加多选
			util.addHandler(checkBtn,"click",function(){
				form.style.display="none";
				var obj={
					type : 2,
					title: "多选题",
					item : ["选项1","选项2","选项3","选项4"]	
				}
				if(_this.storage.length == 10){
					alert("最多只能添加10个问题");
					return;
				}
				_this.storage.push(obj);   				
				_this.render();
			});
			//添加文本
			util.addHandler(textBtn,"click",function(){
				form.style.display="none";
				var obj={
					type : 3,
					title: "文本题"
				}
				if(_this.storage.length == 10){
					alert("最多只能添加10个问题");
					return;
				}
				_this.storage.push(obj);
				_this.render();
			}); 
		
		},

		//给题目添加事件：上移、下移、删除、复用、添加选项
		ItemEvent:function(){//函数声明提升  
			var problemInner = document.querySelector(".problem");
	        var _this=this;
			util.addHandler(problemInner,"click",function(event){
				var event = event ? event : window.event;
				if(event.target.innerHTML=="复用"){
					if(_this.storage.length == 10){
						alert("最多只能添加10个问题");
						return;
				    }
					var num = parseInt(event.target.parentNode.querySelector(".num").innerHTML.substring(1));
					_this.copyEvent(num-1);
				}
				if(event.target.innerHTML=="删除"){
					layer.layerOut({//弹出层
						head : "提示",
						content : "是否要删除该问题",
						callback : function(){//回调函数
							var num = parseInt(event.target.parentNode.querySelector(".num").innerHTML.substring(1));
							_this.delEvent(num-1);
						}
					});				
				}
				if(event.target.innerHTML=="上移"){
					var num = parseInt(event.target.parentNode.querySelector(".num").innerHTML.substring(1));
					_this.upEvent(num-1);
				}
				if(event.target.innerHTML=="下移"){
					var num = parseInt(event.target.parentNode.querySelector(".num").innerHTML.substring(1));
					_this.downEvent(num-1);
				}
				if(event.target.innerHTML=="+"){
					var num = parseInt(event.target.parentNode.querySelector(".num").innerHTML.substring(1));
					_this.addItem(num-1);
				}
				if(event.target.innerHTML=="×"){
					var num = parseInt(event.target.parentNode.querySelector(".num").innerHTML.substring(1));
					//找到是第几个选项
					var str = event.target.previousElementSibling.innerHTML;
					var n = _this.storage[num-1].item.indexOf(str);
					_this.delItem(num-1,n);
				}
			});	
		},
		
		//添加选项
		addItem : function(num){
			var itemNum = this.storage[num].item.length;
			this.storage[num].item.push("选项"+(itemNum+1));
			this.render();
		},
		//删除选项
		delItem : function(num,n){
			this.storage[num].item.splice(n, 1);//删除该位置上的选项
            this.render();
		},
		//复用
		copyEvent : function(num){
			this.storage.splice(num+1,0,this.storage[num]);//在下个位置插入新对象
			this.render();		
		},
		//删除
		delEvent : function(num){
			this.storage.splice(num, 1);//删除该位置上的对象
            this.render();
		},
		//上移
		upEvent : function(num){
			//交换 num 与 num-1 位置上的对象
			var temp={};
			temp = this.storage[num];
			this.storage[num]=this.storage[num-1];
			this.storage[num-1]=temp;
			this.render();
		},
		//下移
		downEvent : function(num){
			//交换 num 与 num+1 位置上的对象
			var temp={};
			temp = this.storage[num];
			this.storage[num]=this.storage[num+1];
			this.storage[num+1]=temp;
			this.render();
		},
		
		//修改标题和选项
		changeEvent : function(){
			//获得title
			var problemInner = document.querySelector(".problem"); 
	        var _this=this;
			util.addHandler(problemInner,"click",function(event){
				var event = event ? event : window.event;
				if (event.target.className == "title"){
					//点击时显示边框
					event.target.style.border="2px solid #9cf";
					
					//firefox-bug修复:内容为空时firefox会自动补<br>
					util.addHandler(event.target,"keyup",function(){
						if(event.target.innerHTML.trim()=="<br>"){
							event.target.innerHTML="";
						}
					});
					//得到是第几个title--失去焦点时,更新storage
					util.addHandler(event.target,"blur",function(){
						event.target.style.border="none";
					    var num = parseInt(event.target.parentNode.querySelector(".num").innerHTML.substring(1));
                        _this.changeTitle(event.target,num-1);					
					});
				}
				if (event.target.className == "item"){
					//点击时显示边框
					event.target.style.border="2px solid #9cf";
					
					util.addHandler(event.target,"keyup",function(){
						if(event.target.innerHTML.trim()=="<br>"){
							event.target.innerHTML="";
						}
					});
					//得到是第几个title的第几个item--失去焦点时,更新storage
					var num = parseInt(event.target.parentNode.querySelector(".num").innerHTML.substring(1));
					var str = event.target.innerHTML;
					var n = _this.storage[num-1].item.indexOf(str);
					(function(){
						util.addHandler(event.target,"blur",function(){
							event.target.style.border="none";
							_this.changeItem(event.target,num-1,n);						
						});
					})(num,n);
				}
			});
		},
		//问卷题目title及item的点击编辑事件
		changeTitle : function(title,num){
			if(title.innerHTML != this.storage[num].title){
				this.storage[num].title=title.innerHTML;
				this.render();
			}
		},
		changeItem : function(item,num,n){
			if(item.innerHTML != this.storage[num].item[n]){
				this.storage[num].item[n] = item.innerHTML;
				this.render();
			}
		},
		
		//根据storage动态渲染问题列表
		render : function(){
			var problemInner = document.querySelector(".problem"); 
			problemInner.innerHTML="";
			for (var i=0; i<this.storage.length; i++){
				var div = document.createElement("div");
				div.className="box";
				//标题
				var QNum = document.createElement("span");
				QNum.className = "num";
				QNum.innerHTML = "Q"+(i+1);
				div.appendChild(QNum);
				var title = document.createElement("div");
				title.className = "title";
				title.contentEditable="true";//可编辑
				title.innerHTML = this.storage[i].title;
				div.appendChild(title);
				var br = document.createElement("br");
				div.appendChild(br);
				//选项
				if(this.storage[i].item != undefined){
					for(var j=0; j<this.storage[i].item.length; j++){
						//单选框
						var input = document.createElement("input");
						if(this.storage[i].type == 1) input.type="radio";
						if(this.storage[i].type == 2) input.type="checkbox";
						input.name="item"+i;
						div.appendChild(input);
						//单选项
						var entry = document.createElement("div");
						entry.className = "item";
						entry.contentEditable="true";//可编辑
						entry.innerHTML = this.storage[i].item[j];
						div.appendChild(entry);
						var a = document.createElement("a");
						a.innerHTML="×";
						div.appendChild(a);
						
						var br = document.createElement("br");
						div.appendChild(br);
					}
				}else{//文本题
					div.innerHTML = div.innerHTML +'<textarea rows="4" cols="70"></textarea><br>'
				}
				//添加选项按钮
				if(this.storage[i].type != 3){
					div.innerHTML = div.innerHTML + '<p>+</p>';
				}	
				//上下移、删除和复用按钮
				div.innerHTML = div.innerHTML +'<span>删除</span>'+
						 '<span>复用</span><span>下移</span><span>上移</span>';
				//问题的hover事件
				var _this = this;
				(function(i){
					var num = parseInt(div.querySelector(".num").innerHTML.substring(1));
					var itemBtns = div.querySelectorAll("span");
					var delBtn = itemBtns[1];
					var copyBtn = itemBtns[2];
					var downBtn = itemBtns[3];
					var upBtn = itemBtns[4];
					
					util.addHandler(div,"mouseover",function(){
						this.style.backgroundColor = "#fc9";
						if(this.querySelector("p") != undefined){
							this.querySelector("p").style.display = "block";
						}
						if(_this.storage.length == 1){//只有一个题目时,只显示删除和复用
							delBtn.style.display = "inline";
							copyBtn.style.display = "inline";
						}else if(num == 1){//否则,如果是第一个题目,不显示上移
							delBtn.style.display = "inline";
							copyBtn.style.display = "inline";
							downBtn.style.display = "inline";
						}else if(num == _this.storage.length){//如果是最后一个题目,不显示下移
							delBtn.style.display = "inline";
							copyBtn.style.display = "inline";
							upBtn.style.display = "inline";
						}else{
							delBtn.style.display = "inline";
							copyBtn.style.display = "inline";
							downBtn.style.display = "inline";
							upBtn.style.display = "inline";
						}
						var del=this.querySelectorAll("a");
						for(var k=0;k<del.length;k++){
							del[k].style.display="inline";
						}
					});
					util.addHandler(div,"mouseout",function(){
						this.style.backgroundColor = "#fff";
						if(this.querySelector("p") != undefined){
							this.querySelector("p").style.display = "none";
						}
						delBtn.style.display = "none";
						copyBtn.style.display = "none";
						downBtn.style.display = "none";
						upBtn.style.display = "none";
						var del=this.querySelectorAll("a");
						for(var k=0;k<del.length;k++){
							del[k].style.display="none";
						}
					});	
					
				})(i);
				problemInner.appendChild(div);
			}
		},
		
		//点击问卷截止日期focus时显示日历--默认选中当天
		calendar : function(){
			var deadline  = document.getElementsByName("deadline")[0],
				calElem  = document.querySelector(".calendar");
				
		    var _this = this;
			var cal = calendar.calendarOut({//----早于当前日期时,不显示
				showDate : deadline,
				callback : function(){
					_this.deadline = deadline.value;//得到截止日期	
					//alert(this instanceof Edit) //输出false
				}
			});
			
			//点击文本框实现日历面板显示和隐藏的切换
			util.addHandler(deadline,"click",function(){
				if(calElem.style.display == "block"){
					calElem.style.display="none";
				}else{
					calElem.style.display="block";
				}
			});
		},
		
		//点击保存问卷--未发布
		//this.state="未发布";
		save : function(){
			var foot = document.querySelector(".foot");
			var btn = foot.querySelectorAll("button")[1];
			var _this=this;
			util.addHandler(btn,"click",function(){
				if(_this.storage.length < 1){
					alert("请至少给问卷添加一个问题");
					return;
				}
				layer.layerOut({
					head : "提示",
					content : "是否保存问卷?",
					callback : function(){
						layer.layerOut({
							head : "提示",
					        content : "问卷保存成功！",
							callback : function(){
								_this.state = "未发布";	
								//把数据保存到localStorage中
								if(_this.flag){
									//修改第_this.num个问卷的数据
									_this.changeStore();
								}else{
									//向localStorage中追加数据
									_this.store();	
								};
							}	
						});
					}
				});
			});
		},

		//点击发布问卷--发布中
		//this.state="发布中";
		release : function(){
			var foot = document.querySelector(".foot");
			var btn = foot.querySelectorAll("button")[0];
			var _this = this;
			util.addHandler(btn,"click",function(){
				if(_this.storage.length < 1){
					alert("请至少给问卷添加一个问题");
					return;
				}
				layer.layerOut({
					head : "提示",
					content : "是否发布问卷?",
					callback : function(){
						layer.layerOut({
							head : "提示",
							content : "发布成功！",
							callback : function(){
								//如果未点击保存---_this.state == "未保存"
								//将this.head、this.deadline、this.state、this.storage保存在localStorage中
								if(_this.state == "未保存"){
									_this.state = "发布中";
									if(_this.flag){
										//修改第_this.num个问卷的数据
										_this.changeStore();	
									}else{
										_this.store();//追加数据	
									}
								}else{
									_this.state = "发布中";
								    if(_this.flag){
										//修改第_this.num个问卷的state
										qnState = JSON.parse(window.localStorage.getItem("qnState"));
										qnState.splice(_this.num,1,_this.state);
										window.localStorage.setItem("qnState",JSON.stringify(qnState));	
									}else{
										//修改最后一个问卷的state
										qnState = JSON.parse(window.localStorage.getItem("qnState"));
										qnState.pop();
										qnState.push(_this.state);
										window.localStorage.setItem("qnState",JSON.stringify(qnState));
									}
								}
								window.location.hash = "#listPage";
							}
						});
					}
				});
			});
		},
		
		//将this.head、this.deadline、this.state、this.storage保存在localStorage中
		store : function(){
			if(window.localStorage){
				if(window.localStorage.getItem("qnContent")== null){
					var qnContent = []; 
					qnContent[0] = this.storage;
					window.localStorage.setItem("qnContent",JSON.stringify(qnContent));
					
					var qnTitle = [];
					qnTitle[0] = this.head;
					window.localStorage.setItem("qnTitle",JSON.stringify(qnTitle));
					
					var qnDeadline = [];
					qnDeadline[0] = this.deadline;
					window.localStorage.setItem("qnDeadline",JSON.stringify(qnDeadline));
					
					var qnState = [];
					qnState[0] = this.state;
					window.localStorage.setItem("qnState",JSON.stringify(qnState));
				}else{
					qnContent = JSON.parse(window.localStorage.getItem("qnContent"));
					qnContent.push(this.storage);
					window.localStorage.setItem("qnContent",JSON.stringify(qnContent));
					
					qnTitle = JSON.parse(window.localStorage.getItem("qnTitle"));
					qnTitle.push(this.head);
					window.localStorage.setItem("qnTitle",JSON.stringify(qnTitle));
					
					qnDeadline = JSON.parse(window.localStorage.getItem("qnDeadline"));
					qnDeadline.push(this.deadline);
					window.localStorage.setItem("qnDeadline",JSON.stringify(qnDeadline));
					
					qnState = JSON.parse(window.localStorage.getItem("qnState"));
					qnState.push(this.state);
					window.localStorage.setItem("qnState",JSON.stringify(qnState));	
				}	
			}else{
				alert("This brower does NOT support localStorage.Please update your brower!")
			}
		},
		
		//更新localStorage中第this.num个数据
		changeStore : function(){
			if(window.localStorage){
				qnContent = JSON.parse(window.localStorage.getItem("qnContent"));
				qnContent.splice(this.num,1,this.storage);
				window.localStorage.setItem("qnContent",JSON.stringify(qnContent));
				
				qnTitle = JSON.parse(window.localStorage.getItem("qnTitle"));
				qnTitle.splice(this.num,1,this.head);
				window.localStorage.setItem("qnTitle",JSON.stringify(qnTitle));
				
				qnDeadline = JSON.parse(window.localStorage.getItem("qnDeadline"));
				qnDeadline.splice(this.num,1,this.deadline);
				window.localStorage.setItem("qnDeadline",JSON.stringify(qnDeadline));
				
				qnState = JSON.parse(window.localStorage.getItem("qnState"));
				qnState.splice(this.num,1,this.state);
				window.localStorage.setItem("qnState",JSON.stringify(qnState));		
			}else{
				alert("This brower does NOT support localStorage.Please update your brower!")
			}
		}
		
	}

	return {
		Edit : Edit
	};
	
	
	
});

