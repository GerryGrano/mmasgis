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
 * Classe per l'estrazione dei valori della classe di parametri, potenziali o marche specificata
 *
 */
public class ValueTask extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db;
	
	/**
	 * Dati il censimento, la categoria (PAR, POT o MAR) e l'ID della classe,
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
			query = "SELECT tc_par_id AS id,tc_par.testo AS text,tc_par.tc_clpar_id AS class_id, tc_clpar.testo AS class_text FROM tc_par JOIN tc_clpar ON tc_par.tc_clpar_id=tc_clpar.tc_clpar_id WHERE tc_par.tc_clpar_id=%s ORDER BY tc_par.ordine ASC";
		} else if(categoria.equalsIgnoreCase("pot")) {
			query = "SELECT tc_pot_id AS id,tc_pot.testo AS text,tc_pot.tc_clpot_id AS class_id, tc_clpot.testo AS class_text FROM tc_pot JOIN tc_clpot ON tc_pot.tc_clpot_id=tc_clpot.tc_clpot_id WHERE tc_pot.tc_clpot_id=%s ORDER BY tc_pot.ordine ASC";
		}else if(categoria.equalsIgnoreCase("ser")) {
			query = "SELECT tcrcm.tc_clser_id AS class_id,tc_ser.tc_ser_id AS id,tc_clser.testo AS class_text, tc_ser.testo AS text FROM tc_rel_clser_ser tcrcm JOIN tc_ser ON tc_ser.tc_ser_id=tcrcm.tc_ser_id JOIN tc_clser ON tc_clser.tc_clser_id=tcrcm.tc_clser_id WHERE tcrcm.tc_clser_id=%s";
		}else if(categoria.equalsIgnoreCase("fatt")) {
			query = "SELECT tc_clfatt.tc_clfatt_id AS class_id, tc_fasc_fatt.tc_fasc_fatt_id AS id, tc_fasc_fatt.testo AS text FROM tc_clfatt JOIN tc_clfasc_fatt ON tc_clfatt.tc_clfasc_fatt_id = tc_clfasc_fatt.tc_clfasc_fatt_id JOIN tc_fasc_fatt ON tc_fasc_fatt.tc_clfasc_fatt_id = tc_clfasc_fatt.tc_clfasc_fatt_id WHERE tc_clfatt_id =%s";
		}
		else {
			query = "SELECT tcrcm.tc_clmar_id AS class_id,tc_mar.tc_mar_id AS id,tc_clmar.testo AS class_text, tc_mar.testo AS text FROM tc_rel_clmar_mar tcrcm JOIN tc_mar ON tc_mar.tc_mar_id=tcrcm.tc_mar_id JOIN tc_clmar ON tc_clmar.tc_clmar_id=tcrcm.tc_clmar_id WHERE tcrcm.tc_clmar_id=%s ORDER BY text";
		}
		
		query = String.format(query, classeID);
		
		if(db.connetti()) {
			ArrayList<HashMap<String,String>> values = db.eseguiQuery(query, true);
			try {
				out = response.getWriter();
				jsonEncode(values, "", out);
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
	private static void jsonEncode(ArrayList<HashMap<String,String>> data, String size, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result=new HashMap<String, Object>();
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
		
	}

}
