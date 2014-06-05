<%@ page import="java.util.*,java.io.*,javax.servlet.*" %>
<%	
if(session.getAttribute("username") == null) {
	response.sendRedirect("http://gis.di.unimi.it/k1-azienda/src/index.php");
	//response.sendRedirect("http://www.metmi.it/k1_aziende/src/index.php");
}
	
String permessi = (String) session.getAttribute("permessi");
String dbname = request.getParameter("dbname");
String reg = request.getParameter("reg");
String pro = request.getParameter("pro");
String com = request.getParameter("com");
String cap = request.getParameter("cap");
String custom = request.getParameter("custom");
String customer = request.getParameter("customer");
String results = request.getParameter("results");
//String censimenti = (String) session.getAttribute("censimenti");
//String settore = (String) session.getAttribute("settore");
String id_offerta = (String) request.getParameter("id_offerta");
String id_vetrina = (String) request.getParameter("id_vetrina");
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<link rel =  "shortcut icon" href = "img/tomcat.ico">
	
	<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
	<title><% out.println("Elenco Anagrafiche: " + dbname); %></title>
	<!--Ext JS-->
	<link rel="stylesheet" href="css/button.css" type="text/css">
	<link rel="stylesheet" href="extjs/resources/css/ext-all-gray.css" type="text/css">
	<style type="text/css">
		body {
			height:100%;
		}
	</style>
	<script type="text/javascript" src="js/const.js"></script>
	<script type="text/javascript" src="extjs/ext-all.js"></script>
	<!--Application JS-->
	<script type="text/javascript"> 
		permessi = <%=permessi%>;
		var reg = "<%=reg%>";
		var pro = "<%=pro%>";
		var com = "<%=com%>";
		var cap = "<%=cap%>";
		dbname = "<%=dbname%>";
		custom = "<%=custom%>";
		customer = "<%=customer%>";
		var results = "<%=results%>";
		id_offerta = "<%=id_offerta%>";
		id_vetrina = "<%=id_vetrina%>";
	</script>
	<script type="text/javascript" src="js/auth.js"></script>
	<script type="text/javascript" src="js/schedaAnagrafica.js"></script>
	<script type="text/javascript" src="js/searchPanel.js"></script>
	<script type="text/javascript" src="js/filterPanel.js"></script>
	<script type="text/javascript" src="js/customFilterPanel.js"></script>
	<script type="text/javascript" src="js/grid.js"></script>
	<script type="text/javascript" src="js/exportSelection.js"></script>
	<script type="text/javascript" src="js/insertKubettone.js"></script>
	
</head>
<body>
<div id="table"></div>
<form name="pdf" id="pdf" action="" method="post" target="new_tab">
	<input type="hidden" name="task" />
	<input type="hidden" name="censimento" />
	<input type="hidden" name="pv" />
	<input type="hidden" name="custom" />
</form>

<form name="estrazioni" id="estrazioni" action="" method="post">
	<input type="hidden" name="search" />
	<input type="hidden" name="task" />
	<input type="hidden" name="censimento" />
	<input type="hidden" name="selections" />
	<input type="hidden" name="customer" />
	<input type="hidden" name="results" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="header" />
	<input type="hidden" name="limit" value="500"/>
	<input type="hidden" name="start" value="0" />
</form>
<form id="aggregazionemarche" action="agg_marche.jsp" method="post" target="aggmar">
	<input type="hidden" name="censimento" />
	<input type="hidden" name="classId" />
	<input type="hidden" name="className" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="parametri" />
	<input type="hidden" name="potenziali" />
	<input type="hidden" name="marche" />
</form>
<form id="aggregazioneservizi" action="agg_servizi.jsp" method="post" target="aggser">
	<input type="hidden" name="censimento" />
	<input type="hidden" name="classId" />
	<input type="hidden" name="className" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="parametri" />
	<input type="hidden" name="potenziali" />
	<input type="hidden" name="marche" />
</form>
<form id="aggregazionemarcheazienda" action="agg_marche_azienda.jsp" method="post" target="aggmaraz">
	<input type="hidden" name="censimento" />
	<input type="hidden" name="classId" />
	<input type="hidden" name="className" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="parametri" />
	<input type="hidden" name="potenziali" />
	<input type="hidden" name="marche" />
</form>
<form id="aggregazioneterr" action="agg_territori.jsp" method="post" target="aggterr">
	<input type="hidden" name="censimento" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="layer" />
	<input type="hidden" name="classe" />
	<input type="hidden" name="parametri" />
	<input type="hidden" name="potenziali" />
	<input type="hidden" name="marche" />
</form>
<form id="aggregazioneterraz" action="agg_territoriAz.jsp" method="post" target="aggterraz">
	<input type="hidden" name="censimento" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="layer" />
	<input type="hidden" name="classe" />
	<input type="hidden" name="parametri" />
	<input type="hidden" name="potenziali" />
	<input type="hidden" name="marche" />
</form>
<form id="aggregazioneterrfatt" action="agg_territori_fatt.jsp" method="post" target="aggterrfatt">
	<input type="hidden" name="censimento" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="layer" />
	<input type="hidden" name="classe" />
	<input type="hidden" name="parametri" />
	<input type="hidden" name="potenziali" />
	<input type="hidden" name="marche" />
</form>
<form id="aggregazionepar" action="agg_parametri.jsp" method="post" target="aggpar">
	<input type="hidden" name="censimento" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="classe" />
	<input type="hidden" name="liv" />
	<input type="hidden" name="parametri" />
	<input type="hidden" name="potenziali" />
	<input type="hidden" name="marche" />
</form>
<form id="aggregazioneparazienda" action="agg_parametri_azienda.jsp" method="post" target="aggparaz">
	<input type="hidden" name="censimento" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="classe" />
	<input type="hidden" name="liv" />
	<input type="hidden" name="parametri" />
	<input type="hidden" name="potenziali" />
	<input type="hidden" name="marche" />
</form>
</body>
</html>
