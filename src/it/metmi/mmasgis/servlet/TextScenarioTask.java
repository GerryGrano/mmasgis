package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class TextScenarioTask extends Task {

	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		// TODO Auto-generated method stub
		String scenario = request.getParameter("box1");
		String zonaArray = request.getParameter("box2");
		String box = request.getParameter("box3");
		String nome = request.getParameter("filename");

		response.setContentType("text; charset=UTF-8");
		response.setHeader("Content-Disposition","attachment; filename="+nome+".txt");
		
		try {
			PrintWriter pw = response.getWriter();

			JSONArray array1 = new JSONArray(scenario);
			JSONArray array2 = new JSONArray(zonaArray);
			JSONArray array3 = new JSONArray(box);
			
			System.out.println("Scenario: "+array1);
			System.out.println("Zona: "+array2);
			System.out.println("Box: "+array3);

			
			pw.println("NomeZona\tzonaId\tColore\ttabellaTerritorio\tnomeTerritorio\tterritorioId\tAgente");
			
			for(int i = 0; i < array3.length(); i++ ) {
				JSONObject ob = array3.getJSONObject(i);
				
				String zona = ob.get("nome").toString();
				String agente = "";
				System.out.println(zona);
				
				for ( int j = 0; j < array2.length(); j++) {
					JSONObject ob2 = array2.getJSONObject(j);
					if (zona.equals(ob2.get("zona").toString())) {
						agente = ob2.getString("agente");
						j = array2.length();
					}
				}
				
				pw.println(zona+"\t"+ob.get("zona_id")+"\t"+ob.get("colore")+"\t"+ob.get("tabella_territorio")+"\t"+ob.get("nome_territorio")+"\t"+ob.get("tc_territorio_id")+"\t"+agente);
				
				
			}

		} catch (IOException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
