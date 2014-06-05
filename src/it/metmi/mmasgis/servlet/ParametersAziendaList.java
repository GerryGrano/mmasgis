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
 * Classe che gestisce l'estrazione delle classi di parametri AZIENDALI
 * dato l'ID del punto vendita e il nome del censimento
 *
 */
public class ParametersAziendaList extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db;
	
	/**
	 * Dati il nome del censimento e l'ID del punto vendita, esegue la query
	 * per trovare le classi di parametri AZIENDALI.
	 * <p>
	 * Per esempio, dati:
	 * <p>
	 * <code>
	 * pv_id = xxx
	 * <p>
	 * censimento = farmacierp1101ciccarelli
	 * </code>
	 * <p>
	 * Viene estratto:
	 * <p>
	 * <code>
	 * Richiesta marca specifica prodotti podologici
	 * <p>
	 * Classificazione Clienti
	 * <p>
	 * Expo terra linea piedi Anno Precedente Totale
	 * <p>
	 * Expo terra linea piedi Anno Corrente
	 * <p>
	 * ...
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
		
		db = new DBManager(censimento, Const.username, Const.password);
		
		String query = Const.queryClassParAz;
		
		if(db.connetti()) {
			result = db.eseguiQuery(query, true);
			
			ArrayList<HashMap<String, String>> v = new ArrayList<HashMap<String, String>>();
			
			for(int i=0;i<result.size(); i++) {
				String classeId = result.get(i).get("classeId");
				String subQuery = String.format(Const.queryValParAz, pvId, classeId);
				v = db.eseguiQuery(subQuery, true);
				
				String tmp="";
				
				if(v.size()>0)
					tmp = v.get(0).get("valore");
				else
					tmp = "-";
				
				result.get(i).put("valore", tmp);
			}
			
			
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