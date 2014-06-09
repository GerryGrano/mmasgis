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


public class ScenarioUpdate extends Task {

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
		String scenario_id = request.getParameter("scenario_id");
		String toInsert = request.getParameter("toInsert");
		String toInsertOK = "{a:" + toInsert.replace("[[", "[").replace("]]", "]") + "}";
		String toUpdate = request.getParameter("toUpdate");
		String toUpdateOK = "{a:" + toUpdate.replace("[[", "[").replace("]]", "]") + "}";
		String toDelete = request.getParameter("toDelete");
		String toDeleteOK = "{a:" + toDelete.replace("[[", "[").replace("]]", "]") + "}";
		String zToInsert = request.getParameter("zToInsert");
		String zToInsertOK = "{a:" + zToInsert.replace("[[", "[").replace("]]", "]") + "}";
		String zToUpdate = request.getParameter("zToUpdate");
		System.out.println(zToUpdate);
		//String zToUpdateOK = "{a:" + zToUpdate.replace("[[", "[").replace("]]", "]") + "}";
		String zToUpdateOK = "{a:" + zToUpdate.replace("[{", "{").replace("}]", "}") + "}";
		String zToDelete = request.getParameter("zToDelete");
		String zToDeleteOK = "{a:" + zToDelete.replace("[[", "[").replace("]]", "]") + "}";
		String nameChanged = request.getParameter("nameChanged");
		Boolean zUpdated = false;
		
		//Inizializzo le query per applicare le modifiche al Data Base
		String queryInsert = "";
		String queryUpdate = "";
		List<String> queryUpdateL = new ArrayList<String>();
		String queryDelete = "";
		List<String> queryDeleteL = new ArrayList<String>();
		String queryZInsert = "";
		String queryZUpdate = "";
		List<String> queryZUpdateL = new ArrayList<String>();
		String queryZDelete = "";
		List<String> queryZDeleteL = new ArrayList<String>();
		String queryNameUpdate = "";
		
		if(!(zToInsertOK.equals("{a:[]}")) && !(zToInsertOK.equals("{a:}"))){
			System.out.println(zToInsertOK);
			//Inserisco le nuove zone nel Data Base
			queryZInsert = "INSERT INTO zona (scenario_id,nome,colore,utente_id,ins_data,ins_utente,mod_data,mod_utente) ";
			queryZInsert += "VALUES ";
	
			try {
				JSONObject jsonObject = new JSONObject(zToInsertOK);
				
				List<String> nome_zona = new ArrayList<String>();
				List<String> colore = new ArrayList<String>();
				JSONArray array = jsonObject.getJSONArray("a");
				System.out.println(array);
				
				for(int i = 0 ; i < array.length() ; i++){
					queryZInsert += "( '";
					
					nome_zona.add(array.getJSONObject(i).getString("zona"));
					colore.add(array.getJSONObject(i).getString("color"));
					 
					queryZInsert += scenario_id + "', '";
					queryZInsert += nome_zona.get(i) + "', '";
					queryZInsert += colore.get(i) + "', ";
					queryZInsert += "NULL, ";
					queryZInsert += "NOW(), '";
					queryZInsert += user_id + "', ";
					queryZInsert += "NULL, ";
					queryZInsert += "NULL";
					
					queryZInsert += ") ";
					if(i != (array.length()-1)){
						queryZInsert += ", ";
					}
				}
			}
			catch (JSONException e){
				e.printStackTrace();
			}
			
			zUpdated = true;
		}
		
