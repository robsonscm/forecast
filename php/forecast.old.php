<?php
header("Content-type: application/json");

$apikey = "6ce9320aca5d6bd7c24747f0f7e6a8a8";
$units = "ca";
$coord = "45.5555,-75.5555";
//enter your DarkSky.net API key above

// create a new cURL resource
$ch = curl_init();
// set URL and other appropriate options
curl_setopt($ch, CURLOPT_URL, "https://api.darksky.net/forecast/". $apikey ."/". $coord ."?units=". $units);
//ADD the proper value for UNITS to the end of the URL on the line above


curl_setopt($ch, CURLOPT_HEADER, 0);

// grab URL and pass it to the browser
curl_exec($ch);

// close cURL resource, and free up system resources
curl_close($ch);
?>