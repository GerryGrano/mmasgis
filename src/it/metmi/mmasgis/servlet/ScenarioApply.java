package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Vector;
import java.util.List;
import java.util.LinkedList;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import org.json.*;

import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.lang.String;
import java.lang.reflect.Type;


public class ScenarioApply extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db = new DBManager(Const.systemDB, Const.username, Const.password);

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {

		//System.out.println("task iniziato");
		//Richiedo la sessione attiva
		HttpSession session = request.getSession(true);
		
		//Inizializzo le variabili
		String user_id = (String)session.getAttribute("user_id");
		String nome_scenario = request.getParameter("nome_scenario");
		String scenario_id;
		String zone = request.getParameter("zone");
		String zoneOK = "{a:" + zone + "}";
		String territori = request.getParameter("territori");
		String territoriOK = "{a:" + territori + "}";
		System.out.println(territoriOK);
		System.out.println(zoneOK);
		
		//Ottengo data ed orario di esecuzione
		//DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//String date = dateFormat.format(new Date());
		//System.out.println(date);
		
		//Inizializzo le query per applicare le modifiche al Data Base
		String queryScen = "";
		String queryScenR = "";
		String queryZone = "";
		String queryZoneR = "";
		String queryRelZT = "";
		
		//Inserisco il nuovo scenario nel Data Base
		queryScen = "INSERT INTO scenario (nome,data_generazione,ins_data,ins_utente,mod_data,mod_utente) ";
		queryScen += "VALUES ('" + nome_scenario + "',NULL,NOW(),'" + user_id + "',NULL,NULL)";
		queryScenR = "SELECT LAST_INSERT_ID() as id_inserito";

		
		if (db.connetti()) {
			//Inserisco lo scenario nel Data Base
			Boolean Scen = db.eseguiAggiornamento(queryScen);
			ArrayList<HashMap<String,String>> ScenR = db.eseguiQuery(queryScenR, true);
			scenario_id = ScenR.get(0).get("id_inserito");
		
			//Inserisco le zone nel Data Base
			if(!(zoneOK.equals("{a:[]}")) && !(zoneOK.equals("{a:}"))){
			
				queryZone = "INSERT INTO zona (scenario_id,nome,colore,utente_id,ins_data,ins_utente,mod_data,mod_utente) ";
				queryZone += "VALUES ";
				
				try {
					JSONObject jsonObject = new JSONObject(zoneOK);
					
					List<String> nome_zona = new ArrayList<String>();
					List<String> colore = new ArrayList<String>();
					
					JSONArray array = jsonObject.getJSONArray("a");
					System.out.println(array);
					
					for(int i = 0 ; i < array.length() ; i++){
						queryZone += "( '";
						nome_zona.add(array.getJSONObject(i).getString("zona"));
						colore.add(array.getJSONObject(i).getString("color"));
						 
						queryZone += scenario_id + "', '";
						queryZone += nome_zona.get(i) + "', '";
						queryZone += colore.get(i) + "', ";
						queryZone += "NULL, ";
						queryZone += "NOW(), '";
						queryZone += user_id + "', ";
						queryZone += "NULL, ";
						queryZone += "NULL";
						
						queryZone += ") ";
						if(i != (array.length()-1)){
							queryZone += ", ";
						}
					}
				}
				catch (JSONException e){
					e.printStackTrace();
				}
				
				queryZoneR = "SELECT zona_id, nome FROM zona WHERE scenario_id = " + scenario_id;
							
				Boolean Zone = db.eseguiAggiornamento(queryZone);
				ArrayList<HashMap<String,String>> ZoneR = db.eseguiQuery(queryZoneR, true);
						
				System.out.println(ZoneR);
				
				//Popolo la tabella rel_zona_territorio
				if(!(territoriOK.equals("{a:}")) && !(territoriOK.equals("{a:}"))){

					queryRelZT = "INSERT INTO rel_zona_territorio (zona_id,tc_territorio_id,tabella_territorio) ";
					queryRelZT += "VALUES ";
				
					try {
						JSONObject jsonObject = new JSONObject(territoriOK);
						
						List<String> tc_territorio_id = new ArrayList<String>();
						List<String> tabella_territorio = new ArrayList<String>();
						List<String> zona = new ArrayList<String>();
						List<String> z_id = new ArrayList<String>();
						
						JSONArray array2 = jsonObject.getJSONArray("a");
						
						for(int it1 = 0; it1 < array2.length(); it1++){
							queryRelZT += "( '";
							tc_territorio_id.add(array2.getJSONObject(it1).getString("tc_territorio_id"));
							tabella_territorio.add(array2.getJSONObject(it1).getString("tabella_territorio"));
							zona.add(array2.getJSONObject(it1).getString("nome"));
							z_id.add("");
							//array2.getJSONObject(it1).getString("zona_id")
							
							loopZ : for(int a = 0; a < ZoneR.size(); a++){
								System.out.println(zona.get(it1));		
								if (zona.get(it1).equals(ZoneR.get(a).get("nome"))){
									z_id.set(it1, ZoneR.get(a).get("zona_id"));
									System.out.println("z_id: "+z_id);
									break loopZ;
								}
							}
							
							queryRelZT += z_id.get(it1) + "', '";
							queryRelZT += tc_territorio_id.get(it1) + "', '";
							queryRelZT += tabella_territorio.get(it1);
							
							queryRelZT += "') ";
							if(it1 != (array2.length()-1)){
								queryRelZT += ", ";
							}
							
							
						}
					}
					catch (JSONException e){
						e.printStackTrace();
					}
					
					Boolean RelZT = db.eseguiAggiornamento(queryRelZT);
					
				}
			}
			
			PrintWriter outScenR = null;
			
			try {
				outScenR = response.getWriter();
				jsonEncode(ScenR, outScenR);

			} catch (IOException e) {
				e.printStackTrace();
			}

			
			
			
			//Disconnessione
			db.disconnetti();
		}
	}

	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}

}