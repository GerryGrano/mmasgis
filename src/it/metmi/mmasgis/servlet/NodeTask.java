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

/**
 * Classe che si occupa di recuperare i territori e di restituirli sotto
 * forma di Json, per la costruzione dell'albero di selezione geografica.
 *
 */
public class NodeTask extends Task {
	
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
		String node = request.getParameter("node");
		String query="";
		
		if(node.equals("0")){
			// se il nodo è zero allora seleziono i nodi che hanno padre -1
			query = "SELECT parent_id, id, text, codice, layer, sigla, leaf FROM tree WHERE parent_id = -1 ORDER BY text";
		}else{
			// altrimenti seleziono i figli del nodo dato
			query = "SELECT parent_id, id, text, codice, layer, sigla, leaf FROM tree WHERE parent_id = "+node+" ORDER BY text";
		}
		
		if (db.connetti()) {
			// eseguo la query
			ArrayList<HashMap<String,String>> nodeList = db.eseguiQuery(query, true);
			
			// scorro i risultati
			for(int i=0; i<nodeList.size(); i++) {
				// se l'attributo leaf è 1 vuol dire che il nodo non ha figli
				// devo includere questa informazione nella risposta perchè Extjs possa creare il treePanel
				if(nodeList.get(i).get("leaf").equals("1")) {
					// setto la proprietà leaf a true
					nodeList.get(i).put("leaf","true");
					// l'icona da usare è quella che si chiama file
					nodeList.get(i).put("cls","file");
				}
				else {
					// altrimenti se il nodo ha figli, leaf è false e verrà usata l'icona folder
					nodeList.get(i).put("leaf","false");
					nodeList.get(i).put("cls","folder");
				}
			}
			PrintWriter out = null;
			try {
				out = response.getWriter();
				//codifico la risposta in json
				jsonEncode(nodeList, out);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			// disconnessione dal db
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

}
