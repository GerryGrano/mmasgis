<%@ page import="java.util.*,java.io.*,javax.servlet.*" %>
<%	
if(session.getAttribute("username") == null) {
	response.sendRedirect("http://gis.di.unimi.it/k1-azienda/src/index.php");
}
	String permessi = (String) session.getAttribute("permessi");
	String dbname = request.getParameter("censimento");
	String classe = request.getParameter("classe");
	String reg = request.getParameter("reg");
	String pro = request.getParameter("pro");
	String com = request.getParameter("com");
	String cap = request.getParameter("cap");
	String liv = request.getParameter("liv");
	String parametri = request.getParameter("parametri");
	String potenziali = request.getParameter("potenziali");
	String marche = request.getParameter("marche");
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel = "shortcut icon" href = "img/tomcat.ico">
<meta http-equiv="Content-Type" content="text/html; charset=utf8">
<title id="title"><% out.println("Aggregazione Parametri: "+dbname); %></title>
<link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all-gray.css">
<link rel="stylesheet" type="text/css" href="css/button.css">
<style type="text/css">
.x-grid-row .custom-column {  
    font-weight: bold; 
}
</style>
	<script src="js/const.js"></script>
	<script src="extjs/ext-all.js"></script>
	<script src="js/auth.js"></script>
	<script type="text/javascript">
		permessi = <%=permessi%>;
		var dbname = "<%=dbname%>";
		var classe = "<%=classe%>";
		var reg = "<%=reg%>";
		var pro = "<%=pro%>";
		var com = "<%=com%>";
		var cap = "<%=cap%>";
		var liv = "<%=liv%>";
		var parametri = "<%=parametri%>";
		var potenziali = "<%=potenziali%>";
		var marche = "<%=marche%>";
	</script>
	<script src="js/aggregPar.js"></script>
</head>
<body>
<form name="estrazioni" id="estrazioni" action="" method="post">
	<input type="hidden" name="task" />
	<input type="hidden" name="censimento" />
	<input type="hidden" name="selections" />
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