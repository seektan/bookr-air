
var douban = {

	t  : '思维的乐趣',

	jsurl : function(){
		var _t = encodeURIComponent(this.t);
		return 'http://api.douban.com/book/subjects?q=' + this.t + '&alt=xd&callback=douban.book';
	},

	adjs : function(url){
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.src = url;
		script.type = 'text/javascript';
		head.appendChild(script);
	},

	book : function(book){
		var output = "";
		var btit =[],bapi =[],batu =[],bpub =[],bpud =[],bpri =[],bisb =[],burl =[],bimg =[];
		for(var i=0;i<book.entry.length;i++){
			if( book.entry[i]["title"]["$t"] === this.t){ 

				batu.push(book.entry[i]["author"][0]["name"]["$t"]);
				btit.push(book.entry[i]["title"]["$t"]);

				for(var j=0; j<book.entry[i]["db:attribute"].length;j++){
					var qr = book.entry[i]["db:attribute"][j]["$t"]; 
					var qn = book.entry[i]["db:attribute"][j]["@name"];
						if(qn == "publisher"){bpub.push(qr);}
						if(qn == "pubdate"){ bpud.push(qr);}
						if(qn == "price"){ bpri.push(qr);}
				}

				for(var j=0; j<book.entry[i]["link"].length;j++){
					var qr = book.entry[i]["link"][j]["@href"]; 
					var qn = book.entry[i]["link"][j]["@rel"];
						if(qn == "self"){bapi.push(qr);}
						if(qn == "alternate"){ burl.push(qr);}
						if(qn == "image"){ bimg.push(qr);}
				}

				bapi.push(book.entry[i]["id"]["$t"]);
			}
		}
		output += "<h2><a href='" + burl[0] + "'>《" + btit[0] + "》</a>的豆瓣书评</h2><div class='bk'><dl class='bkd'>";
		if(bimg[0]!=undefined){output += "<dt><a href='" + burl[0] + "'><img src='" + bimg[0] + "' alt='" + btit[0] + "' /></a></dt>";}
		if(bimg[0]==undefined){output += "";}
		output += "<dd>书名：<a href='" + burl[0] + "'>" + btit[0] + "</a></dd>";
		if(batu[0]!=undefined){output += "<dd>作者：" + batu[0] + "</dd>";}
		if(bpub[0]!=undefined){output += "<dd>出版社：" + bpub[0] + "</dd>";}
		if(bpud[0]!=undefined){output += "<dd>出版时间：" + bpud[0] + "</dd>";}
		if(bpri[0]!=undefined){output += "<dd>定价：" + bpri[0] + "元</dd>";}
		output += "</dl><div id='revs'></div></div>";

		this.adjs( bapi[0]+'/reviews?alt=xd&callback=douban.reviews' );

		if (btit[0]!=undefined){document.getElementById("book_l").innerHTML = output;}
		else{document.getElementById("book_l").innerHTML = "<h2>对不起，找不到《" + this.t + "》相关的数据！</h2>"}
	},

	reviews : function(reviews){
		var output = "";
		var rtit = [],rsum = [],rtim = [],ratu = [],ralk = [],rulr = [];
		for(var i in reviews.entry){

			for(var j=0; j<reviews.entry[i]["author"]["link"].length;j++){
				var qr = reviews.entry[i]["author"]["link"][j]["@href"]; 
				var qn = reviews.entry[i]["author"]["link"][j]["@rel"];
					if(qn == "alternate"){ ralk.push(qr);}
			}

			for(var j=0; j<reviews.entry[i]["link"].length;j++){
				var qr = reviews.entry[i]["link"][j]["@href"]; 
				var qn = reviews.entry[i]["link"][j]["@rel"];
					if(qn == "alternate"){ rulr.push(qr);}
			}

			rtit.push(reviews.entry[i]["title"]["$t"]);
			ratu.push(reviews.entry[i]["author"]["name"]["$t"]);
			rsum.push(reviews.entry[i]["summary"]["$t"]);
			rtim.push(reviews.entry[i]["published"]["$t"]);

		}

		for(var i=0; i<rtit.length;i++){
			output += "<div class='brs'><h3><a class='rh' href='" + rulr[i] + "'>" + rtit[i] + "</a><a class='rw' href='" + ralk[i] + "'>" + ratu[i] + "</a></h3>";
			output += "<p>" + rsum[i] + "</p></div>";
		}

		if(rtit.length==0){
			document.getElementById("revs").innerHTML = "找不到此书相关的评论。";
		}else 
			document.getElementById("revs").innerHTML = output; 
	},

	init : function(){
		douban.adjs(douban.jsurl());
	},

	addEvent : function(elm, evType, fn, useCapture){
		if (elm.addEventListener) 
		{
			elm.addEventListener(evType, fn, useCapture);
			return true;
		} else if (elm.attachEvent) {
			var r = elm.attachEvent('on' + evType, fn);
			return r;
		} else {
			elm['on' + evType] = fn;
		}
	}
}


douban.addEvent(window,"load",douban.init,false);

 window.onload = function(){
	document.getElementById("go").onclick = function(){
		var k =document.getElementById("pkeyw").value;
		if(k){
			douban.t = k;
			douban.init();return false
		}else{alert("请输入关键字");return false}
	}
}