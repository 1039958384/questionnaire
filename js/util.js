
/***问卷网站用到的工具方法****/
define(function(){
	
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