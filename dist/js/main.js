
/***问卷网站用到的工具方法****/
define("util",[],function(){
	
	//跨浏览器事件绑定
	var addHandler = function(element, type, handler){
		if(element.addEventListener) {
			addHandler = function(element, type, handler) {
				element.addEventListener(type, handler, false);
			};
		} else if (element.attachEvent) {
			addHandler = function(element, type, handler) {
				element.attachEvent("on"+type, handler);
			};
		} else {
			addHandler = function(element, type, handler) {
				element["on"+type] = handler;
			};
		}
		return addHandler(element, type, handler);
	};
	
	//跨浏览器移除事件
	var removeHandler = function(element,type,fn){
		if(typeof element.removeEventListener!="undefined"){
			element.removeEventListener(type,fn,false);
		}/*else if(typeof element.detachEvent!="undefined"){
			element.detachEvent("on"+type,fn);*/
		else{//用传统方式模拟
			if(element.events){
				for (var i in element.events[type]){
					if(element.events[type][i]==fn){
						delete element.events[type][i];
					}
				}
			}   
		}	
	};
	
	//跨浏览器获取滚动条
	var scroll = function(){
		var scrollTop=document.documentElement.scrollTop|| document.body.scrollTop,
		    scrollLeft=document.documentElement.scrollLeft|| document.body.scrollLeft,
			top,
			left;
		return{
			top  : scrollTop,
			left : scrollLeft
		}
	};
	
	//跨浏览器获取页面视口大小
	var getViewport = function(){
		//主流浏览器
		var pageWidth=window.innerWidth,
		    pageHeight=window.innerHeight,
			width,
			height;
	    if(typeof pageWidth != "number"){
			//针对低版本IE----IE8及以下
			if(document.compatMode=="CSS1Compat"){//标准模式下
				pageWidth=document.documentElement.clientWidth;
				pageHeight=document.documentElement.clientHeight;
			}else{//混杂模式下
				pageWidth=document.body.clientWidth;
				pageHight=document.body.clientHeight;
			}
		}
        return {
			width  : pageWidth,
			height : pageHeight
		}		
	};
	
	//设置元素在页面视口中间显示
	var center = function (node,width,height){
		width = parseInt(width.replace("px",""));
		height =  parseInt(height.replace("px",""));
		var top=(getViewport().height - height)/2 + scroll().top;
		var left=(getViewport().width - width)/2 + scroll().left;
		node.style.top  = top + "px";
		node.style.left = left + "px";
	};
	
	//insertBefore
	var insertAfter = function(newElement,targetElement){
		var parent = targetElement.parentNode;
		if(parent.lastChild == targetElement){
			parent.appendChild(newElement);
		}else{
			parent.insertBefore(newElement,targetElement.nextSibling);
		}
	}
	
	//跨浏览器获得计算后的样式
	function getStyle(elements,attr){  		   
		if(typeof window.getComputedStyle != "undefined"){//W3C  
			computedStyle=window.getComputedStyle(elements,null);
			return computedStyle[attr];
		}else if(typeof elements.currentStyle != "undefined"){//IE
			return elements.currentStyle[attr];
		}
	}

	return {
		addHandler : addHandler,
		removeHandler : removeHandler,
		getViewport : getViewport,
		scroll : scroll,
		center : center,
		insertAfter : insertAfter,
		getStyle : getStyle
	};
	
})
define("calendar",["util"],function(util){
	
	var calendarOut = function(option){
		var cal = new Calendar(option);
		cal.display();
	}
	
	function Calendar(option){
		this.date = new Date;
		this.year = this.date.getFullYear(); //得到当前年份
		this.month = this.date.getMonth()+1; //得到当前月份
		this.day = this.date.getDate();  //得到当前日期
		this.th= ["日","一","二","三","四","五","六"];
		this.tb=[];//存储表格数据	
		
		this.selMonth;
		this.selYear;
		this.selDay;
		
		this.getDate = option.showDate;
		this.callback = option.callback;
		
	}
	
	Calendar.prototype = {
		display : function(){//给日历添加新功能,早于当前日期的时间不显示
			var calendar     = document.querySelector(".calendar");
			this.genDom(calendar);
			
			var	prevMonthBtn = document.querySelector(".left"),
				nextMonthBtn = document.querySelector(".right");
				
		    //默认情况下显示当前日期
			//获取日期接口
			this.selMonth = this.month;   //存储当前日历中选中的月
			this.selYear = this.year;     //存储当前日历中选中的年份
			this.selDay = this.day;         //存储当前日历中选择的天
			this.getSelDate();
			
			//产生设定日期对应的日历	
			this.getEcho();//日历最上方显示当前年月
			this.tbodyData();
			this.genTable();
			
			var _this = this;
            //点击左右三角，切换到上一月或下一月
			util.addHandler(prevMonthBtn,"click",function(){
				if(_this.selYear==_this.year && _this.selMonth == _this.month){
					//alert("点击无效");
					this.style.borderRight='7px solid #CCC';
					return;	
				}else{
					_this.prevDay();
				}
				
			});
			util.addHandler(nextMonthBtn,"click",function(){
				prevMonthBtn.style.borderRight='7px solid #FFF';
				_this.nextDay();
			});
		},
		
		//生成Dom
		genDom : function(calendar){
			calendar.innerHTML = '<form>'+
									  '<span class="left"></span>'+
									  '<div class="echo">2016年05月</div>'+
									  '<span class="right"></span>'+
								  '</form>'+
								  '<table class="tb"></table>';
		},
		
		//在文本框中显示用户选择的日期
		getSelDate : function(){
			if(parseInt(this.selMonth)<=9){
					if(parseInt(this.selDay)<=9){
						this.getDate.value=this.selYear+"-"+"0"+this.selMonth +"-0"+this.selDay;
					}else{
						this.getDate.value=this.selYear+"-"+"0"+this.selMonth +"-"+this.selDay;
					}
				}else{
				   this.getDate.value=this.selYear+ "-"+this.selMonth +"-"+this.selDay;
				}
				this.callback();
		},

		//获取当前年月
		getEcho : function(){
			var echo = document.querySelector(".echo");
			if(parseInt(this.selMonth)<=9){
				echo.innerHTML=this.selYear+"年0" + this.selMonth +"月";
			}else{
			   echo.innerHTML=this.selYear+"年" + this.selMonth +"月";
			}
		},
		
		//点击左三角的处理函数
		prevDay : function(){
			var table = document.querySelector(".tb");
			if(this.selMonth == 1){
					this.selMonth = 12;
					this.selYear = this.selYear-1;
				}else{
					this.selMonth = this.selMonth-1;
					this.selYear = this.selYear;
				}
				//更新日历
				this.getEcho();
				this.tbodyData();
				//根据tb的值重新渲染日历表格
				table.removeChild(document.getElementsByTagName("thead")[0]);
				table.removeChild(document.getElementsByTagName("tbody")[0]);
				this.genTable();
		},
		
		//点击右三角的处理函数
		nextDay : function(){
			var table = document.querySelector(".tb");
			if(parseInt(this.selMonth) == 12){
					this.selMonth = 1;
					this.selYear = parseInt(this.selYear)+1;
				}else{
					this.selMonth = parseInt(this.selMonth)+1;
					this.selYear = this.selYear;
				}
				//更新日历
				this.getEcho();
				this.tbodyData();
				//根据tb的值重新渲染日历表格
				table.removeChild(document.getElementsByTagName("thead")[0]);
				table.removeChild(document.getElementsByTagName("tbody")[0]);
				this.genTable();
		},
		
		//产生日历表格tb数据
		tbodyData : function(){
			var selDate = new Date(this.selYear,this.selMonth);
		   //得到该月的天数
			var days = selDate.getUTCDate();
		   //得到该月的1号是星期几
			//Date对象的getDay()方法,返回日期是星期几:0-6
			var week = new Date(this.selYear,this.selMonth-1,1).getDay();
			
		   //得到表格的初始化数据
			//声明二维数组的方式
			for(var i=0;i<6;i++){
				this.tb[i]=[];
			}
			
			//得到数组的第一行
			this.tb[0][week]=1;
			var preDays = new Date(this.selYear,this.selMonth-1).getUTCDate();
			for(var i=0;i<7;i++){
				if (i<week){//不可选日期
					//this.tb[0][i]=preDays-week+1+i;
					this.tb[0][i]="";				
				}else if(i>week){
					this.tb[0][i]=this.tb[0][i-1]+1;
				}
			}
			//得到后面的数据
			for (var i=1;i<6;i++){
				for (var j=0; j<7; j++){
					if(j==0){
						this.tb[i][j]= this.tb[i-1][6]+1;
					}else{
						this.tb[i][j]= this.tb[i][j-1]+1;
					}
					if(this.tb[i][j] >= days){//不可选日期
						//tb[i][j] = tb[i][j]-days;
						return;
					}								
				}
			}
		},
		
		//根据表格数据动态产生日历表格
		genTable : function(){
			this.createThead();//创建表头
			this.createTbody(this);//创建表格主体
		},
		createThead : function(){
			var table = document.querySelector(".tb");
			var thead = document.createElement("thead");
			var tr = document.createElement("tr");
			
			for (var i=0; i<this.th.length; i++){
				var td = document.createElement("td");
				var tdText = document.createTextNode(this.th[i]);
				td.appendChild(tdText);
				tr.appendChild(td);
			}
			thead.appendChild(tr);
			table.appendChild(thead);
		},
        createTbody : function(_this){
				var table = document.querySelector(".tb");
				var calendar = document.querySelector(".calendar");
				var current_td=[];//存储本月的td元素
				
				var tbody = document.createElement("tbody");
				for(var i=0; i<this.tb.length; i++){
					//创建tr
					var tr = document.createElement("tr");
					for(var j=0; j<this.tb[i].length; j++){
						//创建td
						var td = document.createElement("td");
						var tdText = document.createTextNode(this.tb[i][j]);
						td.appendChild(tdText);
		
						if(i==0 && this.tb[i][j]==""){ 
							td.style.color="#fff"; 
						}else if(i>3 && this.tb[i][j]<20){ 
							td.style.color="#fff"; 
						}else{//将本月的td添加临时数组
						    if(_this.selYear==_this.year && _this.selMonth == _this.month && parseInt(this.tb[i][j])<_this.day){
								//当日期早于当前日期时，不可选
								td.style.backgroundColor="#fff";
							    td.style.color="#ccc";
							}else{
								current_td.push(td);
							}						
						}
						tr.appendChild(td);
					}
					tbody.appendChild(tr);
				}
				
				//给本月日期添加点击事件的处理函数
				for(var i=0;i<current_td.length;i++){
					util.addHandler(current_td[i],"mouseover",function(){
						this.style.backgroundColor="#f96";
						this.style.color="#fff";
					});
					util.addHandler(current_td[i],"mouseout",function(){
						clearColor();	
					});
					
					util.addHandler(current_td[i],"click",function(){
						_this.selDay = this.innerHTML;
						calendar.style.display="none";
						_this.getSelDate();
					});
				}
				function clearColor(){
					current_td.forEach(function(element){
						element.style.backgroundColor="#fff";
						element.style.color="#333";
					});
				}
				table.appendChild(tbody);
		},

	}
	
	return {
		calendarOut:calendarOut
	};
	
});
define("layer",["util"],function(util){
	
	var layerOut = function(option){//对外接口
		var layer = new Layer(option);
		layer.init();
	}
	
	function Layer(option){
		this.head = option.head;
		this.content = option.content;
		this.callback = option.callback;
	};
	
	Layer.prototype = {
		init : function(){//-----有问题:每次弹出该弹出层时,都会新建screen和layer导致一个页面有很多额外元素
			//半透明遮罩
            var draken = document.querySelector(".draken");
			var parent = document.querySelector("body");
	
			var ihtml = '<div class="screen"></div>'+
			            '<div class="layer">'+
							'<h2>'+ this.head +
								'<span>×</span>'+
							'</h2>'+
							'<div>'+ this.content +'</div>'+
							'<div class="btn">'+
								'<button>确定</button>'+'<button>取消</button>'+
							'</div>'+
					    '</div>';
			draken.innerHTML = ihtml;			
			
			//util.insertAfter(  ,parent.firstChild);
			
			this.drag();
			this.pop();
			this.close();
		},
		//拖拽
		drag : function(){
			var layer = document.querySelector(".layer");
			util.addHandler(layer,"mousedown",function(event){
				var event = event ? event : window.event;
				var diffX=event.clientX-this.offsetLeft;
				var diffY=event.clientY-this.offsetTop;
				
				if(event.target.tagName=="H2"){  //鼠标点下的目标元素是h2时才可以拖动
					util.addHandler(document,"mousemove",move);
					util.addHandler(document,"mouseup",up);
				}
				var _this=this;  
				//-----------mousemove事件执行的函数-----------//
				function move(event){
					var left=event.clientX-diffX;
					var top=event.clientY-diffY;
					if(left<0){//浏览器视口的左边缘
						left=0;
					} else if(left>util.getViewport().width+util.scroll().left-_this.offsetWidth){//浏览器视口的右边缘
						left=util.getViewport().width+util.scroll().left-_this.offsetWidth;
					}
					if(top<0){//浏览器视口的上边缘
						top=0;
					}else if(top>util.getViewport().height+util.scroll().top-_this.offsetHeight){//浏览器视口的下边缘
						top=util.getViewport().height+util.scroll().top-_this.offsetHeight;
					}
					_this.style.left=left+"px";
					_this.style.top=top+"px"; //只根据左上角移动，因为点一下oDiv的CSS效果马上改变
				}
				 //-----------mouseup事件执行的函数-----------//
				function up(){
					util.removeHandler(document,"mousemove",move);
					util.removeHandler(document,"mouseup",up);
				}
		    });
		},
		
		//弹出登录框并遮罩锁屏
		pop : function(){
			var layer = document.querySelector(".layer");
			layer.style.display="block";
			//得到某个元素计算后的样式
			width = util.getStyle(layer,"width");
			height = util.getStyle(layer,"height");
			
			util.center(layer,width,height);
			
			var screen = document.querySelector(".screen");
			screen.style.display="block";//遮罩效果
			screen.style.height=util.getViewport().height+ util.scroll().top+"px";
			//页面滚动时，login始终保持居中
			window.onresize=function(){
				util.center(layer,width,height);
				screen.style.height=util.getViewport().height+ util.scroll().top+"px";
			}
			window.onscroll=function(){
				util.center(layer,width,height);
				screen.style.height=util.getViewport().height+ util.scroll().top+"px";
			}	
		},
		
		//关闭弹出框并解锁
		close : function(){
			var layer  = document.querySelector(".layer"),
			screen = document.querySelector(".screen"),
			layer_btn  = layer.querySelectorAll("button"),
			confirmBtn = layer_btn[0],
			cancelBtn  = layer_btn[1],
			closeBtn   = layer.querySelector("h2 span");
			
			util.addHandler(screen,"click",function(){
				layer.style.display="none";
		        screen.style.display="none";
			});
			var _this = this;
			util.addHandler(confirmBtn,"click",function(){//点击确定以后,执行回调函数
				layer.style.display="none";
				screen.style.display="none";
				_this.callback();
			});
			util.addHandler(cancelBtn,"click",function(){
				layer.style.display="none";
		        screen.style.display="none";
			});
			util.addHandler(closeBtn,"click",function(){
				layer.style.display="none";
		        screen.style.display="none";
			});
		}
	}

    return {
		layerOut : layerOut
	}

});

