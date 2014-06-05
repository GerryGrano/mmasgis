
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


public class EstraiPermessiDeiRuoli extends Task {
	
	/**
	 * Gestore connessione al database
	 */
	DBManager db = new DBManager(Const.systemDB, Const.username, Const.password);
	
	/**
	 * Estrae i permessi assegnati ai ruoli
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		String query= "SELECT rl.ruolo_id as idr, perm.permesso_id as idp "
						+ "FROM ruolo rl JOIN rel_ruolo_permesso rlpr ON rl.ruolo_id = rlpr.ruolo_id "
						+ "JOIN permesso perm ON rlpr.permesso_id = perm.permesso_id";
			
		
		if (db.connetti()) {
			// eseguo query
			ArrayList<HashMap<String,String>> rl_pr = db.eseguiQuery(query, true);
			PrintWriter out = null;
			System.out.println(rl_pr);
			
			try {
				out = response.getWriter();
				// codifico il risultato
				jsonEncode(rl_pr, out);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
		
			db.disconnetti();
		}

	}
	
	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	
	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) 
	{
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}

}
