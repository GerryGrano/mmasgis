package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.mysql.jdbc.exceptions.MySQLIntegrityConstraintViolationException;


public class PromoKV extends Task {

	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(true);

		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		String result = "";
		System.out.println("accesso promo k");
		//String k1_offerta = request.getParameter("offerta");
		//String k1_settore = request.getParameter("settore");
		String k1_settore = request.getParameter("censimento");
		//String k1_settore = (String) session.getAttribute("settore");
		String k1_vetrina = request.getParameter("vetrina");

		String k1gis_vetrinaK1 = "'"+k1_vetrina+"'";
		//String k1gis_Cens = "k1_saloni";
		String insert ="";
		int pv_id = 0;
		String updateRiservata = "";
		//String censimento = request.getParameter("censimento");

		String querySearch = "";
		if (request.getParameterMap().containsKey("search")) {
			querySearch = ListTask.getQuerySearch(request
					.getParameter("search"));
		}
		//conteggio punti vendita
		//ArrayList<HashMap<String, String>> pvK2 = null;

		DBManager db = new DBManager(k1_settore, Const.username, Const.password);

		
		//Fase inserimento promo
		ArrayList<HashMap<String, String>> pvK1 = null;
		
		try {
			String query = String.format(Const.queryMmasK1,
					ListTask.getJoinFiltri(request))
					+ " WHERE ( "
					+ ListTask.selezioneGeografica(request)
					+ " ) "
					+ ListTask.getValoriFiltri(request)
					+ querySearch;
					//+ " GROUP BY p.pv_id ORDER BY ragione_sociale ASC";
			
			
			
			if (db.connetti()) {
			
				pvK1 = db.eseguiQuery(query, true);
		
			for (int i=0; i < pvK1.size(); i++) {
				
				pv_id =Integer.parseInt( pvK1.get(i).get("pv") );
				//HashMap<String, String> rowDataK1 = new HashMap<>();
				//rowDataK1.put(cod_mmas, k1_gis);
			
				 insert = String.format(Const.queryK1V,k1_settore,pv_id,k1gis_vetrinaK1);
				
				
				 result = db.eseguiQueryK1(insert, true);
			
			}
				
			 updateRiservata = db.eseguiQueryK1(String.format(Const.updateK1riservataV,k1gis_vetrinaK1),true);
				
			 	db.disconnetti();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			
		}
		
	
		
		jsonEncode(result, out);
		session.removeAttribute("user");
		session.removeAttribute("vetrina");
		session.removeAttribute("settore");

	}

	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param base_num Base Numerica dell'aggregazione territoriale
	 * @param base_cl Base Clienti dell'aggregazione territoriale
	 * @param base_pot Base Potenziale dell'aggregazione territoriale
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	public void jsonEncode(String data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result = new HashMap<String, Object>();
		
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}
}
