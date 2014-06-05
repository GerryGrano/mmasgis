package it.metmi.mmasgis.util;

/**
 * Classe di UTILITY, contiene le interrogazioni al database utilizzate dal
 * sistema, le credenziali di accesso al database e i nomi delle pagine jsp
 * 
 */
public class Const {

	/************************* CREDENZIALI ****************************************/

	/**
	 * Nome utente del database
	 */
	public static String username = "root";
	// user AZIENDA M&T
	//public static String username = "mmasgis";

	/**
	 * Password del database
	 */
	
	//public static String password = "labcad";
	public static String password = "unimi??";
	// AZIENDA
	//public static String password = "$$metmi";
	
	/**
	 * Path dell'immagine mt.png
	 */
	//public static String imgPath = "C:/Users/Ciro-Federica/git/mmasgis/mmasgis/WebContent/img/mt.png";
	public static String imgPath = "http://www.metmi.it/images/webgis/mt.png";
	//public static String imgPath = "D:/apache-tomcat-7.0.33/webapps/gis/img/mt.png";
	//public static String imgPath = "C:/Program Files/Apache Software Foundation/Tomcat 7.0/webapps/mmasgis/img/mt.png";
	//public static String imgPath = "/Users/marchins/git/mmasgis/mmasgis/WebContent/img/mt.png";
	/**
	 * Nome del database di sistema
	 */
	public static String systemDB = "mmasgisDB";

	/*************************** PAGINE *******************************************/

	/**
	 * Pagina di login
	 * <p>
	 * login.jsp
	 */
	public static String loginPage = "http://gis.di.unimi.it/k1-azienda/src/index.php";
	// public static String loginPage =
	// "http://gis.di.unimi.it/k1-azienda/src/index.php";
	//public static String loginPage ="http://www.metmi.it/k1_aziende/src/index.php";
	/**
	 * Pagina cartografia
	 * <p>
	 * index.jsp
	 */
	public static String mapPage = "index.jsp";
	//public static String mapPageK1 = "indexK1.jsp";

	/**
	 * Pagina anagrafiche
	 * <p>
	 * risultati.jsp
	 */
	public static String pvPage = "risultati.jsp";

	/**
	 * Pagina di errore
	 * <p>
	 * error.jsp
	 */
	public static String errorPage = "error.jsp";

	/************************************ QUERY ****************************************/

	/**
	 * Query per effettuare il login: ottiene nome utente, id e lista permessi
	 * <p>
	 * <code>
	 * SELECT utn.nome_utente, utn.utente_id, prm.nome, prm.permesso_id FROM utente utn
	 * JOIN ruolo rl ON utn.ruolo_id = rl.ruolo_id 
	 * JOIN rel_ruolo_permesso rrp ON rl.ruolo_id = rrp.ruolo_id 
	 * JOIN permesso prm ON rrp.permesso_id = prm.permesso_id WHERE utn.utente_id = 1;
	 * </code>
	 */
	public static String queryLogin = "SELECT utn.amministratore, utn.nome_utente, utn.utente_id, utn.azienda_id, utn.ruolo_id, prm.nome, prm.permesso_id FROM utente utn "
			+ "JOIN ruolo rl ON utn.ruolo_id = rl.ruolo_id "
			+ "JOIN rel_ruolo_permesso rrp ON rl.ruolo_id = rrp.ruolo_id "
			+ "JOIN permesso prm ON rrp.permesso_id = prm.permesso_id WHERE utn.utente_id = %s AND utn.nome_utente = %s ";

	/**
	 * Query di base per elenco anagrafiche.
	 * <p>
	 * <code>
	 * SELECT DISTINCT SQL_CALC_FOUND_ROWS IF(tc_clpot.primario=1, rel_pv_pot.valore, NULL) AS potenziale, <p>
	 * cod_cliente, p.pv_id,codice AS cod_mmas, nome1 AS ragione_sociale, <p>
	 * indirizzo, cap, comune, provincia, tel1 AS telefono, <p>
	 * cf_pi AS codice_fiscale, nome2 AS titolare, fax, email, sito, IF(cliente=0, 'No', 'Si') AS cliente <p> 
	 * FROM pv p LEFT JOIN rel_pv_pot ON p.pv_id = rel_pv_pot.pv_id LEFT JOIN tc_clpot ON rel_pv_pot.tc_clpot_id=tc_clpot.tc_clpot_id %s <p>
	 * </code>
	 */
	public static String queryBase = "SELECT DISTINCT SQL_CALC_FOUND_ROWS IF(tc_clpot.primario=1, rel_pv_pot.valore, 0) AS potenziale, "
			+ "cod_cliente, p.pv_id,codice AS cod_mmas, nome1 AS ragione_sociale, "
			+ "indirizzo, cap, comune, provincia, tel1 AS telefono,tel2 AS telefono2,tel3 AS telefono3, "
			+ "cf_pi AS codice_fiscale, nome2 AS titolare, fax, email, sito, IF(cliente=0, 'No', 'Si') AS cliente, data_aggiornamento , note "
			+ "FROM pv p LEFT JOIN rel_pv_pot ON p.pv_id = rel_pv_pot.pv_id LEFT JOIN tc_clpot ON rel_pv_pot.tc_clpot_id=tc_clpot.tc_clpot_id %s ";

	/**
	 * 
	 */
	public static String queryMmasK1 = "SELECT DISTINCT p.pv_id AS pv "
			+ "FROM pv p LEFT JOIN rel_pv_pot ON p.pv_id = rel_pv_pot.pv_id %s ";

	/**
	 * 
	 */
	public static String queryCountMmasK1 = "SELECT DISTINCT SQL_CALC_FOUND_ROWS p.pv_id AS pvCount "
			+ "FROM pv p LEFT JOIN rel_pv_pot ON p.pv_id = rel_pv_pot.pv_id %s ";
	
	/**
	 * 
	 */
	public static String queryK1offer = "SELECT titolo FROM %s.offerta;" + "WHERE id_offerta = \'%s\' ";
	
	/**
	 * 
	 */
	public static String queryK1 = "INSERT INTO  %s.riservata (pv,offerta) VALUES(%d,%s) ";
	public static String queryK1V = "INSERT INTO  %s.riservata_vetrina (pv,vetrina) VALUES(%d,%s) ";

	/**
	 * 
	 */
	public static String updateK1riservata = "UPDATE offerta SET riservata=1 WHERE id_offerta = %s ";
	public static String updateK1riservataV = "UPDATE vetrina SET riservata=1 WHERE id_vetrina = %s ";

	/**
	 * Query componibile di base per esportazione in Excel.
	 * <p>
	 * <code>
	 * SELECT DISTINCT SQL_CALC_FOUND_ROWS IF(rel_pv_pot.tc_clpot_id=1, rel_pv_pot.valore, NULL) AS potenziale, <p>
	 * cod_cliente, p.pv_id,codice AS cod_mmas, nome1 AS ragione_sociale, <p>
	 * indirizzo, cap, comune, provincia, tel1 AS telefono, <p>
	 * cf_pi AS codice_fiscale, nome2 AS titolare, fax, email, sito, IF(cliente=0, 'No', 'Si') AS cliente <p> 
	 * FROM pv p LEFT JOIN rel_pv_pot ON p.pv_id = rel_pv_pot.pv_id %s <p>
	 * </code>
	 */
	public static String queryBaseExcel = "SELECT DISTINCT %s codice AS cod_mmas "
			+ "FROM pv p LEFT JOIN rel_pv_pot Relpot ON p.pv_id = Relpot.pv_id %s ";

	/*
	 * public static String querySelExcel =
	 * "SELECT DISTINCT Relmar.ordine, %s "+
	 * "codice AS cod_mmas FROM pv p %s ORDER BY Relmar.ordine";
	 */
	public static String querySelExcel = "SELECT DISTINCT %s " + "codice AS cod_mmas FROM pv p %s";

	/**
	 * Query per ottenere le classi di marche, potenziali o parametri a seconda
	 * della tipologia scelta.
	 * <p>
	 * <code>
	 * SELECT tc_cl%s_id AS id, testo AS text <p>
	 * FROM tc_cl%s tcl <p>
	 * WHERE tcl.tc_stato_id=1 ORDER BY ordine ASC
	 * </code>
	 */
	public static String queryClass = "SELECT tc_cl%s_id AS id, testo AS text FROM tc_cl%s tcl WHERE tcl.tc_stato_id=1 ORDER BY ordine ASC";

	/**
	 * Query per ottenere le classi di marche AZIENDALI, potenziali AZIENDALI o
	 * parametri AZIENDALI a seconda della tipologia scelta.
	 * <p>
	 * <code>
	 * SELECT tc_cl%s_az_id AS id, testo AS text <p>
	 * FROM tc_cl%s_az tcl <p>
	 * WHERE tcl.tc_stato_id=1 ORDER BY ordine ASC
	 * </code>
	 */
	public static String queryClassAz = "SELECT tc_cl%s_az_id AS id, testo AS text FROM tc_cl%s_az tcl WHERE tcl.tc_stato_id=1 ORDER BY ordine ASC";

	/**
	 * Query per ottenere i parametri per scheda anagrafica.
	 * <p>
	 * <code>
	 * SELECT DISTINCT tcl.tc_clpar_id AS classeId, tcl.testo AS parametro <p>
	 * FROM tc_clpar tcl <p>
	 * WHERE tcl.tc_stato_id=1
	 * </code>
	 */
	public static String queryClassPar = "SELECT DISTINCT tcl.tc_clpar_id AS classeId, tcl.testo AS parametro "
			+ "FROM tc_clpar tcl " + "WHERE tcl.tc_stato_id=1 ORDER BY tcl.ordine";

	/**
	 * Query per ottenere i parametri AZIENDALI per la scheda anagrafica.
	 * <p>
	 * <code>
	 * SELECT DISTINCT tcl.tc_clpar_az_id AS classeId, tcl.testo AS parametro <p>
	 * FROM tc_clpar_az tcl <p>
	 * WHERE tcl.tc_stato_id=1
	 * </code>
	 */
	public static String queryClassParAz = "SELECT DISTINCT tcl.tc_clpar_az_id AS classeId, tcl.testo AS parametro "
			+ "FROM tc_clpar_az tcl " + "WHERE tcl.tc_stato_id=1 ORDER BY tcl.ordine";

