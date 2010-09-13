<?php
function getRandomChar() {
    $str = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return $str[rand(0,strlen($str)-1)]; 
}

function getRandomString($size) {
    $val = '';
    for ($i = 0; $i < $size; $i++)
        $val .= getRandomChar();
    return $val;
}

$MAX_SIZE = 1024*100;
$ext = $_FILES["file"]["type"];
$size = $_FILES["file"]["size"];
$error = '';

if (count($_FILES) == 0) 
{
    $error = "No file";
}
else if ($_FILES["file"]["error"] > 0)
{
    $error = "Error during upload: " . $_FILES["file"]["error"];
}
else if ($ext != "image/jpeg" && $ext != "image/pjpeg" && $ext != "image/gif")
{
    $error = "Only JPEG and GIF files are allowed";
}
else if ($size > $MAX_SIZE)
{
    $error = "Maximum file size is ".$MAX_SIZE." bytes";
}
else 
{
    $name = getRandomString(20);
    switch ($ext) {
    case "image/jpeg":
    case "image/pjpeg":
        $name .= ".jpg";
        break;
    case "image/gif":
        $name .= ".gif";
        break;
    }
    move_uploaded_file($_FILES["file"]["tmp_name"], "upload/" . $name);
}

if (!$error)
{
    header("Location: index.php?file=".$name);
    exit();
}

?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://www.facebook.com/2008/fbml">
    <head>
        <title>
            Automatic face recognition
        </title>
    </head>
    <body>
<h1>Recognize your friends on a photo</h1>
<h2>Just upload a simple jpg/gif image and watch us find who the people are</h2>
<br/> 

<?php
if ($error) {
    if (count($_FILES) != 0) 
    {
        echo "<h3>Upload failed:</h3>";
        echo "<b>".$error."</b><br/><br/>";
    }
}
?>

<form action="upload.php" method="post" enctype="multipart/form-data">
    <label for="file">Filename:</label>
    <input type="file" name="file" id="file" /> 
    <br />
    <input type="submit" name="submit" value="Submit" />
</form>

