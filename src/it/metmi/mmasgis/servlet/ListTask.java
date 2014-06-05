package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;


/**
 * Classe che si occupa di estrarre dal database l'elenco dei punti vendita
 * presenti nella selezione geografica selezionata (ed inviata nella richiesta http).
 * <p>
 * 
 * Tiene conto di eventuali filtri o ricerche applicati.
 *
 */
public class ListTask extends Task {
	
	
	/**
	 * Ottiene l'elenco dei punti vendita presenti nei territori selezionati(ricevuti nella richiesta HTTP)
	 * e le rispettive informazioni anagrafiche 
	 * (ragione sociale, telefono, indirizzo , eccetera..)
	 * 
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		
		String censimento = request.getParameter("censimento");
		
		DBManager db = new DBManager(censimento, Const.username, Const.password);
		
		String querySearch="";
		
		if(request.getParameterMap().containsKey("search")) {
			querySearch= getQuerySearch(request.getParameter("search"));
		}
		
		//informazioni per paging dei risultati
		String customer=request.getParameter("customer");
		//System.out.println(customer);
		String start = request.getParameter("start");
		String limit = request.getParameter("limit");
		String sortName = "potenziale";
		String order = "DESC";
		
		String clienteSiNo;
		if(customer.equals("clienti")){
			clienteSiNo=" AND cliente=1";
		}
		else{
			if(customer.equals("no_clienti")){
				clienteSiNo=" and cliente=0";
			}
			else{
				clienteSiNo="";
			}
			
		}
		
		if(request.getParameterMap().containsKey("sort")) {
			
			String sort = request.getParameter("sort");
			
			Type collectionType = new TypeToken<ArrayList<HashMap<String,String>>>(){}.getType();
			ArrayList<HashMap<String,String>> tmp = new Gson().fromJson(sort, collectionType);
			sortName = tmp.get(0).get("property");
			order = tmp.get(0).get("direction");
			
		}
		//ORDINAMENTO 
		//System.out.println(sortName);
		//System.out.println(order);
		
		//query completa con filtri e selezione geografica
		String query = String.format(Const.queryBase, getJoinFiltri(request)) + " WHERE ( " + selezioneGeografica(request) + " ) " + getValoriFiltri(request) + querySearch +"AND p.tc_stato_id=1"+clienteSiNo +" GROUP BY p.pv_id ORDER BY "+ sortName + " " + order +" LIMIT "+ start + "," + limit;
		
		
		//eseguo la query
		if (db.connetti()) {
			ArrayList<HashMap<String,String>> pvList = db.eseguiQuery(query, true);
			Vector<String[]> rs = db.eseguiQuery("SELECT  FOUND_ROWS()");
			String total = rs.get(0)[0];
			PrintWriter out = null;
			try {
				out = response.getWriter();
				jsonEncode(pvList, total, out);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			db.disconnetti();
		}
	}
	
	/**
	 * Dati i parametri di ricerca, questo metodo compone la parte di query da concatenare alla query principale
	 * @param search Json inviato dal client contenente i parametri di ricerca
	 * @return blocco di query per la ricerca.
	 */
	public static String getQuerySearch(String search) {
		StringBuilder query = new StringBuilder();
		StringBuilder tmp = new StringBuilder("");
		if (!search.equals("")) {
			Gson gson = new GsonBuilder().create();
			Type type = new TypeToken<ArrayList<HashMap<String, Object>>>() {}.getType();
			ArrayList<HashMap<String, Object>> searchAttr = gson.fromJson(search, type);

			for (HashMap<String, Object> s : searchAttr) {
				tmp.append(" AND ");
				tmp.append(s.get("field").toString());
				if ((Boolean) s.get("option")) {
					tmp.append(" like '%"+((String)s.get("value")).toString().toUpperCase()+"%\'");
				} else {
					tmp.append(" = '"+((String)s.get("value")).toString().toUpperCase()+"\'");
				}
			}
			
			query.append(tmp);
		}
		return query.toString();
	}


