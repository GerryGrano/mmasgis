package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class addRuolo extends Task 
{
	DBManager db;

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		HttpSession session = request.getSession(true);
		
		String nome_ruolo = request.getParameter("nome_ruolo");
		String azienda_id = (String) session.getAttribute("azienda_id");
		String ins_utente = (String) session.getAttribute("user_id");
		String id_ruolo = (String) session.getAttribute("ruolo_id");
		
		ArrayList<HashMap<String,String>> ruolo_id = new ArrayList<HashMap<String,String>>();
		ArrayList<HashMap<String,String>> id_padre = new ArrayList<HashMap<String,String>>();
		PrintWriter out = null;
		
		String q_addRuolo = "INSERT INTO ruolo (nome, azienda_id, ins_utente) VALUES ("+nome_ruolo+", "+azienda_id+", "+ins_utente+") ";
		String sel_ruolo_id = "SELECT LAST_INSERT_ID() as ruolo_id ";
		String find_padre = "SELECT ruolo_id_padre FROM distinta_ruolo WHERE ruolo_id_figlio="+id_ruolo;
		
		
		if(db.connetti())
		{
			if(db.eseguiAggiornamento(q_addRuolo))
			{
				ruolo_id = db.eseguiQuery(sel_ruolo_id, true);
				String new_ruolo_id = ruolo_id.get(0).get("ruolo_id");
				
				String add_distinta_ruolo = "INSERT INTO distinta_ruolo (ruolo_id_padre, ruolo_id_figlio) VALUES ("+id_ruolo+", "+new_ruolo_id+")";
				
				id_padre = db.eseguiQuery(find_padre, true);
				
				if(id_padre.isEmpty())
					db.eseguiAggiornamento(add_distinta_ruolo);
				for(int i=0; i<id_padre.size(); i++)
				{
					add_distinta_ruolo += ", ("+id_padre.get(i).get("ruolo_id_padre")+", "+new_ruolo_id+")";
				}
				
				db.eseguiAggiornamento(add_distinta_ruolo);
				
				try 
				{
					out = response.getWriter();
					jsonEncode(ruolo_id, out);
				} catch (IOException e) { e.printStackTrace();}
				
			}
			db.disconnetti();
		}
		
	}
	
	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) 
	{
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}


}
