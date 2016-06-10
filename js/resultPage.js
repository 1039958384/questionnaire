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
			var body = document.getElementsByTagName("body")[0];
            var script=document.createElement("script");
            script.src = "http://echarts.baidu.com/build/dist/echarts.js";		
			body.appendChild(script);
			
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
		
		// 路径配置
		require.config({
			paths: {
				echarts: 'http://echarts.baidu.com/build/dist'
			}
		});
        
		// 定义配置
		var option;
		
		// 判断类型
		if (problem.type == 2) {
			// 多选题用柱状图
			require([
				'echarts',
				'echarts/chart/bar'
			],function(ec) {
				// 初始化dom
				var myChart = ec.init(div);
				// 定义配置
				option = {
					title: {
						text: problem.title,
						subtext: '数据随机生成'
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
									a.push(parseInt(Math.random()*(100-10+1)+10,10))
								}
								return a;
							})(problem.item.length)
						}
					]
				};
				// 为echarts对象加载数据 
				myChart.setOption(option);   
			});
		} else if (problem.type == 1) {
			// 单选题用饼状图
			require([
				'echarts',
				'echarts/chart/funnel',
				'echarts/chart/pie'
			],function(ec) {
				// 初始化dom
				var myChart = ec.init(div);
				// 定义配置
				option = {
					title: {
						text: problem.title,
						left: 'center',
						top: 20,
					},

					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},

					visualMap: {
						show: false,
						min: 80,
						max: 600,
						inRange: {
							colorLightness: [0, 1]
						}
					},
					series : [
						{
							name:'访问来源',
							type:'pie',
							radius : '55%',
							center: ['50%', '50%'],
							data:(function(len) {
								var a = [];
								var obj;
								for (var i = 0; i < len; i++) {
									a.push({
										value: (parseInt(Math.random()*(80-10+1)+10)), 
										name: problem.item[i]
									});
								}
								return a;
							})(problem.item.length)
							.sort(function (a, b) { return a.value - b.value}),
							roseType: 'angle',
							label: {
								normal: {
									textStyle: {
										color: 'rgba(255, 255, 255, 0.3)'
									}
								}
							}
						}
					]
				};
				// 为echarts对象加载数据 
				myChart.setOption(option);   
			});
		} else if (problem.type == 3) {
			// 文本题也用饼状图
			require([
				'echarts',
				'echarts/chart/funnel',
				'echarts/chart/pie'
			],function(ec) {
				// 初始化dom
				var myChart = ec.init(div);
				// 定义配置
				option = {
					title: {
						text: problem.title
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
										fontSize: '30',
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
								{value:(parseInt(Math.random()*(80-10+1)+10)), name:'有效填写'},
								{value:(parseInt(Math.random()*(80-10+1)+10)), name:'无效填写'}
							]
						}
					]
				};
				// 为echarts对象加载数据 
				myChart.setOption(option);   
			});
		}
	}		
	
	return {
		result : result
	}
	
});