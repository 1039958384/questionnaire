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
	