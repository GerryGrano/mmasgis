package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Classe per l'estrazione dell'elenco delle classificazioni di potenziali relativi ad un PV
 */
public class NoteList extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db;
	
	/**
	 * Dato il censimento e l'ID di un PV, estrae i potenziali relativi a quel PV
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
		LinkedHashMap<String,String> tmp = new LinkedHashMap<String,String>();
		
		db = new DBManager(censimento, Const.username, Const.password);
		
		String query = String.format(Const.queryNotePdf, censimento, pvId);
		
		if(db.connetti()) {
			result = db.eseguiQuery(query, true);
			db.disconnetti();
		}
		for (int i = 0; i < result.size(); i++) {
			tmp.putAll(result.get(i));
		}
		String nt = tmp.get("note");
		String [] nt2 = nt.split("\r");
		result.clear();
		for(int i=0; i<nt2.length; i++){
			LinkedHashMap<String,String> nota = new LinkedHashMap<String,String>();
			nota.put("note", nt2[i]);
			result.add(nota);
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