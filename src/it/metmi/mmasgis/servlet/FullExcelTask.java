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
public class FullExcelTask extends Task {

	/**
	 * Dati il censimento, l'header, i parametri di ricerca e i valori dei filtri applicati,
	 * estrae l'elenco dei punti vendita (analogamente alla classe ListTask) e li inserisce in
	 * un file Excel nominato "estrazione_nomecensimento_dd.MM.yy.hh.mm.xls"
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		String censimento = request.getParameter("censimento");
		//String jsonHeader = request.getParameter("header");
		//System.out.println(jsonHeader);
		//["cod_mmas","cliente","cod_cliente","potenziale","ragione_sociale","indirizzo","cap","comune","provincia","telefono","telefono2","telefono3","codice_fiscale","titolare","email","fax","sito"]

		
		//STAMPO PARAMETRI RICEVUTI
		//System.out.println("RECUPERO check selected: ");
		//System.out.println(request.getParameter("check"));
		//System.out.println(request.getParameter("parametri"));
		//System.out.println(request.getParameter("potenziali"));
		//System.out.println(request.getParameter("marche"));
		String checkSelectedHeader = "";
		String checkSelectedQuery = "";
		try{
		if(request.getParameterMap().containsKey("checkHeader") && !request.getParameter("checkHeader").equals("")) {
			checkSelectedHeader = "";
			checkSelectedHeader = request.getParameter("checkHeader");
			//String[] checkSelected = request.getParameter("check").split(",");
			//System.out.println(checkSelectedHeader);
		}
		if(request.getParameterMap().containsKey("checkQuery") && !request.getParameter("checkQuery").equals("")) {
			checkSelectedQuery = "";
			checkSelectedQuery = request.getParameter("checkQuery");
			checkSelectedQuery += ",";
			//String[] checkSelected = request.getParameter("check").split(",");
			//System.out.println(checkSelectedQuery);
		}
		//checkSelectedQuery = checkSelectedQuery.substring(0,checkSelectedQuery.length());
		//checkSelectedQuery += " ";
		//prova per calcolo potenziale 
		/*String potSel="";
		if(request.getParameterMap().containsKey("potenziali") && !request.getParameter("potenziali").equals("")) {
			String[] pot = request.getParameter("potenziali").split("\\|");
			//potSel = potSel + " AND (";
			for(String s:pot) {
				String[] p = s.split(",");
				potSel = potSel +"SQL_CALC_FOUND_ROWS IF(rel_pv_pot.tc_clpot_id="+pot[1]+", rel_pv_pot.valore, NULL) AS potenziale,";
				//SQL_CALC_FOUND_ROWS IF(rel_pv_pot.tc_clpot_id='+"%s"+', rel_pv_pot.valore, NULL) AS potenziale,
			}
			potSel = potSel.substring(0, potSel.length()-3) + " )";
		}
		*/
		}catch(Exception e){
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		//jsonHeader = "";
		String querySearch = "";
		if (request.getParameterMap().containsKey("search")) {
			querySearch = ListTask.getQuerySearch(request
					.getParameter("search"));
		}

		Gson gson = new GsonBuilder().create();
		Type typeHeader = new TypeToken<ArrayList<String>>() {
		}.getType();
		//ArrayList<String> header = gson.fromJson(jsonHeader, typeHeader);
		ArrayList<String> header = new ArrayList<String>();
		String[] headerArr = checkSelectedHeader.split(",");

		if(!checkSelectedHeader.isEmpty()){
				for(int i = 0;i<headerArr.length;i++)
				{
					header.add(headerArr[i]);	
				}
			}
		//System.out.println(header);

		Date now = Calendar.getInstance().getTime();
		DateFormat formatter = new SimpleDateFormat("dd.MM.yy.hh.mm");
		String today = formatter.format(now);
		
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-Disposition","attachment; filename=estrazione_"+censimento+"_"+today+".xls");
		DBManager db = new DBManager(censimento, Const.username, Const.password);
		String query = " ";
		String querySelections = " ";
		try {
			//String checkSelectedQuery = "a,b,c";
			//Riceve dati in post relativi alla selezione utente	
			//la "select all" ti tutti i parametri 
			 query = String.format(Const.queryBaseExcel, checkSelectedQuery,
					ListTask.getJoinExcel(request))
					+ " WHERE ( "
					+ ListTask.selezioneGeografica(request)
					+ " ) "
					+ ListTask.getValoriExcel(request)
					//+ querySearch
					+ " GROUP BY p.pv_id ORDER BY nome1 ASC";
				
			 //QUERY per diverse selezioni 
			 String select = ListTask.getSelectExcelElement(request);		 
			 querySelections = String.format(Const.querySelExcel,select,
						ListTask.getJoinExcel(request))
						+ " WHERE ( "
						+ ListTask.selezioneGeografica(request)
						+ " ) "
			 			+ ListTask.getValoriExcel(request);
						//+ querySearch
						//+ " GROUP BY p.pv_id,"+select;
			 
			 ArrayList<HashMap<String, String>> pvList = null;
			 ArrayList<HashMap<String, String>> attributeList = null;

			 if (db.connetti()) {
					pvList = db.eseguiQueryExcel(query, true);
					db.disconnetti();
				}
			 if (db.connetti()) {
					attributeList = db.eseguiQueryExcel(querySelections, true);
					db.disconnetti();
				}
			//COMPONIMENTO TUPLE
				//righe tabella
				ArrayList<HashMap<String, String>> pvRow = new ArrayList<HashMap<String, String>>();
				String cod_mmas = "",pvCod_mmas = "",clmar_id = "", attrMar = "";
				String marche = "",
						marche1 = "",marche2 = "",marche3 = "",marche4 = "",marche5 = "",marche6 = "",
						marche7 = "",marche8 = "",marche9 = "",marche10 = "",marche11 = "",marche12 = "";
				//x ogni classe id di ogni pv --> id: valore1, valore2,..  
			 	
			 	HashMap<String, String> pvVal = new HashMap<String, String>();

				int cont = 0,i = 0,j = 0;
				
				for (i=0; i < pvList.size(); i++) {
					HashMap<String, String> rowData = new HashMap<String, String>();

					cod_mmas = "";pvCod_mmas = "";clmar_id = ""; attrMar = "";
					marche = "";
					marche1 = "";marche2 = "";marche3 = "";marche4 = "";marche5 = "";marche6 = "";
					marche7 = "";marche8 = "";marche9 = "";marche10 = "";marche11 = "";marche12 = "";
					
					pvCod_mmas = pvList.get(i).get("cod_mmas");
					rowData.put("cod_mmas", pvCod_mmas);
					
					for (j=0; j < attributeList.size(); j++) {
						
						cod_mmas = attributeList.get(j).get("cod_mmas");
						clmar_id = attributeList.get(j).get("clmar_id");
						attrMar = attributeList.get(j).get("marche");
						//System.out.println("Prelevo valori:cod/id/attr "+cod_mmas+"/"+clmar_id+"/"+attrMar);

						if( pvCod_mmas.equals(cod_mmas) && !attrMar.isEmpty() && !clmar_id.isEmpty()) 
						{
							if(Integer.parseInt(clmar_id) == 1){
								marche1 += attrMar+",";
							}else if(Integer.parseInt(clmar_id) == 2){
								marche2 += attrMar+",";
							}else if(Integer.parseInt(clmar_id) == 3){
								marche3 += attrMar+",";
							}
							marche = marche1 + marche2 + marche3;
							marche = marche.substring(0,marche.length()-1);
						}	
					}//fine for annidato pv_cod_mmas --> tab marche
					
					//compongo campi tabella
					String cosmetica1 = "";
					
						int contMar = 0;int contMar3 = 0;
						String[] cosmetica = marche.split(",");
						
						if(cosmetica.length>2){
							for(int k = 0;k<3 ;k++)
								{
								
								contMar3++;
								if(!cosmetica[k].isEmpty() && cosmetica.length!=2){
									contMar++;
									cosmetica1 = "cosmetica"+contMar;
									//ROWDATA
									rowData.put(cosmetica1, cosmetica[k]); 
									System.out.println("inserito elemento "+contMar+" :"+cosmetica[k]);
									
								}
								
							}
						}else if(cosmetica.length==2){
							for(int k = 0;k<2 ;k++)
							{
								contMar++;
								cosmetica1 = "cosmetica"+contMar;
								//ROWDATA
								rowData.put("cosmetica1", cosmetica[k]);
								System.out.println("inserito elemento "+contMar+" :"+cosmetica[k]);

							}
							rowData.put("cosmetica3", "-");
							System.out.println("inserito elemento length 2 :"+rowData.get("cosmetica1")+" - "+rowData.get("cosmetica2"));

						}
						else if(!marche1.isEmpty())
						{
							System.out.println(marche1);
							rowData.put("cosmetica1", marche1);
							rowData.put("cosmetica2", "-");
							rowData.put("cosmetica3", "-");
						}else{
							rowData.put("cosmetica1", "-");
							rowData.put("cosmetica2", "-");
							rowData.put("cosmetica3", "-");
						}
							
					
					System.out.println(marche);
					pvRow.add(rowData);
					//System.out.println(rowData);
				}//fine ciclo for pv
				
				//pvVal.put(pvCod_mmas, marche); inserisco elementi all'interno dell'arraylist
				//header2 deve avere dei campi specifici --> per mar: mar1 mar2 mar3 mar.length(di ogni pv)
				header.add("cod_mmas");
				String cosmeticaHeader = "cosmetica1,cosmetica2,cosmetica3"; 
				String[] headerMar1 = cosmeticaHeader.split(",");
					for(int m = 0;m<headerMar1.length;m++)
					{	
						header.add(headerMar1[m]);	
					}
			//invio 
					
					
					ArrayList<String> headerPRO = new ArrayList<String>();
					headerPRO.add("ciao");
					headerPRO.add("alba");
					
					HashMap<String, String> map = new HashMap<String, String>();
					HashMap<String, String> map2 = new HashMap<String, String>();

					map.put("ciao","alby");
					map.put("alba","chiara");
					map2.put("ciao","aaa");
					map2.put("alba","ccc");
					
					ArrayList<HashMap<String, String>> pvRowPRO = new ArrayList<HashMap<String, String>>();
					pvRowPRO.add(map);
					pvRowPRO.add(map2);
					
					//export(pvRowPRO, response, headerPRO);		
			export(pvRow, response, header);
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
			HttpServletResponse out, ArrayList<String> header) {
		ServletOutputStream outputStream = null;
		try {
			outputStream = out.getOutputStream();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		// se e' richiesto un filtro di sicuro sara' presente almeno una tra
		// questiparametri(parametri, marche,potenziali)
		//ExcelExporter excel = new ExcelExporter(outputStream, header);
		//excel.exportList(data, header);
	}
}
