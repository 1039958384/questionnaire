define(["util","layer"],function(util,layer){
	
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
			
			//根据this.problems添加问题列表
			this.render();
			
			//生成数据占比图
			
		},
		
		//生成问题列表
		render : function(){
			var problem = document.querySelector(".body"); 
			problem.innerHTML="";			
			for(var i=0; i<this.problems.length;i++){
				var div = document.createElement("div");
				div.className="box";
				//数据占比
				var data = document.createElement("div");
				data.className="data";
				data.innerHTML="数据占比";
				div.appendChild(data);
				//标题
				var title = document.createElement("span");
				title.innerHTML = "Q"+(i+1)+" "+this.problems[i].title;
				div.appendChild(title);
				var br = document.createElement("br");
				div.appendChild(br);
				//选项
				if(this.problems[i].item != undefined){
					for(var j=0; j<this.problems[i].item.length; j++){
						var entry = document.createElement("div");
						entry.innerHTML = this.problems[i].item[j];
						div.appendChild(entry);		
					}
				}
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
		
		//生成数据占比图
		
		
	}
	
	return {
		result : result
	}
	
});