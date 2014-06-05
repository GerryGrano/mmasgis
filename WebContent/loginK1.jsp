<%
String username = request.getParameter("user");
String user_id = request.getParameter("id_utente");
String settore = request.getParameter("settore");
String id_offerta = request.getParameter("id_offerta");
String id_vetrina = request.getParameter("id_vetrina");
%>
<html>
<head>
<link rel="shortcut icon" href="img/tomcat.ico">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>MMASGIS</title>
</head>
<body onload="submit()">
	<form id="loginK1" action="MmasgisServlet" method="post">
    <INPUT type="hidden" name="username" value="<%=username%>">
    <INPUT type="hidden" name="user_id" value="<%=user_id%>">
	<INPUT type="hidden" name="settore" value="<%=settore%>">
	<INPUT type="hidden" name="id_offerta" value="<%=id_offerta%>">
	<INPUT type="hidden" name="id_vetrina" value="<%=id_vetrina%>">
	<input type="hidden" name="task" value="loginK1">
	</form>
	<script type="text/javascript">
	function submit() {
		f = document.getElementById("loginK1");
		f.submit();
	}
	</script>
</body>
</html>