	/**
	 * Data la richiesta HTTP, questo metodo compone la parte di query da concatenare alla query principale, includendo
	 * le clausole SELECT che selezionano i territori
	 * 
	 * @param request	richiesta HTTP
	 * @return blocco di query per la selezione geografica, seleziona i codici istat dei territori selezionati.
	 */
	public static String selezioneGeografica(HttpServletRequest request) {
		
		boolean capSet = false;
		boolean altroSet = false;
		
		String q = "";
		String q2 = "";
		String queryGeo = "";
		
		if(!request.getParameter("reg").equals("")) {
			String[] reg = request.getParameter("reg").split(",");
			for(String a:reg) {
				q = q + String.format("SELECT tcist.tc_istat_id FROM mmasgisDB.tc_istat tcist JOIN mmasgisDB.regioni ON tcist.tc_regione_id = regioni.tc_regione_id WHERE regioni.codice = %s %s ", a, "UNION");
				altroSet = true;
			}
		}	
		if(!request.getParameter("pro").equals("")) {
			String[] pro = request.getParameter("pro").split(",");
			for(String b:pro) {
				q = q + String.format("SELECT tcist.tc_istat_id FROM mmasgisDB.tc_istat tcist JOIN mmasgisDB.province ON tcist.tc_provincia_id = province.tc_provincia_id WHERE province.codice = %s %s ", b, "UNION");
				altroSet = true;
			}
		}	
		if(!request.getParameter("com").equals("")) {
			String[] com = request.getParameter("com").split(",");
			for(String c:com) {
				q = q + String.format("SELECT tcist.tc_istat_id FROM mmasgisDB.tc_istat tcist JOIN mmasgisDB.comuni ON tcist.tc_comune_id = comuni.tc_comune_id WHERE comuni.codice = %s %s ", c, "UNION");
				altroSet = true;
			}
		}
		if(!request.getParameter("cap").equals("")) {
			String[] cap = request.getParameter("cap").split(",");
			for(String d:cap) {
				q2 = q2 + String.format("cap = %s %s ", d, "OR");
				capSet = true;
			}
		}
		
		
		if (altroSet) {
			q = q.substring(0, q.length()-6);
			q = String.format("p.tc_istat_id IN ( %s )", q);
		}

		if (capSet) {
			q2 =q2.substring(0, q2.length()-3);
			q2 = "(" + q2 + ")";
		}
		
		if(altroSet && capSet) {
			queryGeo = q + " OR " + q2;
		}
		else {
			if(altroSet)  {
				queryGeo = q;
			}
			else {
				queryGeo = q2;
			}
		}

		return queryGeo;
	}
	
	
	/**
	 * Data la richiesta http inviata dal client, se sono presenti dei filtri, questo metodo compone il blocco di query, da concatenare alla query principale,
	 * contenente i JOIN con le tabelle dei filtri
	 * 
	 * @param request	richiesta HTTP
	 * @return blocco di query contenente i JOIN con le tabelle dei filtri.
	 */
	public static String getJoinFiltri(HttpServletRequest request) {
		
		String joins = "";
		
		if(request.getParameterMap().containsKey("parametri") && !request.getParameter("parametri").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_par ON p.pv_id = rel_pv_par.pv_id ";
		}
		
		if(request.getParameterMap().containsKey("parametriAz") && !request.getParameter("parametriAz").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_par_az ON p.pv_id = rel_pv_par_az.pv_id ";
		}
		
		if(request.getParameterMap().containsKey("marche") && !request.getParameter("marche").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_mar ON p.pv_id = rel_pv_mar.pv_id ";
			
		}
		
		if(request.getParameterMap().containsKey("marcheAz") && !request.getParameter("marcheAz").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_mar_az ON p.pv_id = rel_pv_mar_az.pv_id ";
		}
		/*
		if(request.getParameterMap().containsKey("potenziali") && !request.getParameter("potenziali").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_pot ON p.pv_id = rel_pv_pot.pv_id ";
		}
		*/
		if(request.getParameterMap().containsKey("potenzialiAz") && !request.getParameter("potenzialiAz").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_pot_az ON p.pv_id = rel_pv_pot_az.pv_id ";
		}
		if(request.getParameterMap().containsKey("servizi") && !request.getParameter("servizi").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_ser ON p.pv_id = rel_pv_ser.pv_id ";
		}
		if(request.getParameterMap().containsKey("fatturati") && !request.getParameter("fatturati").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_fatt ON p.pv_id = rel_pv_fatt.pv_id ";
		}
		
		
		return joins;
	}
	