	/**
	 * Query che trova i valori di una classe di parametri appartenenti ad un
	 * PV.
	 * <p>
	 * <code>
	 * SELECT DISTINCT t.testo AS valore <p>
	 * FROM tc_par t <p>
	 * JOIN rel_pv_par rpp ON t.tc_par_id = rpp.tc_par_id <p>
	 * WHERE rpp.pv_id=%s AND rpp.tc_clpar_id=%s
	 * </code>
	 */
	public static String queryValPar = "SELECT DISTINCT t.testo AS valore,t.tc_par_id AS id_valore " 
			+ "FROM tc_par t "
			+ "JOIN rel_pv_par rpp ON t.tc_par_id = rpp.tc_par_id " 
			+ "WHERE rpp.pv_id=%s AND rpp.tc_clpar_id=%s ";

	/**
	 * Query che trova i valori di una classe di parametri AZIENDALI
	 * appartenenti ad un PV.
	 * <p>
	 * <code>
	 * SELECT DISTINCT t.testo AS valore <p>
	 * FROM tc_par_az t <p>
	 * JOIN rel_pv_par_az rpp ON t.tc_par_az_id = rpp.tc_par_az_id <p>
	 * WHERE rpp.pv_id=%s AND rpp.tc_clpar_az_id=%s
	 * </code>
	 */
	public static String queryValParAz = "SELECT DISTINCT t.testo AS valore " + "FROM tc_par_az t "
			+ "JOIN rel_pv_par_az rpp ON t.tc_par_az_id = rpp.tc_par_az_id "
			+ "WHERE rpp.pv_id=%s AND rpp.tc_clpar_az_id=%s";

	/**
	 * Query che trova i potenziali di un PV.
	 * <p>
	 * <code>
	 * SELECT tccl.testo as potenziale, tcm.testo as fascia, rpm.valore <p>
	 * FROM pv p, tc_pot tcm, rel_pv_pot rpm, tc_clpot tccl <p>
	 * WHERE rpm.tc_pot_id=tcm.tc_pot_id AND rpm.tc_clpot_id=tccl.tc_clpot_id <p>
	 * AND p.pv_id=rpm.pv_id AND p.pv_id=%s and tccl.tc_stato_id=1
	 * </code>
	 */
	public static String queryPot = "SELECT tccl.testo as potenziale, tcm.testo as fascia, rpm.valore "
			+ "FROM pv p, tc_pot tcm, rel_pv_pot rpm, tc_clpot tccl "
			+ "WHERE rpm.tc_pot_id=tcm.tc_pot_id AND rpm.tc_clpot_id=tccl.tc_clpot_id "
			+ "AND p.pv_id=rpm.pv_id AND p.pv_id=%s and tccl.tc_stato_id=1";

	/**
	 * Query che trova i potenziali aziendali di un PV.
	 * <p>
	 * <code>
	 * SELECT tccl.testo as potenziale, tcm.testo as fascia, rpm.valore <p>
	 * FROM pv p, tc_pot_az tcm, rel_pv_pot_az rpm, tc_clpot_az tccl <p>
	 * WHERE rpm.tc_pot_az_id=tcm.tc_pot_az_id AND rpm.tc_clpot_az_id=tccl.tc_clpot_az_id <p>
	 * AND p.pv_id=rpm.pv_id AND p.pv_id=%s and tccl.tc_stato_id=1
	 * </code>
	 */
	public static String queryPotAz = "SELECT tccl.testo as potenziale, tcm.testo as fascia, rpm.valore "
			+ "FROM pv p, tc_pot_az tcm, rel_pv_pot_az rpm, tc_clpot_az tccl "
			+ "WHERE rpm.tc_pot_az_id=tcm.tc_pot_az_id AND rpm.tc_clpot_az_id=tccl.tc_clpot_az_id "
			+ "AND p.pv_id=rpm.pv_id AND p.pv_id=%s and tccl.tc_stato_id=1";

	/**
	 * Query che trova le classi di marche appartenenti ad un PV.
	 * <p>
	 * <code>
	 * SELECT DISTINCT tccl.testo AS classificazione, tcm.testo AS valore <p>
	 * FROM rel_pv_mar rpm <p>
	 * INNER JOIN tc_mar tcm on rpm.tc_mar_id=tcm.tc_mar_id <p>
	 * INNER JOIN tc_clmar tccl on rpm.tc_clmar_id=tccl.tc_clmar_id <p>
	 * INNER JOIN pv p on p.pv_id=rpm.pv_id <p>
	 * WHERE p.pv_id=%s AND tccl.tc_stato_id=1 AND rpm.tc_clmar_id=%s ORDER BY tccl.ordine
	 * </code>
	 */
	public static String queryValMar = "SELECT DISTINCT tccl.tc_clmar_id AS classeId,tccl.testo AS classificazione, tcm.testo AS valore,tcm.tc_mar_id as marcaId "
			+ "FROM rel_pv_mar rpm " + "INNER JOIN tc_mar tcm on rpm.tc_mar_id=tcm.tc_mar_id "
			+ "INNER JOIN tc_clmar tccl on rpm.tc_clmar_id=tccl.tc_clmar_id " + "INNER JOIN pv p on p.pv_id=rpm.pv_id "
			+ "WHERE p.pv_id=%s AND tccl.tc_stato_id=1 AND rpm.tc_clmar_id=%s ORDER BY tccl.ordine";

	public static String queryValSer = "SELECT DISTINCT tccl.testo AS classificazione, tcm.testo AS valore, tcm.tc_ser_id AS servizioId,rpm.tc_clser_id AS classeId "
			+ "FROM rel_pv_ser rpm " + "INNER JOIN tc_ser tcm on rpm.tc_ser_id=tcm.tc_ser_id "
			+ "INNER JOIN tc_clser tccl on rpm.tc_clser_id=tccl.tc_clser_id " + "INNER JOIN pv p on p.pv_id=rpm.pv_id "
			+ "WHERE p.pv_id=%s AND tccl.tc_stato_id=1 AND rpm.tc_clser_id=%s ORDER BY tccl.ordine";

	/**
	 * Query che trova le classi di marche aziendali appartenenti ad un PV.
	 * <p>
	 * <code>
	 * SELECT DISTINCT tccl.testo AS classificazione, tcm.testo AS valore <p>
	 * FROM rel_pv_mar_az rpm <p>
	 * INNER JOIN tc_mar_az tcm on rpm.tc_mar_az_id=tcm.tc_mar_az_id <p>
	 * INNER JOIN tc_clmar_az tccl on rpm.tc_clmar_az_id=tccl.tc_clmar_az_id <p>
	 * INNER JOIN pv p on p.pv_id=rpm.pv_id <p>
	 * WHERE p.pv_id=%s AND tccl.tc_stato_id=1 AND rpm.tc_clmar_az_id=%s ORDER BY tccl.ordine
	 * </code>
	 */
	public static String queryValMarAz = "SELECT DISTINCT tccl.tc_clmar_az_id AS classeAzId,tccl.testo AS classificazione, tcm.testo AS valore,tcm.tc_mar_az_id as marcaAzId  "
			+ "FROM rel_pv_mar_az rpm " + "INNER JOIN tc_mar_az tcm on rpm.tc_mar_az_id=tcm.tc_mar_az_id "
			+ "INNER JOIN tc_clmar_az tccl on rpm.tc_clmar_az_id=tccl.tc_clmar_az_id "
			+ "INNER JOIN pv p on p.pv_id=rpm.pv_id "
			+ "WHERE p.pv_id=%s AND tccl.tc_stato_id=1 AND rpm.tc_clmar_az_id=%s ORDER BY tccl.ordine";

	/**
	 * Query di base per la creazione della tabella temporanea, contenente i pv
	 * della selezione geografica.
	 * <p>
	 * <code>
	 * CREATE TEMPORARY TABLE geografia AS ( <p>
	 * SELECT DISTINCT p.pv_id, p.tc_istat_id FROM mmasgisDB.tc_istat i, pv p <p>
	 * LEFT JOIN rel_pv_par ON p.pv_id = rel_pv_par.pv_id <p>
	 * LEFT JOIN rel_pv_pot ON p.pv_id = rel_pv_pot.pv_id <p>
	 * LEFT JOIN rel_pv_mar ON p.pv_id = rel_pv_mar.pv_id <p>
	 * WHERE p.tc_istat_id = i.tc_istat_id AND p.certificato = 1 AND %s %s)
	 * </code>
	 */
	public static String tempTable = "CREATE TEMPORARY TABLE geografia AS ( "
			+ "SELECT DISTINCT p.pv_id, p.tc_istat_id FROM mmasgisDB.tc_istat i, pv p "
			+ "JOIN rel_pv_%s ON p.pv_id = rel_pv_%s.pv_id "
			+ "WHERE p.tc_istat_id = i.tc_istat_id AND p.certificato = 1 AND %s %s)";
	/*	
	 * Query per la vreazione di una tabella temporanea che calcola il numero di PV che utilizzano una determinata marca
	 * 
	 * 
	 * 
	 * */
	public static String tempTableBrandNumPv="CREATE TEMPORARY TABLE numPV (SELECT tcm.tc_mar_id,tcm.testo AS marca, "
						+ "COUNT(*) num_pv "
						+ "FROM %s.rel_pv_mar m "
						+ "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
						+ "inner JOIN %s.tc_mar tcm ON (m.tc_mar_id = tcm.tc_mar_id) "
						+ "WHERE m.tc_clmar_id = %s "
						+ "GROUP BY tcm.tc_mar_id "
						+ "ORDER BY tcm.testo ASC)";
	
