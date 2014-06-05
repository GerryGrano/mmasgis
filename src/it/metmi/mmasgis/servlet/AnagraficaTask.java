package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import java.io.IOException;
import java.io.PrintWriter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.HashMap;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;




/**
 * Classe che gestisce il salvataggio e aggiornamento della scheda anagrafica
 * ANAGRAFICA
 * PARAMETRI MMAS
 * MARCHE MMAS
 * SERVIZI MMAS
 * FATTURATI
 * NOTE 
 * PARAMETRI AZIENZA
 * MARCHE AZIENDA
 */
public class AnagraficaTask extends Task {
	String censimento = "";
	String anagrafica = "";
	String mapPar="";
	String mapMar="",classMarId="",deleteMar="",mapServ="",deleteSer="";
	String note="";
	String mapParAz="",mapMarAz="",deleteMarAz="";
	/**
	 * 
	 * 
	 * 
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		censimento = request.getParameter("censimento");
		anagrafica = request.getParameter("anagrafica");
		mapPar = request.getParameter("mapPar");
		mapMar = request.getParameter("mapMar");
		deleteMar = request.getParameter("deleteMar");
		mapServ=request.getParameter("mapServ");
		deleteSer=request.getParameter("deleteSer");
		note=request.getParameter("note");
		mapParAz=request.getParameter("mapParAz");
		mapMarAz=request.getParameter("mapMarAz");
		deleteMarAz=request.getParameter("deleteMarAz");
		
		DBManager db = new DBManager(censimento, Const.username, Const.password);
		PrintWriter pw=null;
		//debug sui dai ricevuti
		System.out.println(mapPar);
		System.out.println(mapMar);
		System.out.println(deleteMar);
		System.out.println(mapServ);
		System.out.println(deleteSer);
		System.out.println(note);
		System.out.println(mapParAz);
		System.out.println(mapMarAz);
		System.out.println(deleteMarAz);
		///////////////////////////////
		String m3=null;
		String m6=null,m8=null,m10=null,m12=null;
		String m1Az=null,m3Az=null,m5Az=null;
		String [] m4=null;
		String [] m7=null;
		String [] m9=null;
		String [] m11=null;
		String [] m13=null;
		String [] m2Az=null;
		String [] m4Az=null;
		String [] m6Az=null;
		
		String m1=anagrafica.split("\\{")[1].split("\\}")[0];
		String [] m2=m1.split(",");
		/*effettuo un controllo sui dati ricevuti dal client, se sono stati inseriti uno o più valori*/
		if(!mapPar.equals("{}")){
			m3=(String) mapPar.split("\\{")[1].split("\\}")[0];
			m4=m3.split(",");
		}
		if(!mapMar.equals("[]")){
			m6=(String) mapMar.split("\\[")[1].split("\\]")[0];
			m7=m6.split(",");
		}
		if(!deleteMar.equals("[]")){
			m8=(String) deleteMar.split("\\[")[1].split("\\]")[0];
			m9=m8.split(",");
		}
		if(!mapServ.equals("[]")){
			m10=(String) mapServ.split("\\[")[1].split("\\]")[0];
			m11=m10.split(",");
		}
		if(!deleteSer.equals("[]")){
			m12=(String) deleteSer.split("\\[")[1].split("\\]")[0];
			m13=m12.split(",");
		}
		String notaFinale=note.substring(1,note.length()-1);
		if(!mapParAz.equals("{}")){
			m1Az=(String) mapParAz.split("\\{")[1].split("\\}")[0];
			m2Az=m1Az.split(",");
		}
		if(!mapMarAz.equals("[]")){
			m3Az=(String) mapMarAz.split("\\[")[1].split("\\]")[0];
			m4Az=m3Az.split(",");
		}
		if(!deleteMarAz.equals("[]")){
			m5Az=(String) deleteMarAz.split("\\[")[1].split("\\]")[0];
			m6Az=m5Az.split(",");
		}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		/*SUB TASK CHE SI OCCUPA DELL'AGGIORNAMENTO DEI DATI ANAGRAFIC*/
		//Dall'oggetto Json inviato dal client estraggo i valori corrispondenti dell'anagrafica
		String pv_id=m2[0].substring(m2[0].indexOf(":")+2,m2[0].length()-1);
		String nome1=m2[1].substring(m2[1].indexOf(":")+2,m2[1].length()-1).toUpperCase();
		String nome2=m2[2].substring(m2[2].indexOf(":")+2,m2[2].length()-1).toUpperCase();
		String cf_pi=m2[3].substring(m2[3].indexOf(":")+2,m2[3].length()-1).toUpperCase();
		String indirizzo=m2[5].substring(m2[5].indexOf(":")+2,m2[5].length()-1).toUpperCase();
		String provincia=m2[6].substring(m2[6].indexOf(":")+2,m2[6].length()-1).toUpperCase();
		String cap=m2[7].substring(m2[7].indexOf(":")+2,m2[7].length()-1);
		String comune=m2[8].substring(m2[8].indexOf(":")+2,m2[8].length()-1).toUpperCase();
		String tel1=m2[9].substring(m2[9].indexOf(":")+2,m2[9].length()-1);
		String tel2=m2[10].substring(m2[10].indexOf(":")+2,m2[10].length()-1);
		String tel3=m2[11].substring(m2[11].indexOf(":")+2,m2[11].length()-1);
		String email=m2[12].substring(m2[12].indexOf(":")+2,m2[12].length()-1);
		String fax=m2[13].substring(m2[13].indexOf(":")+2,m2[13].length()-1);
		String sito=m2[14].substring(m2[14].indexOf(":")+2,m2[14].length()-1);
		
