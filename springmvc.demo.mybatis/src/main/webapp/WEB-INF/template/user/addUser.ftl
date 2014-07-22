<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
	<title>添加用户</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	</head>
	<body style="padding: 0px; background: #EAEEF5;">
		<form action="${webRoot}/user/add" method="post" >
			用户名：<input type="text" name="username" /><br>
			密码：<input type="password" name="password" /><br>
			<input type="submit" value="提交" />
		</form>
	</body>
</html>