	/*	
	 * Query per la vreazione di una tabella temporanea che calcola il numero di PV che utilizzano una determinata 
	 * marca Azienda
	 * 
	 * 
	 * 
	 * */
	public static String tempTableBrandAzNumPv="CREATE TEMPORARY TABLE numPV (SELECT tcm.tc_mar_az_id,tcm.testo AS marca, "
						+ "COUNT(*) num_pv "
						+ "FROM %s.rel_pv_mar_az m "
						+ "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
						+ "INNER JOIN %s.tc_mar_az tcm ON (m.tc_mar_az_id = tcm.tc_mar_az_id) "
						+ "WHERE m.tc_clmar_az_id = %s "
						+ "GROUP BY tcm.tc_mar_az_id "
						+ "ORDER BY tcm.testo ASC)";
	
	/*	
	 * Query per la vreazione di una tabella temporanea che calcola il numero di PV che offrono un determinato servizio
	 * 
	 * 
	 * 
	 * */
	public static String tempTableServicesNumPv="CREATE TEMPORARY TABLE numPV (SELECT tcm.tc_ser_id,tcm.testo AS servizio, "
						+ "COUNT(*) num_pv "
						+ "FROM %s.rel_pv_ser m "
						+ "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
						+ "inner JOIN %s.tc_ser tcm ON (m.tc_ser_id = tcm.tc_ser_id) "
						+ "WHERE m.tc_clser_id = %s "
						+ "GROUP BY tcm.tc_ser_id "
						+ "ORDER BY tcm.testo ASC)";
	/**
	 * Query per ottenere la base potenziale e la base numerica per Analisi
	 * marche.
	 * <p>
	 * <code>
	 * SELECT DISTINCT m.pv_id , IF(rp.valore IS NULL, 0, rp.valore) valore_pot <p>
	 * FROM %s.rel_pv_mar m <p>
	 * INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = 1) <p>
	 * WHERE  m.tc_clmar_id = %s ORDER BY pv_id
	 * </code>
	 */
	public static String baseNumPot = "SELECT m.pv_id , IF(rp.valore >100, 0, rp.valore) valore_pot "
			+ "FROM %s.rel_pv_mar m " + "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
			+ "JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id) "
			+ "JOIN tc_clpot ON (rp.tc_clpot_id=tc_clpot.tc_clpot_id)"
			+ "WHERE  m.tc_clmar_id = %s GROUP BY m.pv_id ORDER BY pv_id,rp.tc_clpot_id";
	/**
	 * Query per ottenere la base potenziale e la base numerica per Analisi
	 * servizi.
	 * <p>
	 * <code>
	 * SELECT DISTINCT m.pv_id , IF(rp.valore IS NULL, 0, rp.valore) valore_pot <p>
	 * FROM %s.rel_pv_mar m <p>
	 * INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = 1) <p>
	 * WHERE  m.tc_clmar_id = %s ORDER BY pv_id
	 * </code>
	 */
	public static String baseNumPotSer = "SELECT DISTINCT m.pv_id , IF(rp.valore > 100, 0, rp.valore) valore_pot "
			+ "FROM %s.rel_pv_ser m " + "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
			+ "JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id) "
			+ "JOIN tc_clpot ON (rp.tc_clpot_id=tc_clpot.tc_clpot_id)"
			+ "WHERE  m.tc_clser_id = %s  GROUP BY m.pv_id ORDER BY pv_id,rp.tc_clpot_id";
	/**
	 * Query per ottenere la base potenziale e la base numerica per Analisi
	 * marche azienda.
	 * <p>
	 * <code>
	 * SELECT DISTINCT m.pv_id , IF(rp.valore IS NULL, 0, rp.valore) valore_pot 
	 * FROM %s.rel_pv_mar_az m 
	 * INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) 
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = 1) 
	 * WHERE  m.tc_clmar_az_id = %s ORDER BY pv_id
	 * </code>
	 */
	public static String baseNumPotAz = "SELECT DISTINCT m.pv_id , IF(rp.valore >100, 0, rp.valore) valore_pot "
			+ "FROM %s.rel_pv_mar_az m " + "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
			+ "JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id) "
			+ "JOIN tc_clpot ON (rp.tc_clpot_id=tc_clpot.tc_clpot_id)"
			+ "WHERE  m.tc_clmar_az_id = %s  AND tc_clpot.primario=1 GROUP BY m.pv_id ORDER BY pv_id,rp.tc_clpot_id";

	/**
	 * Query per Analisi marche.
	 * <p>
	 * <code>
	 * SELECT tcm.testo AS marca, COUNT(*) num_pv, ROUND(COUNT(*)/ %s *100.0, 2) numerica , <p>
	 * ROUND(SUM(rp.valore), 0) AS pot_pv, ROUND(SUM(rp.valore)/ %s *100.0,2) ponderata , <p>
	 * ROUND(SUM(rp.valore*m.uso/100.0), 0) AS pot_marca, <p>
	 * ROUND(SUM(rp.valore*m.uso/100.0)/ %s*100.0,2) ind_marca , <p>
	 * ROUND(SUM(rp.valore*m.uso)/SUM(rp.valore)+0.0,2) eff_marca, ROUND(SUM(rp.valore)/COUNT(*)*%s/%s,2) eff_valore <p>
	 * FROM %s.rel_pv_mar m <p>
	 * INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) <p>
	 * INNER JOIN %s.tc_mar tcm ON (m.tc_mar_id = tcm.tc_mar_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = 1) <p>
	 * WHERE m.tc_clmar_id = %s GROUP BY tcm.tc_mar_id ORDER BY %s %s
	 * </code>
	 */
	public static String analisiMarche = "SELECT tcm.testo AS marca,n.num_pv num_pv, ROUND(num_pv/ %s *100.0, 2) numerica , "
			+ "ROUND(SUM(rp.valore), 0) AS pot_pv, ROUND(SUM(rp.valore)/ %s *100.0,2) ponderata , "
			+ "ROUND(SUM(rp.valore*m.uso/100.0), 0) AS pot_marca, "
			+ "ROUND(SUM(rp.valore*m.uso/100.0)/ %s*100.0,2) ind_marca , "
			+ "ROUND(SUM(rp.valore*m.uso)/SUM(rp.valore)+0.0,2) eff_marca, "
			+ "ROUND(SUM(rp.valore)/num_pv*%s/%s,2) eff_valore "
			+ "FROM %s.rel_pv_mar m "
			+ "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
			+ "JOIN %s.numPV n on n.tc_mar_id=m.tc_mar_id "
			+ "INNER JOIN %s.tc_mar tcm ON (m.tc_mar_id = tcm.tc_mar_id) "
			+ "JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id) "
			+ "JOIN tc_clpot ON (rp.tc_clpot_id=tc_clpot.tc_clpot_id and tc_clpot.primario=1)"
			+ "WHERE m.tc_clmar_id = %s GROUP BY tcm.tc_mar_id ORDER BY %s %s";

	public static String analisiServizi = "SELECT tcm.testo AS servizio, n.num_pv num_pv, ROUND(num_pv/ %s *100.0, 2) numerica , "
			+ "ROUND(SUM(rp.valore), 0) AS pot_pv, ROUND(SUM(rp.valore)/ %s *100.0,2) ponderata , "
			+ "ROUND(SUM(rp.valore*m.uso/100.0), 0) AS pot_servizio, "
			+ "ROUND(SUM(rp.valore*m.uso/100.0)/ %s*100.0,2) ind_servizio , "
			+ "ROUND(SUM(rp.valore*m.uso)/SUM(rp.valore)+0.0,2) eff_servizio, "
			+ "ROUND(SUM(rp.valore)/num_pv*%s/%s,2) eff_valore "
			+ "FROM %s.rel_pv_ser m "
			+ "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
			+ "JOIN %s.numPV n on n.tc_ser_id=m.tc_ser_id "
			+ "INNER JOIN %s.tc_ser tcm ON (m.tc_ser_id = tcm.tc_ser_id) "
			+ "JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id) "
			+ "JOIN tc_clpot ON (rp.tc_clpot_id=tc_clpot.tc_clpot_id and tc_clpot.primario=1)"
			+ "WHERE m.tc_clser_id = %s GROUP BY tcm.tc_ser_id ORDER BY %s %s";
	
	/**
	 * Query per Analisi Marche Azienda.
	 * <p>
	 * <code>
	 * SELECT tcm.testo AS marca, COUNT(*) num_pv, ROUND(COUNT(*)/ %s *100.0, 2) numerica , <p>
	 * ROUND(SUM(rp.valore), 0) AS pot_pv, ROUND(SUM(rp.valore)/ %s *100.0,2) ponderata , <p>
	 * ROUND(SUM(rp.valore*m.uso/100.0), 0) AS pot_marca, <p>
	 * ROUND(SUM(rp.valore*m.uso/100.0)/ %s*100.0,2) ind_marca , <p>
	 * ROUND(SUM(rp.valore*m.uso)/SUM(rp.valore)+0.0,2) eff_marca, ROUND(SUM(rp.valore)/COUNT(*)*%s/%s,2) eff_valore <p>
	 * FROM %s.rel_pv_mar_az m <p>
	 * INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) <p>
	 * INNER JOIN %s.tc_mar_az tcm ON (m.tc_mar_az_id = tcm.tc_mar_az_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = 1) <p>
	 * WHERE m.tc_clmar_az_id = %s GROUP BY tcm.tc_mar_az_id ORDER BY %s %s
	 * </code>
	 */
	public static String analisiMarcheAz = "SELECT tcm.testo AS marca,  n.num_pv num_pv, ROUND(num_pv/ %s *100.0, 2) numerica , "
			+ "ROUND(SUM(rp.valore), 0) AS pot_pv, ROUND(SUM(rp.valore)/ %s *100.0,2) ponderata , "
			+ "ROUND(SUM(rp.valore*m.uso/100.0), 0) AS pot_marca, "
			+ "ROUND(SUM(rp.valore*m.uso/100.0)/ %s*100.0,2) ind_marca , "
			+ "ROUND(SUM(rp.valore*m.uso)/SUM(rp.valore)+0.0,2) eff_marca, ROUND(SUM(rp.valore)/num_pv*%s/%s,2) eff_valore "
			+ "FROM %s.rel_pv_mar_az m "
			+ "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
			+ "JOIN %s.numPV n on n.tc_mar_az_id=m.tc_mar_az_id "
			+ "INNER JOIN %s.tc_mar_az tcm ON (m.tc_mar_az_id = tcm.tc_mar_az_id) "
			+ "JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id) "
			+ "JOIN tc_clpot ON (rp.tc_clpot_id=tc_clpot.tc_clpot_id AND tc_clpot.primario=1)"
			+ "WHERE m.tc_clmar_az_id = %s GROUP BY tcm.tc_mar_az_id ORDER BY %s %s";

