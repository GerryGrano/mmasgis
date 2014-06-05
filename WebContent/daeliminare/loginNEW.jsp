<%
session = request.getSession(false);
if (session.getAttribute("user") != null) {
	response.sendRedirect("index.jsp");
}
	
	
//gis.di.unimi.it/K1-Azienda_beta_22luglio/src/index.php
String user = request.getParameter( "user" );
//String password = request.getParameter( "pwd" );
String id = request.getParameter( "id_utente" );


%>

<html>
<head>
<link rel =  "shortcut icon" href = "img/tomcat.ico">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Login</title>
	<link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all.css">
	<link rel="stylesheet" type="text/css" href="css/login_style.css">
	<script src="extjs/ext-all.js"></script>
	<!-- <script src="js/login.js"></script> -->
</head>

<body>

	<form id="login" action="MmasgisServlet" method="post">
    <INPUT type="hidden" name="user" value="">
	<INPUT type="hidden" name="id" value="">
	<input type="hidden" name="task" value="login">
	</form>
	<script type="text/javascript">
	var user = '<%=user%>';
	var id = '<%=id%>';

	
		f = document.getElementById("login");
		
		f.user.value = user;
		f.id.value = id;
		f.submit();
	

</script>
</body>
</html>
