<?php
# Get cleaned parameter
$file = preg_replace('/[^a-zA-Z0-9.]/', '_', $_GET['file']);

if (!$file || !file_exists("upload/".$file)) 
{
    header("Location: upload.php");
    exit();
}

$keyfile = "keys.txt";
$fh = fopen($keyfile, "r");
$fb_key = fgets($fh);
$face_key = fgets($fh);
$local = fgets($fh);
if ($local == 'debug'.chr(10)) 
    $DEBUG = true;
else
    $DEBUG = false;
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
<?php
        if ($DEBUG)
            echo "debug mode";
        else
            echo "Prod";
?>
        <h1>Welcome <span id="name"></span></h1>
            <div id="fb_login" style="display:none">
                <p>Please loging with Facebook so we can try matching this photos with your friends</p>
                <fb:login-button></fb:login-button>
            </div>

            <div id="err" style="display:none">No Error</div>
            <div id="image_wrapper">
                <img id="image" 
<?php
                if ($DEBUG)
                    echo 'src="http://who.itlater.com/adam.jpg"';
                else
                    echo 'src="upload/'.$file.'"';
?>
                    alt="My photo"/>
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
            
            function facebookReady()
            {
                $("#name").html(getFacebookName(osession.uid + '@facebook.com', osession.uid));  
                detectFaces();
            }

            $(document).ready(function() {  });

            </script>

            <div id="fb-root"></div>
            <script src="http://connect.facebook.net/en_US/all.js"></script>
            <script>
                FB.init({apiKey: <?=$fb_key?>, status: true, cookie: true, xfbml: true});
                FB.getLoginStatus(function(response) {
                    if (response.session) {
                        $("#fb_login").hide();
                    } else {
                        $("#fb_login").show();
                    }
                });

                FB.Event.subscribe('auth.sessionChange', function(response) {
                    if (response.session) {
                        osession = response.session;
                        loadFacebook(facebookReady);
                    } else {
                }
            });
        </script>    
    </body>
</html>
