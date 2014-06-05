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

public class AssegnaAgenti extends Task {

	DBManager db;

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		// TODO Auto-generated method stub

		db = new DBManager(Const.systemDB, Const.username, Const.password);
//		PrintWriter out = null;
		ArrayList<HashMap<String, String>> risultato;
		String queryAgenti = "SELECT nome_utente FROM utente WHERE ruolo_id=2";

		PrintWriter out = null;

		try {
			out = response.getWriter();
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		if(db.connetti())
		{
			risultato = db.eseguiQuery(queryAgenti, true);
			jsonEncode(risultato,out);
			db.disconnetti();
		}


	}

	private static void jsonEncode(ArrayList<HashMap<String, String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		gson.toJson(data, out);
	}



}