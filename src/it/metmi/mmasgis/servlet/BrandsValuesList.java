package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Classe che si occupa dell'estrazione dei valori corrispondenti
 * alla classe di marche ottenuta come parametro
 *
 */
public class BrandsValuesList extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db;
	
	/**
	 * Dati il censimento, l'ID del punto vendita e l'ID della classe marca,
	 * estrae dal censimento i valori delle marche del punto vendita specificato.
	 * <p>
	 * Per esempio dati:
	 * <p>
	 * <code>
	 * pv_id = 672
	 * <p>
	 * classe_id = 1
	 * <p>
	 * censimento: farmacierp1101ciccarelli
	 * </code>
	 * <p>
	 * Viene estratto:
	 * <p>
	 * <code>
	 * COSMETICA : VICHY (L'OREAL)
	 * <p>
	 * COSMETICA : ABOCA
	 * </code>
	 * 
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		
		ArrayList<HashMap<String, String>> result = new ArrayList<HashMap<String, String>>();
		String censimento = request.getParameter("censimento");
		String pvId = request.getParameter("id");
		String brandId = request.getParameter("brand_id");
		
		db = new DBManager(censimento, Const.username, Const.password);
		
		String query = String.format(Const.queryValMar, pvId, brandId);
		
		if(db.connetti()) {
			result = db.eseguiQuery(query, true);
			db.disconnetti();
		}
		
		
		
		jsonEncode(result, out);
	}
	
	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	public void jsonEncode(ArrayList<HashMap<String, String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result = new HashMap<String, Object>();
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}
}
