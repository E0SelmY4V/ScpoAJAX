<?php
if ($_POST) die(var_dump($_POST) . 'POST<br><br>');
if ($_GET) die(var_dump($_GET) . 'GET<br><br>');
?>
<script>
	window.onmessage = function() {
		document.write('hh');
	}
</script>
jj