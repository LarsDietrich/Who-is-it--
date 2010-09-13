var aMethodsInputs = [];
	aMethodsInputs['faces/detect']		= '#i_urls, #i_callback_url';
	aMethodsInputs['faces/recognize']	= '#i_urls, #i_uids, #i_namespace, #i_train, #i_auth, #i_callback_url';
	aMethodsInputs['faces/group']		= '#i_urls, #i_uids, #i_namespace, #i_auth, #i_callback_url';
	aMethodsInputs['faces/train']		= '#i_uids, #i_auth, #i_namespace, #i_callback_url';	
	aMethodsInputs['faces/status']		= '#i_uids, #i_auth, #i_namespace';
	aMethodsInputs['tags/get']		= '#i_urls, #i_pids, #i_uids, #i_namespace, #i_order, #i_filter, #i_together, #i_auth';
	aMethodsInputs['tags/save']		= '#i_tids, #i_uid, #i_label, #i_tagger_id, #i_auth';
	aMethodsInputs['tags/remove']		= '#i_tids, #i_tagger_id, #i_auth';
	aMethodsInputs['facebook/get']		= '#i_uids, #i_namespace, #i_limit, #i_order, #i_filter, #i_together, #i_auth';
	aMethodsInputs['account/users']		= '#i_namespaces';
	aMethodsInputs['account/limits']	= '';
	aMethodsInputs['account/namespaces']	= '';

var aParamsInfo = [];
	aParamsInfo['urls']						= 'Comma seperated list of one or more photo URLs';
	aParamsInfo['upload']					= 'Optional: a photo to upload (urls ignored)';
	aParamsInfo['pids']						= 'Optional: photo IDs associated with photo URLs';
	aParamsInfo['uids']						= 'Comma seperated list of User Ids<br />eg:<br /><em>571756321@facebook.com, facedotcom@twitter.com</em>';
	aParamsInfo['namespace']				= 'Optional: default user ID namespace. When set, you can drop the @namespace.com when specifying uids';	
	aParamsInfo['namespaces']				= 'Required for queries related to namesapce users';
	aParamsInfo['train']					= 'Optional: when set to "true", apply training to specified users before attempting recognition';
	aParamsInfo['limit']					= 'Optional: Limit the number of returned photos per user';
	aParamsInfo['order']					= 'Optional: The order of the photos';
	aParamsInfo['filter']					= 'Optional: apply a criteria filter before returning face tags.<br />e.g.:<br />';
	aParamsInfo['together']					= 'Optional: only return photos where all the users appear together';
	aParamsInfo['search_facebook']			= 'Optional: Also search facebook photos. Applicable only when using facebook connect.';
	aParamsInfo['callback_url']				= 'Optional: Run the method asynchronously, and post the response to this url.';
	aParamsInfo['uid']						= 'Single User Id<br />eg:<br /><em>571756321@facebook.com, facedotcom@twitter.com</em>';
	aParamsInfo['label']					= 'Single free text label for the tag';
	aParamsInfo['tagger_id']				= 'Optional: The User Id of the tagger.';
	aParamsInfo['tids']						= 'Comma seperated list of Tag Ids';
	
	aParamsInfo['fb_user']				= '';
	aParamsInfo['fb_session']			= '';
	aParamsInfo['twitter_username']		= '(Basic twitter authenticatoin)';
	aParamsInfo['twitter_password']		= '(Basic twitter authenticatoin)';
	aParamsInfo['twitter_oauth_user']	= '(OAuth userid)';
	aParamsInfo['twitter_oauth_token']	= '(OAuth token)';
	aParamsInfo['twitter_oauth_secret']	= '(OAuth secret)';
	
var TAG_PADDING = 1;
var CROP_SIZE = 80;
var TAG_BORDER_SIZE = 2;
var ATTRIBUTE_THRESHOLD = 20;
var aFacebookUsers = [];
var oCurrentRequest = null;

window.setInterval(function(){
	var val = $("#upload").val();
	
	if ($("#i_upload").is(':visible')) 
	{
		$("#f_upload").val(val);
		$("#urls").val("");
	}
}, 100);


function photosCarousel_itemLoadCallback(carousel, state)
{
    for (var i = carousel.first; i <= carousel.last; i++) {
        if (carousel.has(i)) {
            continue;
        }

        if (i > samplePhotosList.length) {
            break;
        }

        carousel.add(i, "<img src='" + samplePhotosList[i-1] + "' alt='' style='width:70px; height:70px' />");         		        	
    }
};

