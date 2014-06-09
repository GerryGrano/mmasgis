package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


public class PrelevaZone extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db = new DBManager(Const.systemDB, Const.username, Const.password);

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {

		// ottengo parametri da richiesta http e comverto in intero
		String scenario = request.getParameter("scenario");
		int num_scenario = Integer.parseInt(scenario);

		//compongo la query per ottenere la sigla del territorio
		//select * from rel_zona_territorio as rtz where rtz.tabella_territorio="regioni" ;
		String query = "SELECT distinct(nome),zona.zona_id,colore,rel_utente_zona.utente_id,nome_utente" +
				" FROM zona left join rel_utente_zona on zona.zona_id = rel_utente_zona.zona_id left join utente on rel_utente_zona.utente_id = utente.utente_id"+
				" WHERE scenario_id = "+num_scenario;
		System.out.println(query);


		if (db.connetti()) {
			// eseguo query
			ArrayList<HashMap<String,String>> Risultati= db.eseguiQuery(query, true);
			//ArrayList<HashMap<String,String>> Province= db.eseguiQuery(queryRegioni, true);
			//ArrayList<HashMap<String,String>> Comuni= db.eseguiQuery(queryRegioni, true);
			//ArrayList<HashMap<String,String>> Cap= db.eseguiQuery(queryRegioni, true);

			PrintWriter outZone = null;
			//PrintWriter outComuni = null;
			try {
				outZone = response.getWriter();
				jsonEncode(Risultati, outZone);

			} catch (IOException e) {
				e.printStackTrace();
			}

			// diconnessione
			db.disconnetti();
		}


	}

	private static void jsonEncode(ArrayList<HashMap<String, String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}
}
