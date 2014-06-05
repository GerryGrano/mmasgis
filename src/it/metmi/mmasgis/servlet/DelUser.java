package it.metmi.mmasgis.servlet;

import java.io.PrintWriter;
import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class DelUser extends Task 
{
	DBManager db;
	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		String id_utente = request.getParameter("id");
		
		String del_query = "DELETE FROM utente WHERE utente_id ='"+id_utente+"'"; 
		
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		if(db.connetti())
		{
			if(db.eseguiAggiornamento(del_query))
				System.out.println("L'utente è stato eliminato corretamente");
			
			db.disconnetti();
		}

	}

}
