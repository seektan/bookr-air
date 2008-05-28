
jQuery(function($) {	
	sb($("#pkeyw").val());
	$("#go").click(function(){
	var k = $("#pkeyw").val();
		if(k){
			sb(k);return false
		}else{alert("请输入关键字");return false}
	}); 
}); 


function sb(t){
	$("#book_l").html("loading data from douban.com...");
	var bid = t;
	var bst = encodeURIComponent(t);
	var output = "";
	var btit =[],bapi =[],batu =[],bpub =[],bpud =[],bpri =[],bisb =[],burl =[],bimg =[];
	$.ajax({
	  url: "http://api.douban.com/book/subjects?q=" + bst + "&start-index=0&max-results=20&alt=json",
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

		output += "<h2><a href='" + burl[0] + "'>《" + btit[0] + "》" + btit.length + "本豆瓣同名书</a>中的第一本</h2><div class='bk'><dl class='bkd'>";
		if(bimg[0]!=undefined){output += "<dt><a href='" + burl[0] + "'><img src='" + bimg[0] + "' alt='" + btit[0] + "' /></a></dt>";}
		if(bimg[0]==undefined){output += "";}
		output += "<dd>书名：<a href='" + burl[0] + "'>" + btit[0] + "</a></dd>";
		if(batu[0]!=undefined){output += "<dd>作者：" + batu[0] + "</dd>";}
		if(bpub[0]!=undefined){output += "<dd>出版社：" + bpub[0] + "</dd>";}
		if(bpud[0]!=undefined){output += "<dd>出版时间：" + bpud[0] + "</dd>";}
		if(bpri[0]!=undefined){output += "<dd>定价：" + bpri[0] + "元</dd>";}
		output += "</dl>"; 
		if(bapi[0]!=undefined){output += "<div id='zy0'></div></div>";}


		aa(bapi[0] + "?alt=json");
		ar(bapi[0] + "/reviews?start-index=0&max-results=20&alt=json",burl[0]);



		if(bapi.length==0){
			$("#book_l").html("找不到此书相关的基本信息。");
		}else
			$("#book_l").html(output);

	  },
	  error : function(){
		$("#book_l").html("找不到此书相关的基本信息。");
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
		$("#zy0").html("我找不到你需要的相关信息。");
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
			output += "<div class='brs'><h3><a class='rh' href='" + rulr[i] + "'>" + rtit[i] + "</a><a class='rw' href='" + ralk[i] + "'>" + ratu[i] + "</a></h3>";
			output += "<p>" + rsum[i] + "</p></div>";
		}

		if(rtit.length==0){
			$("#review").html("找不到此书相关的评论。");
		}else 
			$("#review").html("<h2><a href='" + u + "reviews'>本书书评</a>豆瓣的前" + rtit.length + "条</h2>" + output); 
		

	  },
	  error : function(){
		$("#review").html("找不到此书相关的评论。");
	  }
	}); 
}