package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Classe che recupera il FID (Feature ID) 
 * 
 */
public class FidTask extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db = new DBManager(Const.systemDB, Const.username, Const.password);

	/**
	 * dato il nome del territorio ed il livello, ricerca il FID (FeatureID) relativo e lo restituisce al client
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {

		String layer = request.getParameter("layer");
		String nome = request.getParameter("nome");

		if (nome.contains("\'"))
			nome = nome.replace("'", "`").trim();

		String query = "SELECT id, parent_id, layer FROM tree WHERE LOWER(text)=LOWER('"
				+ nome + "') AND layer='" + layer + "'";
		
		ArrayList<String> record = new ArrayList<String>();
		
		if (db.connetti()) {
			ArrayList<HashMap<String, String>> fid = db.eseguiQuery(query, true);
			
			if (fid.size() > 0) {

				int x = 0;
				int n = 0;
				int i = 0;
				
				record.add(x++, fid.get(0).get("id"));
				record.add(x++, fid.get(0).get("parent_id"));
				
				if(layer.equals("comune")) { n=1; } 
				if(layer.equals("Cap")) { n=2; }

				while(i<n) {
					String innerQuery = "SELECT parent_id FROM tree WHERE id = "+record.get(x-1);
					Vector<String[]> inner = db.eseguiQuery(innerQuery);
					//System.out.println(inner.get(0).toString());
					record.add(x++, inner.get(0)[0]);
					i++;
				}

			} else {
				record.add(0, "empty");
			}

			PrintWriter out = null;
			try {
				out = response.getWriter();
				jsonEncode(record, out);

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
	private static void jsonEncode(ArrayList<String> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}

}
