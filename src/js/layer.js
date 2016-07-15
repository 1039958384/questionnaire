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
					} else if(left>util.getViewport().width + util.scroll().left -_this.offsetWidth){//浏览器视口的右边缘
						left=util.getViewport().width + util.scroll().left-_this.offsetWidth;
					}
					if(top<0){//浏览器视口的上边缘
						top=0;
					}else if(top>util.getViewport().height + util.scroll().top -_this.offsetHeight){//浏览器视口的下边缘
						top=util.getViewport().height+ util.scroll().top-_this.offsetHeight;
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