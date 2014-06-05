<%
String username = request.getParameter("user");
String user_id = request.getParameter("id_utente");
%>
<html>
<head>
<link rel="shortcut icon" href="img/tomcat.ico">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>MMASGIS</title>
</head>
<body onload="submit()">
	<form id="login" action="MmasgisServlet" method="post">
    <INPUT type="hidden" name="username" value="<%=username%>">
    <INPUT type="hidden" name="user_id" value="<%=user_id%>">
	<input type="hidden" name="task" value="login">
	</form>
	<script type="text/javascript">
	function submit() {
		f = document.getElementById("login");
		f.submit();
	}
	</script>
</body>
</html>
