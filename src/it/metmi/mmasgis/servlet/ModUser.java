package it.metmi.mmasgis.servlet;

import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ModUser extends Task 
{
	DBManager db;

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		String id_utente = request.getParameter("id");
		String nome_utente = request.getParameter("nome");
		String password = request.getParameter("pwd");
		String ruolo = request.getParameter("ruolo");
		
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		if(db.connetti())
		{
			if(password == null && ruolo == null)
			{
				String q_modutn = "UPDATE utente SET nome_utente="+nome_utente+" WHERE utente_id="+id_utente;
				if(db.eseguiAggiornamento(q_modutn));
			}
			else if(nome_utente == null && ruolo == null)
			{
				String q_modpwd = "UPDATE utente SET password='"+password+"' WHERE utente_id="+id_utente;
				if(db.eseguiAggiornamento(q_modpwd));
			}
			else if(nome_utente == null && password == null)
			{
				Vector<String[]> r1;
				String query_idruolo = "SELECT ruolo_id FROM ruolo WHERE nome ="+ruolo;
				r1 = db.eseguiQuery(query_idruolo);
				String[] s1 = r1.firstElement();
				String ruolo_id = s1[0];
				String q_modrl = "UPDATE utente SET ruolo_id='"+ruolo_id+"' WHERE utente_id="+id_utente;
				if(db.eseguiAggiornamento(q_modrl));
			}			
			else
			{
				Vector<String[]> r1;
				String query_idruolo = "SELECT ruolo_id FROM ruolo WHERE nome ="+ruolo;
				r1 = db.eseguiQuery(query_idruolo);
				String[] s1 = r1.firstElement();
				String ruolo_id = s1[0];
				
				String mod_query = "UPDATE utente SET nome_utente="+nome_utente+", password='"+password+"', ruolo_id='"+ruolo_id+"'"
									+" WHERE utente_id="+id_utente;
				
				if(db.eseguiAggiornamento(mod_query))
					System.out.println("L'utente: "+id_utente+" è stato modificato");
			}
			
			db.disconnetti();
		}		
	}

}