$(function(){
	/*		
	$('.photos').jcarousel({
		scroll: 4,
		visible:8,
		size: samplePhotosList.length,
		itemLoadCallback: {onBeforeAnimation: photosCarousel_itemLoadCallback}
	});	
    */
	
	//loadFacebook();
	
	// Populate methods dropdown
	for (var method in aMethodsInputs)
		$("#method").append('<option value="' + method + '" id="method-' + method + '" ' + getMethodSelected(method) + '>' + method.replace("/", ".") + '</option>');

    /*    
	changedFormat();
	changeApiKey();
	changeMethod();
	applyPhotosDetections();
	makeOptionalsCollapsables();
	
	// Attach load event to the iframe used to upload
	$("#hifrm").load(function(){ reqSuccess($(this).contents().find("body").html()); });
	
	var params = $(".param[id!=i_auth]");
	var paramInputs = params.find("textarea, input, select");
	
	$("#upload, #f_upload").val("");
	attachNoteEvents(params);
	
	paramInputs.focus(function(){
		var param = $(this).parent();
		showParamNote(param, false);
		param.unbind("mouseleave");
	}).blur(function(){
		var param = $(this).parent();
		removeParamNote(param);
		attachNoteEvents(param);
	});

	// Remove flickr photos in case of errors
	$("#flickr-photos img").error(function(){ $(this).remove(); });
*/	
	// For manual insertion of JSON
	$("#tools div.formatjson").dblclick(function(){ 
		var content = '<div><label for="manualjson">Paste your JSON here:</label></div>' +
						'<div><textarea rows="13" cols="60" id="manualjson"></textarea></div>' +
						'<div style="text-align: center;"><input type="button" value="Parse My JSON!" id="parsemanualjson" /></div>';
		showDialog("Parse Manual JSON", content);
		$("#parsemanualjson").click(function(){
			reqSuccess($("#manualjson").val());
			closeDialog();
		})
	});
		
	//$('#facep_slider').slider();
});

function getMethodSelected(method)
{
	return (window.location.hash.length > 0 && window.location.hash.replace("#", "") == method)? 'selected="selected"' : '';
}

function attachNoteEvents(params)
{
	params.unbind("mouseenter mouseleave");
	params.mouseenter(function(){ showParamNote($(this)); }).mouseleave(function(){ removeParamNote($(this)); });
}

function showParamNote(param)
{
	var paramName = (""+param.find("label").html()).replace(":", "");
	removeParamNote();
	
	if (typeof aParamsInfo[paramName] != "undefined")
	{
		var paramContent = aParamsInfo[paramName]; 
		
		var note = $('<div class="note">');
		note.attr("id", "n_" + paramName);
		note.html('<div class="content"><h2>' + paramName + '</h2><div>' + paramContent + '</div></div>');
		
		note.appendTo($(document.body));
		note.css("left", (param.position().left + param.width() + 1) + "px");
		note.remove();
		note.appendTo(param);
	}
}

function removeParamNote(param)
{
	var paramName = ".note";
	
	if (typeof param != "undefined")
		paramName = "#n_" + (""+param.find("label").html()).replace(":", "");
	
	$(paramName).remove();
}

function setCurrentValue(option, val)
{
	val = val.replace(/</g, "&lt;").replace(/&/g, "&amp;");
	var cur = option.find(".cur");
	
	if (cur.length == 0)
	{
		cur = $('<span class="cur"></span>');
		option.find("label").after(cur);
	}
	
	cur.html('(' + val + ')');
}

function makeOptionalsCollapsables()
{
	$(".optional").each(function(){
		var option = $(this);
		var input = option.children("input, textarea, select");
		if (input.length > 0)
		{
			setCurrentValue(option, input.val());

			input.bind("change keyup", function(){
				setCurrentValue(option, $(this).val());
			});
		}
		else
		{
			input = option.children(".c");
		}
		
		var collapsible = $('<span class="collapsible">+</span>');
		option.prepend(collapsible);
		
		option.find("label, .collapsible").toggle(function(){
			input.show().focus();
			collapsible.html("-");
		}, function(){
			input.hide();
			collapsible.html("+");
		});
	});
}

