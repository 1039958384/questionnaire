
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
	     
		 
	/*this.storage = [ // 每份问卷的数据存储格式
		  {
			type : 1,
			title : "单选题",
			item : ["选项1","选项2"] 							
		  }
		  {
			type : 2,
			title : "多选题",
			item : ["选项1","选项2","选项3","选项4"]							
		  }
		  {
			type : 3,
			title : "文本题",
			
		  }
		];
	*/
});

