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
        <script type="text/javascript" src="http://api.face.com/lib/api_client.js"></script>
        <script type="text/javascript" src="http://api.face.com/lib/tagger.js"></script>
    </head>
    <body>
        <div>
            <h1>Welcome</h1>
            <fb:login-button></fb:login-button>

            <div id="err" style="display:none">No Error</div>
            <img id="image" src="boris.jpg" alt="My photo"/>
        </div>

        <script type="text/javascript">
            var osession;

            FaceClientAPI.init('8430cdf2fe6d5f7a93944bb9d0007ee5');

            function tagger_error(err)
            {
                console.log('Got face.com error: ' + err.error_code + ' [' + err.error_message + ']')
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
            
            // Facebook Function- called when the user is connected to Facebook
            function loadFacebook()
            {
                FB.getLoginStatus(function (response) {
                    osession = response.session;
                    if (osession != null)
                    {
//                        $("#fblogin").hide();
//                        $("#fblogout").show();
                    }
                    detectFaces();
                });
            }

            $(document).ready(function(){
            });

            </script>

            <div id="fb-root"></div>
            <script src="http://connect.facebook.net/en_US/all.js"></script>
            <script>
                FB.init({appId: '154182797934057', status: true, cookie: true, xfbml: true});
                FB.Event.subscribe('auth.sessionChange', function(response) {
                    if (response.session) {
                        console.log('FB user logged IN: ' + response.session);
                        loadFacebook();  
                    } else {
                        console.log('FB user logged OUT')
                }
            });
        </script>    
    </body>
</html>