define("editPage",["util","calendar","layer"],function(util,calendar,layer){
	
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
		
		//-------------------定义verify()用来验证问卷是否正常编辑过----------------//
		
		
		
		
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



/*新建问卷页逻辑处理*/
define("newBuilt",["util","editPage"],function(util,editPage){
	
	var built = function(){
		refresh();
		btnEvent();
	}
	
	//渲染new-built
	var refresh = function(){
		var main = document.getElementById("content");
		var ihtml="";
		ihtml = '<div id="new-built">'+
			        '<button><span>+ </span>新建问卷</button>'+
		        '</div>';
		main.innerHTML=ihtml;		
	};
	
	//点击新建问卷按钮,跳转页面并预加载edit-page页面
	var btnEvent=function(){
		builtBtn = document.getElementsByTagName("button")[0];
		util.addHandler(builtBtn,"click",function(){
			window.location.hash = "#editPage";
			var edit= new editPage.Edit();
			edit.refresh();
		});
	}
	
	return{
		new_built : built
	}
	
});
define("qnPage",["util","layer"],function(util,layer){
	
	var qnPage = function(option){
		var qn = new Qn(option);
		qn.refresh();
	}
	
	function Qn(option){//传入num,标志这是第几个问卷
		this.head = option.head;
		this.state = option.state;
		this.probList = option.probList; 
		this.flag = false;//单、多选题目用户都填写了时，变为true
	};
	
	Qn.prototype = {
		//刷新页面
		refresh : function(){
			var main = document.getElementById("content");
			main.innerHTML = '<div id="qn-page">'+
			                     '<h2 class="head">'+ this.head +'</h2>'+
								 '<p>标有<span> * </span>的题目为必做题</p>'+
								 '<div class="body">'+
									'<div class="problem">'+
									'</div>'+
								 '</div>'+
                                  '<div class="foot"><button>提交</button></div>'+								 
			                 '</div>';
			this.genProblem();
            this.submit();
		},
		
		//产生问题列表
		genProblem : function(){
			var problemInner = document.querySelector(".problem"); 
			problemInner.innerHTML="";			
			for(var i=0; i<this.probList.length;i++){
				var div = document.createElement("div");
				div.className="box";
				//标题
				var QNum = document.createElement("span");
				QNum.innerHTML = "Q"+(i+1);
				div.appendChild(QNum);
				var title = document.createElement("span");
				title.innerHTML = this.probList[i].title;
				if(this.probList[i].type!=3){
					title.innerHTML=title.innerHTML+'<span> *</span>';
				}
				div.appendChild(title);
				var br = document.createElement("br");
				div.appendChild(br);
				//选项
				if(this.probList[i].item != undefined){
					for(var j=0; j<this.probList[i].item.length; j++){
						//单选框
						var input = document.createElement("input");
						if(this.probList[i].type == 1) input.type="radio";
						if(this.probList[i].type == 2) input.type="checkbox";
						input.name="item"+i;
						div.appendChild(input);
						//单选项
						var entry = document.createElement("span");
						entry.className = "item";
						entry.innerHTML = this.probList[i].item[j];
						div.appendChild(entry);		
						var br = document.createElement("br");
						div.appendChild(br);
					}
				}else{//文本题
					div.innerHTML = div.innerHTML +'<textarea rows="4" cols="70"></textarea><br>'
				}
				problemInner.appendChild(div);
			}
		},
		
	    //点击提交按钮
		submit : function(){
			var subBtn = document.querySelector(".foot button");
			var _this = this;
			util.addHandler(subBtn,"click",function(){
				if(_this.state != "发布中"){
					layer.layerOut({
						head : "提示",
						content : "此问卷未发布或已结束，无法提交！",
						callback : function(){}
					});
				}else{
				    //验证单、多选题是否都做了	
					_this.verify();
					//当有单、多选没做时，作出提示
					if(_this.flag){
						layer.layerOut({
							head : "提示",
							content : "请完整填写问卷！",
							callback : function(){}
						});
					}else{//单、多选都做了时，提示提交成功
						layer.layerOut({
							head : "提示",
							content : "提交成功！",
							callback : function(){
								//this.storage
								
								window.location.hash = "#listPage";
							}
						});
					}	
				}
			});
		},
		
		//提交前验证必做题目是否完成  //判断是否存在所有input.checked 都不为 true
		verify : function(){
			var box = document.querySelectorAll(".body .problem .box");
			var c =[];
			for (var i=0; i < box.length;i++){
				if(box[i].querySelectorAll("input").length != 0){
					var input = box[i].querySelectorAll("input");
					var count=0;
				    for (var j=0; j<input.length ; j++){
						if(input[j].checked == true){
							count++;
						}
					}
					c.push(count);
				}
			}
			if(c.indexOf(0) != -1){//存在未做的必做题目
				this.flag = true;
			}else{
				this.flag=false;
			}
		}
	}
	
	
	return{
		qnPage : qnPage
	}
	
});
	
define("resultPage",["util","layer"],function(util,layer){
	
	var result = function(option){
		var resultPage = new Result(option);
		resultPage.refersh();
	}
	
	function Result(option){
		this.problems = option.probList;
        this.head = option.head;		
	}
	
	Result.prototype = {
		refersh : function(){
			
			var main = document.getElementById("content");
			main.innerHTML = '<div id="result-page">'+
								'<div class="head">'+
								   '<span>＜ 返回</span>'+
								   '<h2>'+ this.head +'</h2>'+
								   '<p>此统计分析只包含完整回收的数据</p>'+
								'</div>'+
								'<div class="body"></div>'+
								'<div class="foot"><button>＜ 返回</button></div>'+
							  '</div>'; 
			//返回问卷列表页				  
			this.backToList();
			
			//生成问题列表DOM
			this.problemDom();
			
			//生成数据占比图
            var date = document.querySelectorAll(".data");
			var _this = this;
			for (var i = 0; i < date.length; i++) {
				(function() {
					genData(_this.problems[i], date[i]);
				})(i)
			}

			
		},
		
		//生成问题列表DOM
		problemDom : function(){
			var problem = document.querySelector(".body"); 
			problem.innerHTML="";			
			for(var i=0; i<this.problems.length;i++){
				var div = document.createElement("div");
				div.className="box";
				//数据占比
				var data = document.createElement("div");
				data.className="data";
				div.appendChild(data);
				problem.appendChild(div);
			}
		},
		
		//返回问卷列表页
		backToList : function(){
			var backBtn1 = document.querySelector(".head span");
			var backBtn2 = document.querySelector(".foot button");
			util.addHandler(backBtn1,"click",function(){
				window.location.hash = "listPage";
			});
			util.addHandler(backBtn2,"click",function(){
				window.location.hash = "listPage";
			});
		}
    
	}
     
    //生成数据占比图
	function genData(problem,div){
		// 定义配置
		var option;
		// 判断类型
		if (problem.type == 2) {
			// 多选题用柱状图
			// 初始化dom
			var myChart = echarts.init(div);
			// 定义配置
			option = {
				
				title: {
					text: problem.title,
					subtext: '数据随机生成',
					left: 'left'
				},
				tooltip: {
					show: true
				},
				xAxis : [
					{
						type : 'category',
						data : problem.item
					}
				],
				yAxis : [
					{
						type : 'value',
					}
				],
				series : [
					{
						"name":"人数",
						"type":"bar",
						"data":(function(len) {
							var a = [];
							for (var i = 0; i < len; i++) {
								a.push(parseInt(Math.random()*(100-10+1)+10))//[10,100]
							}
							return a;
						})(problem.item.length)
					}
				]
			};
			
			// 为echarts对象加载数据 
			myChart.setOption(option);   

		} else if (problem.type == 1) {
			// 单选题用饼状图
			// 初始化dom
			var myChart = echarts.init(div);
			// 定义配置
			option = {
				title: {
					text: problem.title,
					left: 'left'
				},

				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				series : [
					{
						name:'访问来源',
						type:'pie',
						radius : '55%',
						center: ['50%', '50%'],
						data:(function(l) {
							var a = [];
							for (var i = 0; i < l; i++) {
								a.push({
									value: (parseInt(Math.random()*(80-10+1)+10)),//[10,80] 
									name: problem.item[i]
								});
							}
							return a;
						})(problem.item.length)
						.sort(function (a, b) { return a.value - b.value}),
					}
				]
			};
			
			// 为echarts对象加载数据 
			myChart.setOption(option);   

		} else if (problem.type == 3) {
			// 文本题也用饼状图
			// 初始化dom
			var myChart = echarts.init(div);
			// 定义配置
			option = {
				title: {
					text: problem.title,
					left: 'left'
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},  
				series: [
					{
						name:'文本填写',
						type:'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '16',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data:[
							{value:(parseInt(Math.random()*(80-10+1)+10)), name:'有效填写'},//[10,80] 
							{value:(parseInt(Math.random()*(80-10+1)+10)), name:'无效填写'}
						]
					}
				]
			};
			// 为echarts对象加载数据 
			myChart.setOption(option);   
		}
	}		
	
	return {
		result : result
	}
	
});

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

require(['newBuilt','listPage','editPage'],function(newBuilt,listPage,editPage){
	
		window.location.hash = "#listPage";
		var list = new listPage.List();
		list.refresh();
		
	window.onhashchange = function(event){ //根据url的不同hash值跳转页面
		
		if(window.location.hash == "#newBuilt"){
			newBuilt.new_built();
			
		}else if(window.location.hash == "#listPage"){
			var list = new listPage.List();
			list.refresh();
		}
	}
});


