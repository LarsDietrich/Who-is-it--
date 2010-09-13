<?php
$keyfile = "keys.txt";
$fh = fopen($keyfile, "r");
$fb_key = fgets($fh);
$face_key = fgets($fh);
?>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://www.facebook.com/2008/fbml">
    <head>
        <title>
            Automatic face recognition
        </title>
        <script type="text/javascript" src="jquery.js"></script>
        <script type="text/javascript" src="api_client.js"></script>
        <script type="text/javascript" src="tools.js"></script>
        <script type="text/javascript" src="tagger.js"></script>
        <script type="text/javascript" src="http://developers.face.com/site/js/jquery.tooltip.min.js"></script>
        <link rel='stylesheet' href='http://developers.face.com/site/css/tools.css' type='text/css' />
    </head>
    <body>
        <div>
        <h1>Welcome <span id="name"></span></h1>
            <fb:login-button></fb:login-button>

            <div id="err" style="display:none">No Error</div>
            <div id="image_wrapper">
                <img id="image" src="http://who.itlater.com/adam.jpg" alt="My photo"/>
            </div>
        </div>

        <script type="text/javascript">
            var osession;

            FaceClientAPI.init(<?=$face_key?>);

            function tagger_error(err)
            {
                if (err.error_code && err.error_message) {
                    $("#err").show().html("<b>" + err.error_code + "</b>: " + err.error_message);
                } else {
                    $("#err").show().html("<b>" + err + "</b>: ");
                }
            }
            function detectFaces() {
                FaceTagger.load("#image", {
                    click_add_tag: true,
                    resizable: true,
                    facebook: true,
                    fade: true,
                    tags_list: true,
                    tags_visible: true,
                    add_tag_button: true,
                    error: tagger_error,
                    demo_mode: true,
                    design: 'default'
                    });    
            }
            
            function loadFacebook()
            {
                FB.getLoginStatus(function (response) {
                    osession = response.session;
                                        detectFaces();
                });
            }

            $(document).ready(function() {  });

            </script>

            <div id="fb-root"></div>
            <script src="http://connect.facebook.net/en_US/all.js"></script>
            <script>
                FB.init({apiKey: <?=$fb_key?>, status: true, cookie: true, xfbml: true});
                FB.Event.subscribe('auth.sessionChange', function(response) {
                    if (response.session) {
                        loadFacebook2(function() { 
                            $("#name").html(getFacebookName(osession.uid + '@facebook.com', osession.uid)); });  
                        loadFacebook();  
                    } else {
                }
            });
        </script>    
    </body>
</html>
