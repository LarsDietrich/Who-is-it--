<?php

define('FACEBOOK_APP_ID', '154182797934057');
define('FACEBOOK_SECRET', 'c8ec1022482ef76b77405945c75291ca');

echo 'PHP is up <tr>'

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
            <h1>Welcome</h1>
            <fb:login-button></fb:login-button>

            <div id="err" style="display:none">No Error</div>
            <div id="image_wrapper">
                <img id="image" src="http://who.itlater.com/adam.jpg" alt="My photo"/>
            </div>
        </div>

        <script type="text/javascript">
            var osession;

            FaceClientAPI.init('8430cdf2fe6d5f7a93944bb9d0007ee5');

            function tagger_error(err)
            {
                //console.log('Got face.com error: ' + err.error_code + ' [' + err.error_message + ']')
                if (err.error_code && err.error_message) {
                    $("#err").show().html("<b>" + err.error_code + "</b>: " + err.error_message);
                } else {
                    $("#err").show().html("<b>" + err + "</b>: ");
                }
            }
            function detectFaces() {
                console.log('Start tagger... [' + osession + ']');
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
// appId: '154182797934057',
                FB.init({apiKey: '08c94f58e2704728cb16f915d49d2c38',status: true, cookie: true, xfbml: true});

                FB.Event.subscribe('auth.sessionChange', function(response) {
                    if (response.session) {
                        console.log('FB user logged IN: ' + response.session);
                        loadFacebook2();  
                        loadFacebook();  
                    } else {
                        console.log('FB user logged OUT')
                }
            });
        </script>    
    </body>
</html>
