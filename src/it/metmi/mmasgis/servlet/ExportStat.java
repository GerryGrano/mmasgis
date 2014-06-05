package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.ExcelExporter;

import java.io.IOException;
import java.lang.reflect.Type;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

/**
 * Classe che gestisce la creazione di file formato Excel e il riempimento del foglio
 * elettronico con i dati passati via Http
 *
 */
public class ExportStat extends Task {

	/**
	 * Date le informazioni da mettere nel file Excel (fornite in Json dal client), l'header che contiene
	 * i nomi delle colonne della tabella (anche questi in Json), e il censimento, crea il file Excel con le colonne
	 * dell'header, lo popola con i dati forniti e nomina il file secondo il formato 
	 * "estrazione_nomecensimento_dd.MM.yy.hh.mm.xls".
	 * 
	 */
	@Override
	public void doTask(HttpServletRequest request,HttpServletResponse response)
	{
		Gson gson = new GsonBuilder().create();
		
		Date now = Calendar.getInstance().getTime();
		DateFormat formatter = new SimpleDateFormat("dd.MM.yy.hh.mm");
		String today = formatter.format(now);
		
		String jsonRecord=request.getParameter("selections");
		String data_base=request.getParameter("data_base");
		String jsonHeader=request.getParameter("header");
		String censimento=request.getParameter("censimento");
		String valore=request.getParameter("valore");
		String aggregazione=request.getParameter("aggregazione");
		String commento=censimento+"\n\r"+aggregazione+": "+valore;
		//String toolbar=request.getParameter("toolbar");
		//System.err.println(toolbar);
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-Disposition", "attachment; filename=estrazione_"+ censimento +"_"+today+".xls");
		Type type=new  TypeToken<ArrayList<HashMap<String,String>>>(){}.getType();
		ArrayList<HashMap<String,String>> records=gson.fromJson(jsonRecord,type);
		Type typeBase=new  TypeToken<ArrayList<String>>(){}.getType();
		ArrayList<String> bases=gson.fromJson(data_base,typeBase);
		Type typeHeader=new  TypeToken<ArrayList<String>>(){}.getType();
		ArrayList<String> header=gson.fromJson(jsonHeader,typeHeader);
		
		ServletOutputStream outputStream = null;
		try {
			outputStream = response.getOutputStream();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		ExcelExporter e= new ExcelExporter(outputStream,bases, header,commento);
		e.exportList(records, header);
		try {
			outputStream.close();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

}
