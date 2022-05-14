<?php
header('Content-type: application/json');
if ($_POST) die(json_encode($_POST));
if ($_GET) die(json_encode($_GET));
die('"none"');