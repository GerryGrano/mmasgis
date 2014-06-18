<%@ page import="java.util.*,java.sql.*,java.io.*" %>
<%
if(session.getAttribute("username") == null) {
	response.sendRedirect("http://gis.di.unimi.it/k1-azienda/src/index.php");
	//response.sendRedirect("http://www.metmi.it/k1_aziende/src/index.php");
	
}

String user_id = (String) session.getAttribute("user_id");
String username = (String) session.getAttribute("username");
String permessi = (String) session.getAttribute("permessi");
String azienda_id = (String) session.getAttribute("azienda_id");
String ruolo_id = (String) session.getAttribute("ruolo_id");
String territori_selettivo = (String) session.getAttribute("territori");
String zona_id = (String) session.getAttribute("zona_id");
String admin_azienda = (String) session.getAttribute("is_admin_azienda");

//se ha il permesso 20 allora do la ZA
String mapFolder=null;
if (permessi.indexOf("20") < 0)
	mapFolder = "mappa";
else{
	mapFolder = "mappaZA";
}

String censimenti = (String) session.getAttribute("censimenti");
String customer = request.getParameter("customer");
String id_offerta = "";
String id_vetrina = "";
if(request.getParameterMap().containsKey("id_offerta")) {
	id_offerta = request.getParameter("id_offerta");
}
if(request.getParameterMap().containsKey("id_vetrina")) {
	id_vetrina = request.getParameter("id_vetrina");
}
%>
<html>
<form id="txt" method="post" action="" >
	<input type="hidden" name="box" value="" />
	<input type="hidden" name="task" />
	<input type="hidden" name="agente" />
	<input type="hidden" name="filename" />
</form>

<form id="showFeatures" action="risultati.jsp" method="post" <% if(id_offerta.equals("")&&id_vetrina.equals("")){ out.print("target=\"new_tab\""); }%> >
    <input type="hidden" name="reg" value="">
    <input type="hidden" name="pro" value="">
    <input type="hidden" name="com" value="">
    <input type="hidden" name="cap" value="">
	<input type="hidden" name="dbname" value="">
	<input type="hidden" name="custom" value="">
	<input type="hidden" name="customer" value="">
	<input type="hidden" name="dbpers" value="">
	<input type="hidden" name="id_offerta" value="">
	<input type="hidden" name="id_vetrina" value="">
</form>

<head>
<link rel = "shortcut icon" href = "img/tomcat.ico">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="stylesheet" href="css/button.css" type="text/css">
    <link rel="stylesheet" href="css/style.css" type="text/css">
    <link rel="stylesheet" href="css/basic_style.css" type="text/css">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all-gray.css">
	<script src="js/const.js"></script>
	<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
   	<!--<script src="http://openlayers.org/api/OpenLayers.js"> </script>-->
    <script src="js/openlayers/OpenLayers.js"> </script> 
	<script type="text/javascript"> 
		var user_id = '<%=user_id%>';
		var username = '<%=username%>';
		var permessi = <%=permessi%>;
		var azienda_id = <%=azienda_id%>;
		var ruolo_id = <%=ruolo_id%>;
		var lista_censimenti = <%=censimenti%>;
		var customer = "<%=customer%>";	
		var id_offerta = '<%=id_offerta%>';
		var id_vetrina = '<%=id_vetrina%>';
		var zona_id = '<%=zona_id%>';
		var territori_sele = '<%=territori_selettivo%>';
		var admin_azienda = '<%=admin_azienda%>';
		 
		 
	</script>
	<!--<script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>-->
	<script type="text/javascript" src="extjs/ext-all.js"></script>
	<script type="text/javascript" src="js/auth.js"></script>
	<script type="text/javascript" src="js/<%=mapFolder%>/map.js"></script>
		<script type="text/javascript" src="js/<%=mapFolder%>/tree.js"></script>
		<script type="text/javascript" src="js/<%=mapFolder%>/box.js"></script>
		<% if(permessi.indexOf("20") > 0){ %>
		<script> document.write("<script type='text/javascript' src='js/mappaZA/scenario.js'></scrip" + "t>"); </script>
		<script> document.write("<script type='text/javascript' src='js/mappaZA/zone.js'></scrip" + "t>"); </script>
		<script> document.write("<script type='text/javascript' src='js/mappaZA/stdUserMng.js'></scrip" + "t>"); </script>
		<script> document.write("<script type='text/javascript' src='js/mappaZA/adminUserMng.js'></scrip" + "t>"); </script>
		<script> document.write("<script type='text/javascript' src='js/mappaZA/utilityUserMng.js'></scrip" + "t>"); </script>
		<% } %>
		<script type="text/javascript" src="js/<%=mapFolder %>/top.js"></script>
	<title id="page-title">MMASGIS</title>
</head>
<body>
</body>

</html>