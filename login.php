<?php
ini_set('session.gc_maxlifetime', 36000);
session_set_cookie_params(36000);
session_start();


function get_client_ip() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}


$_SESSION["loginsession"] = md5(date("Y-m-d H:i:s") . rand());
$_SESSION["ip"] = get_client_ip();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>1661 USA</title>
  <meta name="description" content="mobile first, app, web app, responsive, admin dashboard, flat, flat ui">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"> 
  <link rel="stylesheet" href="css/bootstrap.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link rel="stylesheet" href="css/plugin.css">
  <link rel="stylesheet" href="css/font.css">
  <link rel="stylesheet" href="css/style.css">
  <!--[if lt IE 9]>
    <script src="js/ie/respond.min.js"></script>
    <script src="js/ie/html5.js"></script>
  <![endif]-->
</head>
<body>
  <!-- header -->
  <header id="header" class="navbar bg bg-black">
    <img src="images/logo_white.png" border=0 style="height:28px; margin-top:10px; margin-left:10px;">
  </header>
  <!-- / header -->

<style>
.nav li{
	background-color:#1d2d3d;
	color:#FFF;
}
.nav li a:link,
.nav li a:visited{
	color:#FFF;
}
.nav li.active a:link{
	color:#222;
}
.nav li.active a:visited{
	color:#222;
}
.nav li{
	width:50%;
	text-align:center;
	font-size:18px;
	font-weight:bold;
}
.confirmcode{
	display:none;
}
</style>
    <div class="main padder">
      <div class="row">
        <div class="col-lg-4 col-lg-offset-4 m-t-large">
        
		  <section class="panel">
            <header class="panel-heading" style="padding: 10px 15px 0 15px !important;">
              <ul class="nav nav-tabs">
                <li class=""><a href="#signup" data-toggle="tab" aria-expanded="true"> 新用户</a></li>
                <li class="active"><a href="#login" data-toggle="tab" aria-expanded="true"> 帐号登录</a></li>
              </ul>
            </header>
            <div class="panel-body">
              <div class="tab-content">              
                <div class="tab-pane" id="signup" style="height:350px;">
                
                
            
                         <form action="login.php" class="panel-body">
              <div class="block">
                <label class="control-label">身份证</label>
                <input type="id" placeholder="身份证号码" class="form-control">
              </div>
              
              
              
              <div class="col-xs-8" style="padding:0;">
              <div class="block">
                <label class="control-label">电话号码</label>
                <input id="phone" type="phone" placeholder="电话号码" class="form-control">
              </div>
              </div>
              <div class="col-xs-1" style="padding:0;"></div>
              <div class="col-xs-3" style="padding:0;">
              <div class="block" style="height:60px;">
 
				<span class="btn btn-info sendconfirm" style="margin-top:22px;margin-bottom:5px;">手机短信确认</span>
                
                <div class=confirmcode>
                <label class="control-label">认证号</label>
                <input type="verifycode" placeholder="认证号码" class="form-control">
				</div>
                
              </div>
			  </div>
              
              
              <div class="block">
                <label class="control-label">密码</label>
                <input type="password" id="inputPassword" placeholder="密码" class="form-control">
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%; height:45px;"><i class="fa fa-check"></i> 注册</button>

            </form>               
                
                </div>
                
                <div class="tab-pane active" id="login" style="height:350px;">
                
                
                         <form action="login.php" class="panel-body">
              <div class="block">
                <label class="control-label">身份证</label>
                <input type="number" placeholder="身份证号码" class="form-control">
              </div>
              <div class="block">
                <label class="control-label">密码</label>
                <input type="password" id="inputPassword" placeholder="密码" class="form-control">
              </div>
              <button type="submit" class="btn btn-info" style="width:100%; height:45px;">登录</button>
              <br />
              <a href="#" class="m-t-mini"><small>忘记密码?</small></a>
              <br /><br />
              <div class="line line-dashed"></div>
              <p class="text-muted text-center"><small>没有帐号?</small></p>
              <a href="#signup" data-toggle="tab" aria-expanded="false" class="btn btn-white btn-block">申请我的智跑帐号</a>
            </form>  

                </div>
              </div>
            </div>
          </section>

              </div>
            </div>
         </div>




  
  
  <!-- footer -->
  <footer id="footer">
    <div class="text-center padder clearfix">
      <p>
        <a href="https://www.miitbeian.gov.cn/">陕ICP备15011147</a>
      <br><br>
       &copy; <?php echo date("Y"); ?> 陕西柏希寰球贸易有限公司.
        
      </p>
    </div>
  </footer>
  <!-- / footer -->


<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.js"></script>
<script src="js/app.js"></script>
<script src="js/app.plugin.js"></script>
<script src="js/app.data.js"></script>
<script src="js/mask.js" type="text/javascript"></script>
<script>
jQuery(function($){
	$("#phone").mask("(199) 9999-9999");
	
	$(".sendconfirm").click(function(){
	
		var idval = $("#id").val()
		
		idval = phoneval.replace(/[^0-9]/g, '');


		var phoneval = $("#phone").val()
		
		phoneval = phoneval.replace(/[^0-9]/g, '');

		if (phoneval.length == 11 && phoneval.length > 14){	
	
		setTimeout(function() {
    		$('.sendconfirm').fadeOut('fast');
		}, 200); 
				
		setTimeout(function() {
			$('.confirmcode').show('fast');
		}, 400); 
		

		} else {
			alert("请输入您的电话号码!");
		}
		
	});
	
});
</script>
</body>
</html>