	/**
	 * Query per base numerica dell'aggregazione territoriale.
	 * <p>
	 * <code>
	 * SELECT COUNT(tc.nome1) FROM %s.geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_regione tc ON (i.tc_regione_id=tc.tc_regione_id) <p>
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) 
	 * </code>
	 */
	public static String baseNumTerr = "SELECT COUNT(tc.nome1) FROM %s.geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_regione tc ON (i.tc_regione_id=tc.tc_regione_id) "
			+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
			+ "LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) ";

	/**
	 * Query per base numerica dell'aggregazione territoriale.
	 * <p>
	 * <code>
	 * SELECT COUNT(tc.nome1) FROM %s.geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_regione tc ON (i.tc_regione_id=tc.tc_regione_id) <p>
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) 
	 * </code>
	 */
	public static String baseNumTerrAz = "SELECT COUNT(tc.nome1) FROM %s.geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_regione tc ON (i.tc_regione_id=tc.tc_regione_id) "
			+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
			+ "LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) ";
	
	/**
	 * Query per base numerica dell'aggregazione territoriale per fatturati.
	 * <p>
	 * <code>
	 * SELECT COUNT(tc.nome1) FROM %s.geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_regione tc ON (i.tc_regione_id=tc.tc_regione_id) <p>
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_fatt rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) 
	 * </code>
	 */
	public static String baseNumTerrFatt = "SELECT COUNT(tc.nome1) FROM %s.geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_regione tc ON (i.tc_regione_id=tc.tc_regione_id) "
			+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
			+ "LEFT JOIN %s.rel_pv_fatt rp ON (s.pv_id = rp.pv_id AND rp.tc_clfatt_id = %s) ";
	
	/**
	 * Query per base potenziale dell'aggregazione territoriale.
	 * <p>
	 * <code>
	 * SELECT DISTINCT m.pv_id , IF(rp.valore IS NULL, 0, rp.valore) valore_pot <p>
	 * FROM %s.rel_pv_pot m " + "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) 
	 * </code>
	 */
	public static String baseNumPotTerr = "SELECT DISTINCT m.pv_id , IF(rp.valore IS NULL, 0, rp.valore) valore_pot "
			+ "FROM %s.rel_pv_pot m " + "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
			+ "LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) ";
	
	
	/**
	 * Query per base potenziale azienda dell'aggregazione territoriale.
	 * <p>
	 * <code>
	 * SELECT DISTINCT m.pv_id , IF(rp.valore IS NULL, 0, rp.valore) valore_pot <p>
	 * FROM %s.rel_pv_pot m " + "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) 
	 * </code>
	 */
	public static String baseNumPotAzTerr = "SELECT DISTINCT m.pv_id , IF(rp.valore IS NULL, 0, rp.valore) valore_pot "
			+ "FROM %s.rel_pv_pot_az m " + "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
			+ "LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) ";
	
	/**
	 * Query per base potenziale dell'aggregazione territoriale.
	 * <p>
	 * <code>
	 * SELECT DISTINCT m.pv_id , IF(rp.valore IS NULL, 0, rp.valore) valore_pot <p>
	 * FROM %s.rel_pv_pot m " + "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) 
	 * </code>
	 */
	public static String baseNumPotTerrFatt = "SELECT DISTINCT m.pv_id , IF(rp.importo IS NULL, 0, rp.importo) valore_fatt "
			+ "FROM %s.rel_pv_fatt m " + "INNER JOIN %s.geografia s ON (m.pv_id = s.pv_id) "
			+ "LEFT JOIN %s.rel_pv_fatt rp ON (s.pv_id = rp.pv_id AND rp.tc_clfatt_id = %s) ";

	/**
	 * Query per base clienti dell'analisi territoriale.
	 * <p>
	 * <code>
	 * SELECT count(p.cliente) cl from %s.geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) <p>
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) <p>
	 * WHERE cliente = 1
	 * </code>
	 */
	public static String baseNumClTerr = "SELECT count(p.cliente) cl from %s.geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) "
			+ "JOIN %s.pv p ON (s.pv_id = p.pv_id)  "
			+ "LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) " 
			+ "WHERE cliente = 1";
	/**
	 * Query che calcola il totale dei potenziali clienti preso a seconda del livello selezionato
	 * 
	 * SELECT sum(rp.valore) cl FROM %s.geografia s    //censimento
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) 
	 * JOIN mmasgisDB.tc_%s tc ON (i.tc_%s_id=tc.tc_%s_id)  //livello, livello,livello
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id)   //censimento
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = 1)  //censimento
	 * WHERE cliente = 1 
	 * GROUP BY tc.tc_%s_id //livello
	 */

		public static String baseNumPotClTerr="SELECT sum(rp.valore) cl FROM %s.geografia s "
				+ "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
				+ "JOIN mmasgisDB.tc_%s tc ON (i.tc_%s_id=tc.tc_%s_id) "
				+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
				+ "LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) "
				+ "WHERE cliente = 1 "
				+ "GROUP BY tc.tc_%s_id "
				+ "ORDER BY tc.nome1";
		
		public static String baseNumPotCapClTerr="SELECT SUM(rp.valore) cl,tc.nome1 "
				+ "FROM %s.geografia s JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id)"
				+ "JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) "
				+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
				+ "LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) "
				+ "LEFT OUTER JOIN mmasgisDB.tc_cap ON (tc_cap.tc_comune_id = i.tc_comune_id AND tc_cap.nome1=p.cap) "
				+ "WHERE cliente = 1 and rp.valore is not null "
				+ "GROUP BY tc.tc_comune_id,tc_cap.nome1 "
				+ "ORDER BY tc.nome1";
		
		public static String baseNumPotAzClTerr="SELECT sum(rp.valore) cl FROM %s.geografia s "
				+ "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
				+ "JOIN mmasgisDB.tc_%s tc ON (i.tc_%s_id=tc.tc_%s_id) "
				+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
				+ "LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) "
				+ "WHERE cliente = 1 "
				+ "GROUP BY tc.tc_%s_id "
				+ "ORDER BY tc.nome1";
		
		public static String baseNumPotAzCapClTerr="SELECT SUM(rp.valore) cl,tc.nome1 "
				+ "FROM %s.geografia s JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id)"
				+ "JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) "
				+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
				+ "LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) "
				+ "LEFT OUTER JOIN mmasgisDB.tc_cap ON (tc_cap.tc_comune_id = i.tc_comune_id AND tc_cap.nome1=p.cap) "
				+ "WHERE cliente = 1 and rp.valore is not null "
				+ "GROUP BY tc.tc_comune_id,tc_cap.nome1 "
				+ "ORDER BY tc.nome1";
	/**
	 * Query per base clienti dell'analisi territoriale azienda.
	 * <p>
	 * <code>
	 * SELECT count(p.cliente) cl from %s.geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) <p>
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) <p>
	 * WHERE cliente = 1
	 * </code>
	 */
	
	
	public static String baseNumClTerrAz = "SELECT count(p.cliente) cl from %s.geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) "
			+ "JOIN %s.pv p ON (s.pv_id = p.pv_id)  "
			+ "LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) " 
			+ "WHERE cliente = 1";
	
	/**
	 * Query per base clienti dell'analisi territoriale.
	 * <p>
	 * <code>
	 * SELECT count(p.cliente) cl from %s.geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) <p>
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) <p>
	 * WHERE cliente = 1
	 * </code>
	 */
	public static String baseNumClTerrFatt = "SELECT count(p.cliente) cl from %s.geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) "
			+ "JOIN %s.pv p ON (s.pv_id = p.pv_id)  "
			+ "LEFT JOIN %s.rel_pv_fatt rp ON (s.pv_id = rp.pv_id AND rp.tc_clfatt_id = %s) " 
			+ "WHERE cliente = 1";

	
	/**
	 * Query per Aggregazione Territoriale Azienda.
	 * <p>
	 * <code>
	 * SELECT tc.tc_%s_id id, tc.nome1 AS nome, p.cap AS cap," 
	 * COUNT(tc.nome1) AS NumPV, 
	 * ROUND(COUNT(tc.nome1)/ %s *100.0, 2) PercentPV , 
	 * SUM(p.cliente) AS NumClienti, 
	 * ROUND(SUM(p.cliente)/ %s *100.0, 2) PercentClienti, 
	 * ROUND(SUM(rp.valore),0) Potenziale,ROUND(SUM(rp.valore)/ %s *100.0,2) PercentPOT 
	 * FROM %s.geografia s 
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) 
	 * JOIN mmasgisDB.tc_%s tc ON (i.tc_%s_id=tc.tc_%s_id) 
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id)  
	 * LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) 
	 * GROUP BY tc.tc_%s_id 
	 * ORDER BY %s %s
	 * </code>
	 */
	public static String aggregazionePvAz = "SELECT tc.tc_%s_id id, tc.nome1 AS Territorio,"
			+ "COUNT(tc.nome1) AS NumPV, " + "ROUND(COUNT(tc.nome1)/ %s *100.0, 2) Percentuale_PV ,"
			+ "SUM(p.cliente) AS NumClienti, "
			+ "ROUND(SUM(p.cliente)/COUNT(tc.nome1),2) AS Rapp_clienti_pv," + "ROUND(SUM(p.cliente)/ %s *100.0, 2) Percentuale_Clienti, "
			+ "ROUND(SUM(rp.valore),0) Potenziale,ROUND(SUM(rp.valore)/ %s *100.0,2) Percentuale_Pot "
			+ "FROM %s.geografia s " + "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_%s tc ON (i.tc_%s_id=tc.tc_%s_id) " + "JOIN %s.pv p ON (s.pv_id = p.pv_id)  "
			+ "LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) " + "GROUP BY tc.tc_%s_id "
			+ "ORDER BY %s %s";
	
