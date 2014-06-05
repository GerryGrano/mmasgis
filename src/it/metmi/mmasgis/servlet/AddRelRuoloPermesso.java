package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AddRelRuoloPermesso extends Task 
{
	DBManager db;

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		String id_ruolo = request.getParameter("id_ruolo");
		System.out.println(id_ruolo);
		String id_permessi = request.getParameter("id_permessi");
		
		db = new DBManager(Const.systemDB, Const.username, Const.password);
				
		// split array permessi
		String sub = id_permessi.substring(1, id_permessi.lastIndexOf("]"));
		System.out.println(sub);
		String[] id = sub.split(",");
		
		String query_ins = "INSERT INTO rel_ruolo_permesso (ruolo_id, permesso_id) VALUES ";
		
		if(db.connetti())
		{	
			for(int i=0; i<id.length; i++)
			{
				if(i != id.length-1)
					query_ins += "("+id_ruolo+", "+id[i]+"), ";
				else
					query_ins += "("+id_ruolo+", "+id[i]+") ";		
		    }
			
			db.eseguiAggiornamento(query_ins);
			db.disconnetti();
		}
	}
}
