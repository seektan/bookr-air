/*
Author Seektan | http://hi.baidu.com/webworker/ @2008-4-25
*/

jQuery(function($) {	
	$("#fm").submit(function(){
	  var k = $("#bs")[0],b = $(".bk")[0], p = $(".ps")[0];
		if(k.value){
			if(b.checked){sb(k.value);;return false}
			else if(p.checked){ap(k.value);;return false}
			else{alert("请选择搜索类型");return false}
		}else{alert("请输入关键字");return false}
	}); 

	$("#bs").focus(function(){  if ($("#bs").val() =="请输入关键字并回车"){$("#bs").val("")}	}); 
	$("#bs").blur(function(){  if ($("#bs").val() ==""){$("#bs").val("请输入关键字并回车")}	}); 

	$("#tips").click(function(){	$("#tips dd").toggle("slow");	});
}); 



//books and it's related reviews search
function sb(t){
	$("#book").html("<p class='err'>数据加载中。。。如果时间过长，请重新查询</p>");
	var bid = t;
	var bst = encodeURIComponent(t);
	var output = "";
	var btit =[],bapi =[],batu =[],bpub =[],bpud =[],bpri =[],bisb =[],burl =[],bimg =[];
	$.ajax({
	  url: "http://api.douban.com/book/subjects?q=" + bst + "&start-index=0&max-results=15&alt=json",
	  cache: false,
	  success: function(data){
		var book = eval("(" + data + ")");
		for(var i=0;i<book.entry.length;i++){
			if( book.entry[i]["title"]["$t"] === bid){ 

				batu.push(book.entry[i]["author"][0]["name"]["$t"]);
				btit.push(book.entry[i]["title"]["$t"]);

				for(var j in book.entry[i]["db:attribute"]){
					var qr = book.entry[i]["db:attribute"][j]["$t"]; 
					var qn = book.entry[i]["db:attribute"][j]["@name"];
						if(qn == "publisher"){bpub.push(qr);}
						if(qn == "pubdate"){ bpud.push(qr);}
						if(qn == "price"){ bpri.push(qr);}
				}

				for(var j in book.entry[i]["link"]){
					var qr = book.entry[i]["link"][j]["@href"]; 
					var qn = book.entry[i]["link"][j]["@rel"];
						if(qn == "self"){bapi.push(qr);}
						if(qn == "alternate"){ burl.push(qr);}
						if(qn == "image"){ bimg.push(qr);}
				}

				bapi.push(book.entry[i]["id"]["$t"]);
			}
		}

		output += "<div class='bk'><h2>基本信息<span>（<a href='" + burl[0] + "' target='_blank'>" + btit.length + "本同名书中的1本</a>）</span></h2><dl class='bkd'>";
		if(bimg[0]!=undefined){output += "<dt><img src='" + bimg[0] + "' alt='" + btit[0] + "' /></dt>";}
		if(bimg[0]==undefined){output += "<dt></dt>";}
		output += "<dd>书名：" + btit[0] + "</dd>";
		if(batu[0]!=undefined){output += "<dd>作者：" + batu[0] + "</dd>";}
		if(bpub[0]!=undefined){output += "<dd>出版社：" + bpub[0] + "</dd>";}
		if(bpud[0]!=undefined){output += "<dd>出版时间：" + bpud[0] + "</dd>";}
		if(bpri[0]!=undefined){output += "<dd>定价：" + bpri[0] + "元</dd>";}
		output += "</dl></div>"; 
		if(bapi[0]!=undefined){output += "<div id='zy0'></div>";}


		aa(bapi[0] + "?alt=json");
		ar(bapi[0] + "/reviews?start-index=0&max-results=15&alt=json",burl[0]);



		if(bapi.length==0){
			$("#book").html("<p class='err'>找不到此书相关的基本信息。</p>");
		}else
			$("#book").html(output);

	  },
	  error : function(){
		$("#book").html("<p class='err'>找不到此书相关的基本信息。</p>");
	  }
	}); 
}
//book's abstract
function aa(ap){
	$.ajax({
	  url: ap,
	  cache: false,
	  success: function(data){
		var dat = eval("(" + data + ")");
		if(!!dat["summary"]){
			var sum  = dat["summary"]["$t"];
			$("#zy0").html("<p>" + sum + "</p>"); 
		}
		else $("#zy0").html("<p>暂无内容简介。</p>"); 
	  },
	  error : function(){
		$("#tab").html("<p class='err'>我找不到你需要的相关信息。</p>");
	  }
	}); 
}
//book's related reviews search
function ar(ap,u){
	$.ajax({
	  url: ap,
	  cache: false,
	  success: function(data){
		var reviews = eval("(" + data + ")");
		var output = "";
		var rtit = [],rsum = [],rtim = [],ratu = [],ralk = [],rulr = [];
		for(var i in reviews.entry){

			for(var j in reviews.entry[i]["author"]["link"]){
				var qr = reviews.entry[i]["author"]["link"][j]["@href"]; 
				var qn = reviews.entry[i]["author"]["link"][j]["@rel"];
					if(qn == "alternate"){ ralk.push(qr);}
			}

			for(var j in reviews.entry[i]["link"]){
				var qr = reviews.entry[i]["link"][j]["@href"]; 
				var qn = reviews.entry[i]["link"][j]["@rel"];
					if(qn == "alternate"){ rulr.push(qr);}
			}

			rtit.push(reviews.entry[i]["title"]["$t"]);
			ratu.push(reviews.entry[i]["author"]["name"]["$t"]);
			rsum.push(reviews.entry[i]["summary"]["$t"]);
			rtim.push(reviews.entry[i]["published"]["$t"]);

		}

		for(var i in rtit){
			output += "<div class='brs'><ul>";
			output += "<li class='rt'><a href='" + rulr[i] + "' target='_blank'>" + rtit[i] + "</a></li>";
			output += "<li>评论者：<a href='" + ralk[i] + "' target='_blank'>" + ratu[i] + "</a><span>评论时间：</span>" + rtim[i].substr(0,10) + "</li>";
			output += "<li class='rs'><p>" + rsum[i] + "</p></li>";
			output += "</ul></div>"; 
		}

		if(rtit.length==0){
			$("#review").html("<p class='err'>找不到此书相关的评论。</p>");
		}else 
			$("#review").html("<h2>相关评论<span>（<a href='" + u + "reviews' target='_blank'>调用了豆瓣的前" + rtit.length + "条</a>）</span></h2>" + output); 
		

	  },
	  error : function(){
		$("#review").html("<p class='err'>找不到此书相关的评论。</p>");
	  }
	}); 
}



