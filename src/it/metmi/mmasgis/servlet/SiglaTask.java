package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.metmi.mmasgis.servlet.Task;
import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

/**
 * Classe che si occupa di ottenere la sigla corrispondente al territorio 
 * selezionato e passato come parametro
 *
 */
public class SiglaTask extends Task {
	
	/**
	 * Gestore connessione al database
	 */
	DBManager db = new DBManager(Const.systemDB, Const.username, Const.password);
	
	/**
	 * Estrae dal database la sigla corrispondente al territorio inviato
	 * come parametro HTTP
	 * <p>
	 * Per esempio Milano ha sigla (MI/LOM)
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		
		// ottengo parametri da richiesta http
		String fid = request.getParameter("fid");
		String layer = request.getParameter("layer");
		
		//compongo la query per ottenere la sigla del territorio
		String query="SELECT sigla FROM tree WHERE codice="+fid+" AND layer='"+layer+"'";
			
		
		if (db.connetti()) {
			// eseguo query
			ArrayList<HashMap<String,String>> sigla= db.eseguiQuery(query, true);
			PrintWriter out = null;
			try {
				out = response.getWriter();
				// codifico il risultato
				jsonEncode(sigla, out);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			// diconnessione
			db.disconnetti();
		}

	}
	
	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}

}
