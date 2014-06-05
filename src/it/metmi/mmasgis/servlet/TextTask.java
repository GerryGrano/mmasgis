package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;
import it.metmi.mmasgis.util.ExcelExporter;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;



public class TextTask extends Task {


	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {

		String data = request.getParameter("box");
		String nome = request.getParameter("filename");
		String agente = request.getParameter("agente");

		response.setContentType("text; charset=UTF-8");
		response.setHeader("Content-Disposition","attachment; filename="+nome+".txt");

		try {
			PrintWriter pw = response.getWriter();



			JSONArray array = new JSONArray(data);

			JSONObject ob = (JSONObject) array.get(0);

			System.out.println(ob);

			pw.println("Nome,Agente,Colore,Territorio,Layer,Tc_territorio\n");
			pw.println(ob.get("nome")+","+agente+","+ob.get("colore")+","+ob.get("nome_territorio")+","+ob.get("tabella_territorio")+","+ob.get("tc_territorio_id")+"\n");


			for( int i = 1; i < array.length(); i++ ) {
				JSONObject ob2 = (JSONObject) array.get(i);
				pw.println(" , , ,"+ob2.get("nome_territorio")+","+ob2.get("tabella_territorio")+","+ob2.get("tc_territorio_id")+"\n");
			}


		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}


}