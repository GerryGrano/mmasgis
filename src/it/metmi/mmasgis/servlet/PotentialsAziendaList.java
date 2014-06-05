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
 * Classe per l'estrazione dell'elenco delle classificazioni di potenziali AZIENDALI relativi ad un PV
 */
public class PotentialsAziendaList extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db;
	
	/**
	 * Dato il censimento e l'ID di un PV, estrae i potenziali aziendali relativi a quel PV
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
		
		db = new DBManager(censimento, Const.username, Const.password);
		
		String query = String.format(Const.queryPotAz, pvId);
		
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