//people's collection of books and his reviews
function ap(t){
	$("#book").html("<p class='err'>数据加载中。。。如果时间过长，请重新查询</p>");
	var ts = encodeURIComponent(t);
	var output = "";
	var btit =[],burl =[],bapi =[],bimg =[];
	var baul = null;
	$.ajax({
	  url: "http://api.douban.com/people/" + ts + "/collection?cat=book&start-index=0&max-results=15&alt=json",
	  cache: false,
	  success: function(data){
		var book = eval("(" + data + ")");

		var taol = book["opensearch:totalResults"]["$t"];

		for(var x in book["author"]["link"]){
			var qr = book["author"]["link"][x]["@href"]; 
			var qn = book["author"]["link"][x]["@rel"];
				if(qn == "alternate"){baul = qr;}
		}

		for(var i in book.entry){

			btit.push(book.entry[i]["db:subject"]["title"]["$t"]);
			
			for(var j in book.entry[i]["db:subject"]["link"]){
				var qr = book.entry[i]["db:subject"]["link"][j]["@href"]; 
				var qn = book.entry[i]["db:subject"]["link"][j]["@rel"];
					if(qn == "alternate"){burl.push(qr);}
					if(qn == "image"){bimg.push(qr);}
					if(qn == "self"){bapi.push(qr);}
			}

		}
		
		output += "<h2><a href='" + baul + "' target='_blank'>" + t +" 在豆瓣上收藏的图书</a><span>（调用了前"+ btit.length + "条）</span></h2><div class='pbs'><ul>";

		for(var i in btit){
			if(bimg[i]!=undefined){output += "<li><img src='" + bimg[i] + "' alt='" + btit[i] + "' />";}
			output += "<a href='" + burl[i] + "'>" + btit[i] + "</a></li>";
		}

		output += "</ul></div>"

		if(btit.length==0){
			$("#book").html("<p class='err'>找不到此豆瓣用户相关的收藏。</p>");
		}else 
			$("#book").html(output);

	  },
	  error : function(){
		$("#book").html("<p class='err'>找不到此豆瓣用户相关的收藏。</p>");
	  }
	}); 

	$.ajax({
	  url: "http://api.douban.com/people/" + t + "/reviews?start-index=1&max-results=15&alt=json",
	  cache: false,
	  success: function(data){
		var dlk = "http://www.douban.com/people/" + t + "/reviews";
		var output = "";
		var reviews = eval("(" + data + ")"); 
		var ptit = [],ptim = [],psum = [],purl = [],pobj = [],pobjl = [],pobji = [];
		for(var i in reviews.entry){

			for(var j in reviews.entry[i]["db:subject"]["link"]){
				var qr = reviews.entry[i]["db:subject"]["link"][j]["@href"]; 
				var qn = reviews.entry[i]["db:subject"]["link"][j]["@rel"];
					if(qn == "alternate"){ pobjl.push(qr);}
					if(qn == "image"){ pobji.push(qr);}
			}

			for(var j in reviews.entry[i]["link"]){
				var qr = reviews.entry[i]["link"][j]["@href"]; 
				var qn = reviews.entry[i]["link"][j]["@rel"];
					if(qn == "alternate"){ purl.push(qr);}
			}

			ptit.push(reviews.entry[i]["title"]["$t"]);
			psum.push(reviews.entry[i]["summary"]["$t"]);
			ptim.push(reviews.entry[i]["published"]["$t"]);
			pobj.push(reviews.entry[i]["db:subject"]["title"]["$t"]);

		}

		for(var i in ptit){
			output += "<div class='brs'><ul>";
			output += "<li class='rt'><a href='" + purl[i] + "' target='_blank'>" + ptit[i] + "</a></li>";
			output += "<li>评: <a href='" + pobjl[i] + "' target='_blank'>《" + pobj[i] + "》</a></li>";
			output += "<li>" + ptim[i].substr(0,10) + "</li>";
			output += "<li class='rs'><p>";
			if(pobji[i]!=undefined){output += "<img src='" + pobji[i] + "' alt='" + pobj[i] + "'/>";}
			output += psum[i] + "</p></li>";
			output += "</ul></div>"; 
		}


		if(ptit.length==0){
			$("#review").html("<p class='err'>找不到此豆瓣用户相关的评论。</p>");
		}else 
			$("#review").html("<h2><a href='" + dlk + "' target='_blank'>" + t + " 在豆瓣上的评论</a><span>（调用了前" + ptit.length + "条）</span></h2>" + output); 

	  },
	  error : function(){
		$("#review").html("<p class='err'>找不到此豆瓣用户相关的评论。</p>");
	  }
	}); 
}