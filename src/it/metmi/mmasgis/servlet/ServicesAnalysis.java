package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

/**
 * Classe che svolge l'"Analisi marche", estraendo i dati dal censimento selezionato
 * e calcolando i vari indici che compongono l'analisi, sulla base della marca passata 
 * come parametro nella richiesta HTTP
 * 
 */
public class ServicesAnalysis extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db;
	
	/**
	 * Dati il censimento e la classe della marca (estratti dalla richiesta HTTP), crea una tabella temporanea di 
	 * appoggio ed esegue su di essa la query per l'analisi marche. 
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
		int base_num=0;
		double base_pot=0;
		
		String censimento = request.getParameter("censimento");
		String classeId = request.getParameter("classe");
		String sortName = "tcm.testo";
		String order = "ASC";
		
		if(request.getParameterMap().containsKey("sort")) {
			
			String sort = request.getParameter("sort");
			
			Type collectionType = new TypeToken<ArrayList<HashMap<String,String>>>(){}.getType();
			ArrayList<HashMap<String,String>> tmp = new Gson().fromJson(sort, collectionType);
			sortName = tmp.get(0).get("property");
			order = tmp.get(0).get("direction");
			
		}
		
		db = new DBManager(censimento, Const.username, Const.password);
		
		String selGeo = ListTask.selezioneGeografica(request);
		String tabellaTemporanea = String.format(Const.tempTable,"ser","ser", selGeo, ListTask.getValoriFiltri(request));
		
		if (db.connetti()) {
			
			if (db.eseguiAggiornamento(tabellaTemporanea)) {
				
				Vector<String[]> baseField = db.eseguiQuery(String.format(Const.baseNumPotSer, censimento, censimento, censimento, classeId));
				
				for(String[] s:baseField) {
					base_num++;
					base_pot = base_pot + Double.parseDouble(s[1]);
				}
				/*
				 * creo una tabella temporanea dove trovo i PV che offrono ogni singolo servizio a seconda della classe
				 * di servizio scelta e dopodichè la mette in join con la query che si occupa dell'aggregazione servizi
				 */
				String qq1=String.format(Const.tempTableServicesNumPv,censimento,censimento,censimento,classeId);
				if (db.eseguiAggiornamento(qq1)) {					
					String query = String.format(Const.analisiServizi, base_num, base_pot, base_pot, base_num, base_pot, censimento, censimento,censimento, censimento, censimento, classeId, sortName, order);
					result=db.eseguiQuery(query, true);
				}
				
			}
			db.disconnetti();
		}

		jsonEncode(result, String.valueOf(base_num), String.valueOf((int)base_pot), out);

	}
	
	
	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param base_num Base Numerica dell'analisi marche
	 * @param base_pot Base Potenziale dell'analisi marche
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	public void jsonEncode(ArrayList<HashMap<String, String>> data, String base_num, String base_pot, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result = new HashMap<String, Object>();
		result.put("base_num", base_num);
		result.put("base_pot", base_pot);
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}

}
