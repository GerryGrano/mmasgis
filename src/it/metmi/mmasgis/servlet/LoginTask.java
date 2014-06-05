package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


/**
 * Classe che si occupa di gestire il login dell'utente
 *
 */
public class LoginTask extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db = new DBManager(Const.systemDB, Const.username, Const.password);

	/**
	 * Interroga il database e se username e password sono corretti
	 * crea una nuova sessione contenente lo username, un flag che indica se l'utente è admin, 
	 * e l'elenco dei censimenti autorizzati, e poi effettua redirect alla index. 
	 * Se invece esiste una sessione ancora valida, effettua direttamente
	 * il redirect alla pagina index.
	 * <p>
	 * Se invece username o password sono scorretti effettua un redirect alla pagina di login.
	 * 
	 */
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		
		
		String page = Const.errorPage;
		int aut = -2;
		int c = -2;
		
		//richiedo sessione attiva o ne creo una nuova
		HttpSession session = request.getSession(true);
		
		//controllo presenza di tutti i parametri nella richiesta
		if(!request.getParameter("username").equals("null") && !request.getParameter("user_id").equals("null")) {
			
			String username = request.getParameter("username");
			String user_id = request.getParameter("user_id");
			
			//se la sessione non è valida oppure utente o password non corrispondono a quelli della sessione
			if(session.getAttribute("username")==null || !(session.getAttribute("username").equals(username) || session.getAttribute("user_id").equals(user_id))) {
				
				//autentico utente impostando user e id nella nuova sessione
				aut = autenticaUtente(request, session);
				
			}
			
			//
			c = setCensimenti(request, response, session);
			
		}
		
		if((aut == 1 || aut==-2) && c == 1) {
			page = Const.mapPage;
			
		}
		
		//EFFETTUO REDIRECT
		try {
			request.getRequestDispatcher(page).forward(request, response);
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException io){
			io.printStackTrace();
		}
		
	}
	
	/**
	 * Autentica l'utente, se le credenziali sono corrette, impostando username, user_id e permessi nella sessione creata.
	 * 
	 * @param request
	 * @param session
	 * @return -1 in caso di errore del db, 0 in caso di credenziali non corrette, 1 in caso di autenticazione riuscita
	 */
	private int autenticaUtente(HttpServletRequest request, HttpSession session) {
		
		int r = 0;
		
		if (db.connetti()) {
			String username = request.getParameter("username");
			String user_id = request.getParameter("user_id");
			// TODO: mettere apici singoli nella query in Const: '%s'
			String query = String.format(Const.queryLogin, user_id, "'"+username+"'");
			Vector<String[]> result = db.eseguiQuery(query);	
			
			if (result.size() > 0) {
				// se la query ha risultati creo la sessione contenente lo username
				String[] s = result.firstElement();
				
				session.setAttribute("user_id", s[2]);
				session.setAttribute("username", s[1]);
				session.setAttribute("is_admin", s[0]);
				
				String permessi = "[";	
				for(int i=0;i<result.size();i++) {
					permessi = permessi + "'" + result.get(i)[4]+ "',";
				}
				permessi = (permessi.substring(0, permessi.length()-1))+"]";
				session.setAttribute("permessi", permessi);
				
				r = 1;
			}
			else {
				r = 0;
			}
			
		}
		else {
			r = -1;
		}
		
		db.disconnetti();
		
		return r;
	}

	
	/**
	 * Recupera il nome e l'ID del censimento su cui è stata effettuata l'offerta in K1
	 * 
	 * @param request
	 * @param response
	 */
	private int setCensimenti(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		int b = -1;
		
		String user_id = request.getParameter("user_id");
		String is_admin = (String)session.getAttribute("is_admin");
		
		String queryCensimenti = "";
		
		if (is_admin.equals("1")) {
			queryCensimenti = "SELECT nome_db, nome_pers, custom FROM dbmmas order by nome_pers";
		}
		else {
			queryCensimenti = "SELECT DISTINCT nome_db, nome_pers, custom FROM mmasgisDB.rel_utente_dbmmas JOIN mmasgisDB.dbmmas ON rel_utente_dbmmas.db_id=dbmmas.db_id WHERE utente_id="+ user_id+" order by nome_pers";
		}
		
		
		if(db.connetti()) {
			
			ArrayList<HashMap<String,String>> listaCensimenti = db.eseguiQuery(queryCensimenti, true);
			if(listaCensimenti.size() > 0) {
				String censimenti="[";
				for(int i=0; i<listaCensimenti.size(); i++) {
						censimenti = censimenti + "['"+listaCensimenti.get(i).get("nome_db")+"','"+listaCensimenti.get(i).get("nome_pers")+"','"+listaCensimenti.get(i).get("custom")+ "'],";
				}
				censimenti = (censimenti.substring(0, censimenti.length()-1))+"]";
				
				request.getSession().setAttribute("censimenti", censimenti);
				
				b = 1;
			} 
			else { 
				
				b = 0; 
			}
		}
		
		db.disconnetti();
		
		return b;
	}
	
}