function callMethod()
{
	var apiKey = $('#api_key').val();
	var apiSecret = $('#api_secret').val();
	var format = $('#format').val();
	var method = $('#method').val();
	

	if (($("#uids").is(":visible") && ($("#uids").val().indexOf("@facebook.com") != -1 || $("#namespace").val() == "facebook.com" )) && ($("#fb_user").val() == "" || ($("#fb_session").val() == "" && $("#fb_oauth_token").val() == "")))
	{
		alert("Can't check Facebook users without a Facebook user id and session");
		return false;
	}	
	
	if (method == "tags/save")
	{
		var tagIds = $('#tids').val(); 
		for (pid in samplePhotos)
		{
			if (tagIds.indexOf(samplePhotos[pid]) != -1)
			{
				alert("Can't save tags of one a sample photo. Please use another url or upload a photo");
				return false;
			}
		}			
	}
	
	$('#output').html('<img src="/site/images/loader.gif" alt="Loading..." />');
	
	var r_url = '/site/caller.php';
	var r_data = 'api_key=' + encodeURIComponent(apiKey) + '&api_secret=' + encodeURIComponent(apiSecret) + '&format=' + encodeURIComponent(format);
	var r_data_f = "";
	var a_data = [];
	var user_auth = "";
	
	$('#flickr-photos img.current').removeClass("current");
	$('#flickr-photos img[src="' + $('#urls').val() + '"]').addClass("current");
	
	var listOfParams = aMethodsInputs[method].replace("#i_auth", "#i_auth .param");
	if (listOfParams.length > 0)
	{
		$(listOfParams).each(function()
		{
			if (!$(this).hasClass("np"))
			{
				var sParam = $(this).attr("id").replace("i_", "");
				var sVal = jQuery.trim($("#" + sParam).val());
				
				if (sVal != "")
				{
					if ($(this).hasClass("user_auth"))
					{				
							user_auth += sParam + ":" + encodeURIComponent(sVal) + ",";
					}
					else
					{					
						a_data.push(sVal);
						r_data += '&' + sParam + '=' + encodeURIComponent(sVal);
						r_data_f += "&<b>" + sParam + "</b>=<em>" + sVal + "</em>";
					}
				}
			}
		});
		
		if (user_auth != "")
		{
			user_auth = user_auth.substring(0, user_auth.length - 1);
			a_data.push(user_auth);
			r_data += '&user_auth=' + user_auth;
			r_data_f += "&<b>user_auth</b>=<em>" + user_auth + "</em>";
		}
	}
	if ($('#nd:checked').length != 0)
	{
		r_data += "&nd=1";
		r_data_f += "&<b>nd</b>";
	}
	
	var toolsQueryString = window.top.location.search.substring(1);
	r_data += "&" + toolsQueryString;
	r_data_f += "&<b>" + toolsQueryString + "</b>";
	
	$('#methodCalled').html(
							"<h3>PHP Client Library:</h3>" + 
							"<div>$face->" + method.replace("/", "_") + "('" + a_data.join("','") + "');</div>" +
							"<hr />" + 
							"<h3>REST URL:</h3>" +
							"<div>" + REST_URL +  method + "." + format + "?<b>api_key</b>=<em>" + apiKey + "</em>&<b>api_secret</b>=<em>" + apiSecret + "</em>" + r_data_f
			);
	
	if (oCurrentRequest != null)
		oCurrentRequest.abort();
	
	$('#image').html('');
	
	if ($("#urls").val().length > 0)
		$("#upload, #f_upload").val("");
	
	if ($('#genJim').length != 0)
		r_data += "&genJim=1";
	
	if ($("#upload").val().length > 0)
	{
		$("#main-form").attr("action", r_url + "?method=" + method + "&" + r_data);
		$("#main-form").submit();
	}
	else
	{
		oCurrentRequest = $.ajax({
			type: 'POST',
			url: r_url,
			data: "method=" + method + "&" + r_data + "&" + new Date().getTime().toString(),
			success: reqSuccess,
			error:function(XMLHttpRequest, textStatus, errorThrown){
				$('#output, #output-raw').html(textStatus + "<br />" + errorThrown);
				oCurrentRequest = null;
			}
		});
	}
}


function reqSuccess(data)
{
	if (typeof data == "undefined" || data == "")
	{
		$('#output, #output-raw').html("Request failed, or got an empty response.");
		oCurrentRequest = null;
		return;
	}
	
	if ($('#genJim').length != 0)
	{
		$('#output, #output-raw').html(data);
		return;
	}
	
	try
	{
		var format = $('#format').val();
		var viz = true;
		var img = $('#image');
		img.html('');
		
		if (format == "json")
		{
			$('#output-raw').html(data).prepend('<div style="float: right; height: 22px; margin: -5px -5px 0 0;  width: 100px;">&#160;</div>');
			
			if (typeof data == "string")
				data = JSON.parse(data);
			
			var jsonFormat = new JSONFormatter();
			$("#output").html(jsonFormat.jsonToHTML(data));
	
			$("#output .collapsible").each(function(){
				addCollapser(this.parentNode);
			});
			$("#output .tag").each(function(){
				attachToggleTag($(this), '#' + $(this).attr('id').replace('j_', ''));
			});
			
			$("#output").mouseleave(function(){ $(".f_tag").css('opacity', '1'); });
		}
		else
		{
			$('#output-raw').html('<pre>' + data.replace(/</g, "&lt;").replace(/	/g, "&#160;") + '</pre>');
		}
		
		if (viz && format == "json")
			drawDataOnImage(data, img);
		else
			$('#output-raw').css('height', '500px');
	}
	catch(ex)
	{
		$("#output, #output-raw").html("Oops! It seems like we've hit a problem with the response.<br />Apparently there's some more work to be done. Don't worry- we're on it!");
		window.console.debug(ex);		
	}
	
	changeOutputDisplay();
	oCurrentRequest = null;
}

function showDialog(title, content)
{
	if ($("#dialog").length == 0)
	{
		$('<div id="screen" />').html("&#160;").click(closeDialog).appendTo($(document.body));
		$('<div id="dialog" />').
			html('<div class="w">' +
					'<h2>' + title + '</h2>' +
					'<div class="c">' +
						content +
					'</div>' +
					'<span class="close">Close</span>' +
				'</div>').
			appendTo($(document.body)).
			css("left", ($(document.body).width() - $("#dialog").width()) / 2 + "px").
			find("#rupload").focus();
		
		$("#dialog .close").click(closeDialog);
		
		return $("#dialog");
	}
}