	/**
	 * Query per Aggregazione Territoriale.
	 * <p>
	 * <code>
	 * SELECT tc.tc_%s_id id, tc.nome1 AS nome, p.cap AS cap," 
	 * COUNT(tc.nome1) AS NumPV, 
	 * ROUND(COUNT(tc.nome1)/ %s *100.0, 2) PercentPV , 
	 * SUM(p.cliente) AS NumClienti, 
	 * ROUND(SUM(p.cliente)/ %s *100.0, 2) PercentClienti, 
	 * ROUND(SUM(rp.valore),0) Potenziale,ROUND(SUM(rp.valore)/ %s *100.0,2) PercentPOT 
	 * FROM %s.geografia s 
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) 
	 * JOIN mmasgisDB.tc_%s tc ON (i.tc_%s_id=tc.tc_%s_id) 
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id)  
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) 
	 * GROUP BY tc.tc_%s_id 
	 * ORDER BY %s %s
	 * </code>
	 */
	public static String aggregazionePv = "SELECT tc.tc_%s_id id, tc.nome1 AS Territorio,"
			+ "COUNT(tc.nome1) AS NumPV, " + "ROUND(COUNT(tc.nome1)/ %s *100.0, 2) Percentuale_PV ,"
			+ "SUM(p.cliente) AS NumClienti,"
			+ "ROUND(SUM(p.cliente)/COUNT(tc.nome1),2) AS Rapp_clienti_pv, " + "ROUND(SUM(p.cliente)/ %s *100.0, 2) Percentuale_Clienti, "
			+ "ROUND(SUM(rp.valore),0) Potenziale,ROUND(SUM(rp.valore)/ %s *100.0,2) Percentuale_Pot "
			+ "FROM %s.geografia s " + "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_%s tc ON (i.tc_%s_id=tc.tc_%s_id) " + "JOIN %s.pv p ON (s.pv_id = p.pv_id)  "
			+ "LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) " + "GROUP BY tc.tc_%s_id "
			+ "ORDER BY %s %s";
	
	/**
	 * Query per Aggregazione Territoriale.
	 * <p>
	 * <code>
	 * SELECT tc.tc_%s_id id, tc.nome1 AS nome, p.cap AS cap," 
	 * COUNT(tc.nome1) AS NumPV, 
	 * ROUND(COUNT(tc.nome1)/ %s *100.0, 2) PercentPV , 
	 * SUM(p.cliente) AS NumClienti, 
	 * ROUND(SUM(p.cliente)/ %s *100.0, 2) PercentClienti, 
	 * ROUND(SUM(rp.importo),0) Fatturato,ROUND(SUM(rp.importo)/ %s *100.0,2) PercentFATT 
	 * FROM %s.geografia s 
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) 
	 * JOIN mmasgisDB.tc_%s tc ON (i.tc_%s_id=tc.tc_%s_id) 
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id)  
	 * LEFT JOIN %s.rel_pv_fatt rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) 
	 * GROUP BY tc.tc_%s_id 
	 * ORDER BY %s %s
	 * </code>
	 */
	public static String aggregazionePvFatt = "SELECT tc.tc_%s_id id, tc.nome1 AS Territorio,"
			+ "COUNT(tc.nome1) AS NumPV, " 
			+ "ROUND(COUNT(tc.nome1)/ %s *100.0, 2) Percentuale_PV ,"
			+ "SUM(p.cliente) AS NumClienti," 
			+ "ROUND(SUM(p.cliente)/ %s *100.0, 2) Percentuale_Clienti, "
			+ "ROUND(SUM(rp.importo),0) Fatturato,"
			+ "ROUND(SUM(rp.importo)/ %s *100.0,2) Percentuale_Fatt "
			+ "FROM %s.geografia s " 
			+ "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_%s tc ON (i.tc_%s_id=tc.tc_%s_id) " + "JOIN %s.pv p ON (s.pv_id = p.pv_id)  "
			+ "LEFT JOIN %s.rel_pv_fatt rp ON (s.pv_id = rp.pv_id AND rp.tc_clfatt_id = %s) " + "GROUP BY tc.tc_%s_id "
			+ "ORDER BY %s %s";

	/**
	 * Query per Aggregazione Territoriale a livello Comuni e Aree CAP.
	 * <p>
	 * <code>
	 * SELECT tc.tc_comune_id id,tc.nome1 AS nome, p.cap AS cap, <p>
	 * COUNT(tc.nome1) AS NumPV, <p>
	 * ROUND(COUNT(tc.nome1)/ %s *100.0, 2) PercentPV <p>
	 * SUM(p.cliente) AS NumClienti, <p>
	 * ROUND(SUM(p.cliente)/ %s *100.0, 2) PercentClienti, <p>
	 * ROUND(SUM(rp.valore),0) potenziale,ROUND(SUM(rp.valore)/ %s *100.0,2) PercentPOT <p>
	 * FROM %s.geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) <p>
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) <p>
	 * LEFT OUTER JOIN mmasgisDB.tc_cap ON (tc_cap.tc_comune_id = i.tc_comune_id AND tc_cap.nome1=p.cap) <p>
	 * GROUP BY tc.tc_comune_id,tc_cap.nome1, p.cap <p>
	 * ORDER BY %s %s, p.cap
	 * </code>
	 */
	public static String aggregazionePvCap = "SELECT tc.tc_comune_id id,tc.nome1 AS Territorio,%s "
			+ "COUNT(tc.nome1) AS NumPV, " + "ROUND(COUNT(tc.nome1)/ %s *100.0, 2) Percentuale_PV ,"
			+ "SUM(p.cliente) AS NumClienti, "
			+ "ROUND(SUM(p.cliente)/COUNT(tc.nome1),2) AS Rapp_clienti_pv" + ",ROUND(SUM(p.cliente)/ %s *100.0, 2) Percentuale_Clienti, "
			+ "ROUND(SUM(rp.valore),0) Potenziale,ROUND(SUM(rp.valore)/ %s *100.0,2) Percentuale_Pot "
			+ "FROM %s.geografia s " + "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) "
			+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
			+ "LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) "
			+ "LEFT OUTER JOIN mmasgisDB.tc_cap ON (tc_cap.tc_comune_id = i.tc_comune_id AND tc_cap.nome1=p.cap) "
			+ "GROUP BY tc.tc_comune_id,tc_cap.nome1, p.cap " + "ORDER BY %s %s, p.cap";
	
	/**
	 * Query per Aggregazione Territoriale a livello Comuni e Aree CAP.
	 * <p>
	 * <code>
	 * SELECT tc.tc_comune_id id,tc.nome1 AS nome, p.cap AS cap, <p>
	 * COUNT(tc.nome1) AS NumPV, <p>
	 * ROUND(COUNT(tc.nome1)/ %s *100.0, 2) PercentPV <p>
	 * SUM(p.cliente) AS NumClienti, <p>
	 * ROUND(SUM(p.cliente)/ %s *100.0, 2) PercentClienti, <p>
	 * ROUND(SUM(rp.valore),0) potenziale,ROUND(SUM(rp.valore)/ %s *100.0,2) PercentPOT <p>
	 * FROM %s.geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) <p>
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_pot rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_id = %s) <p>
	 * LEFT OUTER JOIN mmasgisDB.tc_cap ON (tc_cap.tc_comune_id = i.tc_comune_id AND tc_cap.nome1=p.cap) <p>
	 * GROUP BY tc.tc_comune_id,tc_cap.nome1, p.cap <p>
	 * ORDER BY %s %s, p.cap
	 * </code>
	 */
	public static String aggregazionePvAzCap = "SELECT tc.tc_comune_id id,tc.nome1 AS Territorio,%s "
			+ "COUNT(tc.nome1) AS NumPV, " + "ROUND(COUNT(tc.nome1)/ %s *100.0, 2) Percentuale_PV ,"
			+ "SUM(p.cliente) AS NumClienti,"
			+ " ROUND(SUM(p.cliente)/COUNT(tc.nome1),2) AS Rapp_clienti_pv, " + "ROUND(SUM(p.cliente)/ %s *100.0, 2) Percentuale_Clienti, "
			+ "ROUND(SUM(rp.valore)/COUNT(tc.nome1),0) Potenziale,ROUND(SUM(rp.valore)/ %s *100.0,2) Percentuale_Pot "
			+ "FROM %s.geografia s " + "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) "
			+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
			+ "LEFT JOIN %s.rel_pv_pot_az rp ON (s.pv_id = rp.pv_id AND rp.tc_clpot_az_id = %s) "
			+ "LEFT OUTER JOIN mmasgisDB.tc_cap ON (tc_cap.tc_comune_id = i.tc_comune_id AND tc_cap.nome1=p.cap) "
			+ "GROUP BY tc.tc_comune_id,tc_cap.nome1, p.cap " + "ORDER BY %s %s, p.cap";
	
