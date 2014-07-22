<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
	<title>综合信息管理系统</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	</head>
	<body style="padding: 0px; background: #EAEEF5;">
		<#list users as user>
			${user_index + 1} 用户名：${user.username!} 密码： ${user.password!}<br>
		</#list>
	</body>
</html>