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
 * Classe per l'estrazione dei valori della classe di parametri AZIENDALI, potenziali AZIENDALI o marche AZIENDALI specificata
 *
 */
public class ValueAzTask extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db;
	
	/**
	 * Dati il censimento personalizzato, la categoria (PAR, POT o MAR) e l'ID della classe,
	 * estrae l'elenco dei valori di quella categoria
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		
		String censimento=request.getParameter("censimento");
		String categoria=request.getParameter("category");
		String classeID=request.getParameter("id");
		
		PrintWriter out = null;
		db = new DBManager(censimento, Const.username, Const.password);
		
		String query="";
		
		if(categoria.equalsIgnoreCase("par")) {
			query = "SELECT tc_par_az_id AS id,tc_par_az.testo AS text,tc_par_az.tc_clpar_az_id AS class_id, tc_clpar_az.testo AS class_text FROM tc_par_az JOIN tc_clpar_az ON tc_par_az.tc_clpar_az_id=tc_clpar_az.tc_clpar_az_id WHERE tc_par_az.tc_clpar_az_id=%s ORDER BY tc_par_az.ordine ASC";
		} else if(categoria.equalsIgnoreCase("pot")) {
			query = "SELECT tc_pot_az_id AS id,tc_pot_az.testo AS text,tc_pot_az.tc_clpot_az_id AS class_id, tc_clpot_az.testo AS class_text FROM tc_pot_az JOIN tc_clpot_az ON tc_pot_az.tc_clpot_az_id=tc_clpot_az.tc_clpot_az_id WHERE tc_pot_az.tc_clpot_az_id=%s ORDER BY tc_pot_az.ordine ASC";
		}
		else {
			query = "SELECT tcrcm.tc_clmar_az_id AS class_id,tc_mar_az.tc_mar_az_id AS id,tc_clmar_az.testo AS class_text, tc_mar_az.testo AS text FROM tc_rel_clmar_mar_az tcrcm JOIN tc_mar_az ON tc_mar_az.tc_mar_az_id=tcrcm.tc_mar_az_id JOIN tc_clmar_az ON tc_clmar_az.tc_clmar_az_id=tcrcm.tc_clmar_az_id WHERE tcrcm.tc_clmar_az_id=%s ORDER BY text";
		}
		
		query = String.format(query, classeID);
		
		if(db.connetti()) {
			ArrayList<HashMap<String,String>> values = db.eseguiQuery(query, true);
			try {
				out = response.getWriter();
				jsonEncode(values, out);
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
