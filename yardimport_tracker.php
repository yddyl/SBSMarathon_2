<html>
<head>
<title>Untitled Document</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
</head>
<body>
<?PHP

//setlocale(LC_ALL, 'zh_CN.UTF8');
$hostname_myDB = "sbsdatabasev1.compheoy92tk.us-west-2.rds.amazonaws.com";
$database_myDB = "testPHPmarathon";
$username_myDB = "root";
$password_myDB = "rootroot";
$myDB = mysqli_connect($hostname_myDB, $username_myDB, $password_myDB) or trigger_error(mysql_error(),E_USER_ERROR);

/*function style_exists($sql_str)
{
	$result		=	mysql_query($sql_str);
	if( !$result )
	{
		die('Invalid query: ' . mysql_error());
	}
	$num_rows 	= 	mysql_num_rows($result);

	if($num_rows == 0)
		return false;
	else
		return true;
}*/
function dataClean($data)
{	$tempData=$data;
	$data=trim($data);
	//if($tempData!=$data)
	//print "Cleaned:-$tempData-> -$data-;</br>";
	return $data;
}
function checkIdCard($idcard){  
    // 18Dig ONLY 
    if(strlen($idcard)!=18){  
		print "badID(Digs wrong):$idcard;</br>";
        return false;  
    }   
    // Main numbers
    $idcard_base = substr($idcard, 0, 17);  
    // Validation number
    $verify_code = substr($idcard, 17, 1); 
    // Array of factors
    $factor = array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);  
    // Validation list 
    $verify_code_list = array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  
    // Calculate Validation number based on Main numbers 
    $total = 0;  
    for($i=0; $i<17; $i++){  
        $total += substr($idcard_base, $i, 1)*$factor[$i];  
    }  
    // Mod
    $mod = $total % 11;  
    // Check Calculated Validation number and corect Validation number
    if($verify_code == $verify_code_list[$mod]){
		return true;  
    }else{  
		print "badID(Validation Error):$idcard;</br>";
		return false;  
	}  
}  

if(isset($_POST['submit'])){
	$filename=$_POST['filename'];
	$handle = fopen("$filename", "r");
	$row=0;
	$matchid="";
	$seriesnumber="";
	mysqli_query($myDB,"START TRANSACTION;");
	mysqli_query($myDB,"SET CHARACTER SET utf8");
	mysqli_query($myDB,"SET NAMES 'utf8'");
	$importUser="INSERT into testPHPmarathon.ren(name,gender,IDtype,IDnumber,birthday,country,city,ifBadID) 
			values";
	$importRecord="INSERT into testPHPmarathon.chengji (
				matchid,seriesnumber,
				rank,bibnumber,gender,IDnumber,class,
				Runnerid,5km,10km,15km,20km,21km,
				25km,30km,35km,40km,42km,
				50km,100km,otherrecord,netrecord)
			values";
	$idArray[]="";
	$countUser=0;
	$countRecord=0;
	$runnerid=0;
	$pp=0;
	$runnerid1=mysqli_fetch_assoc(mysqli_query($myDB,"select max(runnerid) from testPHPmarathon.ren"));
	$runnerid=$runnerid1['max(runnerid)'];
	echo "last id is: $runnerid";
	
	$idData=mysqli_query($myDB,"select IDnumber from testPHPmarathon.ren");
	$idList=array();
	while($row = mysqli_fetch_assoc($idData)){
		$idList[]=$row['IDnumber'];
	}
	//print_r(array_values($idList));
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE)
	{	
		//Read first row for matchid and seriesnumber
		if ($row == 0)  {
			$matchid=$data[0];
			$seriesnumber=$data[1];
			$row++;	
			continue; 
		}//skip second row
		if ($row == 1)  {
			$row++;	
			continue; 
		}
			$row++;	
		$data[2]=dataClean($data[2]);//delete spaces in name
		$data[6]=strtoupper(dataClean($data[6]));//delete spaces in IDnumber, and Upper string.
		$isID=0;
		if($data[5]=="身份证"&&!checkIdCard($data[6])){
			//validation IDnumber
			$isID=1;
		}	
		if(in_array($data[6],$idArray)){
			//check if the ID is already in this event.
			echo "This IDnumber alrdy exists in this match:$data[2]-ZZ-$data[6]!</br>";
			continue;
		}
		else{
			//Check if IDnumber alrdy exists
			//$check=mysqli_query($myDB,"select Runnerid from testPHPmarathon.ren where IDnumber ='$data[6]'");
			//$checkrows=mysqli_num_rows($check);
			if(in_array($data[6],$idList)) {
				//if exists, print out and skip
				echo "IDnumber exists:$data[2]zz$data[6]!</br>";
			} else {
				$runnerid++;
				if($countUser!=0)
					$importUser.=",";
				$idArray[]=$data[6];
				$countUser++;
				//import Runner info
				$importUser.="('$data[2]', '$data[3]', '$data[5]', '$data[6]', '$data[7]', '$data[8]', '$data[9]','$isID')";
			}
			//Check if the IDnumber alrdy had record in this event.
			//$check=mysqli_query($myDB,"select * from testPHPmarathon.chengji where IDnumber ='$data[6]' and matchid='$matchid' and seriesnumber='$seriesnumber'");
			//$checkrows=mysqli_num_rows($check);
			//if($checkrows>0) {
				//if exists, print out and skip
				//echo "This guy already had a record in this match! WTF:id=$data[6]; matchid=$matchid; seriesnumber=$seriesnumber!</br>";
			//} else {
				//import Record info
			if($countRecord!=0)
				$importRecord.=",";
			$countRecord++;
			$Runnerid=mysqli_fetch_assoc(mysqli_query($myDB,"select Runnerid from testPHPmarathon.ren where IDnumber ='$data[6]'"));
			$importRecord.="(
				'$matchid','$seriesnumber',
				'$data[0]','$data[1]', '$data[3]', '$data[6]', '$data[10]', 
				'$runnerid','$data[11]', '$data[12]','$data[13]', '$data[14]','$data[15]', 
				'$data[16]','$data[17]', '$data[18]','$data[19]', '$data[20]',
				'$data[21]','$data[22]','$data[23]','$data[24]'
			)";
				//mysqli_query($myDB,"SET CHARACTER SET utf8");
				//mysqli_query($myDB,"SET NAMES 'utf8'");
				//mysqli_query($myDB,$importRecord);
			//}
		}
	}
	mysqli_query($myDB,$importUser);
	mysqli_query($myDB,$importRecord);
	mysqli_query($myDB,"COMMIT;");
	fclose($handle);
	print "Import done!";
}
else
{
	print "<form action='yardimport_tracker.php' method='post'>";
	print "Type file name to import:<br>";
	print "<input type='text' name='filename' size='20'><br>";
	print "<input type='submit' name='submit' value='submit'></form>";
}
   
?>
</body>
</html>
