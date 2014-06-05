<%@ page import="java.util.*,java.sql.*,java.io.*" %>
<%
	String offertk1 = "";
	//out.println(session.getAttribute("username"));
	//out.println(session.getAttribute("is_admin"));
	if(session.getAttribute("user") == null)
		//response.sendRedirect("login.jsp");
		response.sendRedirect("http://gis.di.unimi.it/k1-azienda/src/home.php");
	//if (session.getAttribute("offerta") != null) {
	//	 offertk1 = "ok";
	//}
	
	String name = (String) session.getAttribute("user");
   // String password = (String) session.getAttribute("password");
    String censimenti = (String) session.getAttribute("censimenti");
    String settore = (String) session.getAttribute("settore");
    offertk1 = (String) session.getAttribute("offerta");
    
%>
<html>
<form id="showFeatures" action="risultatiK1.jsp" method="post">
    <input type="hidden" name="reg" value="">
    <input type="hidden" name="pro" value="">
    <input type="hidden" name="com" value="">
    <input type="hidden" name="cap" value="">
	<input type="hidden" name="dbname" value="">
	<input type="hidden" name="custom" value="">
	<input type="hidden" name="dbpers" value="">
</form>

<head>
<link rel =  "shortcut icon" href = "img/tomcat.ico">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="stylesheet" href="css/style.css" type="text/css">
    <link rel="stylesheet" href="css/basic_style.css" type="text/css">
     <link rel="stylesheet" href="css/button.css" type="text/css">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all-gray.css">
	<script src="js/const.js"></script>
	<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
    <script src="http://openlayers.org/api/OpenLayers.js"></script>
	<script type="text/javascript">
		var user = '<%=name%>';
		var lista_censimenti = <%=censimenti%>;
		var offertk1 = "<%=offertk1%>";
	</script>
	<!--<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>-->
	<script type="text/javascript" src="extjs/ext-all.js"></script>
	<script type="text/javascript" src="js/mapK1.js"></script>
	<title id="page-title">MMASGIS</title>
</head>
<body>
</body>

</html>


