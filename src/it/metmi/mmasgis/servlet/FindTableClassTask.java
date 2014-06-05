package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class FindTableClassTask extends Task{

	@Override
public void doTask(HttpServletRequest request, HttpServletResponse response) {
		
		String censimento=request.getParameter("censimento");
		String [] categories={"ser","fatt","pot_az","par_az","mar_az"};
		String [] vuote=new String [5];
		DBManager db = new DBManager(censimento, Const.username, Const.password);
		PrintWriter out = null;
		for(int i=0;i<5;i++){
			if (db.connetti()) {
				ArrayList<HashMap<String,String>> classi;
				String query=String.format("SELECT COUNT(tc_cl%s_id) AS tot FROM %s.tc_cl%s",categories[i],censimento,categories[i]);
				classi=db.eseguiQuery(query, true);
				if(classi.isEmpty() || classi.get(0).get("tot").equals("0")){
					vuote[i]="0";
				}
				else{
					vuote[i]=classi.get(0).get("tot");
				}
				db.disconnetti();
			}
		}
		try {
			out = response.getWriter();
			jsonEncodeArray(vuote, out);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	private static void jsonEncodeArray(String [] data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result=new HashMap<String, Object>();
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}

}
