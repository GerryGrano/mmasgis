package it.metmi.mmasgis.servlet;

import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class DelNewUser extends Task 
{	
	DBManager db;

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		String id_ruolo = request.getParameter("id_ruolo");
		String id_azienda = request.getParameter("id_azienda");
		
		Vector<String[]> ruolo_id_figlio;
		String sel_ruolo_figlio = "SELECT ruolo_id_figlio FROM distinta_ruolo WHERE ruolo_id_padre="+id_ruolo;
		
		String del_rel_ruolo_permesso = "DELETE FROM rel_ruolo_permesso WHERE ruolo_id="+id_ruolo;
		String del_distinta = "DELETE FROM distinta_ruolo WHERE ruolo_id_figlio="+id_ruolo;
		String del_utenti = "DELETE FROM utente WHERE ";
		String del_utente = "DELETE FROM utente WHERE ruolo_id="+id_ruolo;
		String del_ruoli = "DELETE FROM ruolo WHERE ";
		String del_ruolo = "DELETE FROM ruolo WHERE ruolo_id="+id_ruolo;
		String del_azienda = "DELETE FROM azienda WHERE azienda_id="+id_azienda;
		
		db = new DBManager(Const.systemDB, Const.username, Const.password);
		
		if(db.connetti())
		{
			ruolo_id_figlio = db.eseguiQuery(sel_ruolo_figlio);
			
			if(ruolo_id_figlio.isEmpty())
			{
				if(db.eseguiAggiornamento(del_rel_ruolo_permesso))
					if(db.eseguiAggiornamento(del_distinta))
						if(db.eseguiAggiornamento(del_utente))
							if(db.eseguiAggiornamento(del_ruolo))
								db.eseguiAggiornamento(del_azienda);
			}
			else
			{	
				for(int i=0; i<ruolo_id_figlio.size(); i++)
				{
					String[] ruolo = ruolo_id_figlio.elementAt(i);
					
					del_rel_ruolo_permesso += " or ruolo_id="+ruolo[0];
					del_distinta += " or ruolo_id_figlio="+ruolo[0];
					
					if(i != ruolo_id_figlio.size()-1)
					{
						del_utenti += "ruolo_id="+ruolo[0]+" or ";
						del_ruoli += "ruolo_id="+ruolo[0]+" or ";
					}
					else
					{
						del_utenti += "ruolo_id="+ruolo[0];
						del_ruoli += "ruolo_id="+ruolo[0];
					}
					
				}
				
				if(db.eseguiAggiornamento(del_rel_ruolo_permesso))
					if(db.eseguiAggiornamento(del_distinta))
						if(db.eseguiAggiornamento(del_utenti))
							if(db.eseguiAggiornamento(del_ruoli))
								if(db.eseguiAggiornamento(del_utente))
									if(db.eseguiAggiornamento(del_ruolo))
										db.eseguiAggiornamento(del_azienda);
			}
			
			db.disconnetti();
		}
	

	}

}