function closeDialog()
{
	$("#screen, #dialog").remove();
}

function loadFacebook2(response)
{
    console.log('LoadFacebook 2');
	FB.getLoginStatus(function(response) {	
		var osession = response.session;        
		if (osession != null)
		{
			$("#fb_user").val(osession.uid);
			$("#fb_session").val(osession.session_key);
			$("#namespace").val("facebook.com").siblings(".cur").html("(facebook.com)");
			$("#search_facebook").val("true").siblings(".cur").html("(true)");
			
			$("#fblogin").hide();
			$("#fblogout").show();
			
			FB.api(
				{
					method: 'fql.query',
					query: "SELECT uid, first_name, last_name, name, pic_square, profile_url, locale  FROM user WHERE uid=" + osession.uid + " OR uid IN (SELECT uid2 FROM friend WHERE uid1 = " + osession.uid + ") ORDER BY name ASC"
				},									
				function(result){
					var friends = [{
						"uid": "friends@facebook.com",
						"pic": "/site/images/fb-logo.jpg",
						"name": "All facebook friends"
							}];
					
					for (var i=0; i<result.length; i++)
					{
						aFacebookUsers[result[i]["uid"]] = result[i]["name"];
						
						friends.push({
								"uid": result[i]["uid"],
								"pic": result[i]["pic_square"],
								"name": result[i]["name"]
						});
					}
					
					var fbFriends = $('<div id="fbfriends">');
					
					$('<span class="close">X</span>').click(hideFBFriends).appendTo(fbFriends);
					
					var search = $('<input type="text" id="fbfriends-search" value="" />');
					fbFriends.append(search);

/* BORIS                     
					search.autocomplete(friends, {
						minChars: 0,
						max: 12,
						autoFill: true,
						mustMatch: true,
						matchContains: true,
						selectFirst: true,
						scrollHeight: 220,
						formatItem: function(data, i, total, search) {
							return '<table><tr uid="' + data.uid + '">' +
										'<td><img src="' + data.pic + '" alt="" /></td>' +
					 					'<td class="name">' + data.name.replace(/</g, "&lt;") + '</td>' +
					 				'</tr></table>';
						},
						formatMatch: function(row, i, max) {
							if (row.name != null)
								return row.name;
							else
								return false;
						},
						formatResult: function(row) {
							if (row.name != null)
								return row.name;
							else
								return false;
						}
					}).result(function(event, data){
						if (typeof data != "undefined")
						{
							var uid = data.uid;
							
							var fieldId = '#uids';
							var sVal = $(fieldId).val();						
							if ($("#i_uid").is(':visible'))						
							{
								fieldId = '#uid';
								sVal = "";
								if (uid == "friends@facebook.com")
								{
									$(fieldId).val('');
									uid = "";								
								}
								else
									uid += "@facebook.com";							
							}												
							
							if (sVal.indexOf(uid) == -1)
							{
								sVal += ((sVal == "")? "" : ",") + uid;
								$(fieldId).val(sVal);
							}
						}
						
						hideFBFriends();
					});
*/
					
					search.keyup(function(e){
						if (e.keyCode == 27)
							hideFBFriends();
					});
					
					search.blur(function(e){					
							hideFBFriends();
					});
							
					$('.actions').append(fbFriends);
					$(".facebook-friends").removeClass("disabled").attr("title", "Show Facebook friends");
					hideFBFriends();
				}
			);
		}
	});
}

function showFBFriends()
{
	var fbfriends = $("#fbfriends");
	
	var left = 0;
	if ($("#i_uids").is(':visible'))
	{
		$("#i_uid").detach("#fbfriends");
		$("#i_uids").append(fbfriends);
		left = $("#uids").width(); 
	}
	else
	{
		$("#i_uids").detach("#fbfriends");
		$("#i_uid").append(fbfriends);
		left = $("#uid").width();
	}
	
	fbfriends.css({
			"top": "20px",
			"left": (left) + "px"
		}).show();
	
	$(".facebook-friends").unbind("click").click(hideFBFriends);
	
	if ($(".ac_results").css("display") != "block")
	{
		$("#fbfriends-search").val("").focus().click().click().val("");		
		window.setTimeout(function(){ $(".ac_results").show(); }, 50);
	}
	
	return false;
}
function hideFBFriends()
{
	$("#fbfriends").fadeOut(100);
	$(".facebook-friends").unbind("click").click(showFBFriends);
	return false;
}

function showTwitterFriends()
{
	var friends = $("#twitterfriends"); 
	friends.css({
			"top": "20px",
			"left": "-" + ($("#uids").width()+2) + "px"
		}).show();
	
	$(".twitter-friends").unbind("click").click(hideTwitterFriends);
	
	return false;
}
function hideTwitterFriends()
{
	$("#twitterfriends").fadeOut(100);
	$(".twitter-friends").unbind("click").click(showTwitterFriends);;
	return false;
}

