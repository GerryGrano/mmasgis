package it.metmi.mmasgis.servlet;

import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.*;

public class ModRelRuoloPermesso extends Task 
{
	DBManager db;
	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		String id_ruolo = request.getParameter("id_ruolo");
		String id_permessi = request.getParameter("id_permessi");
		
		db = new DBManager(Const.systemDB, Const.username, Const.password);
				
		// split array permessi
		String sub = id_permessi.substring(1, id_permessi.lastIndexOf("]"));
		String[] id = sub.split(",");
		
		String query_del = "DELETE FROM rel_ruolo_permesso WHERE ruolo_id="+id_ruolo+"; ";
		String query_ins = "INSERT INTO rel_ruolo_permesso (ruolo_id, permesso_id) VALUES ";
		
		if(db.connetti())
		{	
			if(db.eseguiAggiornamento(query_del))
			{
				for(int i=0; i<id.length; i++)
				{
					if(i != id.length-1)
						query_ins += "("+id_ruolo+", "+id[i]+"), ";
					else
						query_ins += "("+id_ruolo+", "+id[i]+") ";		
			    }
				
				db.eseguiAggiornamento(query_ins);
			}
			
			db.disconnetti();
		}
	}
}
