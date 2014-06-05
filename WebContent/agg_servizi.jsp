<%@ page import="java.util.*,java.io.*,javax.servlet.*" %>
<%	
if(session.getAttribute("username") == null) {
	response.sendRedirect("http://gis.di.unimi.it/k1-azienda/src/index.php");
}
	String permessi = (String) session.getAttribute("permessi");
	String dbname = request.getParameter("censimento");
	String classId = request.getParameter("classId");
	String className = request.getParameter("className");
	String reg = request.getParameter("reg");
	String pro = request.getParameter("pro");
	String com = request.getParameter("com");
	String cap = request.getParameter("cap");
	String parametri = request.getParameter("parametri");
	String potenziali = request.getParameter("potenziali");
	String marche = request.getParameter("marche");
%>
<html>
<head>
<link rel = "shortcut icon" href = "img/tomcat.ico">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title id="title"><% out.println("Analisi Servizi: " + className + " ("+dbname+")"); %></title>
	<link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all-gray.css">
	<link rel="stylesheet" type="text/css" href="css/button.css">
	<script src="js/const.js"></script>
	<script src="extjs/ext-all.js"></script>
	<script src="js/auth.js"></script>
	<script type="text/javascript">
		permessi = <%=permessi%>;
		dbname = "<%=dbname%>";
		classId = "<%=classId%>";
		className = "<%=className%>";
		reg = "<%=reg%>";
		pro = "<%=pro%>";
		com = "<%=com%>";
		cap = "<%=cap%>";
		potenziali = "<%=potenziali%>";
		parametri = "<%=parametri%>";
		marche = "<%=marche%>";
	</script>
	<script src="js/aggregSer.js"></script>
</head>
<body>
<form name="estrazioni" id="estrazioni" action="" method="post">
	<input type="hidden" name="task" />
	<input type="hidden" name="censimento" />
	<input type="hidden" name="selections" />
	<input type="hidden" name="data_base" />
	<input type="hidden" name="valore" />
	<input type="hidden" name="aggregazione" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="header" />
	<input type="hidden" name="limit" value="500"/>
	<input type="hidden" name="start" value="0" />
</form>
</body>
</html>