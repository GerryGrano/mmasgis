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
 * Classe che gestisce l'estrazione delle classificazioni della categoria scelta:
 * marche AZIENDALI, parametri AZIENDALI o potenziali AZIENDALI.
 *
 */
public class ClassAzTask extends Task {
	
	
	/**
	 * Data la categoria di classificazione AZIENDALE (par, mar o pot) e il censimento,
	 * estrae dal censimento personalizzato l'elenco delle classi.
	 * <p>
	 * Per esempio, dati:
	 * <p>
	 * <code>
	 * categoria: mar
	 * <p>
	 * censimento: farmacierp1101ciccarelli
	 * </code>
	 * <p>
	 * Viene estratto:
	 * <p>
	 * <code>
	 * Prodotti Podologici
	 * </code>
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		
		String censimento=request.getParameter("censimento");
		String categoria=request.getParameter("category");
		
		DBManager db = new DBManager(censimento, Const.username, Const.password);
		
		PrintWriter out = null;
		
		if (db.connetti()) {
			String query = String.format(Const.queryClassAz, categoria, categoria);
			
			ArrayList<HashMap<String,String>> elencoClassi = db.eseguiQuery(query, true);
			try {
				out = response.getWriter();
				jsonEncode(elencoClassi, out);
			} catch (IOException e) {
				// TODO Auto-generated catch block
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
	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result=new HashMap<String, Object>();
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}
	
}