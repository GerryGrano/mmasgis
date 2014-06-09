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

public class ScenarioTask extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db = new DBManager(Const.systemDB, Const.username, Const.password);


	/**
	 * Estrae dal database le zone dello scenario 1
	 * come parametro HTTP
	 * <p>
	 *
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {

		// ottengo parametri da richiesta http e comverto in intero
		String scenario = request.getParameter("scenario");
		int num_scenario = Integer.parseInt(scenario);

		//compongo la query per ottenere la sigla del territorio
		//select * from rel_zona_territorio as rtz where rtz.tabella_territorio="regioni" ;
		String queryZone = "SELECT tree.text as nome_territorio,rel_zona_territorio.tabella_territorio,rel_zona_territorio.tc_territorio_id,tree.sigla,zona.zona_id,zona.nome,zona.colore "
				+ "FROM tree join rel_zona_territorio join zona  "
				+ "where mid(tree.layer,1,3)=mid(tabella_territorio,1,3)  "
				+ "and (rel_zona_territorio.tc_territorio_id -1) = tree.codice "
				+ "and zona.zona_id = rel_zona_territorio.zona_id and scenario_id = "+num_scenario+" "
				+ "order by zona.nome";
		
		System.out.println(queryZone);


		if (db.connetti()) {
			// eseguo query
			ArrayList<HashMap<String,String>> Regioni= db.eseguiQuery(queryZone, true);
			//ArrayList<HashMap<String,String>> Province= db.eseguiQuery(queryRegioni, true);
			//ArrayList<HashMap<String,String>> Comuni= db.eseguiQuery(queryRegioni, true);
			//ArrayList<HashMap<String,String>> Cap= db.eseguiQuery(queryRegioni, true);

			PrintWriter outZone = null;
			//PrintWriter outComuni = null;
			try {
				outZone = response.getWriter();
				jsonEncode(Regioni, outZone);

			} catch (IOException e) {
				e.printStackTrace();
			}

			// diconnessione
			db.disconnetti();
		}


	}

	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}

}
