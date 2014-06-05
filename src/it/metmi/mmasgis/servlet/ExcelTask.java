package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;
import it.metmi.mmasgis.util.ExcelExporter;

import java.io.IOException;
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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

/**
 * Classe che gestisce la creazione di file formato Excel e il riempimento del foglio
 * elettronico con i dati estratti dal database, tenendo conto della selezione
 * geografica, di eventuali filtri e di parametri di ricerca applicati
 *
 */
public class ExcelTask extends Task {

	/**
	 * Dati il censimento, l'header, i parametri di ricerca e i valori dei filtri applicati,
	 * estrae l'elenco dei punti vendita (analogamente alla classe ListTask) e li inserisce in
	 * un file Excel nominato "estrazione_nomecensimento_dd.MM.yy.hh.mm.xls"
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {

		String censimento = request.getParameter("censimento");
		String jsonHeader = request.getParameter("header");
		String search = request.getParameter("search");
		String customer=request.getParameter("customer");
		System.out.println(customer);
		String estrazione=censimento;
		String clienteSiNo;
		if(customer.equals("clienti")){
			clienteSiNo=" AND cliente=1";
		}
		else{
			if(customer.equals("no_clienti")){
				clienteSiNo=" AND cliente=0";
			}
			else{
				clienteSiNo="";
			}
			
		}
		
		String querySearch = "";
		if (request.getParameterMap().containsKey("search") && request.getParameter("search") != null) {
			querySearch = ListTask.getQuerySearch(request
					.getParameter("search"));
		}
		//System.out.println(request.getParameter("search"));
		//System.out.println(search);
		
		Gson gson = new GsonBuilder().create();
		Type typeHeader = new TypeToken<ArrayList<String>>() {
		}.getType();
		ArrayList<String> header = gson.fromJson(jsonHeader, typeHeader);
		
		Date now = Calendar.getInstance().getTime();
		DateFormat formatter = new SimpleDateFormat("dd.MM.yy.hh.mm");
		String today = formatter.format(now);
		
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-Disposition","attachment; filename=estrazione_"+censimento+"_"+today+".xls");
		DBManager db = new DBManager(censimento, Const.username, Const.password);

		try {
			String query = String.format(Const.queryBase,
					ListTask.getJoinFiltri(request))
					+ " WHERE ( "
					+ ListTask.selezioneGeografica(request)
					+ " ) "
					+ ListTask.getValoriFiltri(request)
					+ querySearch
					+ "AND p.tc_stato_id=1"+ clienteSiNo+" GROUP BY p.pv_id ORDER BY potenziale DESC";

			if (db.connetti()) {
				ArrayList<HashMap<String, String>> pvList = db.eseguiQuery(query, true);
				/*for(HashMap<String,String> t: pvList){
					Set<Entry<String,String>> entries = t.entrySet();
			        Iterator<Entry<String,String>> ite = entries.iterator();
			        while (ite.hasNext()) {
			          Entry<String,String> next = ite.next(); //next entry of the Map
			          if(next.getKey().equals("potenziale")){
			        	  double nuovo=Double.parseDouble(next.getValue());
			        	  next.setValue(String.valueOf(nuovo));
			          }
			        }*/
				/*for(int i=0;i<pvList.size();i++){
					String pot=pvList.get(i).get("potenziale");
					//System.out.println(pot);
					if(pot!=null){
						pvList.get(i).put("potenziale",String.valueOf(Double.parseDouble(pot)));
					}
				}*/
				export(pvList, response, header,estrazione);
				db.disconnetti();
			
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	/**
	 * Scrive i risultati nel file Excel e lo invia in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param header ArrayList contenente le intestazioni delle colonne della tabella
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	public void export(ArrayList<HashMap<String, String>> data,
			HttpServletResponse out, ArrayList<String> header,String estrazione) {
		ServletOutputStream outputStream = null;
		String ext=estrazione;
		try {
			outputStream = out.getOutputStream();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		ArrayList<String> base=new ArrayList<String>();
		// se e' richiesto un filtro di sicuro sara' presente almeno una tra
		// questiparametri(parametri, marche,potenziali)
		ExcelExporter excel = new ExcelExporter(outputStream,base,header,ext);
		excel.exportList(data, header);
	}
}
