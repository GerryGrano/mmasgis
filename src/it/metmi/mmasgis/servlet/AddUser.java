package it.metmi.mmasgis.servlet;

import java.io.PrintWriter;
import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AddUser extends Task 
{
	DBManager db;
	

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) 
	{
		HttpSession session = request.getSession(true);
		
		String nome_utente = request.getParameter("nome");
		String password = request.getParameter("pwd");
		String ruolo = request.getParameter("ruolo");
		String azienda_id = (String) session.getAttribute("azienda_id");
		String ins_utente = (String) session.getAttribute("user_id");
				
		db = new DBManager(Const.systemDB, Const.username, Const.password);

		Vector<String[]> r1;
		String q1_idruolo = "SELECT ruolo_id FROM ruolo WHERE azienda_id="+azienda_id+" AND nome ="+ruolo;
		
		
		if(db.connetti())
		{
			r1 = db.eseguiQuery(q1_idruolo);
			String[] s1 = r1.firstElement();
			String ruolo_id = s1[0];
			
			String insert = "INSERT INTO utente (azienda_id, nome_utente, password, ruolo_id, amministratore, ins_utente)"
					 + " VALUES ("+azienda_id+", "+nome_utente+",'"+password+"', "+ruolo_id+", 1, "+ins_utente+")";
			
			db.eseguiAggiornamento(insert);
			
			db.disconnetti();
		}

	}

}
