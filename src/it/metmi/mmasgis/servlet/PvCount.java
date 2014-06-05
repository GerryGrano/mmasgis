package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Vector;

import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;


public class PvCount extends Task {

	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(true);

		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		String result = "", nomeOfferta = "";
		int pv_id = 0;
		String k1_settore = request.getParameter("censimento");
		//String k1_offerta = request.getParameter("offerta");
		//String k1_settore = (String) session.getAttribute("censimento");
		String k1_offerta = (String) session.getAttribute("offerta");
		
		System.out.println(k1_settore);

		//String k1gis_Cens = "k1_saloni";
		String querySearch = "";
		if (request.getParameterMap().containsKey("search")) {
			querySearch = ListTask.getQuerySearch(request
					.getParameter("search"));
		}
		//conteggio punti vendita
		ArrayList<HashMap<String, String>> pvK1 = null;

		ArrayList<HashMap<String, String>> pvK2 = null;

		DBManager db = new DBManager(k1_settore, Const.username, Const.password);
		String total = "";
		try {
		/*
			String query1 = String.format(Const.queryK1offer,k1_settore,k1_offerta,
					ListTask.getJoinFiltri(request))
					+ " WHERE ( "
					+ ListTask.selezioneGeografica(request)
					+ " ) "
					+ ListTask.getValoriFiltri(request)
					+ querySearch;
					//+ " GROUP BY p.pv_id ORDER BY ragione_sociale ASC";
			*/
			String query2 = String.format(Const.queryCountMmasK1,
					ListTask.getJoinFiltri(request))
					+ " WHERE ( "
					+ ListTask.selezioneGeografica(request)
					+ " ) "
					+ ListTask.getValoriFiltri(request)
					+ querySearch;
					//+ " GROUP BY p.pv_id ORDER BY ragione_sociale ASC";

			if (db.connetti()) {
				
			//	pvK1 = db.eseguiQuery(query1, true);
				
			//	nomeOfferta = pvK1.get(0).get("titolo");
				pvK2 = db.eseguiQuery(query2, true);
				//result = pvK2.get(0).get("pvCount");
				Vector<String[]> rs = db.eseguiQuery("SELECT  FOUND_ROWS()");
				total = rs.get(0)[0];
				db.disconnetti();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}	
		
		jsonEncode(total, out);

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
		
	
		//result.put("nomeOfferta", nomeOfferta);
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}
}