		//accedo al DB censimento
		if (db.connetti()) {
			String queryUpdate=String.format(Const.saveAnagrafica,censimento,nome1,nome2,cf_pi,indirizzo,provincia,cap,comune,tel1,tel2,tel3,fax,sito,email,pv_id);
			//System.out.println(queryUpdate);
			ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
			ArrayList<HashMap<String, String>> exist = new ArrayList<HashMap<String, String>>();
			String queryEstrazione=String.format(Const.estrAnagrSave,censimento,pv_id);
			//System.out.println(queryEstrazione);
			//faccio l'update con "query" e subito estraggo i dati aggiornati con "queryEstr" per inviarli al client
			list=db.eseguiQuery(queryEstrazione, db.eseguiAggiornamento(queryUpdate));
			
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
			/*SUBTASK CHE SI OCCUPA DELL'AGGIORNAMENTO DEI PARAMETRI MMAS*/
			//Dall'oggetto Json inviato dal client estraggo i valori corrispondenti ai valori dei PARAMETRI
			if(m4!=null){
				for(int i=0;i<m4.length;i++){
					String [] m5=m4[i].split(":");
					String classeId=m5[0].substring(1,m5[0].length()-1);
					String id_valore=m5[1].substring(1,m5[1].length()-1);
					String queryFindExistingRecord=String.format(Const.queryFindExistingParRecord,censimento,pv_id,classeId);	
					exist=db.eseguiQuery(queryFindExistingRecord,true);
					if(!exist.isEmpty()){
						String queryUpdatePar=String.format(Const.saveParAnagrafica,censimento,id_valore,pv_id,classeId);
						boolean update=db.eseguiAggiornamento(queryUpdatePar);
						System.out.println(update);
					}
					else{
						String insertParAnagrafica=String.format(Const.insertParAnagrafica,censimento,pv_id,id_valore,classeId);
						boolean insert=db.eseguiAggiornamento(insertParAnagrafica);
						System.out.println(insert);
					}
				}
			}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/*SUBTASK CHE SI OCCUPA DELL'AGGIUNTA DI UNA NUOVA MARCA MMAS*/
			if(m7!=null){
				String mar_id=null,class_mar_id = null;
				for(int i=0,j=1,k=2;i<m7.length && j<m7.length && k<m7.length;i+=3,j+=3,k+=3){
					mar_id=m7[i];
					class_mar_id=m7[k];					
					//System.out.println("marid: "+mar_id);	
					//System.out.println("classmarid: "+class_mar_id);				
					if(mar_id!=null && class_mar_id!=null){
						String mar="mar";
						ArrayList<HashMap<String,String>> maxOrd= new ArrayList<HashMap<String,String>>();
						String queryCount=String.format(Const.maxOrdine,censimento,mar,mar,class_mar_id,pv_id);
						maxOrd=db.eseguiQuery(queryCount,true);
						//System.out.println("ordine: "+maxOrd.get(0).get("maxOrdine"));
						Integer ordine=Integer.parseInt(maxOrd.get(0).get("maxOrdine"));
						//una volta ottenuto l'ordine massimo lo incremento di 1 per inserire il nuovo record
						ordine++;
						String queryInsertAnagrafica=String.format(Const.insertMarAnagrafica,censimento,pv_id,class_mar_id,ordine,mar_id);
						boolean insert=db.eseguiAggiornamento(queryInsertAnagrafica);
						System.out.println(insert);
						//AGGIORNO IL VALORE DI "USO" NELLA TABELLA rel_pv_mar PER OGNI MARCA INSERITA
						String ord_id="SELECT ordine,tc_mar_id AS marcaId FROM "+censimento+".rel_pv_mar WHERE pv_id="+pv_id+" AND tc_clmar_id="+class_mar_id;
						ArrayList<HashMap<String,String>> ord_id_list= new ArrayList<HashMap<String,String>>();
						ord_id_list=db.eseguiQuery(ord_id,true);
						//scorro la lista ottenuta per ottenere la corrispondenza tra ordine e marcaId per poi interrogare 
						//la tabella percMark in mmasgisDB e avere i valori di "Uso" e inserirli nella tab rel_pv_mar
						for(int q=0;q<ord_id_list.size();q++){
							String marcaId=ord_id_list.get(q).get("marcaId");
							String currentOrd=ord_id_list.get(q).get("ordine");
							String queryChangeUso=String.format(Const.changeUsoMar,censimento,ordine,currentOrd,"",pv_id,class_mar_id,marcaId);
							boolean changeUso=db.eseguiAggiornamento(queryChangeUso);
							System.out.println(changeUso);
						}
					}
				}
			}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/*SUBTASK CHE SI OCCUPA DELL'ELIMINAZIONE DI UNA MARCA MMAS*/
			if(m9!=null){
				for(int i=0,j=1;i<m9.length && j<m9.length;i+=2,j+=2){
					String cl_mar_id=m9[i];
					String mar_id=m9[j];
					String queryDelete=String.format(Const.deleteMarAnagrafica,censimento,pv_id,cl_mar_id,mar_id);
					boolean deleted=db.eseguiAggiornamento(queryDelete);
					System.out.println(deleted);
					//AGGIORNO IL VALORE DI "USO" NELLA TABELLA rel_pv_mar PER OGNI MARCA ELIMINATA
					String mar="mar";
					ArrayList<HashMap<String,String>> maxOrd= new ArrayList<HashMap<String,String>>();
					String queryCount=String.format(Const.maxOrdine,censimento,mar,mar,cl_mar_id,pv_id);
					maxOrd=db.eseguiQuery(queryCount,true);
					//System.out.println("ordine: "+maxOrd.get(0).get("maxOrdine"));
					Integer ordine=Integer.parseInt(maxOrd.get(0).get("maxOrdine"));
					String ord_id="SELECT ordine,tc_mar_id AS marcaId FROM "+censimento+".rel_pv_mar WHERE pv_id="+pv_id+" AND tc_clmar_id="+cl_mar_id;
					ArrayList<HashMap<String,String>> ord_id_list= new ArrayList<HashMap<String,String>>();
					ord_id_list=db.eseguiQuery(ord_id,true);
					//scorro la lista ottenuta per ottenere la marcaId per poi interrogare 
					//la tabella percMark in mmasgisDB e avere i valori di "Uso" e inserirli nella tab rel_pv_mar aggiornata dopo l'eliminazione
					for(int k=0;k<ord_id_list.size();k++){
						String marcaId=ord_id_list.get(k).get("marcaId");
						String ord=",ordine="+(k+1);
						String queryChangeUso=String.format(Const.changeUsoMar,censimento,ordine,(k+1),ord,pv_id,cl_mar_id,marcaId);
						boolean changeUso=db.eseguiAggiornamento(queryChangeUso);
						System.out.println(changeUso);
					}
				}
			}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/*SUBTASK CHE SI OCCUPA DELL'AGGIUNTA DI UN NUOVO SERVIZIO MMAS*/
			if(m11!=null){
				String ser="ser";
				String ser_id=null,class_ser_id = null;
				for(int i=0,j=1,k=2;i<m11.length && j<m11.length && k<m11.length;i+=3,j+=3,k+=3){
					ser_id=m11[i];
					class_ser_id=m11[k];					
					//System.out.println("servid: "+ser_id);	
					if(ser_id!=null && class_ser_id!=null){
						ArrayList<HashMap<String,String>> maxOrd= new ArrayList<HashMap<String,String>>();
						String queryCount=String.format(Const.maxOrdine,censimento,ser,ser,class_ser_id,pv_id);
						maxOrd=db.eseguiQuery(queryCount,true);
						Integer ordine=Integer.parseInt(maxOrd.get(0).get("maxOrdine"));
						//una volta ottenuto l'ordine massimo lo incremento di 1 per inserire il nuovo record
						ordine++;
						String queryInsertAnagrafica=String.format(Const.insertSerAnagrafica,censimento,pv_id,class_ser_id,ordine,ser_id);
						boolean insert=db.eseguiAggiornamento(queryInsertAnagrafica);
						System.out.println(insert);
						//AGGIORNO IL VALORE DI "USO" NELLA TABELLA rel_pv_ser PER OGNI MARCA INSERITA
						String ord_id="SELECT ordine,tc_ser_id AS servizioId FROM "+censimento+".rel_pv_ser WHERE pv_id="+pv_id+" AND tc_clser_id="+class_ser_id;
						ArrayList<HashMap<String,String>> ord_id_list= new ArrayList<HashMap<String,String>>();
						ord_id_list=db.eseguiQuery(ord_id,true);
						//scorro la lista ottenuta per ottenere la corrispondenza tra ordine e servizioId per poi interrogare 
						//la tabella percMark in mmasgisDB e avere i valori di "Uso" e inserirli nella tab rel_pv_ser
						for(int q=0;q<ord_id_list.size();q++){
							String servizioId=ord_id_list.get(q).get("servizioId");
							String currentOrd=ord_id_list.get(q).get("ordine");
							String queryChangeUso=String.format(Const.changeUsoSer,censimento,ordine,currentOrd,"",pv_id,class_ser_id,servizioId);
							boolean changeUso=db.eseguiAggiornamento(queryChangeUso);
							System.out.println(changeUso);
						}
					}
				}
			}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/*SUBTASK CHE SI OCCUPA DELL'ELIMINAZIONE DI UN SERVIZIO MMAS*/
			if(m13!=null){
				for(int i=0,j=1;i<m13.length && j<m13.length;i+=2,j+=2){
					String cl_ser_id=m13[i];
					String ser_id=m13[j];
					String queryDelete=String.format(Const.deleteSerAnagrafica,censimento,pv_id,cl_ser_id,ser_id);
					boolean deleted=db.eseguiAggiornamento(queryDelete);
					System.out.println(deleted);
					//AGGIORNO IL VALORE DI "USO" NELLA TABELLA rel_pv_mar PER OGNI MARCA ELIMINATA
					String ser="ser";
					ArrayList<HashMap<String,String>> maxOrd= new ArrayList<HashMap<String,String>>();
					String queryCount=String.format(Const.maxOrdine,censimento,ser,ser,cl_ser_id,pv_id);
					maxOrd=db.eseguiQuery(queryCount,true);
					Integer ordine=Integer.parseInt(maxOrd.get(0).get("maxOrdine"));
					String ord_id="SELECT ordine,tc_ser_id AS servizioId FROM "+censimento+".rel_pv_ser WHERE pv_id="+pv_id+" AND tc_clser_id="+cl_ser_id;
					ArrayList<HashMap<String,String>> ord_id_list= new ArrayList<HashMap<String,String>>();
					ord_id_list=db.eseguiQuery(ord_id,true);
					//scorro la lista ottenuta per ottenere la marcaId per poi interrogare 
					//la tabella percMark in mmasgisDB e avere i valori di "Uso" e inserirli nella tab rel_pv_mar aggiornata dopo l'eliminazione
					for(int k=0;k<ord_id_list.size();k++){
						String servizioId=ord_id_list.get(k).get("servizioId");
						String ord=",ordine="+(k+1);
						String queryChangeUso=String.format(Const.changeUsoSer,censimento,ordine,(k+1),ord,pv_id,cl_ser_id,servizioId);
						boolean changeUso=db.eseguiAggiornamento(queryChangeUso);
						System.out.println(changeUso);
					}
				}
			}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/*SUBTASK PER IL SALVATAGGIO/AGGIORNAMENTO DELLE NOTE*/
			notaFinale=notaFinale.replace("\\n", "\n");
			String queryNota=String.format(Const.saveNoteAnagrafica,censimento,notaFinale,pv_id);
			boolean saveNota=db.eseguiAggiornamento(queryNota);
			System.out.println(saveNota);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/*SUBTASK CHE SI OCCUPA DELL'AGGIORNAMENTO DEI PARAMETRI AZIENDA MMAS*/
			//Dall'oggetto Json inviato dal client estraggo i valori corrispondenti ai valori dei PARAMETRI AZIENDA
			if(m2Az!=null){
				for(int i=0;i<m2Az.length;i++){
					String [] mAz=m2Az[i].split(":");
					String classeId=mAz[0].substring(1,mAz[0].length()-1);
					String id_valore=mAz[1].substring(1,mAz[1].length()-1);
					String queryFindExistingRecord=String.format(Const.queryFindExistingParAzRecord,censimento,pv_id,classeId);	
					exist=db.eseguiQuery(queryFindExistingRecord,true);
					if(!exist.isEmpty()){
						String queryUpdateParAz=String.format(Const.saveParAzAnagrafica,censimento,id_valore,pv_id,classeId);
						boolean update=db.eseguiAggiornamento(queryUpdateParAz);
						System.out.println(update);
					}
					else{
						String insertParAzAnagrafica=String.format(Const.insertParAzAnagrafica,censimento,pv_id,id_valore,classeId);
						boolean insert=db.eseguiAggiornamento(insertParAzAnagrafica);
						System.out.println(insert);
					}
				}
			}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
			/*SUBTASK CHE SI OCCUPA DELL'AGGIUNTA DI UNA NUOVA MARCA AZIENDA MMAS*/
			if(m4Az!=null){
				String mar_az_id=null,class_mar_az_id = null;
				for(int i=0,j=1,k=2;i<m4Az.length && j<m4Az.length && k<m4Az.length;i+=3,j+=3,k+=3){
					mar_az_id=m4Az[i];
					class_mar_az_id=m4Az[k];					
					//System.out.println("marid: "+mar_id);	
					//System.out.println("classmarid: "+class_mar_id);				
					if(mar_az_id!=null && class_mar_az_id!=null){
						String mar_az="mar_az";
						ArrayList<HashMap<String,String>> maxOrd= new ArrayList<HashMap<String,String>>();
						String queryCount=String.format(Const.maxOrdine,censimento,mar_az,mar_az,class_mar_az_id,pv_id);
						maxOrd=db.eseguiQuery(queryCount,true);
						//System.out.println("ordine: "+maxOrd.get(0).get("maxOrdine"));
						Integer ordine=Integer.parseInt(maxOrd.get(0).get("maxOrdine"));
						//una volta ottenuto l'ordine massimo lo incremento di 1 per inserire il nuovo record
						ordine++;
						String queryInsertAnagrafica=String.format(Const.insertMarAzAnagrafica,censimento,pv_id,class_mar_az_id,ordine,mar_az_id);
						boolean insert=db.eseguiAggiornamento(queryInsertAnagrafica);
						System.out.println(insert);
						//AGGIORNO IL VALORE DI "USO" NELLA TABELLA rel_pv_mar_az PER OGNI MARCA INSERITA
						String ord_id="SELECT ordine,tc_mar_az_id AS marcaAzId FROM "+censimento+".rel_pv_mar_az WHERE pv_id="+pv_id+" AND tc_clmar_az_id="+class_mar_az_id;
						ArrayList<HashMap<String,String>> ord_id_list= new ArrayList<HashMap<String,String>>();
						ord_id_list=db.eseguiQuery(ord_id,true);
						//scorro la lista ottenuta per ottenere la corrispondenza tra ordine e marcaId per poi interrogare 
						//la tabella percMark in mmasgisDB e avere i valori di "Uso" e inserirli nella tab rel_pv_mar
						for(int q=0;q<ord_id_list.size();q++){
							String marcaAzId=ord_id_list.get(q).get("marcaAzId");
							String currentOrd=ord_id_list.get(q).get("ordine");
							String queryChangeUso=String.format(Const.changeUsoMarAz,censimento,ordine,currentOrd,"",pv_id,class_mar_az_id,marcaAzId);
							boolean changeUso=db.eseguiAggiornamento(queryChangeUso);
							System.out.println(changeUso);
						}
					}
				}
			}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			/*SUBTASK CHE SI OCCUPA DELL'ELIMINAZIONE DI UNA MARCA AZIENDA MMAS*/
			if(m6Az!=null){
				for(int i=0,j=1;i<m6Az.length && j<m6Az.length;i+=2,j+=2){
					String cl_mar_az_id=m6Az[i];
					String mar_az_id=m6Az[j];
					String queryDelete=String.format(Const.deleteMarAzAnagrafica,censimento,pv_id,cl_mar_az_id,mar_az_id);
					boolean deleted=db.eseguiAggiornamento(queryDelete);
					System.out.println(deleted);
					//AGGIORNO IL VALORE DI "USO" NELLA TABELLA rel_pv_mar PER OGNI MARCA ELIMINATA
					String mar_az="mar_az";
					ArrayList<HashMap<String,String>> maxOrd= new ArrayList<HashMap<String,String>>();
					String queryCount=String.format(Const.maxOrdine,censimento,mar_az,mar_az,cl_mar_az_id,pv_id);
					maxOrd=db.eseguiQuery(queryCount,true);
					//System.out.println("ordine: "+maxOrd.get(0).get("maxOrdine"));
					Integer ordine=Integer.parseInt(maxOrd.get(0).get("maxOrdine"));
					String ord_id="SELECT ordine,tc_mar_az_id AS marcaAzId FROM "+censimento+".rel_pv_mar_az WHERE pv_id="+pv_id+" AND tc_clmar_az_id="+cl_mar_az_id;
					ArrayList<HashMap<String,String>> ord_id_list= new ArrayList<HashMap<String,String>>();
					ord_id_list=db.eseguiQuery(ord_id,true);
					//scorro la lista ottenuta per ottenere la marcaId per poi interrogare 
					//la tabella percMark in mmasgisDB e avere i valori di "Uso" e inserirli nella tab rel_pv_mar_az aggiornata dopo l'eliminazione
					for(int k=0;k<ord_id_list.size();k++){
						String marcaId=ord_id_list.get(k).get("marcaAzId");
						String ord=",ordine="+(k+1);
						String queryChangeUso=String.format(Const.changeUsoMarAz,censimento,ordine,(k+1),ord,pv_id,cl_mar_az_id,marcaId);
						boolean changeUso=db.eseguiAggiornamento(queryChangeUso);
						System.out.println(changeUso);
					}
				}
			}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			try {
				pw = response.getWriter();
				jsonEncode(list, pw);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			db.disconnetti();
			
		}		
	}
	
	/**
	 * Codifica i risultati in formato JSON e invia lo stream in risposta al client
	 * 
	 * @param data ArrayList contenente i dati da codificare in Json
	 * @param out PrintWriter su cui scrivere lo stream di risposta al client
	 */
	private static void jsonEncode(ArrayList<HashMap<String,String>> data, PrintWriter out) {
		Gson gson = new GsonBuilder().create();
		HashMap<String, Object> result=new HashMap<String, Object>();
		result.put("results", data);
		result.put("success", true);
		gson.toJson(result, out);
	}   
	
}