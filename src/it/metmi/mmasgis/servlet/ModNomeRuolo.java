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

public class ModNomeRuolo extends Task 
{
	DBManager db;
	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		String id_ruolo = request.getParameter("id_ruolo");
		String mod_ruolo = request.getParameter("mod");
		
		HttpSession session = request.getSession(true);
		
		String azienda_id = (String) session.getAttribute("azienda_id");
		
		System.out.println(id_ruolo);
		System.out.println(mod_ruolo);
		System.out.println(azienda_id);
		
		String q_mod_ruolo = "UPDATE ruolo SET nome="+mod_ruolo+" WHERE ruolo_id="+id_ruolo+" AND azienda_id="+azienda_id;
		
		if(db.connetti())
		{
			db.eseguiAggiornamento(q_mod_ruolo);
			
			db.disconnetti();
		}
		

	}

}