	/**
	 * Data la richiesta http inviata dal client, se sono presenti dei filtri, 
	 * questo metodo compone il blocco di query contenente
	 * le classi e i valori di filtri applicati. 
	 * Tale blocco di query viene concatenato nella clausola WHERE della query principale
	 * 
	 * @param request	richiesta HTTP
	 * @return blocco di query contenente le classi e i valori di filtri applicati.
	 */
	public static String getValoriFiltri(HttpServletRequest request) {
		
		// TODO
		// modificare implementazione filtri: valori della stessa categoria e classe vanno in OR
		// ma stessa categoria e classe diversa vanno in AND
		
		String filters = "";
		
		if(request.getParameterMap().containsKey("parametri") && !request.getParameter("parametri").equals("")) {
			String[] par = request.getParameter("parametri").split("\\|");
			Arrays.sort(par);
			filters = filters + " AND (";
			String [] ps = null;
			int countO = 0;
			int countA = 0;
			//for(String s:par) {
			for(int i = 0; i<par.length; i++){
				String[] p = par[i].split(",");
				if(!p[0].equals("undefined")){
					if(par.length==1){
						filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_par WHERE tc_clpar_id="+p[0]+" AND tc_par_id="+p[1]+")) AND ";
						countA++;
					}else{
						if(i!=par.length-1){
							ps = par[i+1].split(",");
						}
						if(p[0].equals(ps[0])){
							if(countO == 0){
								filters = filters +"((p.pv_id IN(SELECT pv_id FROM rel_pv_par WHERE tc_clpar_id="+p[0]+" AND tc_par_id="+p[1]+")) OR ";
								countO++;
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_par WHERE tc_clpar_id="+p[0]+" AND tc_par_id="+p[1]+")) OR ";
							}
						}else{
							if(countA==0){
								//filters = filters +"( tc_clpar_id=" + p[0] + " AND tc_par_id=" + p[1] + ") OR ";
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_par WHERE tc_clpar_id="+p[0]+" AND tc_par_id="+p[1]+"))) AND ";
								countA++;
								//p.pv_id IN (SELECT pv_id FROM k1_farmacie.rel_pv_par WHERE tc_clpar_id=35 AND tc_par_id=505)
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_par WHERE tc_clpar_id="+p[0]+" AND tc_par_id="+p[1]+")) AND ";
							}
						}
					}
				}else{
					if(countA != 0 && countO == 0){
						filters = filters.substring(0, filters.length()-4) + " )";
					}else{
						filters = filters.substring(0, filters.length()-4) + " ))";
					}
				}
			}
			if(countA != 0){
				filters = filters.substring(0, filters.length()-4) + " )";
			}else{
				filters = filters.substring(0, filters.length()-4) + " ))";
			}
		}
		
		if(request.getParameterMap().containsKey("parametriAz") && !request.getParameter("parametriAz").equals("")) {
			String[] par = request.getParameter("parametriAz").split("\\|");
			Arrays.sort(par);
			filters = filters + " AND (";
			String [] ps = null;
			int countO = 0;
			int countA = 0;
			//for(String s:par) {
			for(int i = 0; i<par.length; i++){
				String[] p = par[i].split(",");
				//filters = filters +"( tc_clpar_az_id=" + p[0] + " AND tc_par_az_id=" + p[1] + ") OR ";
				//filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_par_az WHERE tc_clpar_az_id="+p[0]+" AND tc_par_az_id="+p[1]+")) AND ";
				if(!p[0].equals("undefined")){
					if(par.length==1){
						filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_par_az WHERE tc_clpar_az_id="+p[0]+" AND tc_par_az_id="+p[1]+")) AND ";
						countA++;
					}else{
						if(i!=par.length-1){
							ps = par[i+1].split(",");
						}
						if(p[0].equals(ps[0])){
							if(countO == 0){
								filters = filters +"((p.pv_id IN(SELECT pv_id FROM rel_pv_par_az WHERE tc_clpar_az_id="+p[0]+" AND tc_par_az_id="+p[1]+")) OR ";
								countO++;
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_par_az WHERE tc_clpar_az_id="+p[0]+" AND tc_par_az_id="+p[1]+")) OR ";
							}
						}else{
							if(countA==0){
								//filters = filters +"( tc_clpar_id=" + p[0] + " AND tc_par_id=" + p[1] + ") OR ";
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_par_az WHERE tc_clpar_az_id="+p[0]+" AND tc_par_az_id="+p[1]+"))) AND ";
								countA++;
								//p.pv_id IN (SELECT pv_id FROM k1_farmacie.rel_pv_par WHERE tc_clpar_id=35 AND tc_par_id=505)
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_par_az WHERE tc_clpar_az_id="+p[0]+" AND tc_par_az_id="+p[1]+")) AND ";
							}
						}
					}
				}else{
					if(countA != 0 && countO==0){
						filters = filters.substring(0, filters.length()-4) + " )";
					}else{
						filters = filters.substring(0, filters.length()-4) + " ))";
					}
				}
			}
			if(countA != 0){
				filters = filters.substring(0, filters.length()-4) + " )";
			}else{
				filters = filters.substring(0, filters.length()-4) + " ))";
			}
		}
		
		if(request.getParameterMap().containsKey("potenziali") && !request.getParameter("potenziali").equals("")) {
			String[] pot = request.getParameter("potenziali").split("\\|");
			Arrays.sort(pot);
			filters = filters + " AND (";
			String [] ps = null;
			int countO = 0;
			int countA = 0;
			//for(String s:par) {
			for(int i = 0; i<pot.length; i++){
				String[] p = pot[i].split(",");
				if(!p[0].equals("undefined")){
					if(pot.length==1){
						filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_pot WHERE tc_clpot_id="+p[0]+" AND tc_pot_id="+p[1]+")) AND ";
						countA++;
					}else{
						if(i!=pot.length-1){
							ps = pot[i+1].split(",");
						}
						if(p[0].equals(ps[0])){
							if(countO == 0){
								filters = filters +"((p.pv_id IN(SELECT pv_id FROM rel_pv_pot WHERE tc_clpot_id="+p[0]+" AND tc_pot_id="+p[1]+")) OR ";
								countO++;
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_pot WHERE tc_clpot_id="+p[0]+" AND tc_pot_id="+p[1]+")) OR ";
							}
						}else{
							if(countA==0){
								//filters = filters +"( tc_clpar_id=" + p[0] + " AND tc_par_id=" + p[1] + ") OR ";
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_pot WHERE tc_clpot_id="+p[0]+" AND tc_pot_id="+p[1]+"))) AND ";
								countA++;
								//p.pv_id IN (SELECT pv_id FROM k1_farmacie.rel_pv_par WHERE tc_clpar_id=35 AND tc_par_id=505)
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_pot WHERE tc_clpot_id="+p[0]+" AND tc_pot_id="+p[1]+")) AND ";
							}
						}
					}
				}else{
					if(countA != 0 && countO==0){
						filters = filters.substring(0, filters.length()-4) + " )";
					}else{
						filters = filters.substring(0, filters.length()-4) + " ))";
					}
				}
			}
			if(countA != 0){
				filters = filters.substring(0, filters.length()-4) + " )";
			}else{
				filters = filters.substring(0, filters.length()-4) + " ))";
			}
		}
		
		if(request.getParameterMap().containsKey("potenzialiAz") && !request.getParameter("potenzialiAz").equals("")) {
			String[] pot = request.getParameter("potenzialiAz").split("\\|");
			Arrays.sort(pot);
			filters = filters + " AND (";
			String [] ps = null;
			int countO = 0;
			int countA = 0;
			//for(String s:par) {
			for(int i = 0; i<pot.length; i++){
				String[] p = pot[i].split(",");
				if(!p[0].equals("undefined")){
					if(pot.length==1){
						filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_pot_az WHERE tc_clpot_az_id="+p[0]+" AND tc_pot_az_id="+p[1]+")) AND ";
						countA++;
					}else{
						if(i!=pot.length-1){
							ps = pot[i+1].split(",");
						}
						if(p[0].equals(ps[0])){
							if(countO == 0){
								filters = filters +"((p.pv_id IN(SELECT pv_id FROM rel_pv_pot_az WHERE tc_clpot_az_id="+p[0]+" AND tc_pot_az_id="+p[1]+")) OR ";
								countO++;
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_pot_az WHERE tc_clpot_az_id="+p[0]+" AND tc_pot_az_id="+p[1]+")) OR ";
							}
						}else{
							if(countA==0){
								//filters = filters +"( tc_clpar_id=" + p[0] + " AND tc_par_id=" + p[1] + ") OR ";
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_pot_az WHERE tc_clpot_az_id="+p[0]+" AND tc_pot_az_id="+p[1]+"))) AND ";
								countA++;
								//p.pv_id IN (SELECT pv_id FROM k1_farmacie.rel_pv_par WHERE tc_clpar_id=35 AND tc_par_id=505)
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_pot_az WHERE tc_clpot_az_id="+p[0]+" AND tc_pot_az_id="+p[1]+")) AND ";
							}
						}
					}
				}else{
					if(countA != 0 && countO==0){
						filters = filters.substring(0, filters.length()-4) + " )";
					}else{
						filters = filters.substring(0, filters.length()-4) + " ))";
					}				
				}
			}
			if(countA != 0){
				filters = filters.substring(0, filters.length()-4) + " )";
			}else{
				filters = filters.substring(0, filters.length()-4) + " ))";
			}
		}
		
		if(request.getParameterMap().containsKey("marche") && !request.getParameter("marche").equals("")) {
			String[] mar = request.getParameter("marche").split("\\|");
			filters = filters + " AND (";
			for(String s:mar) {
				String[] p = s.split(",");
				if(!p[0].equals("undefined")){
					//filters = filters +"( tc_clmar_id=" + p[0] + " AND tc_mar_id=" + p[1] + ") OR ";
					filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_mar WHERE tc_clmar_id="+p[0]+" AND tc_mar_id="+p[1]+")) OR ";
				}
			}
			filters = filters.substring(0, filters.length()-4) + " )";
		}
		
		if(request.getParameterMap().containsKey("marcheAz") && !request.getParameter("marcheAz").equals("")) {
			String[] mar = request.getParameter("marcheAz").split("\\|");
			filters = filters + " AND (";
			for(String s:mar) {
				String[] p = s.split(",");
				if(!p[0].equals("undefined")){
					//filters = filters +"( tc_clmar_az_id=" + p[0] + " AND tc_mar_az_id=" + p[1] + ") OR ";
					filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_mar_az WHERE tc_clmar_az_id="+p[0]+" AND tc_mar_az_id="+p[1]+")) OR ";
				}
			}
			filters = filters.substring(0, filters.length()-4) + " )";
		}
		
		if(request.getParameterMap().containsKey("servizi") && !request.getParameter("servizi").equals("")) {
			String[] ser = request.getParameter("servizi").split("\\|");
			filters = filters + " AND (";
			for(String s:ser) {
				String[] p = s.split(",");
				if(!p[0].equals("undefined")){
					//filters = filters +"( tc_clser_id=" + p[0] + " AND tc_ser_id=" + p[1] + ") OR ";
					filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_ser WHERE tc_clser_id="+p[0]+" AND tc_ser_id="+p[1]+")) OR ";
				}
			}
			filters = filters.substring(0, filters.length()-4) + " )";
		}
		if(request.getParameterMap().containsKey("fatturati") && !request.getParameter("fatturati").equals("")) {
			String[] fat = request.getParameter("fatturati").split("\\|");
			Arrays.sort(fat);
			filters = filters + " AND (";
			String [] ps = null;
			int countO = 0;
			int countA = 0;
			//for(String s:par) {
			for(int i = 0; i<fat.length; i++){
				String[] p = fat[i].split(",");
				if(!p[0].equals("undefined")){
					if(fat.length==1){
						filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_fatt WHERE tc_clfatt_id="+p[0]+" AND tc_fasc_fatt_id="+p[1]+")) AND ";
						countA++;
					}else{
						if(i!=fat.length-1){
							ps = fat[i+1].split(",");
						}
						if(p[0].equals(ps[0])){
							if(countO == 0){
								filters = filters +"((p.pv_id IN(SELECT pv_id FROM rel_pv_fatt WHERE tc_clfatt_id="+p[0]+" AND tc_fatt_id="+p[1]+")) OR ";
								countO++;
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_fatt WHERE tc_clfatt_id="+p[0]+" AND tc_fatt_id="+p[1]+")) OR ";
							}
						}else{
							if(countA==0){
								//filters = filters +"( tc_clpar_id=" + p[0] + " AND tc_par_id=" + p[1] + ") OR ";
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_fatt WHERE tc_clfatt_id="+p[0]+" AND tc_fatt_id="+p[1]+"))) AND ";
								countA++;
								//p.pv_id IN (SELECT pv_id FROM k1_farmacie.rel_pv_par WHERE tc_clpar_id=35 AND tc_par_id=505)
							}else{
								filters = filters +"(p.pv_id IN(SELECT pv_id FROM rel_pv_fatt WHERE tc_clfatt_id="+p[0]+" AND tc_fatt_id="+p[1]+")) AND ";
							}
						}
					}
				}else{
					if(countA != 0 && countO==0){
						filters = filters.substring(0, filters.length()-4) + " )";
					}else{
						filters = filters.substring(0, filters.length()-4) + " ))";
					}
				}
			}
			if(countA != 0){
				filters = filters.substring(0, filters.length()-4) + " )";
			}else{
				filters = filters.substring(0, filters.length()-4) + " ))";
			}
		}
		
		return filters;
	}
	

	/**
	 * Data la richiesta http inviata dal client, se sono presenti dei filtri, questo metodo compone il blocco di query, da concatenare alla query principale,
	 * contenente i JOIN con le tabelle dei filtri
	 * 
	 * @param request	richiesta HTTP
	 * @return blocco di query contenente i JOIN con le tabelle dei filtri.
	 */
	public static String getJoinExcel(HttpServletRequest request) {
		
		String joins = "";
		
		if(request.getParameterMap().containsKey("potenziali") && !request.getParameter("potenziali").equals("")) {
			joins = joins + "LEFT JOIN rel_pv_pot Relpot ON p.pv_id = Relpot.pv_id "+
		"LEFT JOIN tc_pot pot 		ON Relpot.tc_pot_id = pot.tc_pot_id ";
		}
		if(request.getParameterMap().containsKey("potenzialiAz") && !request.getParameter("potenzialiAz").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_pot_az RelpotAz ON p.pv_id = RelpotAz.pv_id " +
					"LEFT JOIN tc_pot pot 		ON RelpotAz.tc_pot_id = pot.tc_pot_id";
		}
		if(request.getParameterMap().containsKey("parametri") && !request.getParameter("parametri").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_par Relpar ON p.pv_id = Relpar.pv_id " +
					"LEFT JOIN tc_par par 		ON Relpar.tc_par_id = par.tc_par_id";
		}
		
		if(request.getParameterMap().containsKey("parametriAz") && !request.getParameter("parametriAz").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_par_az RelparAz ON p.pv_id = RelparAz.pv_id " +
					"LEFT JOIN tc_par_az par_az 		ON RelparAz.tc_par_id = par_az.tc_par_id";
		}
		
		if(request.getParameterMap().containsKey("marche") && !request.getParameter("marche").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_mar Relmar ON p.pv_id = Relmar.pv_id " +
					"LEFT JOIN tc_mar mar 		ON Relmar.tc_mar_id = mar.tc_mar_id";
			
		}
		
		if(request.getParameterMap().containsKey("marcheAz") && !request.getParameter("marcheAz").equals("")) {
			joins = joins + " LEFT JOIN rel_pv_mar_az RelmarAz ON p.pv_id = RelmarAz.pv_id " +
					"LEFT JOIN tc_mar_az mar_az 		ON RelmarAz.tc_mar_id = mar_az.tc_mar_id";
		}
		
		
		return joins;
	}	