function changeApiKey()
{
	if ($("#api_key").val().replace(/-/g, '') == '')
		$("#api_key option:first-child").attr("selected", true);
	
	$("#api_secret").val(apiClients[$("#api_key").val()]);

	// Hide all connect buttons if the application is not the demo (secretless app key)	
    toggleConnect();
}

function toggleConnect()
{
    var method = $('#method').val();
    var show = ($("#api_secret").val() == "" && aMethodsInputs[method].indexOf('auth') >= 0)
    if (show)
        $('#connect').fadeIn('slow');
    else
        $('#connect').fadeOut('slow');
}

function changeOutputDisplay()
{
	var format = ($("#formatjson:checked").length > 0);

	if (format && $("#formatjson").attr("disabled") == false)
	{
		$("#output-raw").hide();
		$("#output").show();
	}
	else
	{
		$("#output-raw").show();
		$("#output").hide();
	}
}

function changeMethod()
{
	var method = $('#method').val();
	window.location = "#" + method;
	
	$('#tools .actions .param').each(function(){ if(!$(this).hasClass("user_auth")) { $(this).hide(); } });
	$("#methoddoc").attr("href", "/docs/" + method.replace("/", "_") + "/");
	
    if (aMethodsInputs[method] == "")
    {
        $("#i_noparams").show();
    }
    else
    {
        $(aMethodsInputs[method]).show();
    }
	toggleConnect();
}

function toggleTag(oTag, bShow)
{
	$(oTag).parent().find('.f_tag').css({ 'opacity': (bShow? '0.4' : ''), 'filter': (bShow? 'alpha(opacity=40)' : '') });
	$(oTag).css({ 'opacity': (bShow? '1.0' : ''), 'filter': (bShow? 'alpha(opacity=100)' : '') });
}

function attachToggleTag(oElement, oTag)
{
	oElement.hover(function(e){
		$("#j_" + $(oTag).attr("id")).addClass("tag_hover");
		toggleTag(oTag, true);
	},
	function(e){
		$("#j_" + $(oTag).attr("id")).removeClass("tag_hover");
		toggleTag(oTag, false);
	});
}

function getCropUrl(tag, url, wWidth, wHeight)
{
	
	var ioX			= Math.round(tag.center.x * wWidth / 100);
	var ioY			= Math.round(tag.center.y * wHeight / 100);
	var ioWidth		= Math.round(tag.width * wWidth / 100);
	var ioHeight	= Math.round(tag.height * wHeight / 100);
	
	var iWidth		= ioWidth * TAG_PADDING * (ioHeight/ioWidth);
	var iHeight 	= ioHeight * TAG_PADDING;
	var iX			= Math.round(ioX - (iWidth/2));
	var iY			= Math.round(ioY - (iHeight/2));
	
	var url = "http://face.com/photofinder/php/crop_image.php"
			+'?photoId=' + url
			+'&tagId=' + Math.round(Math.random()*100000)
			+'&srcImage='+ url
			+'&srcX=' + iX
			+'&srcY=' + iY
			+'&srcW=' + iWidth
			+'&srcH=' + iHeight
			+'&dstW=' + CROP_SIZE
			+'&dstH=' + CROP_SIZE
			+'&tagSource=' + 2;
	

	return url;
}

