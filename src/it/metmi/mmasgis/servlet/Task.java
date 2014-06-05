package it.metmi.mmasgis.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Classe astratta che rappresenta i Task gestiti dal sistema
 *
 */
public abstract class Task {
	
	/**
	 * Metodo astratto che viene implementato nelle diverse classi che estendono la classe Task.
	 * 
	 * @param request	richiesta HTTP
	 * @param response	risposta HTTP
	 */
	public abstract void doTask(HttpServletRequest request,HttpServletResponse response);
	
	
}
