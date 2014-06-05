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
 * marche, parametri o potenziali.
 *
 */
public class AllClassTask extends Task {
	
	
	/**
	 * Data la categoria di classificazione(par, mar o pot) e il censimento,
	 * estrae dal censimento l'elenco delle classi.
	 * <p>
	 * Per esempio, dati i seguenti parametri:
	 * <p>
	 * <code>
	 * Categoria: par
	 * <p>
	 * Censimento: farmacierp1101ciccarelli
	 * </code>
	 * <p>
	 * Viene estratto:
	 * <p>
	 * <code>
	 * 	Tipologia Esercizio,
	 * 	Addetti,
	 * 	Fascia Mq. Negozio,
	 * 	Fascia Mq. Magazzino,
	 * 	Numero Vetrine,
	 * 	Uso PC,
	 * 	Uso Internet
	 * </code>
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		
		String censimento=request.getParameter("censimento");
		String pv_id=request.getParameter("id");
		System.err.println(pv_id);
		String [] categories={"ser","fatt","pot_az","par_az","mar_az"};
		String [] length=new String [5];
		DBManager db = new DBManager(censimento, Const.username, Const.password);
		PrintWriter out = null;
		for(int i=0;i<5;i++){
			if (db.connetti()) {
				ArrayList<HashMap<String,String>> lunghezzeClassi;
				if(pv_id!=null && !categories[i].equals("fatt")){
					String query = String.format("SELECT COUNT(tc_cl%s_id) as totClassi FROM tc_cl%s tcl WHERE tcl.tc_stato_id=1" , categories[i], categories[i]);
					lunghezzeClassi = db.eseguiQuery(query, true);
				}
				else{
					String query = String.format("SELECT COUNT(tc_clfatt.testo) as totClassi FROM rel_pv_fatt JOIN tc_clfatt JOIN tc_fasc_fatt ON rel_pv_fatt.tc_fasc_fatt_id = tc_fasc_fatt.tc_fasc_fatt_id AND rel_pv_fatt.tc_clfatt_id = tc_clfatt.tc_clfatt_id WHERE pv_id = %s",pv_id);
					lunghezzeClassi = db.eseguiQuery(query, true);
					//System.err.println(lunghezzeClassi.get(0).get("totClassi"));
				}
				if(!lunghezzeClassi.isEmpty()){
					length[i]=lunghezzeClassi.get(0).get("totClassi");
					
				}
				else{
					length[i]="0";
				}
				db.disconnetti();
			}
		}
		try {
			out = response.getWriter();
			jsonEncodeArray(length, out);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	private static void jsonEncodeArray(String[] data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result=new HashMap<String, Object>();
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}
	
}
