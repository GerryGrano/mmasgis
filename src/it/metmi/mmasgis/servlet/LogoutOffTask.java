package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Classe che si occupa di effettuare il logout dell'utente invalidando la sessione attiva
 * 
 */
public class LogoutOffTask extends Task {

	/**
	 * Invalida la sessione corrente ed effettua il redirect
	 * alla pagina di login
	 * 
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(true);

		PrintWriter out = null;
		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		String settore = LoginK1.settore;
		String offerta = LoginK1.offerta;
		System.out.println(settore+" "+offerta);
		// imposto header per la risposta http
		response.setHeader("Cache-Control", "no-cache, no-store");
		response.setHeader("Pragma", "no-cache");
		//invalido la sessione
		request.getSession().invalidate();
		System.out.println(settore+" "+offerta);
		try {
			// effettuo redirect alla pagina di login
			//response.sendRedirect("http://www.metmi.it/k1_aziende/src/offerta_inserita.php?settore="+settore+"&id_offerta="+offerta);
			response.sendRedirect("http://gis.di.unimi.it/k1-azienda/src/offerta_inserita.php?settore="+settore+"&id_offerta="+offerta);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
