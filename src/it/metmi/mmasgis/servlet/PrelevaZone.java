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

	DBManager db;

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		// TODO Auto-generated method stub

		db = new DBManager(Const.systemDB, Const.username, Const.password);
		//		PrintWriter out = null;
		ArrayList<HashMap<String, String>> risultato;

		String scenario = request.getParameter("scenario");
		int num_scenario = Integer.parseInt(scenario);

		String query = "SELECT distinct(nome),colore, rel_utente_zona.utente_id,nome_utente" +
				" FROM zona left join rel_utente_zona on zona.zona_id = rel_utente_zona.zona_id left join utente on rel_utente_zona.utente_id = utente.utente_id"+
				" WHERE scenario_id = "+num_scenario;
		System.out.println(query);

		PrintWriter out = null;

		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		if(db.connetti())
		{
			risultato = db.eseguiQuery(query, true);
			jsonEncode(risultato,out);
			db.disconnetti();
		}


	}

	private static void jsonEncode(ArrayList<HashMap<String, String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}
}
