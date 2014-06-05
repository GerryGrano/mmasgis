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
 * Classe che gestisce l'elencazione delle Marche MMAS, in particolare l'elenco dei valori
 * per ogni singola Marca
 *
 */
public class AnagraficaServTask extends Task{

	/**
	 * Gestore connessione al database
	 */
	DBManager db;
	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		String censimento = request.getParameter("censimento");	
		String classeId=request.getParameter("classeId");	
		String brand_id=request.getParameter("brand_id");
		
		// TODO Auto-generated method stub
		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		ArrayList<HashMap<String, String>> result = new ArrayList<HashMap<String, String>>();
		db = new DBManager(censimento, Const.username, Const.password);
		
		if(db.connetti()) {
			
				String elencoServizi = String.format(Const.queryAllServicesPerClass,brand_id,classeId);
				result= db.eseguiQuery(elencoServizi, true);
				
				
				/*for(int j=0;j<result.size();j++){
					Iterator<Map.Entry<String,String>> ite;
					ite = result.get(j).entrySet().iterator();
					while(ite.hasNext()){
						Map.Entry<String, String> next = ite.next(); //estraggo l'elemento entry
						System.out.println(next.getValue());
					}
				}*/
				
			
			
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
	
	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result=new HashMap<String, Object>();
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}   

}