	/**
	 * Query per Aggregazione Territoriale per Fatturati a livello Comuni e Aree CAP.
	 * <p>
	 * <code>
	 * SELECT tc.tc_comune_id id,tc.nome1 AS nome, p.cap AS cap, <p>
	 * COUNT(tc.nome1) AS NumPV, <p>
	 * ROUND(COUNT(tc.nome1)/ %s *100.0, 2) PercentPV <p>
	 * SUM(p.cliente) AS NumClienti, <p>
	 * ROUND(SUM(p.cliente)/ %s *100.0, 2) PercentClienti, <p>
	 * ROUND(SUM(rp.importo),0) potenziale,ROUND(SUM(rp.importo)/ %s *100.0,2) PercentFATT <p>
	 * FROM %s.geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) <p>
	 * JOIN %s.pv p ON (s.pv_id = p.pv_id) <p>
	 * LEFT JOIN %s.rel_pv_fatt rp ON (s.pv_id = rp.pv_id AND rp.tc_clfatt_id = %s) <p>
	 * LEFT OUTER JOIN mmasgisDB.tc_cap ON (tc_cap.tc_comune_id = i.tc_comune_id AND tc_cap.nome1=p.cap) <p>
	 * GROUP BY tc.tc_comune_id,tc_cap.nome1, p.cap <p>
	 * ORDER BY %s %s, p.cap
	 * </code>
	 */
	public static String aggregazioneFattCap = "SELECT %s tc.tc_comune_id id,tc.nome1 AS Territorio, "
			+ "COUNT(tc.nome1) AS NumPV, " 
			+ "ROUND(COUNT(tc.nome1)/ %s *100.0, 2) Percentuale_PV ,"
			+ "SUM(p.cliente) AS NumClienti," 
			+ "ROUND(SUM(p.cliente)/ %s *100.0, 2) Percentuale_Clienti, "
			+ "ROUND(SUM(rp.importo)/COUNT(tc.nome1),0) Fatturato,"
			+ "ROUND(SUM(rp.importo)/ %s *100.0,2) Percentuale_Fatt "
			+ "FROM %s.geografia s " + "JOIN mmasgisDB.tc_istat i ON (s.tc_istat_id = i.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_comune tc ON (i.tc_comune_id=tc.tc_comune_id) "
			+ "JOIN %s.pv p ON (s.pv_id = p.pv_id) "
			+ "LEFT JOIN %s.rel_pv_fatt rp ON (s.pv_id = rp.pv_id AND rp.tc_clfatt_id = %s) "
			+ "LEFT OUTER JOIN mmasgisDB.tc_cap ON (tc_cap.tc_comune_id = i.tc_comune_id AND tc_cap.nome1=p.cap) "
			+ "GROUP BY tc.tc_comune_id,tc_cap.nome1, p.cap " + "ORDER BY %s %s, p.cap";
	
	/**
	 * Query per Aggregazione Parametri su livello Regione.
	 * <p>
	 * <code>
	 * SELECT tci.nome1 nome1, COUNT(r.tc_clpar_id) AS conteggio,tcp.tc_par_id parametro,tcp.testo, <p>
	 * tci.tc_regione_id AS id <p>
	 * FROM geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_regione tci ON (i.tc_regione_id=tci.tc_regione_id) <p>
	 * JOIN rel_pv_par r ON (r.pv_id = s.pv_id AND r.tc_clpar_id = %s ) <p>
	 * JOIN tc_par tcp ON (tcp.tc_par_id = r.tc_par_id) <p>
	 * GROUP BY id,tcp.tc_par_id ORDER BY tci.nome1
	 * </code>
	 */
	public static String aggregazioneParReg = "SELECT tci.nome1 nome1, COUNT(r.tc_clpar_id) AS conteggio,tcp.tc_par_id parametro,tcp.testo, "
			+ "tci.tc_regione_id AS id "
			+ "FROM geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_regione tci ON (i.tc_regione_id=tci.tc_regione_id) "
			+ "JOIN rel_pv_par r ON (r.pv_id = s.pv_id AND r.tc_clpar_id = %s ) " 
			+ "JOIN tc_par tcp ON (tcp.tc_par_id = r.tc_par_id)  " 
			+ "GROUP BY id,tcp.tc_par_id ORDER BY tci.nome1";

	/**
	 * Query per Aggregazione Parametri Azienda su livello Regione.
	 * <p>
	 * <code>
	 * SELECT tci.nome1 nome1, COUNT(r.tc_clpar_az_id) AS conteggio,tcp.tc_par_az_id parametro,tcp.testo, <p>
	 * tci.tc_regione_id AS id <p>
	 * FROM geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_regione tci ON (i.tc_regione_id=tci.tc_regione_id) <p>
	 * JOIN rel_pv_par_az r ON (r.pv_id = s.pv_id AND r.tc_clpar_az_id = %s ) <p>
	 * JOIN tc_par_az tcp ON (tcp.tc_par_az_id = r.tc_par_az_id) <p>
	 * GROUP BY id,tcp.tc_par_az_id ORDER BY tci.nome1
	 * </code>
	 */
	public static String aggregazioneParAziendaReg = "SELECT tci.nome1 nome1, COUNT(r.tc_clpar_az_id) AS conteggio,tcp.tc_par_az_id parametro,tcp.testo, "
			+ "tci.tc_regione_id AS id "
			+ "FROM geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_regione tci ON (i.tc_regione_id=tci.tc_regione_id) "
			+ "JOIN rel_pv_par_az r ON (r.pv_id = s.pv_id AND r.tc_clpar_az_id = %s ) "
			+ "JOIN tc_par_az tcp ON (tcp.tc_par_az_id = r.tc_par_az_id)  "
			+ "GROUP BY id,tcp.tc_par_az_id ORDER BY tci.nome1";

	/**
	 * Query per Aggregazione Parametri su livello Provincia.
	 * <p>
	 * <code>
	 * SELECT tci.nome1 nome1, COUNT(r.tc_clpar_id) AS conteggio,tcp.tc_par_id parametro,tcp.testo, <p>
	 * tci.tc_provincia_id AS id <p>
	 * FROM geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_provincia tci ON (i.tc_provincia_id=tci.tc_provincia_id) <p>
	 * JOIN rel_pv_par r ON (r.pv_id = s.pv_id AND r.tc_clpar_id = %s ) <p>
	 * JOIN tc_par tcp ON (tcp.tc_par_id = r.tc_par_id) <p>
	 * GROUP BY id,tcp.tc_par_id ORDER BY tci.nome1
	 * </code>
	 */
	public static String aggregazioneParPro = "SELECT tci.nome1 nome1, COUNT(r.tc_clpar_id) AS conteggio,tcp.tc_par_id parametro,tcp.testo, "
			+ "tci.tc_provincia_id AS id "
			+ "FROM geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_provincia tci ON (i.tc_provincia_id=tci.tc_provincia_id) "
			+ "JOIN rel_pv_par r ON (r.pv_id = s.pv_id AND r.tc_clpar_id = %s ) " 
			+ "JOIN tc_par tcp ON (tcp.tc_par_id = r.tc_par_id)  " 
			+ "GROUP BY id,tcp.tc_par_id ORDER BY tci.nome1";

	/**
	 * Query per Aggregazione Parametri Azienda su livello Provincia.
	 * <p>
	 * <code>
	 * SELECT tci.nome1 nome1, COUNT(r.tc_clpar_az_id) AS conteggio,tcp.tc_par_az_id parametro,tcp.testo, <p>
	 * tci.tc_provincia_id AS id <p>
	 * FROM geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_provincia tci ON (i.tc_provincia_id=tci.tc_provincia_id) <p>
	 * JOIN rel_pv_par_az r ON (r.pv_id = s.pv_id AND r.tc_clpar_az_id = %s ) <p>
	 * JOIN tc_par_az tcp ON (tcp.tc_par_az_id = r.tc_par_az_id) <p>
	 * GROUP BY id,tcp.tc_par_az_id ORDER BY tci.nome1
	 * </code>
	 */
	public static String aggregazioneParAziendaPro = "SELECT tci.nome1 nome1, COUNT(r.tc_clpar_az_id) AS conteggio,tcp.tc_par_az_id parametro,tcp.testo, "
			+ "tci.tc_provincia_id AS id "
			+ "FROM geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_provincia tci ON (i.tc_provincia_id=tci.tc_provincia_id) "
			+ "JOIN rel_pv_par_az r ON (r.pv_id = s.pv_id AND r.tc_clpar_az_id = %s ) "
			+ "JOIN tc_par_az tcp ON (tcp.tc_par_az_id = r.tc_par_az_id)  "
			+ "GROUP BY id,tcp.tc_par_az_id ORDER BY tci.nome1";

	/**
	 * Query per Aggregazione Parametri su livello Comune.
	 * <p>
	 * <code>
	 * SELECT tci.nome1 nome1, COUNT(r.tc_clpar_id) AS conteggio,tcp.tc_par_id parametro,tcp.testo, <p>
	 * tci.tc_comune_id AS id <p>
	 * FROM geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_comune tci ON (i.tc_comune_id=tci.tc_comune_id) <p>
	 * JOIN rel_pv_par r ON (r.pv_id = s.pv_id AND r.tc_clpar_id = %s ) <p>
	 * JOIN tc_par tcp ON (tcp.tc_par_id = r.tc_par_id) <p>
	 * GROUP BY id,tcp.tc_par_id ORDER BY tci.nome1
	 * </code>
	 */
	public static String aggregazioneParCom = "SELECT tci.nome1 nome1, COUNT(r.tc_clpar_id) AS conteggio,tcp.tc_par_id parametro,tcp.testo, "
			+ "tci.tc_comune_id AS id "
			+ "FROM geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_comune tci ON (i.tc_comune_id=tci.tc_comune_id) "
			+ "JOIN rel_pv_par r ON (r.pv_id = s.pv_id AND r.tc_clpar_id = %s ) " 
			+ "JOIN tc_par tcp ON (tcp.tc_par_id = r.tc_par_id)  " 
			+ "GROUP BY id,tcp.tc_par_id ORDER BY tci.nome1";

	/**
	 * Query per Aggregazione Parametri Azienda su livello Comune.
	 * <p>
	 * <code>
	 * SELECT tci.nome1 nome1, COUNT(r.tc_clpar_az_id) AS conteggio,tcp.tc_par_az_id parametro,tcp.testo, <p>
	 * tci.tc_comune_id AS id <p>
	 * FROM geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) <p>
	 * JOIN mmasgisDB.tc_comune tci ON (i.tc_comune_id=tci.tc_comune_id) <p>
	 * JOIN rel_pv_par_az r ON (r.pv_id = s.pv_id AND r.tc_clpar_az_id = %s ) <p>
	 * JOIN tc_par_az tcp ON (tcp.tc_par_az_id = r.tc_par_az_id) <p>
	 * GROUP BY id,tcp.tc_par_az_id ORDER BY tci.nome1
	 * </code>
	 */
	public static String aggregazioneParAziendaCom = "SELECT tci.nome1 nome1, COUNT(r.tc_clpar_az_id) AS conteggio,tcp.tc_par_az_id parametro,tcp.testo, "
			+ "tci.tc_comune_id AS id "
			+ "FROM geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON(i.tc_istat_id = s.tc_istat_id) "
			+ "JOIN mmasgisDB.tc_comune tci ON (i.tc_comune_id=tci.tc_comune_id) "
			+ "JOIN rel_pv_par_az r ON (r.pv_id = s.pv_id AND r.tc_clpar_az_id = %s ) "
			+ "JOIN tc_par_az tcp ON (tcp.tc_par_az_id = r.tc_par_az_id)  "
			+ "GROUP BY id,tcp.tc_par_az_id ORDER BY tci.nome1";

