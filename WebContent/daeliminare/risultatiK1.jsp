<%@ page import="java.util.*,java.io.*,javax.servlet.*" %>
<%	
	if(session.getAttribute("user") == null)
		response.sendRedirect("login.jsp");
	String dbname = request.getParameter("dbname");
	String reg = request.getParameter("reg");
	String pro = request.getParameter("pro");
	String com = request.getParameter("com");
	String cap = request.getParameter("cap");
	String custom = request.getParameter("custom");
    String censimenti = (String) session.getAttribute("censimenti");
    String settore = (String) session.getAttribute("settore");
    String offerta = (String) session.getAttribute("offerta");

%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf8" />
	<title><% out.println("Elenco Anagrafiche: " + dbname); %></title>
	<!--Ext JS-->
	<link rel="stylesheet" type="text/css" href="css/button.css" type="text/css">	
	<link rel="stylesheet" href="extjs/resources/css/ext-all-gray.css" type="text/css">
	 <link rel="stylesheet" href="css/button.css" type="text/css">
	<style type="text/css">
		body {
			height:100%;
		}
	</style>
	<script type="text/javascript" src="js/const.js"></script>
	<script type="text/javascript" src="extjs/ext-all.js"></script>
	<!--Application JS-->
	<script type="text/javascript"> 
		
		var reg = "<%=reg%>";
		var pro = "<%=pro%>";
		var com = "<%=com%>";
		var cap = "<%=cap%>";
		dbname = "<%=dbname%>";
		custom = "<%=custom%>";
		
		censimenti = "<%=censimenti%>";
		var settore = "<%=settore%>";
		var offerta = "<%=offerta%>";
		
	</script>
	<script type="text/javascript" src="js/schedaAnagrafica.js"></script>
	<script type="text/javascript" src="js/searchPanel.js"></script>
	<script type="text/javascript" src="js/filterPanel.js"></script>
	<script type="text/javascript" src="js/customFilterPanel.js"></script>
	<script type="text/javascript" src="js/gridK1.js"></script>
	<script type="text/javascript" src="js/exportSelection.js"></script>
	<script type="text/javascript" src="js/insertKubettone.js"></script>
	
</head>
<body>
<div id="table"></div>
<form name="estrazioni" id="estrazioni" action="" method="post">
	<input type="hidden" name="task" />
	<input type="hidden" name="censimento" />
	<input type="hidden" name="selections" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<input type="hidden" name="header" />
	<input type="hidden" name="limit" value="500"/>
	<input type="hidden" name="start" value="0" />
</form>
<form name="kubettone" id="kubettone" action="" method="post">
	<input type="hidden" name="task" />
	<input type="hidden" name="censimento" />
	<input type="hidden" name="selections" />
	<input type="hidden" name="reg" />
	<input type="hidden" name="pro" />
	<input type="hidden" name="com" />
	<input type="hidden" name="cap" />
	<!--<input type="hidden" name="offerta" />
	<input type="hidden" name="settore" />
	<input type="hidden" name="limit" value="500"/> -->
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