		if(!(zToUpdateOK.equals("{a:[]}")) && !(zToUpdateOK.equals("{a:}"))){
			//Aggiorno le zone che sono state modificate
			try {
				System.out.println(zToUpdateOK);
				JSONObject jsonObject = new JSONObject(zToUpdateOK);
				
				List<String> nome_zona = new ArrayList<String>();
				List<String> colore = new ArrayList<String>();
				List<String> zona_id = new ArrayList<String>();
				JSONArray array2 = jsonObject.getJSONArray("a");
				System.out.println(array2);
				System.out.println(array2.length());
				
				for(int i = 0 ; i < array2.length() ; i++){
					queryZUpdate = "UPDATE zona SET ";
					
					nome_zona.add(array2.getJSONObject(i).getString("zona"));
					colore.add(array2.getJSONObject(i).getString("color"));
					zona_id.add(array2.getJSONObject(i).getString("id"));
					
					queryZUpdate += "nome='" + nome_zona.get(i) + "', ";
					queryZUpdate += "colore='" + colore.get(i) + "', ";
					queryZUpdate += "mod_data=NOW(), ";
					queryZUpdate += "mod_utente='" + user_id + "' ";
					
					queryZUpdate += "WHERE zona_id='" + zona_id.get(i) + "'";
					queryZUpdateL.add(queryZUpdate);
				}
			}
			catch (JSONException e){
				e.printStackTrace();
			}
			
			zUpdated = true;
		}
		
		if(!(toInsertOK.equals("{a:[]}")) && !(toInsertOK.equals("{a:}"))){
			//Inserisco le nuove relazioni tra zona e territorio
			queryInsert = "INSERT INTO rel_zona_territorio (zona_id,tc_territorio_id,tabella_territorio) ";
			queryInsert += "VALUES ";
	
			try {
				JSONObject jsonObject = new JSONObject(toInsertOK);
				
				List<String> tc_territorio_id = new ArrayList<String>();
				List<String> tabella_territorio = new ArrayList<String>();
				List<String> z_id = new ArrayList<String>();
				
				JSONArray array3 = jsonObject.getJSONArray("a");
				System.out.println(array3);
				
				for(int it1 = 0; it1 < array3.length(); it1++){
					queryInsert += "( '";
					tc_territorio_id.add(array3.getJSONObject(it1).getString("tc_territorio_id"));
					tabella_territorio.add(array3.getJSONObject(it1).getString("tabella_territorio"));
					z_id.add(array3.getJSONObject(it1).getString("zona_id"));
					
					queryInsert += z_id.get(it1) + "', '";
					queryInsert += tc_territorio_id.get(it1) + "', '";
					queryInsert += tabella_territorio.get(it1);
					
					queryInsert += ") ";
					if(it1 != (array3.length()-1)){
						queryInsert += ", ";
					}
					
				}
			}
			catch (JSONException e){
				e.printStackTrace();
			}
			
			zUpdated = true;
		}
		
		if(!(toUpdateOK.equals("{a:[]}")) && !(toUpdateOK.equals("{a:}"))){
			//Aggiorno le relazioni zona-territorio che sono state modificate
			try {
				JSONObject jsonObject = new JSONObject(toUpdateOK);
				
				List<String> tc_territorio_id = new ArrayList<String>();
				//List<String> tabella_territorio = new ArrayList<String>();
				List<String> z_id = new ArrayList<String>();
				
				JSONArray array4 = jsonObject.getJSONArray("a");
				
				for(int i = 0 ; i < array4.length() ; i++){
					queryUpdate = "UPDATE rel_zona_territorio SET ";
					
					z_id.add(array4.getJSONObject(i).getString("zona_id"));
					
					queryUpdate += "zona_id='" + z_id.get(i) + "', ";	
					queryUpdate += "mod_data=NOW(), ";
					queryUpdate += "mod_utente='" + user_id + "' ";
					
					queryUpdate += "WHERE tc_territorio_id='" + tc_territorio_id.get(i) + "' ";
					queryUpdateL.add(queryUpdate);
				}
			}
			catch (JSONException e){
				e.printStackTrace();
			}
			
			zUpdated = true;
		}
		