	/**
	 * Query per Aggregazione Parametri su livello CAP.
	 * <p>
	 * <code>
	 * SELECT tci.nome1 nome1, COUNT(r.tc_clpar_id) AS conteggio,tcp.tc_par_id parametro,tcp.testo, <p>
	 * p.cap,CONCAT(tci.tc_comune_id,'_',p.cap) AS id <p>
	 * FROM geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (i.tc_istat_id = s.tc_istat_id) <p>
	 * JOIN pv p ON (p.pv_id = s.pv_id) <p>
	 * JOIN mmasgisDB.tc_comune tci ON (i.tc_comune_id=tci.tc_comune_id) <p>
	 * JOIN rel_pv_par r ON (r.pv_id = s.pv_id AND r.tc_clpar_id = %s ) <p>
	 * JOIN tc_par tcp ON (tcp.tc_par_id = r.tc_par_id) <p>
	 * GROUP BY id,tcp.tc_par_id,p.cap ORDER BY tci.nome1 ,p.cap
	 * </code>
	 */
	public static String aggregazioneParCap = "SELECT tci.nome1 nome1, COUNT(r.tc_clpar_id) AS conteggio,tcp.tc_par_id parametro,tcp.testo, "
			+ "p.cap,CONCAT(tci.tc_comune_id,'_',p.cap) AS id "
			+ "FROM geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON (i.tc_istat_id = s.tc_istat_id) "
			+ "JOIN pv p ON (p.pv_id = s.pv_id) "
			+ "JOIN mmasgisDB.tc_comune tci ON (i.tc_comune_id=tci.tc_comune_id) "
			+ "JOIN rel_pv_par r ON (r.pv_id = s.pv_id AND r.tc_clpar_id = %s ) "
			+ "JOIN tc_par tcp ON (tcp.tc_par_id = r.tc_par_id) "
			+ "GROUP BY id,tcp.tc_par_id,p.cap ORDER BY tci.nome1 ,p.cap";

	/**
	 * Query per Aggregazione Parametri Azienda su livello CAP.
	 * <p>
	 * <code>
	 * SELECT tci.nome1 nome1, COUNT(r.tc_clpar_az_id) AS conteggio,tcp.tc_par_az_id parametro,tcp.testo, <p>
	 * p.cap,CONCAT(tci.tc_comune_id,'_',p.cap) AS id <p>
	 * FROM geografia s <p>
	 * JOIN mmasgisDB.tc_istat i ON (i.tc_istat_id = s.tc_istat_id) <p>
	 * JOIN pv p ON (p.pv_id = s.pv_id) <p>
	 * JOIN mmasgisDB.tc_comune tci ON (i.tc_comune_id=tci.tc_comune_id) <p>
	 * JOIN rel_pv_par_az r ON (r.pv_id = s.pv_id AND r.tc_clpar_az_id = %s ) <p>
	 * JOIN tc_par_az tcp ON (tcp.tc_par_az_id = r.tc_par_az_id) <p>
	 * GROUP BY id,tcp.tc_par_az_id,p.cap ORDER BY tci.nome1 ,p.cap
	 * </code>
	 */
	public static String aggregazioneParAziendaCap = "SELECT tci.nome1 nome1, COUNT(r.tc_clpar_az_id) AS conteggio,tcp.tc_par_az_id parametro,tcp.testo, "
			+ "p.cap,CONCAT(tci.tc_comune_id,'_',p.cap) AS id "
			+ "FROM geografia s "
			+ "JOIN mmasgisDB.tc_istat i ON (i.tc_istat_id = s.tc_istat_id) "
			+ "JOIN pv p ON (p.pv_id = s.pv_id) "
			+ "JOIN mmasgisDB.tc_comune tci ON (i.tc_comune_id=tci.tc_comune_id) "
			+ "JOIN rel_pv_par_az r ON (r.pv_id = s.pv_id AND r.tc_clpar_az_id = %s ) "
			+ "JOIN tc_par_az tcp ON (tcp.tc_par_az_id = r.tc_par_az_id) "
			+ "GROUP BY id,tcp.tc_par_az_id,p.cap ORDER BY tci.nome1 ,p.cap";

	/**
	 * Query per risolvere codici istat Regioni.
	 * <p>
	 * <code>
	 * SELECT tc_istat_id <p>
	 * FROM mmasgisDB.tc_istat JOIN mmasgisDB.regioni ON tc_istat.tc_regione_id = regioni.tc_regione_id <p>
	 * WHERE regioni.codice = 
	 * </code>
	 */
	public static final String queryIstatRegioni = "SELECT tc_istat_id FROM mmasgisDB.tc_istat JOIN mmasgisDB.regioni ON tc_istat.tc_regione_id = regioni.tc_regione_id WHERE regioni.codice = ";

	/**
	 * Query per risolvere codici istat Province.
	 * <p>
	 * <code>
	 * SELECT tc_istat_id <p>
	 * FROM mmasgisDB.tc_istat JOIN mmasgisDB.province ON tc_istat.tc_provincia_id = province.tc_provincia_id <p>
	 * WHERE province.codice = 
	 * </code>
	 */
	public static final String queryIstatProvince = "SELECT tc_istat_id FROM mmasgisDB.tc_istat JOIN mmasgisDB.province ON tc_istat.tc_provincia_id = province.tc_provincia_id WHERE province.codice = ";

	/**
	 * Query per risolvere codici istat Comuni.
	 * <p>
	 * <code>
	 * SELECT tc_istat_id <p>
	 * FROM mmasgisDB.tc_istat JOIN mmasgisDB.comuni ON tc_istat.tc_comune_id = comuni.tc_comune_id <p>
	 * WHERE comuni.codice = 
	 * </code>
	 */
	public static final String queryIstatComuni = "SELECT tc_istat_id FROM mmasgisDB.tc_istat JOIN mmasgisDB.comuni ON tc_istat.tc_comune_id = comuni.tc_comune_id WHERE comuni.codice = ";
    
	/**
	 * Query che trova i fatturati di un PV.
	 * <p>
	 * <code>
	 * SELECT tc_clfatt.testo as fatturato, rel_pv_fatt.importo, tc_fasc_fatt.testo as fascia <p>
	 * FROM rel_pv_fatt JOIN tc_clfatt JOIN tc_fasc_fatt <p>
	 * ON rel_pv_fatt.tc_fasc_fatt_id = tc_fasc_fatt.tc_fasc_fatt_id AND rel_pv_fatt.tc_clfatt_id = tc_clfatt.tc_clfatt_id <p>
	 * WHERE pv_id = %s <p>
	 * </code>
	 */
	public static String queryFatt = "SELECT tc_clfatt.testo as fatturato, tc_fasc_fatt.testo as fascia, rel_pv_fatt.importo as valore "
			+ "FROM rel_pv_fatt JOIN tc_clfatt JOIN tc_fasc_fatt "
			+ "ON rel_pv_fatt.tc_fasc_fatt_id = tc_fasc_fatt.tc_fasc_fatt_id AND rel_pv_fatt.tc_clfatt_id = tc_clfatt.tc_clfatt_id "
			+ "WHERE pv_id = %s";
	// QUERY PDF
	public static String queryAnagraficaPdf = "SELECT codice, IF(cliente=0, 'No', 'Si') AS cliente, cod_cliente, nome1 as ragione_sociale, nome2 as titolare, cf_pi, indirizzo, cap, comune, provincia, tel1, fax, email, sito "
			+ "FROM %s.pv " + "WHERE pv_id = %s";

	public static String queryNotePdf = "SELECT note " + "FROM %s.pv WHERE pv_id = %s";

	public static String queryNomiParPdf ="SELECT testo FROM %s.tc_clpar order by ordine";
	public static String queryParPdf = "SELECT tc_clpar.testo as nome, tc_par.testo as valore "
			+ "FROM %s.tc_clpar JOIN %s.rel_pv_par JOIN %s.tc_par "
			+ "ON %s.rel_pv_par.tc_clpar_id=%s.tc_clpar.tc_clpar_id AND %s.rel_pv_par.tc_par_id=%s.tc_par.tc_par_id "
			+ "WHERE pv_id = %s";
	public static String queryNomiMarPdf = "SELECT testo FROM %s.tc_clmar order by ordine";
	public static String queryMarPdf = "SELECT tc_clmar.testo as nome, tc_mar.testo as valore "
			+ "FROM %s.tc_clmar JOIN %s.rel_pv_mar JOIN %s.tc_mar "
			+ "ON %s.rel_pv_mar.tc_clmar_id=%s.tc_clmar.tc_clmar_id AND %s.rel_pv_mar.tc_mar_id=%s.tc_mar.tc_mar_id "
			+ "WHERE pv_id = %s";
	public static String queryNomiSerPdf = "SELECT testo FROM tc_clser order by ordine";
	public static String querySerPdf = "SELECT tc_clser.testo as nome, tc_ser.testo as valore "
			+ "FROM tc_clser JOIN rel_pv_ser JOIN tc_ser "
			+ "ON rel_pv_ser.tc_clser_id=tc_clser.tc_clser_id AND rel_pv_ser.tc_ser_id=tc_ser.tc_ser_id "
			+ "WHERE pv_id = %s";

	public static String queryPotPdf = "SELECT tccl.testo as potenziale, rpm.valore "
			+ "FROM %s.pv p, %s.tc_pot tcm, %s.rel_pv_pot rpm, %s.tc_clpot tccl "
			+ "WHERE rpm.tc_pot_id=tcm.tc_pot_id AND rpm.tc_clpot_id=tccl.tc_clpot_id AND p.pv_id=rpm.pv_id AND p.pv_id=%s and tccl.tc_stato_id=1 ";
	
