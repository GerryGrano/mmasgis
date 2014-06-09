package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class GetListScen extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db = new DBManager(Const.systemDB, Const.username, Const.password);

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {

		//Richiedo la sessione attiva
		HttpSession session = request.getSession(true);
				
		//Ottengo l'id dell'utente
		String user_id = (String)session.getAttribute("user_id");
		
		//Definisco la query
		String query = "SELECT scenario_id, nome, ins_data, mod_data FROM scenario "
					 + "WHERE ins_utente='" + user_id + "' "				
					 + "ORDER BY COALESCE(mod_data, ins_data) DESC ";

		if (db.connetti()) {
			//Eseguo la query
			ArrayList<HashMap<String,String>> scenari = db.eseguiQuery(query, true);

			PrintWriter outQ = null;

			try {
				outQ = response.getWriter();
				jsonEncode(scenari, outQ);

			} catch (IOException e) {
				e.printStackTrace();
			}

			//Disconnessione
			db.disconnetti();
		}


	}

	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}

}