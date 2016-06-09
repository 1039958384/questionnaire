define(["util","layer"],function(util,layer){
	
	var qnPage = function(option){
		var qn = new Qn(option);
		qn.refresh();
	}
	
	function Qn(option){//传入num,标志这是第几个问卷
		this.head = option.head;
		this.state = option.state;
		this.probList = option.probList;
		this.storage = [];
		
		/*this.storage的格式
		this.storage=[
			{   //单选
			  0:1,
              1:0,
              2:0			  
			},
			{    //多选
			  0:1,
              1:1,
              2:0,
              3:1			  
			},
			{    //文本
			  true(填)/false(未填)  
			} 
		]
		
		*/
		
		/*
		   存储用户对问卷中每个问题的填写情况
		   qn-num-users=[  //-----查看数据页根据该数据渲染数据图
			   {  //(单、多选:选择不同选项的人数)
				 0: 3,
				 1: 1,
				 2: 2,
				 3: 0		
			   },
			   {  //(文本题:填或未填的人数)
				 yes : 1,
				 no : 4  
			   }
		    ]
		*/   
	};
	
	Qn.prototype = {
		//刷新页面
		refresh : function(){
			var main = document.getElementById("content");
			main.innerHTML = '<div id="qn-page">'+
			                     '<h2 class="head">'+ this.head +'</h2>'+
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
					//得到所有input和textarea,判断input.check==true? 或textarea.value.trim().length==0?
					//根据this.probList的type和this.probList[i].item记录
					
					//当有单、多选没做时，作出提示
					
					//单、多选都做了时，提示提交成功并把用户选项记录到this.storage中
					layer.layerOut({
						head : "提示",
						content : "提交成功！",
						callback : function(){
							//this.storage
					        
					        window.location.hash = "#listPage";
						}
					});
					
				}
			});
		}
	   
        //点击input或文本框时，记录下用户的选择以及文本框中是否有内容(文本题有没有做) 
        //并将用户选择存入Storage中,在查看数据页面使用		
	}
	
	
	return{
		qnPage : qnPage
	}
	
});
	