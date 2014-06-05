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

public class PermitsList extends Task 
{
	DBManager db;

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		ArrayList<HashMap<String,String>> permits = new ArrayList<HashMap<String,String>>();
		PrintWriter out = null;
		
		String query = "SELECT permesso_id, nome, descrizione FROM permesso";
		
		if(db.connetti())
		{
			permits = db.eseguiQuery(query, true);
			
			try 
			{
				out = response.getWriter();
				jsonEncode(permits, out);
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
