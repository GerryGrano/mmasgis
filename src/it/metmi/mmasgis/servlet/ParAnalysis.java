package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Classe che opera l'Aggregazione Parametri
 *
 */
public class ParAnalysis extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db;

	/**
	 * Dati il censimento, la classe di parametri, e il livello su cui operare l'analisi,
	 * crea la tabella temporanea contenente i PV della selezione geografica (ed eventuali filtri),
	 * e su tale tabella esegue la query per l'aggregazione parametri.
	 * <p>
	 * Scorrendo il resultset, aggrega i risultati ed aggiunge le informazioni necessarie per creare la tabella da incapsulare nel Json
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {

		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		String censimento = request.getParameter("censimento");
		String classeId = request.getParameter("classe");
		String livello = request.getParameter("liv");
		String selGeo = ListTask.selezioneGeografica(request);
		String tabellaTemporanea = String.format(Const.tempTable,"par","par", selGeo, ListTask.getValoriFiltri(request));
		String query = "";
		boolean b = true;

		if (livello.equals("reg")) {
			query = String.format(Const.aggregazioneParReg, classeId);
		} else if (livello.equals("pro")) {
			query = String.format(Const.aggregazioneParPro, classeId);
		} else if (livello.equals("com")) {
			query = String.format(Const.aggregazioneParCom, classeId);
		} else if (livello.equals("cap")) {
			query = String.format(Const.aggregazioneParCap, classeId);
			b=false;
		}

		ArrayList<HashMap<String, String>> result = new ArrayList<HashMap<String, String>>();
		HashMap<String, Object> meta = new HashMap<String, Object>();
		ArrayList<HashMap<String, String>> fields_array = new ArrayList<HashMap<String, String>>();
		ArrayList<HashMap<String, String>> columns_array = new ArrayList<HashMap<String, String>>();

		HashMap<String, String> liv_field = new HashMap<String, String>();
		liv_field.put("name", "territorio");
		liv_field.put("type", "string");
		
		HashMap<String, String> liv_column = new HashMap<String, String>();
		liv_column.put("text", "Territorio");
		liv_column.put("dataIndex", "territorio");
		
		fields_array.add(liv_field);
		columns_array.add(liv_column);
		
		if(!b) {
			HashMap<String, String> id_field = new HashMap<String, String>();
			id_field.put("name", "cap");
			id_field.put("type", "int");
			
			HashMap<String, String> id_col = new HashMap<String, String>();
			id_col.put("text","Cap");
			id_col.put("dataIndex", "cap");
			
			fields_array.add(id_field);
			columns_array.add(id_col);
		}
		
		
		

		db = new DBManager(censimento, Const.username, Const.password);

		if (db.connetti()) {
			if (db.eseguiAggiornamento(tabellaTemporanea)) {

				Vector<String[]> v = db
						.eseguiQuery("SELECT tc_par_id AS id, tc_par.testo AS text, tc_par.tc_clpar_id AS class_id, "
								+ "tc_clpar.testo AS class_text FROM tc_par JOIN tc_clpar ON tc_par.tc_clpar_id=tc_clpar.tc_clpar_id "
								+ "WHERE tc_par.tc_clpar_id=" + classeId + " ORDER BY tc_par.ordine ASC");
				
				ArrayList<HashMap<String, String>> rs = db.eseguiQuery(query, true);

				// elenco i nomi dei campi che serviranno per creare dinamicamente il model in extjs
				for (String[] s : v) {
					
					HashMap<String, String> field = new HashMap<String, String>();
					HashMap<String, String> column = new HashMap<String, String>();
					field.put("name", s[1].replace(".", ""));
					field.put("type", "int");

					column.put("text", s[1].replace(".", ""));
					column.put("dataIndex", s[1].replace(".", ""));
					column.put("summaryType", "sum");

					fields_array.add(field);
					columns_array.add(column);
				}

				HashMap<String, String> tot_field = new HashMap<String, String>();
				tot_field.put("name", "totale");
				tot_field.put("type", "int");
				fields_array.add(tot_field);
				
				
				HashMap<String, String> idn_field = new HashMap<String, String>();
				idn_field.put("name", "idn");
				idn_field.put("type", "string");
				idn_field.put("hide", "true");
				fields_array.add(idn_field);
				
				HashMap<String, String> tot_col = new HashMap<String, String>();
				tot_col.put("text", "Totale");
				tot_col.put("dataIndex", "totale");
				tot_col.put("summaryType", "sum");
				tot_col.put("tdCls","custom-column");
				columns_array.add(tot_col);
				
				HashMap<String, String> idn_col = new HashMap<String, String>();
				idn_col.put("text","idn");
				idn_col.put("dataIndex", "idn");
				columns_array.add(idn_col);
				
				meta.put("fields", fields_array);
				meta.put("columns", columns_array);
				meta.put("root", "results");
				meta.put("idProperty", "idn");
				
				String prevId = "";

				// per ogni territorio
				for (int i = 0; i < rs.size()+1; i++) {
					
					HashMap<String, String> tmp = new HashMap<String, String>();
					
					if(i==rs.size()) {
						tmp.put("territorio", "totale");
						
					}
					else {
						// se non l'ho gia' inserito
						if (!(rs.get(i).get("id").equals(prevId)) && true) {
							// lo inserisco
							tmp.put("territorio", rs.get(i).get("nome1").replace(".", ""));
							tmp.put("idn", rs.get(i).get("id"));
							tmp.put("totale", "");
							
							//se il livello di aggregazione è CAP, allora inserisco anche la chiave cap
							if (!b) {
								tmp.put("cap", rs.get(i).get("cap"));
							}
							
							// e poi inserisco tutti i parametri della classe
							// selezionata settandoli a zero
							for (int j = 0; j < v.size(); j++) {
								tmp.put(v.get(j)[1].replace(".", ""), "");
							}
							
							// salvo il territorio attuale per il confronto
							prevId = rs.get(i).get("id");
							
							// infine aggiungo al result
							result.add(tmp);
						}
					}
				}
				
				//popolo il result con i valori numerici corretti
				for (int k = 0; k < rs.size(); k++) {
					for (int w=0; w<result.size(); w++) {
						
						if (result.get(w).get("territorio").equals(rs.get(k).get("nome1")) && result.get(w).get("idn").equals(rs.get(k).get("id"))) {
							result.get(w).put(rs.get(k).get("testo").replace(".", ""), rs.get(k).get("conteggio"));
						}
					}
				}

				//scorro result e calcolo totale per ogni territorio
				for(int n=0; n<result.size(); n++) {
					Set<String> keys = result.get(n).keySet();
					Iterator<String> keyIter = keys.iterator();
					int tot=0;
					while (keyIter.hasNext()) {
						String key = (String) keyIter.next(); // Get the next key.
						if(!(key.equals("territorio")) && !(key.equals("totale"))) {
							String value = result.get(n).get(key);
							if(value.length()>0 && !key.equals("cap") && !key.equals("idn")) {
								tot = tot+Integer.parseInt(value);
							}
						}
					}
					result.get(n).put("totale", String.valueOf(tot));
					
				}			
					
			}
			db.disconnetti();
		}
		
		jsonEncode(result, meta, out);

	}

	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 *
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param meta Informazioni aggiuntive per la creazione della tabella dinamica (nomi delle colonne, tipo dei dati, modificatori di visibilità..)
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	public void jsonEncode(ArrayList<HashMap<String, String>> data, HashMap<String, Object> meta, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result = new HashMap<String, Object>();
		result.put("metaData", meta);
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}
}
