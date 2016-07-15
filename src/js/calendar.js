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