function drawDataOnImage(data, img)
{	
	var tagByIds = new Array();	
			
	if (data.photos != undefined)
	{
		var maxImageWidth = 640;
		var maxImageSizeInEngine = 900;
        console.log('Starting to draw..');
		
		$.each(data.photos, function(i, item){
			var wId = "w_" + Math.round(Math.random()*100000);
			var wrapper = $('<span class="wrapper" id="' + wId + '"><img style="max-width: ' + maxImageWidth + 'px;" src="' + item.url + '" alt="" /><div class="features"></div></span>'); 
			img.append(wrapper);
            wrapper.show();

			if (item.width > maxImageSizeInEngine || item.height > maxImageSizeInEngine)
			{
				var resizedTo = "";
				var resizedWidth;
				var resizedHeight;
				if (item.width > item.height)
				{	
					resizedWidth = maxImageSizeInEngine;
					resizedHeight = Math.round((resizedWidth / item.width) * item.height);					 
				}
				else
				{
					resizedHeight = maxImageSizeInEngine;
					resizedWidth = Math.round((resizedHeight / item.height) * item.width);
				}			
					
				img.append('<h3 id="resize-msg" style="margin-bottom:15px;font-size:14px">This photo was resized-down to ' + resizedWidth + 'x' + resizedHeight + ' during recognition</h3>');
			}
			
			var ratio = 1;
			if (item.width > maxImageWidth)
				ratio = maxImageWidth/item.width;
			
			item.width *= ratio;
			item.height *= ratio;
	
			var oFeatures = wrapper.find(".features");
			if (item.tags != undefined)
			{
				$.each(item.tags, function(i, tag){
					
					var tagData = new Object();
					tagData.tag = tag;
					tagData.photoWidth = item.width;
					tagData.photoHeight = item.height;
					tagData.url = item.url;					
					tagByIds[tag.tid] = tagData;
					
					var uid = "";
					var confidence = 0;
					if (tag.uids.length > 0 && tag.uids[0].confidence > tag.threshold)					
					{
						uid = tag.uids[0].uid;
						confidence = tag.uids[0].confidence;
					}
						
					var name = tag.label || uid;

                    console.log('Drawing for: ' + name);
					
					name = (name == undefined || name == '') && (tag.gid != null) ? "Group " + tag.gid : name;
					name = (name == undefined || name == '')? "Unknown" : name;
					
					name = getFacebookName(uid, name);

                    console.log('Got facebook name: ' + name);
					
					var oTag = drawTag('#' + wId, name, img, tag.center.x, tag.center.y, tag.width, tag.height, item.width, item.height, tag.uids);
					var oInnerTag = oTag.find(".f_inner_tag");
					
					attachToggleTag(oInnerTag, oTag);
					
					if (tag.manual == false)
					{
						var points = [
						            { point: tag.eye_left, 		title: 'Left eye: (eye_left.x, eye_left.y)' },
						            { point: tag.eye_right,		title: 'Right eye: (eye_right.x, eye_right.y)' },
						            { point: tag.mouth_left,	title: 'Left mouth: (mouth_left.x, mouth_left.y)' },
						            { point: tag.mouth_center,	title: 'Center mouth: (mouth_center.x, mouth_center.y)' },
						            { point: tag.mouth_right,	title: 'Right mouth: (mouth_right.x, mouth_right.y)' },
						            { point: tag.nose,			title: 'Nose: (nose.x, nose.y)' },
						            { point: tag.ear_left,			title: 'Ear: (ear_left.x, ear_left.y)' },
						            { point: tag.ear_right,			title: 'Ear: (ear_right.x, ear_right.y)' },
						            { point: tag.chin,			title: 'chin: (chin.x, chin.y)' }
									];
						
						var sTooltip = '<table>';
						
						/* --- ATTRIBUTES --- */
						sTooltip += "<tr><td colspan='2' class='t'>Attributes:</td></tr>";
						$.each(tag.attributes, function(i, attr){
							if (i == 'face')
							{
								sTooltip += "<tr><td class='k'>" + i + ":</td><td class='v'>" + attr.value + " (" + attr.confidence + ')' + "</td></tr>";
								oTag.attr("facep", attr.confidence);
							}
							else
							{
								sTooltip += "<tr><td class='k'>" + i + ":</td><td class='v'>" + attr.value + " (" + attr.confidence + '%)' + "</td></tr>";
							}
						});
						
						/* --- ROTATIONS --- */
						sTooltip += "<tr><td colspan='2' class='t'>Rotations:</td></tr>";
						sTooltip += "<tr><td class='k'>roll:</td><td class='v'>" + tag.roll + "°</td></tr>";
						sTooltip += "<tr><td class='k'>yaw:</td><td class='v'>" + tag.yaw + "°</td></tr>";
						sTooltip += "<tr><td class='k'>pitch:</td><td class='v'>" + tag.pitch + "°</td></tr>";
						
						/* --- RECOGNITIONS --- */
						var highConfidenceIndex = 0;
						for (var j=0; j<tag.uids.length; j++)
						{
							if (j == 0) sTooltip += "<tr><td colspan='2' class='t'>High Confidence Recognitions:</td></tr>";
							
							if (tag.threshold > tag.uids[j].confidence)
							{
								highConfidenceIndex = j;
								if (j == 0)
									sTooltip += "<tr><td class='k'>none</td></tr>";
								break;								
							}															
							
							sTooltip += "<tr><td class='k'>" + getFacebookName(tag.uids[j].uid) + ":</td><td class='v'>" + tag.uids[j].confidence + "</td></tr>";
							highConfidenceIndex++;
						}
						
						for (var j=highConfidenceIndex; j<tag.uids.length ; j++)
						{														
							if (j - highConfidenceIndex > 5)
							{
								sTooltip += "<tr><td class='k'>...</td></tr>";
								break;
							}
							
							if (j == highConfidenceIndex) sTooltip += "<tr><td colspan='2' class='t'>Low Confidence Recognitions:</td></tr>";
							sTooltip += "<tr><td class='k'>" + getFacebookName(tag.uids[j].uid) + ":</td><td class='v'>" + tag.uids[j].confidence + "</td></tr>";							
						}
						
						
						sTooltip += "</table>";
						
						rotateObject(oInnerTag, tag.roll);
						
         				oTag.tooltip({
							track: true,
							delay: 0,
							extraClass: "tooltipTag",
							bodyHandler: function() {
								return sTooltip;
							}
						});

						var tagX = oTag.position().left;
						var tagY = oTag.position().top;
/* BORIS						
						for (var i=0; i<points.length; i++)
						{
							var point = points[i].point;
							if (point != null)
							{
								var x = point.x * item.width / 100 - tagX;
								var y = point.y * item.height / 100 - tagY;
								
								var oDot = $('<span class="dot">&#160;</span>');
									oDot.css('top', Math.round(y) + "px")
										.css('left', Math.round(x) + "px")
										.attr('title', points[i].title + ".  (" + point.x + "," + point.y + ")")
										.appendTo(oTag);
								attachToggleTag(oDot, oTag);
							}
						}
                        */
					}
				});
			}
		});		
	}
	
	if (data.groups != undefined)
	{
		//window.console.log(tagByIds);
		
		var clustersList = $('<ul>');		
		$.each(data.groups, function(i, cluster){
									
			var clusterLi = $('<li>');
			var thumbsList = $('<ul>');			
			
			var clusterId = cluster.uid != null ? cluster.uid : (cluster.gid != null) ? "Group " + cluster.gid : "ungrouped"; 
			clusterLi.append("<span>" + clusterId + "</span>") 
			
			$.each(cluster.tids, function(j, tidInCluster){
								
				var tagData = tagByIds[tidInCluster];				
								
				var wId = "w_" + Math.round(Math.random()*100000);
				thumbsList.append('<li style="display:inline"><img src="' + getCropUrl(tagData.tag, tagData.url, tagData.photoWidth, tagData.photoHeight) + '" alt="" /></li>');				
			});
			
			clusterLi.append(thumbsList);
			clustersList.append(clusterLi);			
			clustersList.append("<hr/>");
		});
				
		clustersList.append("<li style='clear:both'></li>");
		img.prepend(clustersList);
	}	
}

