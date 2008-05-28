
var photos ={

	init : function(){	
		$("#go").click(function(){
			photos.dose();return false;
		}); 
		$("#pkeyw").focus(function(){ $("#pkeyw").select() }); 
	},
	
	dose : function (){
		$("#photos_l").html("loading photos from flickr.com...");
		var _tago = $("#pkeyw").val();
		var _tag = encodeURIComponent(_tago);
		var _output ="<h2>Photos From <a href='http://www.flickr.com/photos/tags/" + _tag + "'>Flickr.com</a> with tags of <span>" + _tago + "</span></h2><ul class='p_list'>";
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=" + _tag + "&format=json&jsoncallback=?", function(data){
			$.each(data.items, function(i,item){
				if ( i < 20 ){
					_output += "<li><div class='img'><a href='" + item.link + "' title='" + item.title + "' class='thickbox' ><img src='" + item.media.m + "' /></a></div><h3>" + item.title + "</h3></li>";
				}
			});
			$("#photos_l").html(_output + "</ul>");
		});
	}
	
}

$(window).bind("load",photos.dose);
$(window).bind("load",photos.init);
