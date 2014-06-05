/**
 * 
 */
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
 * Classe che gestisce l'elencazione dei Parametri MMAS, in particolare l'elenco dei valori
 * per ogni singolo parametro 
 *
 */
public class AnagraficaParAzTask extends Task{
	/**
	 * Gestore connessione al database
	 */
	DBManager db;
	
	/**
	 * Dato il censimento, estrae le classi di parametri
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		
		ArrayList<HashMap<String, Object>> result = new ArrayList<HashMap<String, Object>>();
		String censimento = request.getParameter("censimento");	
		String classeId = request.getParameter("classeId");

		db = new DBManager(censimento, Const.username, Const.password);
				
		if(db.connetti()) {
			String elencoParAnagrafica = String.format(Const.elencoParAzAnagrafica, classeId);
			result= db.eseguiQueryObject(elencoParAnagrafica, true);
			db.disconnetti();
		}
		
		jsonEncode(result,out);
		
	}

	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 *
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	
	public void jsonEncode(ArrayList<HashMap<String, Object>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result = new HashMap<String, Object>();
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}
}
