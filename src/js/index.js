
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


