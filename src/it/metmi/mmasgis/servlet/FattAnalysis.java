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
 * Classe che opera l'Aggregazione Territoriale
 *
 */
public class FattAnalysis extends Task {
	
	DBManager db;
	
	/**
	 * Dati il censimento e il livello su cui operare l'aggregazione, crea la tabella temporanea 
	 * contenente i PV della selezione geografica (ed eventuali filtri), e su tale tabella 
	 * esegue la query per l'aggregazione territoriale. 
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

		double base_fatt=0;
		int base_cl = 0;
		int base_num=0;
		boolean cap=false;
		
		String censimento = request.getParameter("censimento");
		String livello = request.getParameter("layer").toLowerCase();
		String classeId = request.getParameter("classe");
		String sortName = "tc.nome1";
		String order = "ASC";
		
		if(request.getParameterMap().containsKey("sort")) {
			
			String sort = request.getParameter("sort");
			
			Type collectionType = new TypeToken<ArrayList<HashMap<String,String>>>(){}.getType();
			ArrayList<HashMap<String,String>> tmp = new Gson().fromJson(sort, collectionType);
			sortName = tmp.get(0).get("property");
			order = tmp.get(0).get("direction");
			
		}

		if(!(livello.equalsIgnoreCase("regione") || livello.equalsIgnoreCase("provincia") || livello.equalsIgnoreCase("comune"))) {
			cap = true;
		}
		
		
		db = new DBManager(censimento, Const.username, Const.password);
		
		String selGeo = ListTask.selezioneGeografica(request);
		String tabellaTemporanea = String.format(Const.tempTable,"fatt","fatt", selGeo, ListTask.getValoriFiltri(request));
		String query = "";
		
		
		if (db.connetti()) {
			if (db.eseguiAggiornamento(tabellaTemporanea)) {
				// = db.eseguiQuery(query,true);
				
				Vector<String[]> baseField2 = db.eseguiQuery(String.format(Const.baseNumPotTerrFatt, censimento, censimento, censimento, classeId));
				for(String[] s:baseField2) {
					//base_num++;
					base_fatt = base_fatt + Double.parseDouble(s[1]);
				}
				Vector<String[]> baseField22  = db.eseguiQuery(String.format(Const.baseNumTerrFatt, censimento, censimento, censimento,classeId));
				for(String[] s2:baseField22) {
					base_num = Integer.parseInt(s2[0]);
				}
				Vector<String[]> baseField4  = db.eseguiQuery(String.format(Const.baseNumClTerrFatt, censimento, censimento, censimento,classeId));
				/*metodo alternativo di vector
				 * String[] s = baseField4.get(0);
				base_cl = Integer.parseInt(s[0]);*/
				for(String[] s3:baseField4) {
					base_cl = Integer.parseInt(s3[0]);
				}
				/*String query = "";
				boolean b = true;

				if (livello.equals("reg")) {
					query = String.format(Const.aggregazionePvReg, classeId);
				} else if (livello.equals("pro")) {
					query = String.format(Const.aggregazionePvPro, classeId);
				} else if (livello.equals("com")) {
					query = String.format(Const.aggregazionePvCom, classeId);
				} else if (livello.equals("cap")) {
					query = String.format(Const.aggregazionePvCap, classeId);
					b=false;
				}
				if(!b) {
					result = db.eseguiQuery(query,true);
				} else {
					result = db.eseguiQuery(query,true);				*/	
					if(cap) {
						String CAP="p.cap AS CAP,";
						query = String.format(Const.aggregazioneFattCap,CAP,base_num,base_cl,base_fatt, censimento, censimento, censimento, classeId, sortName, order);
						result = db.eseguiQuery(query,true);
					} else {
						query = String.format(Const.aggregazionePvFatt,livello,base_num,base_cl,base_fatt,censimento, livello, livello, livello, censimento,censimento,classeId, livello, sortName, order);
				
					//	query = String.format(Const.aggregazionePv,livello,base_num,base_cl,base_pot,censimento, censimento,censimento,classeId, livello, sortName, order);
					result = db.eseguiQuery(query,true);
					//System.out.print(base_num +"-"+ base_cl +"-"+ base_pot);
					//System.out.println(result.toString());
				}	
			}
			db.disconnetti();
		}
		jsonEncode(result,String.valueOf(base_num),String.valueOf(base_cl), String.valueOf((int)base_fatt), out);

		//jsonEncode(result, out);

	}
	
	
	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param base_num Base Numerica dell'aggregazione territoriale
	 * @param base_cl Base Clienti dell'aggregazione territoriale
	 * @param base_pot Base Potenziale dell'aggregazione territoriale
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	public void jsonEncode(ArrayList<HashMap<String, String>> data,String base_num,String base_cl, String base_fatt, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result = new HashMap<String, Object>();
		
		result.put("base_num", base_num);
		result.put("base_cl", base_cl);
		result.put("base_fatt", base_fatt);
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}
	

}
