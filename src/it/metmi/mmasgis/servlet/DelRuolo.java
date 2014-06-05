package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class DelRuolo extends Task 
{
	DBManager db;

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		String id_ruolo = request.getParameter("ruolo_id");
		
		ArrayList<HashMap<String,String>> utenti = new ArrayList<HashMap<String,String>>();
		
		String query = "SELECT utente_id FROM utente WHERE ruolo_id="+id_ruolo;
		
		String del_rel_ruolo_permesso = "DELETE FROM rel_ruolo_permesso WHERE ruolo_id="+id_ruolo;
		String del_distinta_ruolo = "DELETE FROM distinta_ruolo WHERE ruolo_id_padre="+id_ruolo+" OR ruolo_id_figlio="+id_ruolo;
		String del_ruolo = "DELETE FROM ruolo WHERE ruolo_id="+id_ruolo;
		
		if(db.connetti())
		{
			utenti = db.eseguiQuery(query, true);
			if(utenti.isEmpty())
			{
				if(db.eseguiAggiornamento(del_rel_ruolo_permesso))
					if(db.eseguiAggiornamento(del_distinta_ruolo))
						db.eseguiAggiornamento(del_ruolo);
			}
			else
			{
				try {
					response.sendError(204);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			
			db.disconnetti();
		}

	}

}
