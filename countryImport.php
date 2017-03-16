<html>
<head>
<title>Untitled Document</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>
<body>
<?PHP

//setlocale(LC_ALL, 'zh_CN.UTF8');
$hostname_myDB = "sbsdatabasev1.compheoy92tk.us-west-2.rds.amazonaws.com";
$database_myDB = "malasong";
$username_myDB = "root";
$password_myDB = "rootroot";
$myDB = mysqli_connect($hostname_myDB, $username_myDB, $password_myDB) or trigger_error(mysql_error(),E_USER_ERROR);


function dataClean($data)
{	$tempData=$data;
	$data=trim($data,'?');
	return $data;
}

if(isset($_POST['submit'])){
	$filename=$_POST['filename'];
	$handle = fopen("$filename", "r");
	$row=0;
	$matchid="";
	$seriesnumber="";
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE)
	{	
		if ($row <2)  {
			$row++;	
			continue; 
		}//skip 2 row

		//$row++;
		$data[0]=dataClean($data[0]);//delete spaces in name
		//$country2ID=mysqli_fetch_assoc(mysqli_query($myDB,"select countries_iso_code_2 as id from malasong.countries where countries_id ='$row-1'"));
		//print "$country2ID[id]</br>";
		//if(!$country2ID['id']==$data[2]) {
			//$import="update malasong.countries(countries_CN) 
			//values('WRONG')";
			//echo "$country2ID['id'] is not right!</br>";
		//} else {
			//import Runner info
			$import="update malasong.countries set countries_CN='$data[0]' where countries_iso_code_2='$data[2]'";
		//}
		mysqli_query($myDB,"SET CHARACTER SET utf8");
		mysqli_query($myDB,"SET NAMES 'utf8'");
		mysqli_query($myDB,$import);	
		
	}
	fclose($handle);
	print "Import done!";
}
else
{
	print "<form action='countryImport.php' method='post'>";
	print "Type file name to import:<br>";
	print "<input type='text' name='filename' size='20'><br>";
	print "<input type='submit' name='submit' value='submit'></form>";
}
   
?>
</body>
</html>