		if(!(toDeleteOK.equals("{a:[]}")) && !(toDeleteOK.equals("{a:}"))){
			//Cancello dal DB le relazioni zona-territorio che sono state eliminate
			try {
				JSONObject jsonObject = new JSONObject(toDeleteOK);
				
				List<String> tc_territorio_id = new ArrayList<String>();
				
				JSONArray array5 = jsonObject.getJSONArray("a");
				System.out.println(array5);
				
				for(int i = 0 ; i < array5.length() ; i++){
					queryDelete = "DELETE FROM rel_zona_territorio WHERE ";
					
					tc_territorio_id.add(array5.getJSONObject(i).getString("tc_territorio_id"));
					
					queryDelete += "tc_territorio_id='" + tc_territorio_id.get(i) + "' ";
					queryDeleteL.add(queryDelete);
				}
			}
			catch (JSONException e){
				e.printStackTrace();
			}
			
			zUpdated = true;
		}
		
		if(!(zToDeleteOK.equals("{a:[]}")) && !(zToDeleteOK.equals("{a:}"))){
			//Cancello dal DB le zone che sono state eliminate
			System.out.println(zToDeleteOK);
			try {
				JSONObject jsonObject = new JSONObject(zToDeleteOK);
				
				List<String> zona_id = new ArrayList<String>();
				
				JSONArray array6 = jsonObject.getJSONArray("a");
				
				for(int i = 0 ; i < array6.length() ; i++){
					queryZDelete = "DELETE FROM zona WHERE ";
					
					zona_id.add(array6.getJSONObject(i).getString("id"));
					
					queryZDelete += "zona_id='" + zona_id.get(i) + "' ";
					queryZDeleteL.add(queryZDelete);
				}
			}
			catch (JSONException e){
				e.printStackTrace();
			}
			
			zUpdated = true;
		}
		
		if(nameChanged.equals("true")){
			//Aggiorno il nome dello scenario
			queryNameUpdate = "UPDATE scenario SET ";
			queryNameUpdate += "nome='" + nome_scenario + "', ";
			queryNameUpdate += "mod_data=NOW(), ";
			queryNameUpdate += "mod_utente='" + user_id + "' ";
			queryNameUpdate += "WHERE scenario_id='" + scenario_id + "' ";
		}
		else if(zUpdated == true){
			queryNameUpdate = "UPDATE scenario SET ";
			queryNameUpdate += "mod_data=NOW(), ";
			queryNameUpdate += "mod_utente='" + user_id + "' ";
			queryNameUpdate += "WHERE scenario_id='" + scenario_id + "' ";
		}
		
		
		if (db.connetti()) {
			//E' importante l'ordine in cui le query vengono eseguite
			if(queryZInsert != "") {Boolean OK1 = db.eseguiAggiornamento(queryZInsert);}
			for(int i = 0 ; i < queryZUpdateL.size() ; i++){
				if(queryZUpdateL.get(i) != "") {Boolean OK2 = db.eseguiAggiornamento(queryZUpdateL.get(i));}
			}
			if(queryInsert != "") {Boolean OK3 = db.eseguiAggiornamento(queryInsert);}
			for(int i = 0 ; i < queryUpdateL.size() ; i++){
				if(queryUpdateL.get(i) != "") {Boolean OK4 = db.eseguiAggiornamento(queryUpdateL.get(i));}
			}
			for(int i = 0 ; i < queryDeleteL.size() ; i++){
				if(queryDeleteL.get(i) != "") {Boolean OK5 = db.eseguiAggiornamento(queryDeleteL.get(i));}
			}
			for(int i = 0 ; i < queryZDeleteL.size() ; i++){
				if(queryZDeleteL.get(i) != "") {Boolean OK6 = db.eseguiAggiornamento(queryZDeleteL.get(i));}
			}
			if(queryNameUpdate != "") {Boolean OK7 = db.eseguiAggiornamento(queryNameUpdate);}		
			
			//Disconnessione
			db.disconnetti();
		}
	}

	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}

}