function getFacebookName(uid, defaultName)
{
	defaultName = defaultName || uid;
	
	if (uid.indexOf("@facebook.com" != -1))
	{
		var uid = uid.substring(0, uid.indexOf("@facebook.com"));
		return (aFacebookUsers[uid] != undefined)? aFacebookUsers[uid] : defaultName;
	}
	
	return defaultName;
}

function rotateObject(o, deg)
{
	deg = Math.round(deg);
	o.css("-moz-transform", "rotate(" + deg + "deg)") .
	  css("-webkit-transform", "rotate(" + deg + "deg)") .
	  css("transform", "rotate(" + deg + "deg)");
	
	// for crappy browsers which don't support CSS3 (IE)
	// This is commented out because when rotating an element inside an element with the same size IE gets buggy.
	/*
	var rad = deg * (Math.PI * 2 / 360);
    var costheta = Math.cos(rad);
    var sintheta = Math.sin(rad);
	o.css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11=" + costheta + ", M12=" + -sintheta + ", M21=" + sintheta + ", M22=" + costheta + ", SizingMethod='auto expand')");
	*/
}

function drawTag(oWrapper, sName, oImage, _iX, _iY, _iWidth, _iHeight, wWidth, wHeight, uids)
{
	oWrapper = $(oWrapper);
	
	var ioX			= Math.round(_iX * wWidth / 100);
	var ioY			= Math.round(_iY * wHeight / 100);
	var ioWidth		= Math.round(_iWidth * wWidth / 100);
	var ioHeight	= Math.round(_iHeight * wHeight / 100);
	
	var iWidth		= ioWidth*TAG_PADDING;
	var iHeight 	= ioHeight*TAG_PADDING;
	var iX			= Math.round(ioX - (iWidth/2)) - TAG_BORDER_SIZE;
	var iY			= Math.round(ioY - (iHeight/2)) - TAG_BORDER_SIZE;

//	
//	if (iX < 0) iX = 0;
//	if (iY < 0) iY = 0;
//	
//	if (iX+iWidth > wWidth) iX = wWidth - iWidth; 
//	if (iY+iHeight > wHeight) iY = wHeight - iHeight;
	
	var pxStyle = 'top: ' +  Math.round(iY) + 'px; left: ' +  Math.round(iX) + 'px; width: ' +  Math.round(iWidth) + 'px; height: ' +  Math.round(iHeight) + 'px;';
	var perStyle = 'top: ' + _iY + '%; left: ' + _iX + '%; width: ' + _iWidth + '%; height: ' + _iHeight + '%';
	
	var oTag = $('<div id="tag_' + Math.round(_iX) + '_' + Math.round(_iY) + '" class="f_tag f_tag_trans" style="' + pxStyle + '">' +
				'<div class="f_inner_tag" style="border-width:' + TAG_BORDER_SIZE + 'px; left:-' + TAG_BORDER_SIZE + 'px; top:-' + TAG_BORDER_SIZE + 'px; position:relative;">' +
						'<div class="f_tag_caption">' +// ((sName == 'Unknown') ? ' style="display:none;">' : '>') + 
								'<span>' + sName.replace(/</g, "&lt;") + '</span>' + 
						'</div>' +
						((uids.length > 1)? '<div class="f_tag_more">**</div>' : '') +
					'</div>' +
				'</div>');	
	
	oWrapper.append(oTag);
	
	return oTag;
}

function changedFormat()
{
	var format = $("#format").val();

	$("#formatjson").attr("disabled", format == "xml");
	$(".formatjson").removeClass("disabled").addClass((format == "xml")? "disabled" : "");
}