public static String getSelectExcelElement(HttpServletRequest request) {
		
		String select = "";
		
		if(request.getParameterMap().containsKey("parametri") && !request.getParameter("parametri").equals("")) {
			
			select = select + "par.testo AS parametri , Relpar.tc_clpar_id clpar_id,";
			
		}
		
		if(request.getParameterMap().containsKey("parametriAz") && !request.getParameter("parametriAz").equals("")) {
			select = select + "par_az.testo AS parametriAz, RelparAz.tc_clpar_id clparAz_id,";
			
		}
		
		if(request.getParameterMap().containsKey("potenziali") && !request.getParameter("potenziali").equals("")) {
			select = select + "pot.testo AS potenziali, Relpot.tc_clpot_id clpot_id,";
			
		}
		
		if(request.getParameterMap().containsKey("potenzialiAz") && !request.getParameter("potenzialiAz").equals("")) {
			select = select + "pot_az.testo AS potenzialiAz, RelpotAz.tc_clpot_id clpotAz_id,";
		}
		
		if(request.getParameterMap().containsKey("marche") && !request.getParameter("marche").equals("")) {
			select = select + "mar.testo AS marche, Relmar.tc_clmar_id clmar_id,";
		}
		
		if(request.getParameterMap().containsKey("marcheAz") && !request.getParameter("marcheAz").equals("")) {
			select = select + "mar_az.testo AS marcheAz, RelmarAz.tc_clmar_id clmarAz_id,";
		}
		
		return select;
	}

	public static String getValoriExcel(HttpServletRequest request) {
		
		String filters = "";
		
		if(request.getParameterMap().containsKey("parametri") && !request.getParameter("parametri").equals("")) {
			String[] par = request.getParameter("parametri").split("\\|");
			filters = filters + " AND (";
			for(String s:par) {
				String[] p = s.split(",");
				filters = filters +"( Relpar.tc_clpar_id=" + p[1] +  ") OR ";
						
			}
			filters = filters.substring(0, filters.length()-3) + " )";
		}
		
		if(request.getParameterMap().containsKey("parametriAz") && !request.getParameter("parametriAz").equals("")) {
			String[] par = request.getParameter("parametriAz").split("\\|");
			filters = filters + " AND (";
			for(String s:par) {
				String[] p = s.split(",");
				filters = filters +"( RelparAz.tc_clpar_az_id=" + p[1] +") OR ";
			}
			filters = filters.substring(0, filters.length()-3) + " )";
		}
		
		if(request.getParameterMap().containsKey("potenziali") && !request.getParameter("potenziali").equals("")) {
			String[] pot = request.getParameter("potenziali").split("\\|");
			filters = filters + " AND (";
			for(String s:pot) {
				String[] p = s.split(",");
				filters = filters +"( Relpot.tc_clpot_id=" + p[1] + ") OR ";
			}
			filters = filters.substring(0, filters.length()-3) + " )";
		}
		
		if(request.getParameterMap().containsKey("potenzialiAz") && !request.getParameter("potenzialiAz").equals("")) {
			String[] pot = request.getParameter("potenzialiAz").split("\\|");
			filters = filters + " AND (";
			for(String s:pot) {
				String[] p = s.split(",");
				filters = filters +"( RelpotAz.tc_clpot_az_id=" + p[1] + ") OR ";
			}
			filters = filters.substring(0, filters.length()-3) + " )";
		}
		
		if(request.getParameterMap().containsKey("marche") && !request.getParameter("marche").equals("")) {
			String[] mar = request.getParameter("marche").split("\\|");
			filters = filters + " AND (";
			for(String s:mar) {
				String[] p = s.split(",");
				filters = filters +"( Relmar.tc_clmar_id=" + p[1] + ") OR ";
			}
			filters = filters.substring(0, filters.length()-3) + " )";
		}
		
		if(request.getParameterMap().containsKey("marcheAz") && !request.getParameter("marcheAz").equals("")) {
			String[] mar = request.getParameter("marcheAz").split("\\|");
			filters = filters + " AND (";
			for(String s:mar) {
				String[] p = s.split(",");
				filters = filters +"( RelmarAz.tc_clmar_az_id=" + p[1] + ") OR ";
			}
			filters = filters.substring(0, filters.length()-3) + " )";
		}
		
		return filters;
	}
	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param size Numero di punti vendita estratti
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	private static void jsonEncode(ArrayList<HashMap<String,String>> data, String size, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result=new HashMap<String, Object>();
		result.put("results", data);
		result.put("total", size);
		result.put("success", true);
		gson.toJson(result, out);	
	}
	
}
