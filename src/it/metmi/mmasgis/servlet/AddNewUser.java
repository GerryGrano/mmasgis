package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AddNewUser extends Task 
{
	DBManager db;
	
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		HttpSession session = request.getSession(true);
		
		String azienda = request.getParameter("azienda");
		String nome_utente = request.getParameter("nome");
		String password = request.getParameter("pwd");
		String ruolo = request.getParameter("ruolo");
		
		String ins_utente = (String) session.getAttribute("user_id");
		String ruolo_id_padre = (String) session.getAttribute("ruolo_id");
		
		String query_azienda = "SELECT nome_azienda FROM azienda";
		Vector<String[]> nomi_azienda;
		boolean bool = true;
		
		String ins_azienda = "INSERT INTO azienda (nome_azienda) values ("+azienda+")";
		String sel_azienda_id = "SELECT LAST_INSERT_ID() as azienda_id ";
		
		Vector<String[]> r, permessi;
		String azienda_id = null;
		String ruolo_id = null;
		
		String ins_ruolo_permessi = "INSERT INTO rel_ruolo_permesso (ruolo_id, permesso_id) VALUES ";
				
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		if(db.connetti())
		{
			nomi_azienda = db.eseguiQuery(query_azienda);
			
			for(int i=0; i<nomi_azienda.size(); i++)
			{
				String[] nome_azienda = nomi_azienda.elementAt(i);
				String temp = "\""+nome_azienda[0]+"\"";
				
				if(temp.equalsIgnoreCase(azienda))
					bool = false;
			}
			
			/* se l'azienda non esiste ancora viene inserito il primo utente 
			con relativo ruolo e relativi permessi */
			
			if(bool)
			{
				// inserimento nuova azienda
				if(db.eseguiAggiornamento(ins_azienda))
				{
					r = db.eseguiQuery(sel_azienda_id);
					String[] s1 = r.firstElement();
					azienda_id = s1[0];
				}
				
				// inserimento primo ruolo aziendale 
				String ins_ruolo = "INSERT INTO ruolo (azienda_id, nome, ins_utente) VALUES ("+azienda_id+", "+ruolo+", "+ins_utente+")";
				String sel_ruolo_id = "SELECT LAST_INSERT_ID() as ruolo_id ";
				
				if(db.eseguiAggiornamento(ins_ruolo))
				{
					r = db.eseguiQuery(sel_ruolo_id);
					String[] s1 = r.firstElement();
					ruolo_id = s1[0];
				}
				
				// selezione e assegnamento al ruolo creato di tutti permessi esistenti 
				String sel_permessi = "SELECT permesso_id FROM permesso";
				permessi = db.eseguiQuery(sel_permessi);
				
				for(int i=0; i<permessi.size(); i++)
				{
					String[] p = permessi.elementAt(i);
					if(i != permessi.size()-1)
						ins_ruolo_permessi += "("+ruolo_id+", "+p[0]+"), ";
					else
						ins_ruolo_permessi += "("+ruolo_id+", "+p[0]+") ";
				}
				
				db.eseguiAggiornamento(ins_ruolo_permessi);
				
				//inserimento del ruolo nella distinta
				String ins_distinta = "INSERT INTO distinta_ruolo (ruolo_id_padre, ruolo_id_figlio) VALUES ("+ruolo_id_padre+", "+ruolo_id+") ";
				db.eseguiAggiornamento(ins_distinta);
				
				//inserimento utente
				String insert_utente = "INSERT INTO utente (azienda_id, nome_utente, password, ruolo_id, amministratore, ins_utente) "
										+"VALUES ("+azienda_id+", "+nome_utente+", '"+password+"', "+ruolo_id+", 1, "+ins_utente+") ";
				
				db.eseguiAggiornamento(insert_utente);
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
