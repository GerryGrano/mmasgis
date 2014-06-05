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


public class UserList extends Task 
{
	DBManager db;
	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		HttpSession session = request.getSession(true);
		
		String azienda_id = (String) session.getAttribute("azienda_id");
		String utente_id = (String) session.getAttribute("user_id");
		
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		ArrayList<HashMap<String,String>> utenti_ruolo = new ArrayList<HashMap<String,String>>();
		PrintWriter out = null;
		
		String query = "SELECT ut.utente_id, ut.nome_utente, rl.nome as ruolo, zn.nome as zona "
						+"FROM zona zn JOIN rel_utente_zona ruz ON zn.zona_id=ruz.zona_id RIGHT JOIN utente ut ON ruz.utente_id=ut.utente_id "
							+"JOIN ruolo rl ON ut.ruolo_id = rl.ruolo_id  "
						+"WHERE ut.azienda_id="+azienda_id+" AND ut.ins_utente="+utente_id
						+" ORDER BY ut.utente_id ASC; "; 		
		
		
		if(db.connetti())
		{
			utenti_ruolo = db.eseguiQuery(query, true);
			
			for(int i=0; i<utenti_ruolo.size(); i++)
			{
				if(utenti_ruolo.get(i).get("zona") == null)
					utenti_ruolo.get(i).put("zona", "Nessuna");
			}
			
			try 
			{
				out = response.getWriter();
				jsonEncode(utenti_ruolo, out);
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
