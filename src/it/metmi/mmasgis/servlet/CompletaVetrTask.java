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
public class CompletaVetrTask extends Task {

	/**
	 * Invalida la sessione corrente ed effettua il redirect
	 * alla pagina di login
	 * 
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		// imposto header per la risposta http
		response.setHeader("Cache-Control", "no-cache, no-store");
		response.setHeader("Pragma", "no-cache");
		//invalido la sessione
		request.getSession().invalidate();
		try {
			// effettuo redirect alla pagina di login
			response.sendRedirect("http://gis.di.unimi.it/k1-azienda/src/vetrina_riservata_correttamente.php");
			//response.sendRedirect("http://www.metmi.it/k1_aziende/src/vetrina_riservata_correttamente.php");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}


}