function loadFlickr()
{
	$("#flickr").append('<img src="images/loader.gif" alt="Loading..." id="flickr-loading" />');
	$("#flickr-photos").html('');
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=face&format=json&jsoncallback=?", function(data){
	  $.each(data.items, function(i,item){
	    $("<img/>").attr("src", item.media.m).appendTo("#flickr-photos");
	    if (i+1 == Math.round(data.items.length/2))
	    	$("#flickr-photos").append("<br />");
	  });
	  $("#flickr-loading").remove();
	  applyPhotosDetections();
	});
}

function applyPhotosDetections()
{
	$("#flickr-photos img").live('click', (function(){ detectPhoto(this.src); }));
}

function detectPhoto(src)
{
	$("#urls").val(src);
	callMethod();
}

function JSONFormatter()
{
	this.htmlEncode = function(t)
	{
		return t != null ? t.toString().replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;") : '';
	}
	
	this.decorateWithSpan = function(value, className)
	{
		return '<span class="' + className + '">' + this.htmlEncode(value) + '</span>';
	}
 
	// Convert a basic JSON datatype (number, string, boolean, null, object, array) into an HTML fragment.
	this.valueToHTML = function(value, bTags)
	{
		var valueType = typeof value;
		
		var output = "";
		if (value == null) {
			output += this.decorateWithSpan('null', 'null');
		}
		else if (value && value.constructor == Array) {
			output += this.arrayToHTML(value, bTags);
		}
		else if (valueType == 'object') {
			output += this.objectToHTML(value, bTags);
		}
		else if (valueType == 'number') {
			output += this.decorateWithSpan(value, 'num');
		}
		else if (valueType == 'string') {
			if (/^(http|https):\/\/[^\s]+$/.test(value)) {
				output += '<a href="' + value + '" target="_blank">' + this.htmlEncode(value) + '</a>';
			} else {
			output += this.decorateWithSpan('"' + value + '"', 'string');
			}
		}
		else if (valueType == 'boolean') {
			output += this.decorateWithSpan(value, 'bool');
		}
		
		return output;
	}
 
	// Convert an array into an HTML fragment
	this.arrayToHTML = function(json, bTags)
	{
		var output = '[<ul class="array collapsible">';
		var hasContents = false;
		
		for (var prop in json)
		{
			hasContents = true;
			if ((bTags))
				output += '<li id="j_tag_' + Math.round(json[prop].center.x) + '_' + Math.round(json[prop].center.y) + '" class="tag">';
			else
				output += '<li>';
			output += this.valueToHTML(json[prop]);
			output += '</li>';
		}
		output += '</ul>]';
		
		if (!hasContents)
			output = "[ ]";
		
		return output;
	}
 
	//Convert a JSON object to an HTML fragment
	this.objectToHTML = function(json, bTags)
	{
		var output = '{<ul class="obj collapsible">';
		var hasContents = false;
		
		for (var prop in json)
		{
			hasContents = true;
			output += '<li>';
			output += '<span class="prop">' + this.htmlEncode(prop) + '</span>: '
			output += this.valueToHTML(json[prop], (prop == "tags"));
			output += '</li>';
		}
		output += '</ul>}';
		
		if (!hasContents)
			output = "{ }";
		
		return output;
	}
 
	this.jsonToHTML = function(json, callback, uri)
	{
		return '<div id="json">' + this.valueToHTML(json) + '</div>';
	}
}

function collapse(evt)
{
	var collapser = (typeof event != "undefined")? event.srcElement : evt.target;
	var target = $(collapser.parentNode).find('.collapsible');
	
	if (!target.length)
		return;
	
	target = target[0];
	
	if (target.style.display == 'none')
	{
		var ellipsis = $(target.parentNode).find('.ellipsis')[0];
		target.parentNode.removeChild(ellipsis);
		target.style.display = '';
	}
	else
	{
		target.style.display = 'none';
		
		var ellipsis = document.createElement('span');
		ellipsis.className = 'ellipsis';
		ellipsis.innerHTML = ' &hellip; ';
		target.parentNode.insertBefore(ellipsis, target);
	}
	
	collapser.innerHTML = (collapser.innerHTML == '-') ? '+' : '-';
}

function addCollapser(item)
{
	if (item.nodeName != 'LI')
		return;

	var collapser = document.createElement('div');
	collapser.className = 'collapser';
	collapser.innerHTML = '-';
	collapser.onclick = collapse;
	item.insertBefore(collapser, item.firstChild);
}

if (typeof RegExp.escape != 'function')
{
	RegExp.escape = function(text) {
	  if (!arguments.callee.sRE) {
	    var specials = [
	      '/', '.', '*', '+', '?', '|',
	      '(', ')', '[', ']', '{', '}', '\\'
	    ];
	    arguments.callee.sRE = new RegExp(
	      '(\\' + specials.join('|\\') + ')', 'g'
	    );
	  }
	  return text.replace(arguments.callee.sRE, '\\$1');
	}
}

function showUploadField()
{
	$("#i_upload").show();
	$("#i_urls").hide();
}

function showUrlsField()
{
	$("#i_upload").hide();
	$("#i_urls").show();
}
