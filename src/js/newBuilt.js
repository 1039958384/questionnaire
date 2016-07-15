
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