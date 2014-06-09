package it.metmi.mmasgis.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Vector;

import it.metmi.mmasgis.util.Const;
import it.metmi.mmasgis.util.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Classe che si occupa di recuperare i territori e di restituirli sotto
 * forma di Json, per la costruzione dell'albero di selezione geografica.
 *
 */
public class GetFigliTask extends Task {

	/**
	 * Gestore connessione al database
	 */
	DBManager db = new DBManager(Const.systemDB, Const.username, Const.password);

	/**
	 * Ottiene dal database l'elenco dei nodi, ovvero dei territori, per
	 * la creazione della struttura ad albero contenente tutti i territori italiani.
	 *
	 */
	@Override
	public void doTask(HttpServletRequest request, HttpServletResponse response) {
		//richiedo il nodo passato come parametro della richiesta http
		String layer = request.getParameter("layer");
		String cod = request.getParameter("cod");
		String requestCod = request.getParameter("codChiamante");
		String requestLayer = request.getParameter("layerChiamante");




		if (db.connetti()) {
			// eseguo la query
			ArrayList<HashMap<String,String>> figli=null;
			ArrayList<HashMap<String,String>> temp;
			

			//se richiede provincia a regione
			if (getParentela(requestLayer,layer)==1){

				//selezioana tutte le province che non sono la richiedetne
				String query="select codice,layer "
						+ "from tree "
						+ "where tree.parent_id=(select id from tree where codice="+cod+" and layer ='"+layer+"')"
						+ " and tree.codice!="+requestCod;
				System.out.println(query);
				figli = db.eseguiQuery(query, true);
				
			}else if(getParentela(requestLayer,layer)==2){
				System.out.println("PARENTELA 2");

				String parentIDQuery="SELECT parent_id FROM mmasgisdb.tree  where codice="+requestCod+" and layer ='"+requestLayer+"'";
				System.out.println(parentIDQuery);
				String parentID = db.eseguiQuery1Result(parentIDQuery);
				
				String query="select * "
						+ "from tree "
						+ "where parent_id="+parentID+" and codice!="+requestCod+";";
				System.out.println(query);
				
				figli = db.eseguiQuery(query, true);
				
				String granPaIDQuery="SELECT parent_id FROM mmasgisdb.tree  where id='"+parentID+"'";
				String granPaID = db.eseguiQuery1Result(granPaIDQuery);
				
				query = "select * "
						+ "from tree "
						+ "where parent_id="+granPaID+" and id!="+parentID+"";
				
				temp = db.eseguiQuery(query, true);
				
				for (int i=0;i<temp.size();i++){
					figli.add(temp.get(i));
				}
				
				System.out.println("FINE PARENTELA 2");
			}else if(getParentela(requestLayer,layer)==3){
				
				
				//estraggo tutti i cap fratelli della request
				String ComuneIdQuery = "select parent_id "
						+ "from tree "
						+ "where codice="+requestCod+" and layer='"+requestLayer+"'";
				String ComuneId = db.eseguiQuery1Result(ComuneIdQuery); ;
				
				String queryCap="select * "
						+ "from tree "
						+ "where parent_id="+ComuneId+" and codice != "+requestCod;
				
				figli = db.eseguiQuery(queryCap, true);
				
				//estraggo tutti i comuni fratelli del papa di CAP
				String ProvinciaIdQuery = "select parent_id "
						+ "from tree "
						+ "where id="+ComuneId;
				String ProvinciaId = db.eseguiQuery1Result(ProvinciaIdQuery);
				
				String queryComuni="select * from tree where parent_id = "+ProvinciaId+" and id!="+ComuneId;
				
				temp = db.eseguiQuery(queryComuni, true);
				for (int i=0;i<temp.size();i++){
					figli.add(temp.get(i));
				}
				
				//estraggo tutte le province sorelle del nonno di CAP
				String RegIdQuery = "select parent_id from tree where id="+ProvinciaId;
				String RegId = db.eseguiQuery1Result(RegIdQuery);
				
				String queryProv="select * from tree where parent_id = "+RegId+" and id!="+ProvinciaId;

				temp = db.eseguiQuery(queryProv, true);
				for (int i=0;i<temp.size();i++){
					figli.add(temp.get(i));
				}
						
			}else if(getParentela(requestLayer,layer)==4){
				
				
				//estraggo tutti i cap fratelli della request
				String ComuneIdQuery = "select parent_id "
						+ "from tree "
						+ "where codice="+requestCod+" and layer='"+requestLayer+"'";
				String ComuneId = db.eseguiQuery1Result(ComuneIdQuery); ;
				
				String queryCap="select * "
						+ "from tree "
						+ "where parent_id="+ComuneId+" and codice != "+requestCod;
				
				figli = db.eseguiQuery(queryCap, true);
				
				//estraggo tutti i comuni fratelli del papa di CAP
				String ProvinciaIdQuery = "select parent_id "
						+ "from tree "
						+ "where id="+ComuneId;
				String ProvinciaId = db.eseguiQuery1Result(ProvinciaIdQuery);
				
				String queryComuni="select * from tree where parent_id = "+ProvinciaId+" and id!="+ComuneId;
				
				temp = db.eseguiQuery(queryComuni, true);
				for (int i=0;i<temp.size();i++){
					figli.add(temp.get(i));
				}
				
				//estraggo tutte le province sorelle del nonno di CAP
				String RegIdQuery = "select parent_id from tree where id="+ProvinciaId;
				String RegId = db.eseguiQuery1Result(RegIdQuery);
				
				String queryProv="select * from tree where parent_id = "+RegId+" and id!="+ProvinciaId;

				temp = db.eseguiQuery(queryProv, true);
				for (int i=0;i<temp.size();i++){
					figli.add(temp.get(i));
				}
						
			}
			
			PrintWriter out = null;
			//PrintWriter outComuni = null;
			try {
				out = response.getWriter();
				jsonEncode(figli, out);

			} catch (IOException e) {
				e.printStackTrace();
			}

			// diconnessione
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
		gson.toJson(data, out);
	}

	private static int getParentela(String Req,String Dest) {

		if (Req.equals("provincia") && Dest.equals("regione"))
			return 1;
		if (Req.equals("comune") && Dest.equals("regione"))
			return 2;
		if (Req.equals("Cap") && Dest.equals("regione"))
			return 3;
		if (Req.equals("comune") && Dest.equals("provincia"))
			return 1;
		if (Req.equals("Cap") && Dest.equals("provincia"))
			return 2;
		if (Req.equals("Cap") && Dest.equals("comune"))
			return 1;

		return 0;
	}

}