	public static String queryPotAzPdf = "SELECT tccl.testo as potenziale, rpm.valore "
			+ "FROM %s.pv p, %s.tc_pot_az tcm, %s.rel_pv_pot_az rpm, %s.tc_clpot_az tccl "
			+ "WHERE rpm.tc_pot_az_id=tcm.tc_pot_az_id AND rpm.tc_clpot_az_id=tccl.tc_clpot_az_id AND p.pv_id=rpm.pv_id AND p.pv_id=%s and tccl.tc_stato_id=1 ";
	public static String queryNomiParAzPdf ="SELECT testo FROM %s.tc_clpar_az order by ordine";
	public static String queryParAzPdf = "SELECT tc_clpar_az.testo as nome, tc_par_az.testo as valore "
			+ "FROM %s.tc_clpar_az JOIN %s.rel_pv_par_az JOIN %s.tc_par_az "
			+ "ON %s.rel_pv_par_az.tc_clpar_az_id=%s.tc_clpar_az.tc_clpar_az_id AND %s.rel_pv_par_az.tc_par_az_id=%s.tc_par_az.tc_par_az_id "
			+ "WHERE pv_id = %s";
	public static String queryNomiMarAzPdf = "SELECT testo FROM %s.tc_clmar_az order by ordine";
	public static String queryMarAzPdf = "SELECT tc_clmar_az.testo as nome, tc_mar_az.testo as valore "
			+ "FROM %s.tc_clmar_az JOIN %s.rel_pv_mar_az JOIN %s.tc_mar_az "
			+ "ON %s.rel_pv_mar_az.tc_clmar_az_id=%s.tc_clmar_az.tc_clmar_az_id AND %s.rel_pv_mar_az.tc_mar_az_id=%s.tc_mar_az.tc_mar_az_id "
			+ "WHERE pv_id = %s";


	//QUERY UPDATE/SELECT CENSIMENTO
	public static String saveAnagrafica="UPDATE %s.pv SET "
			+ "nome1 = \"%s\","
			+ "nome2 = \"%s\","
			+ "cf_pi = \"%s\","
			+ "indirizzo = \"%s\","
			+ "provincia = \"%s\","
			+ "cap = \"%s\","
			+ "comune = \"%s\","
			+ "tel1 = \"%s\","
			+ "tel2 = \"%s\","
			+ "tel3 = \"%s\","
			+ "fax = \"%s\","
			+ "sito = \"%s\","
			+ "email = \"%s\","
			+ "data_aggiornamento = current_date "
			+ "WHERE pv_id = %s";
	public static String getIdValuePar="SELECT tc_par_id "
			+ "FROM %s.tc_par "
			+ "WHERE testo=\"%s\" AND tc_clpar_id=%s";
	public static String getIdValueParAz="SELECT tc_par_az_id "
			+ "FROM %s.tc_par_az "
			+ "WHERE testo=\"%s\" AND tc_clpar_az_id=%s";
	public static String getIdValueMar="SELECT tc_mar_id FROM %s.tc_mar WHERE testo=\"%s\"";
	
	public static String getIdValueMarAz="SELECT tc_mar_az_id FROM %s.tc_mar_az WHERE testo=\"%s\"";
	
	public static String maxOrdine="SELECT COUNT(ordine) AS maxOrdine "
			+ "FROM %s.rel_pv_%s "
			+ "WHERE tc_cl%s_id=%s AND pv_id=%s";
	public static String changeUsoMar="UPDATE %s.rel_pv_mar "
			+ "SET uso=(SELECT VALPERC FROM mmasgisDB.percMark WHERE NCIT=%s AND ordine=%s) %s "
			+ "WHERE pv_id=%s AND tc_clmar_id=%s AND tc_mar_id=%s";
	public static String changeUsoSer="UPDATE %s.rel_pv_ser "
			+ "SET uso=(SELECT VALPERC FROM mmasgisDB.percMark WHERE NCIT=%s AND ordine=%s) %s "
			+ "WHERE pv_id=%s AND tc_clser_id=%s AND tc_ser_id=%s";
	
	public static String changeUsoMarAz="UPDATE %s.rel_pv_mar_az "
			+ "SET uso=(SELECT VALPERC FROM mmasgisDB.percMark WHERE NCIT=%s AND ordine=%s) %s "
			+ "WHERE pv_id=%s AND tc_clmar_az_id=%s AND tc_mar_az_id=%s";
	
	public static String insertMarAnagrafica="INSERT INTO %s.rel_pv_mar (pv_id,tc_clmar_id,ordine,tc_mar_id,ins_data,ins_utente) "
			+ "VALUES(%s,%s,%s,%s,current_date,1)";
	
	public static String insertMarAzAnagrafica="INSERT INTO %s.rel_pv_mar_az (pv_id,tc_clmar_az_id,ordine,tc_mar_az_id,ins_data,ins_utente) "
			+ "VALUES(%s,%s,%s,%s,current_date,1)";
	
	public static String deleteMarAnagrafica="DELETE FROM %s.rel_pv_mar "
			+ "WHERE pv_id=%s AND tc_clmar_id=%s AND tc_mar_id=%s";
	
	public static String deleteMarAzAnagrafica="DELETE FROM %s.rel_pv_mar_az "
			+ "WHERE pv_id=%s AND tc_clmar_az_id=%s AND tc_mar_az_id=%s";
	public static String saveParAnagrafica="UPDATE %s.rel_pv_par "
			+ "SET tc_par_id=%s "
			+ "WHERE pv_id=%s AND tc_clpar_id=%s";
	
	public static String saveParAzAnagrafica="UPDATE %s.rel_pv_par_az "
			+ "SET tc_par_az_id=%s "
			+ "WHERE pv_id=%s AND tc_clpar_az_id=%s";
	
	public static String insertParAnagrafica="INSERT INTO %s.rel_pv_par (pv_id,tc_par_id,tc_clpar_id,ins_data) "
			+ "VALUES (%s,%s,%s,current_date)";
	
	public static String insertParAzAnagrafica="INSERT INTO %s.rel_pv_par_az (pv_id,tc_par_az_id,tc_clpar_az_id,ins_data) "
			+ "VALUES (%s,%s,%s,current_date)";
	
	public static String estrAnagrSave="SELECT codice AS cod_mmas, cliente, cod_cliente, nome1 as ragione_sociale, nome2 as titolare, cf_pi, indirizzo, cap, comune, provincia, tel1, tel2, tel3, fax, email, sito, data_aggiornamento "
			+ "FROM %s.pv "
			+ "WHERE pv_id = %s";
	
	public static String elencoParAnagrafica="SELECT DISTINCT t.testo AS valoriParametro,t.tc_par_id as id_valore "
			+"FROM tc_par t JOIN rel_pv_par rpp "
			+"ON t.tc_par_id = rpp.tc_par_id "
			+"where rpp.tc_clpar_id=\"%s\" "
			+"order by t.testo asc";
	public static String elencoParAzAnagrafica="SELECT DISTINCT t.testo AS valoriParametroAz,t.tc_par_az_id as id_valore "
			+"FROM tc_par_az t JOIN rel_pv_par_az rpp "
			+"ON t.tc_par_az_id = rpp.tc_par_az_id "
			+"where rpp.tc_clpar_az_id=\"%s\" "
			+"order by t.testo asc";
	public static String queryFindExistingParRecord="SELECT * FROM %s.rel_pv_par where pv_id=%s and tc_clpar_id=%s";
	public static String queryFindExistingParAzRecord="SELECT * FROM %s.rel_pv_par_az where pv_id=%s and tc_clpar_az_id=%s";

	public static String queryClassMar="SELECT tc_clmar_id AS classeId, testo "
			+ "FROM tc_clmar "
			+ "ORDER BY tc_clmar_id";
	
	public static String queryAllBrandsPerClass="SELECT DISTINCT  tcm.testo AS valore "
			+ "FROM rel_pv_mar rpm INNER JOIN tc_mar tcm on rpm.tc_mar_id=tcm.tc_mar_id "
			+ "INNER JOIN tc_clmar tccl on rpm.tc_clmar_id=tccl.tc_clmar_id "
			+ "INNER JOIN pv p on p.pv_id=rpm.pv_id "
			+ "WHERE tccl.tc_stato_id=%s AND rpm.tc_clmar_id=%s "
			+ "ORDER BY tcm.testo";
	
	public static String queryAllServicesPerClass="SELECT DISTINCT tcm.testo AS valore "
			+ "FROM rel_pv_ser rpm INNER JOIN tc_ser tcm on rpm.tc_ser_id=tcm.tc_ser_id "
			+ "INNER JOIN tc_clser tccl on rpm.tc_clser_id=tccl.tc_clser_id "
			+ "INNER JOIN pv p on p.pv_id=rpm.pv_id "
			+ "WHERE tccl.tc_stato_id=%s AND rpm.tc_clser_id=%s "
			+ "ORDER BY tccl.ordine;";
	
	public static String getIdValueServ="SELECT tc_ser_id FROM %s.tc_ser WHERE testo=\"%s\"";
	
	public static String insertSerAnagrafica="INSERT INTO %s.rel_pv_ser (pv_id,tc_clser_id,ordine,tc_ser_id,ins_data,ins_utente) "
			+ "VALUES(%s,%s,%s,%s,current_date,1)";
	public static String deleteSerAnagrafica="DELETE FROM %s.rel_pv_ser "
			+ "WHERE pv_id=%s AND tc_clser_id=%s AND tc_ser_id=%s";
	
	public static String saveNoteAnagrafica="UPDATE %s.pv SET note= \"%s\" WHERE pv_id=%s";
	
	public static String queryAllBrandsAzPerClass="SELECT DISTINCT  tcm.testo AS valore "
			+ "FROM rel_pv_mar_az rpm INNER JOIN tc_mar_az tcm on rpm.tc_mar_az_id=tcm.tc_mar_az_id "
			+ "INNER JOIN tc_clmar_az tccl on rpm.tc_clmar_az_id=tccl.tc_clmar_az_id "
			+ "INNER JOIN pv p on p.pv_id=rpm.pv_id "
			+ "WHERE tccl.tc_stato_id=%s AND rpm.tc_clmar_az_id=%s "
			+ "ORDER BY tcm.testo";

}
