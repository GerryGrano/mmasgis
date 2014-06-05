package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class AdminUserList extends Task 
{
	DBManager db;
	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		HttpSession session = request.getSession(true);
		String utente_id = (String) session.getAttribute("user_id");
		
		ArrayList<HashMap<String,String>> az_utenti_ruolo = new ArrayList<HashMap<String,String>>();
		PrintWriter out = null;
		
		String query = "SELECT az.azienda_id, az.nome_azienda as azienda, ut.utente_id, ut.nome_utente, rl.ruolo_id, rl.nome as ruolo "
						+"FROM azienda az JOIN utente ut ON az.azienda_id = ut.azienda_id JOIN ruolo rl ON ut.ruolo_id = rl.ruolo_id "
						+"WHERE ut.ins_utente="+utente_id;
//						+" ORDER BY azienda ASC"; 		
		
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		if(db.connetti())
		{
			az_utenti_ruolo = db.eseguiQuery(query, true);
			
			try 
			{
				out = response.getWriter();
				jsonEncode(az_utenti_ruolo, out);
			} catch (IOException e) { e.printStackTrace();}
			
			db.disconnetti();
		}	
		

	}
	
	private static void jsonEncode(ArrayList<HashMap<String, String>> data, PrintWriter out) 
	{
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result = new HashMap<String, Object>();
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}

}
