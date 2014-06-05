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


public class RoleList extends Task 
{
	DBManager db;
	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		HttpSession session = request.getSession(true);
		
		String azienda_id = (String) session.getAttribute("azienda_id");
		String ruolo_id = (String) session.getAttribute("ruolo_id");
		
		ArrayList<HashMap<String,String>> ruoli = new ArrayList<HashMap<String,String>>();
		PrintWriter out = null;
		
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		String query = "SELECT DISTINCT nome as ruolo, ruolo_id "
						+ "FROM ruolo join distinta_ruolo on ruolo_id=ruolo_id_figlio "
						+ "WHERE ruolo_id_padre="+ruolo_id+" AND azienda_id="+azienda_id;
		
		if(db.connetti())
		{
			
			ruoli = db.eseguiQuery(query, true);
			
			try 
			{
				out = response.getWriter();
				jsonEncode(ruoli, out);
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
