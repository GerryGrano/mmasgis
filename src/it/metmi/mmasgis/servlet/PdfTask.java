package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;
import it.metmi.mmasgis.util.MyPageEventListener;

import java.io.IOException;

import com.itextpdf.text.Element;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.Phrase;
//import com.itextpdf.text.pdf.PdfTable;
//import com.itextpdf.text.pdf.PdfCell;



/**
 * Classe che gestisce la creazione di file formato Excel e il riempimento del foglio
 * elettronico con i dati estratti dal database, tenendo conto della selezione
 * geografica, di eventuali filtri e di parametri di ricerca applicati
 *
 */
public class PdfTask extends Task {
	String censimento = "";
	String pv_id = "";
	String custom = "";

	/**
	 * Dati il censimento, l'header, i parametri di ricerca e i valori dei filtri applicati,
	 * estrae l'elenco dei punti vendita (analogamente alla classe ListTask) e li inserisce in
	 * un file Excel nominato "estrazione_nomecensimento_dd.MM.yy.hh.mm.xls"
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {

		censimento = request.getParameter("censimento");
		pv_id = request.getParameter("pv");
		custom = request.getParameter("custom");
		System.out.println(pv_id);
		System.out.println(censimento);
		System.out.println(custom);
		
		//METODO PER LA CREAZIONE DELLE INFO
		ArrayList<HashMap<String, String>> anagrafica = null;
		ArrayList<HashMap<String, String>> listPar = null;
		ArrayList<HashMap<String, String>> nomiPar = null;
		ArrayList<HashMap<String, String>> listMar = null;
		ArrayList<HashMap<String, String>> nomiMar = null;
		ArrayList<HashMap<String, String>> nomiSer = null;
		ArrayList<HashMap<String, String>> listSer = null;
		ArrayList<HashMap<String, String>> listPot = null;
		ArrayList<HashMap<String, String>> listParAz = null;
		ArrayList<HashMap<String, String>> nomiParAz = null;
		ArrayList<HashMap<String, String>> listMarAz = null;
		ArrayList<HashMap<String, String>> nomiMarAz = null;
		ArrayList<HashMap<String, String>> listPotAz = null;
		ArrayList<HashMap<String, String>> note = null;
		ArrayList<HashMap<String, String>> fatturati = null;
		
		DBManager db = new DBManager(censimento, Const.username, Const.password);

		try {
			
			//DATI ANAGRAFICI
			String query1 = String.format(Const.queryAnagraficaPdf, censimento, pv_id);
			//NOTE
			String query2 = String.format(Const.queryNotePdf, censimento, pv_id);
			//DATI PARAMETRI
			String query3 = String.format(Const.queryParPdf,censimento,censimento,censimento,censimento,censimento,censimento,censimento,pv_id);
			//NOMI PARAMETRI
			String query6 = String.format(Const.queryNomiParPdf,censimento);
			//DATI MARCHE
			String query4 = String.format(Const.queryMarPdf,censimento,censimento,censimento,censimento,censimento,censimento,censimento,pv_id);
			//NOMI MARCHE
			String query7 = String.format(Const.queryNomiMarPdf, censimento);
			
			//DATI POT
			String query5 = String.format(Const.queryPotPdf,censimento,censimento,censimento,censimento,pv_id);
			
			//DATI FATTURATI
			String query8 = String.format(Const.queryFatt,pv_id);
			
			//DATI SERVIZI
			String query9 = String.format(Const.queryNomiSerPdf);
			String query10 = String.format(Const.querySerPdf,pv_id);
			
			//PERSONALIZZATO
			String query11 = String.format(Const.queryPotAzPdf,censimento,censimento,censimento,censimento,pv_id);
			String query12 = String.format(Const.queryParAzPdf,censimento,censimento,censimento,censimento,censimento,censimento,censimento,pv_id);
			String query13 = String.format(Const.queryNomiParAzPdf,censimento);
			String query14 = String.format(Const.queryMarAzPdf,censimento,censimento,censimento,censimento,censimento,censimento,censimento,pv_id);
			String query15 = String.format(Const.queryNomiMarAzPdf, censimento);

			if (db.connetti()) {
				
				anagrafica = db.eseguiQuery(query1, true);
				note = db.eseguiQuery(query2, true);
				nomiPar=db.eseguiQuery(query6, true);
				listPar = db.eseguiQuery(query3, true);
				nomiMar = db.eseguiQuery(query7, true);
				listMar = db.eseguiQuery(query4, true);
				listPot = db.eseguiQuery(query5, true);
				fatturati = db.eseguiQuery(query8, true);
				nomiSer = db.eseguiQuery(query9, true);
				listSer = db.eseguiQuery(query10, true);
				if(custom.equals("1")){
					listPotAz = db.eseguiQuery(query11, true);
					nomiParAz = db.eseguiQuery(query13, true);
					listParAz = db.eseguiQuery(query12, true);
					listMarAz = db.eseguiQuery(query14, true);
					nomiMarAz = db.eseguiQuery(query15, true);
				}
				db.disconnetti();
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
		//CREAZIONE PDF
		response.setContentType("application/pdf");
        try {
            // step 1
            Document document = new Document();
            //document.setMargins(25, 25, 15, 25);
            
            // step 2
            PdfWriter writer = null;
            try {
            	writer = PdfWriter.getInstance(document, response.getOutputStream());
            } catch (IOException e1) {
    			e1.printStackTrace();
    		}
            
            //HEADER & FOOTER
            MyPageEventListener events = new MyPageEventListener(censimento);
        	writer.setPageEvent(events);
        	
            // step 3
            document.open();
                    	
            // step 4
            PdfPCell cell;
                        
        	Font Time_bold  = new Font(Font.FontFamily.TIMES_ROMAN, 12,  Font.BOLD);
        	Font Time_normal  = new Font(Font.FontFamily.TIMES_ROMAN, 12,  Font.NORMAL);
        	//Font hel_bold_big  = new Font(Font.FontFamily.HELVETICA, 14,  Font.BOLD);
        	//Font hel_bold_small  = new Font(Font.FontFamily.HELVETICA, 12,  Font.BOLD);           
     
           
            //DATI ANAGRAFICI
            PdfPTable anag = new PdfPTable(3);
            anag.setWidthPercentage(100);
            HashMap<String,String> tmp = new HashMap<String,String>();
			for (int i = 0; i < anagrafica.size(); i++) {
				tmp.putAll(anagrafica.get(i));
			}
            String[] a = new String[14];
            a[0]="Codice MMAS: "+tmp.get("codice");
            a[1]="Cliente: "+tmp.get("cliente");
            if(tmp.get("cod_cliente")==null){
            	a[2]="Codice Cliente:";
            }else{
            	a[2]="Codice cliente: "+tmp.get("cod_cliente");
            }
            if(tmp.get("ragione_sociale")==null){
            	a[3]="Ragione Sociale:";
            }else{
            	a[3]="Ragione sociale: "+tmp.get("ragione_sociale");
            }
            if(tmp.get("titolare")==null){
            	a[4]="Titolare:";
            }else{
            	a[4]="Titolare: "+tmp.get("titolare");
            }
            if(tmp.get("cf_pi")==null){
            	a[5]="Codice fiscale/P.IVA:";
            }else{
            	a[5]="Codice fiscale/P.IVA: "+tmp.get("cf_pi");
            }
            if(tmp.get("indirizzo")==null){
            	a[6]="Indirizzo:";
            }else{
            	a[6]="Indirizzo: "+tmp.get("indirizzo");
            }
            if(tmp.get("cap")==null){
            	a[7]="Cap:";
            }else{
            	a[7]="Cap: "+tmp.get("cap");
            }
            if(tmp.get("comune")==null){
            	a[8]="Comune:";
            }else{
            	a[8]="Comune: "+tmp.get("comune");
            }
            if(tmp.get("provincia")==null){
            	a[9]="Provincia:";
            }else{
            	a[9]="Provincia: "+tmp.get("provincia");
            }
            if(tmp.get("tel1")==null){
            	a[10]="Telefono:";
            }else{
            	a[10]="Telefono: "+tmp.get("tel1");
            }
            if(tmp.get("fax")==null){
            	a[11]="Fax:";
            }else{
            	a[11]="Fax: "+tmp.get("fax");
            }
            if(tmp.get("email")==null){
            	a[12]="Email:\n\r";
            }else{
            	a[12]="Email: "+tmp.get("email")+"\n\r";
            }
            if(tmp.get("sito")==null){
            	a[13]="Sito Internet:\n\r";
            }else{
            	a[13]="Sito Internet: "+tmp.get("sito")+"\n\r";
            }
              
            cell = new PdfPCell((new Phrase("DATI ANAGRAFICI",Time_bold)));
            cell.setColspan(3);
            cell.setBorder(0);
            cell.setBorderWidthBottom((float)0.2);
            anag.addCell(cell);
            for(int i=0;i<a.length;i++){
            	Phrase ph = new Phrase(a[i], Time_normal);
            	cell = new PdfPCell(ph);
            	cell.setBorder(0);
               	if(i==3 || i==4 || i==5 || i==6){
            		cell.setColspan(3);
            	}
            	if(i==10 || i==13){
            		cell.setColspan(2);
               	}
            	if(i==12 || i==13){
            		cell.setBorderWidthBottom((float)0.2);
            	}
            	anag.addCell(cell);
            }
            document.add(anag);
            
            //NOTE 
            
            tmp.clear();
            PdfPTable not = new PdfPTable(1);
            not.setWidthPercentage(100);
			for (int i = 0; i < note.size(); i++) {
				tmp.putAll(note.get(i));
			}
			String nt = tmp.get("note");
			cell = new PdfPCell((new Phrase("\nNOTE",Time_bold)));
            cell.setBorder(0);
            cell.setBorderWidthBottom((float)0.2);
            not.addCell(cell);
            if(nt!=null){
            	Phrase ph = new Phrase(nt, Time_normal);
        		cell = new PdfPCell(ph);
        		cell.setBorder(0);
        		not.addCell(cell);
        	}
        	document.add(not);
        	

            //PARAMETRI
            Iterator<HashMap<String, String>> i = nomiPar.iterator();
            Iterator<HashMap<String, String>> i2 = listPar.iterator();
            Map<String, String>r;
            Map<String, String>r2;
            ArrayList<String> nome = new ArrayList<String>();
            ArrayList<String> nome2 = new ArrayList<String>();
            ArrayList<String> valore = new ArrayList<String>();
            while (i.hasNext()) {
    			r = i.next();
    			nome.add(r.get("testo"));
    		}
        	while (i2.hasNext()) {
    			r2 = i2.next();
    			nome2.add(r2.get("nome"));
    			valore.add(r2.get("valore"));
    		}
        	PdfPTable para = new PdfPTable(2);
            para.setWidthPercentage(100);
            cell = new PdfPCell((new Phrase("\nPARAMETRI MMAS",Time_bold)));
            cell.setColspan(2);
            cell.setBorder(0);
            cell.setBorderWidthBottom((float)0.2);
            para.addCell(cell);
        	for(int j = 0; j<nome.size(); j++){
        		for(int k=0; k<nome2.size(); k++){
        			if(nome.get(j).equals(nome2.get(k))){
        				cell = new PdfPCell(new Phrase(nome.get(j), Time_normal));
        				cell.setBorder(0);
        				para.addCell(cell);
        				cell = new PdfPCell(new Phrase(valore.get(k), Time_normal));
        				cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        				cell.setIndent(10);
        				cell.setBorder(0);
        				para.addCell(cell);
        				break;
        			}else{
        				if(!(nome.get(j).equals(nome2.get(k))) && k == nome2.size()-1){
        					cell = new PdfPCell(new Phrase(nome.get(j), Time_normal));
        					cell.setBorder(0);
        					para.addCell(cell);
        					cell = new PdfPCell(new Phrase(" "));
        					cell.setBorder(0);
        					para.addCell(cell);
        				}
        			}
        		}
        	}
        	if(nome2.size()==0){
        		for(int k=0; k<nome.size(); k++){
					cell = new PdfPCell(new Phrase(nome.get(k), Time_normal));
					cell.setBorder(0);
					para.addCell(cell);
					cell = new PdfPCell(new Phrase(" "));
					cell.setBorder(0);
					para.addCell(cell);
        		}
        	}
        	
            document.add(para);
            

            //MARCHE
            Iterator<HashMap<String, String>> iter = nomiMar.iterator();
            Iterator<HashMap<String, String>> iter2 = listMar.iterator();
            Map<String, String>map;
            Map<String, String>map2;
            ArrayList<String> text = new ArrayList<String>();
            ArrayList<String> text2 = new ArrayList<String>();
            ArrayList<String> val = new ArrayList<String>();
            while (iter.hasNext()) {
    			map = iter.next();
    			text.add(map.get("testo"));
    		}
        	while (iter2.hasNext()) {
    			map2 = iter2.next();
    			text2.add(map2.get("nome"));
    			val.add(map2.get("valore"));
    		}
        	
        	PdfPTable mar = new PdfPTable(2);
            mar.setWidthPercentage(100);
            cell = new PdfPCell((new Phrase("\nMARCHE MMAS",Time_bold)));
            cell.setColspan(2);
            cell.setBorder(0);
            cell.setBorderWidthBottom((float)0.2);
            mar.addCell(cell);
        	for(int j = 0; j<text.size(); j++){
        		boolean trovato = false;
        		for(int k=0; k<text2.size(); k++){
        			if(text.get(j).equals(text2.get(k))){
        				cell = new PdfPCell(new Phrase(text.get(j), Time_normal));
        				cell.setBorder(0);
        				mar.addCell(cell);
        				cell = new PdfPCell(new Phrase(val.get(k), Time_normal));
        				cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        				cell.setIndent(10);
        				cell.setBorder(0);
        				mar.addCell(cell);
        				trovato = true;
        					
        			}else{
        				if(!(text.get(j).equals(text2.get(k))) && k == text2.size()-1 && trovato == false){
        					cell = new PdfPCell(new Phrase(text.get(j), Time_normal));
        					cell.setBorder(0);
        					mar.addCell(cell);
        					cell = new PdfPCell(new Phrase(" "));
        					cell.setBorder(0);
        					mar.addCell(cell);
        				}
        			}
        			
        		}
        	}
        	if(text2.size()==0){
        		for(int k=0; k<text.size(); k++){
					cell = new PdfPCell(new Phrase(text.get(k), Time_normal));
					cell.setBorder(0);
					mar.addCell(cell);
					cell = new PdfPCell(new Phrase(" "));
					cell.setBorder(0);
					mar.addCell(cell);
        		}
        	}
        	
            document.add(mar);

            //POTENZIALI
            PdfPTable pot = new PdfPTable(2);
            pot.setWidthPercentage(100);
            cell = new PdfPCell((new Phrase("\nPOTENZIALI MMAS",Time_bold)));
            cell.setColspan(2);
            cell.setBorder(0);
            cell.setBorderWidthBottom((float)0.2);
            pot.addCell(cell);
            Iterator<HashMap<String, String>> p = listPot.iterator();
            Map<String, String>pt;
            ArrayList<String> poten = new ArrayList<String>();
            ArrayList<String> value = new ArrayList<String>();
            while (p.hasNext()) {
    			pt = p.next();
    			poten.add(pt.get("potenziale"));
    			value.add(pt.get("valore"));
    		}
            for(int j=0; j<poten.size(); j++){
				cell = new PdfPCell(new Phrase(poten.get(j), Time_normal));
				cell.setBorder(0);
				pot.addCell(cell);
				cell = new PdfPCell(new Phrase(value.get(j), Time_normal));
				cell.setHorizontalAlignment(Element.ALIGN_CENTER);
				cell.setBorder(0);
				pot.addCell(cell);
            }
            document.add(pot);
           
            
            //SERVIZI
            Iterator<HashMap<String, String>> iterS = nomiSer.iterator();
            Iterator<HashMap<String, String>> iterS2 = listSer.iterator();
            Map<String, String>mapS;
            Map<String, String>mapS2;
            ArrayList<String> textS = new ArrayList<String>();
            ArrayList<String> textS2 = new ArrayList<String>();
            ArrayList<String> valS = new ArrayList<String>();
            while (iterS.hasNext()) {
    			mapS = iterS.next();
    			textS.add(mapS.get("testo"));
    		}
        	while (iterS2.hasNext()) {
    			mapS2 = iterS2.next();
    			textS2.add(mapS2.get("nome"));
    			valS.add(mapS2.get("valore"));
    		}
        	
        	PdfPTable ser = new PdfPTable(2);
            ser.setWidthPercentage(100);
            cell = new PdfPCell((new Phrase("\nSERVIZI",Time_bold)));
            cell.setColspan(2);
            cell.setBorder(0);
            cell.setBorderWidthBottom((float)0.2);
            ser.addCell(cell);
        	for(int j = 0; j<textS.size(); j++){
        		boolean trovato = false;
        		for(int k=0; k<textS2.size(); k++){
        			if(textS.get(j).equals(textS2.get(k))){
        				cell = new PdfPCell(new Phrase(textS.get(j), Time_normal));
        				cell.setBorder(0);
        				ser.addCell(cell);
        				cell = new PdfPCell(new Phrase(valS.get(k), Time_normal));
        				cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        				cell.setIndent(10);
        				cell.setBorder(0);
        				ser.addCell(cell);
        				trovato = true;
        					
        			}else{
        				if(!(textS.get(j).equals(textS2.get(k))) && k == textS2.size()-1 && trovato == false){
        					cell = new PdfPCell(new Phrase(textS.get(j), Time_normal));
        					cell.setBorder(0);
        					ser.addCell(cell);
        					cell = new PdfPCell(new Phrase(" "));
        					cell.setBorder(0);
        					ser.addCell(cell);
        				}
        			}
        			
        		}
        	}
        	if(textS2.size()==0){
        		for(int k=0; k<textS.size(); k++){
					cell = new PdfPCell(new Phrase(textS.get(k), Time_normal));
					cell.setBorder(0);
					ser.addCell(cell);
					cell = new PdfPCell(new Phrase(" "));
					cell.setBorder(0);
					ser.addCell(cell);
        		}
        	}
        	
            document.add(ser);
            //PERSONALIZZATO
            if(custom.equals("1")){
            	 //FATTURATI
                PdfPTable fat = new PdfPTable(2);
                fat.setWidthPercentage(100);
                cell = new PdfPCell((new Phrase("\nFATTURATI",Time_bold)));
                cell.setColspan(2);
                cell.setBorder(0);
                cell.setBorderWidthBottom((float)0.2);
                fat.addCell(cell);
                Iterator<HashMap<String, String>> f = fatturati.iterator();
                Map<String, String>ft;
                ArrayList<String> fatt = new ArrayList<String>();
                ArrayList<String> valori = new ArrayList<String>();
                while (f.hasNext()) {
        			ft = f.next();
        			fatt.add(ft.get("fatturato"));
        			valori.add(ft.get("valore"));
        		}
                for(int j=0; j<fatt.size(); j++){
    				cell = new PdfPCell(new Phrase(fatt.get(j), Time_normal));
    				cell.setBorder(0);
    				fat.addCell(cell);
    				cell = new PdfPCell(new Phrase(valori.get(j), Time_normal));
    				cell.setHorizontalAlignment(Element.ALIGN_CENTER);
    				cell.setBorder(0);
    				fat.addCell(cell);
                }
                document.add(fat);
                //PARAMETRI AZ
                Iterator<HashMap<String, String>> iAz = nomiParAz.iterator();
                Iterator<HashMap<String, String>> i2Az = listParAz.iterator();
                Map<String, String>rAz;
                Map<String, String>r2Az;
                ArrayList<String> nomeAz = new ArrayList<String>();
                ArrayList<String> nome2Az = new ArrayList<String>();
                ArrayList<String> valoreAz = new ArrayList<String>();
                while (iAz.hasNext()) {
        			rAz = iAz.next();
        			nomeAz.add(rAz.get("testo"));
        		}
            	while (i2Az.hasNext()) {
        			r2Az = i2Az.next();
        			nome2Az.add(r2Az.get("nome"));
        			valoreAz.add(r2Az.get("valore"));
        		}
            	PdfPTable paraAz = new PdfPTable(2);
                paraAz.setWidthPercentage(100);
                cell = new PdfPCell((new Phrase("\nPARAMETRI AZ",Time_bold)));
                cell.setColspan(2);
                cell.setBorder(0);
                cell.setBorderWidthBottom((float)0.2);
                paraAz.addCell(cell);
            	for(int j = 0; j<nomeAz.size(); j++){
            		for(int k=0; k<nome2Az.size(); k++){
            			if(nomeAz.get(j).equals(nome2Az.get(k))){
            				cell = new PdfPCell(new Phrase(nomeAz.get(j), Time_normal));
            				cell.setBorder(0);
            				paraAz.addCell(cell);
            				cell = new PdfPCell(new Phrase(valoreAz.get(k), Time_normal));
            				cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            				cell.setIndent(10);
            				cell.setBorder(0);
            				paraAz.addCell(cell);
            				break;
            			}else{
            				if(!(nomeAz.get(j).equals(nome2Az.get(k))) && k == nome2Az.size()-1){
            					cell = new PdfPCell(new Phrase(nomeAz.get(j), Time_normal));
            					cell.setBorder(0);
            					paraAz.addCell(cell);
            					cell = new PdfPCell(new Phrase(" "));
            					cell.setBorder(0);
            					paraAz.addCell(cell);
            				}
            			}
            		}
            	}
            	System.out.println(nome2Az.size());
            	if(nome2Az.size()==0){
            		for(int k=0; k<nomeAz.size(); k++){
    					cell = new PdfPCell(new Phrase(nomeAz.get(k), Time_normal));
    					cell.setBorder(0);
    					paraAz.addCell(cell);
    					cell = new PdfPCell(new Phrase(" "));
    					cell.setBorder(0);
    					paraAz.addCell(cell);
            		}
            	}
            	
                document.add(paraAz);
              //MARCHE AZ
                Iterator<HashMap<String, String>> iterAz = nomiMarAz.iterator();
                Iterator<HashMap<String, String>> iter2Az = listMarAz.iterator();
                Map<String, String>mapAz;
                Map<String, String>map2Az;
                ArrayList<String> textAz = new ArrayList<String>();
                ArrayList<String> text2Az = new ArrayList<String>();
                ArrayList<String> valAz = new ArrayList<String>();
                while (iterAz.hasNext()) {
        			mapAz = iterAz.next();
        			textAz.add(mapAz.get("testo"));
        		}
            	while (iter2Az.hasNext()) {
        			map2Az = iter2Az.next();
        			text2Az.add(map2Az.get("nome"));
        			valAz.add(map2Az.get("valore"));
        		}
            	
            	PdfPTable marAz = new PdfPTable(2);
                marAz.setWidthPercentage(100);
                cell = new PdfPCell((new Phrase("\nMARCHE AZ",Time_bold)));
                cell.setColspan(2);
                cell.setBorder(0);
                cell.setBorderWidthBottom((float)0.2);
                marAz.addCell(cell);
            	for(int j = 0; j<textAz.size(); j++){
            		boolean trovato = false;
            		for(int k=0; k<text2Az.size(); k++){
            			if(textAz.get(j).equals(text2Az.get(k))){
            				cell = new PdfPCell(new Phrase(textAz.get(j), Time_normal));
            				cell.setBorder(0);
            				marAz.addCell(cell);
            				cell = new PdfPCell(new Phrase(valAz.get(k), Time_normal));
            				cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            				cell.setIndent(10);
            				cell.setBorder(0);
            				marAz.addCell(cell);
            				trovato = true;
            					
            			}else{
            				if(!(textAz.get(j).equals(text2Az.get(k))) && k == text2Az.size()-1 && trovato == false){
            					cell = new PdfPCell(new Phrase(textAz.get(j), Time_normal));
            					cell.setBorder(0);
            					marAz.addCell(cell);
            					cell = new PdfPCell(new Phrase(" "));
            					cell.setBorder(0);
            					marAz.addCell(cell);
            				}
            			}
            			
            		}
            	}
            	if(text2Az.size()==0){
            		for(int k=0; k<textAz.size(); k++){
    					cell = new PdfPCell(new Phrase(textAz.get(k), Time_normal));
    					cell.setBorder(0);
    					marAz.addCell(cell);
    					cell = new PdfPCell(new Phrase(" "));
    					cell.setBorder(0);
    					marAz.addCell(cell);
            		}
            	}
            	
                document.add(marAz);
            	//POTENZIALE AZ
            	PdfPTable potAz = new PdfPTable(2);
                potAz.setWidthPercentage(100);
                cell = new PdfPCell((new Phrase("\nPOTENZIALI AZ",Time_bold)));
                cell.setColspan(2);
                cell.setBorder(0);
                cell.setBorderWidthBottom((float)0.2);
                potAz.addCell(cell);
                Iterator<HashMap<String, String>> pAz = listPotAz.iterator();
                Map<String, String>ptAz;
                ArrayList<String> potenAz = new ArrayList<String>();
                ArrayList<String> valueAz = new ArrayList<String>();
                while (pAz.hasNext()) {
        			ptAz = pAz.next();
        			potenAz.add(ptAz.get("potenziale"));
        			valueAz.add(ptAz.get("valore"));
        		}
                for(int j=0; j<potenAz.size(); j++){
    				cell = new PdfPCell(new Phrase(potenAz.get(j), Time_normal));
    				cell.setBorder(0);
    				potAz.addCell(cell);
    				cell = new PdfPCell(new Phrase(valueAz.get(j), Time_normal));
    				cell.setHorizontalAlignment(Element.ALIGN_CENTER);
    				cell.setBorder(0);
    				potAz.addCell(cell);
                }
                document.add(potAz);
            	
            }
            // step 5
           
 
            document.close();
            
        } catch (DocumentException e) {
        	e.printStackTrace();
		}
	}

	
}