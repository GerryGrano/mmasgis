package it.metmi.mmasgis.util;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Vector;

/**
 * Classe dedicata alla gestione del Database.
 * <p>
 * Gestisce l'apertura e la chiusura della connessione col Database. Fornisce i
 * metodi per l'esecuzione delle query sul Database.
 * 
 */
public class DBManager{

	// CAMPI
	/**
	 * Nome del database a cui connettersi
	 */
	private String nomeDB; // Nome del Database a cui connettersi

	/**
	 * Nome utente utilizzato per la connessione al database
	 */
	private String username; // Nome utente utilizzato per la connessione al DB

	/**
	 * Password usata per la connessione al database
	 */
	private String password; // Password usata per la connessione al DB

	/**
	 * Stringa che contiene informazioni sull'errore sollevato
	 */
	private String errore; // Raccoglie info su errore sollevato

	/**
	 * Connessione al database
	 */
	private Connection db; // La connessione col Database

	/**
	 * Flag che indica se la connessione è attiva
	 */
	private boolean connesso; // Flag che indica se la connessione e' attiva

	/**
	 * Costruttore della classe
	 * 
	 * @param nomeDB
	 *            nome del database
	 */
	public DBManager(String nomeDB) {
		this(nomeDB, "", "");
	}
	public DBManager(String nomeUtente,String pwdUtente){
		this("",nomeUtente,pwdUtente);
	}
	/**
	 * Costruttore della classe
	 * 
	 * @param nomeDB
	 *            nome del database
	 * @param nomeUtente
	 *            username dell'utente del database
	 * @param pwdUtente
	 *            password del database
	 */
	public DBManager(String nomeDB, String nomeUtente, String pwdUtente) {
		this.nomeDB = nomeDB;
		this.username = nomeUtente;
		this.password = pwdUtente;
		connesso = false;
		errore = "";
	}

	/**
	 * Metodo che apre la connessione con il Database
	 * 
	 * @return boolean TRUE se la connessione è stabilita con successo, FALSE
	 *         altrimenti.
	 */
	/*public boolean connettiDB(){
		connesso=false;
		try{
			Class.forName("com.mysql.jdbc.Driver");
			if(nomeDB.equals("")){
				db = DriverManager.getConnection("jdbc:mysql://localhost/");
				connesso=true;
			}
		} catch (Exception e) {
			errore = e.getMessage();
			e.printStackTrace();
		}
		return connesso;
	}*/
	public boolean connetti() {
		connesso = false;
		try {
			// Carico il driver JDBC per la connessione con il database MySQL
			Class.forName("com.mysql.jdbc.Driver");
			// Controllo che il nome del Database non sia nulla
			if (!nomeDB.equals("")) {
				// Controllo se il nome utente va usato o meno per la
				// connessione
				if (username.equals("")) {
					// La connessione non richiede nome utente e password
					db = DriverManager.getConnection("jdbc:mysql://localhost/" + nomeDB);
				} else {
					// La connessione richiede nome utente, controllo se
					// necessita anche della password
					if (password.equals("")) {
						// La connessione non necessita di password
						db = DriverManager.getConnection("jdbc:mysql://localhost/" + nomeDB + "?user=" + username);
					} else {
						// La connessione necessita della password
						db = DriverManager.getConnection("jdbc:mysql://localhost/" + nomeDB + "?user=" + username
								+ "&password=" + password);
					}
				}
				// La connessione e' avvenuta con successo
				connesso = true;
			} else {
				System.out.println("Manca il nome del database!!");
				System.out.println("Scrivere il nome del DB in \"Const.java\"");
				System.exit(0);
			}
		} catch (Exception e) {
			errore = e.getMessage();
			e.printStackTrace();
		}
		return connesso;
	}

	/**
	 * Metodo che esegue la query restituendo un vettore contenente tutte le
	 * tuple
	 * 
	 * @param query
	 *            query da eseguire
	 * @return Vector<String[]> contiene il resultset della query
	 */
	public Vector<String[]> eseguiQuery(String query) {
		Vector<String[]> v = null;
		String[] record;
		int colonne = 0;
		try {
			// Creo lo Statement per l'esecuzione della query
			Statement stmt = db.createStatement();

			// DEBUG
			System.out.println(query);

			// Ottengo il ResultSet dell'esecuzione della query
			ResultSet rs = stmt.executeQuery(query);
			v = new Vector<String[]>();
			ResultSetMetaData rsmd = rs.getMetaData();
			colonne = rsmd.getColumnCount();
			// Creo il vettore risultato scorrendo tutto il ResultSet
			while (rs.next()) {
				record = new String[colonne];
				for (int i = 0; i < colonne; i++) {
					record[i] = rs.getString(i + 1);
					// System.out.println(record[i]);
				}
				v.add((String[]) record.clone());
			}
			rs.close(); // Chiudo il ResultSet
			stmt.close(); // Chiudo lo Statement
		} catch (Exception e) {
			e.printStackTrace();
			errore = e.getMessage();
		}

		return v;
	}

	/**
	 * Metodo che esegue la query restituendo un arraylist
	 * 
	 * @param query
	 *            Query da eseguire
	 * @param arrayMode
	 *            Booleano che indica di restituire i risultati in una struttura
	 *            di tipo ArrayList
	 * @return ArrayList che contiene il resultset della query
	 */
	public ArrayList<HashMap<String, String>> eseguiQuery(String query, boolean arrayMode) {

		ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();

		int colonne = 0;
		try {
			// Creo lo Statement per l'esecuzione della query
			Statement stmt = db.createStatement();

			// DEBUG
			System.out.println(query);

			// Ottengo il ResultSet dell'esecuzione della query
			ResultSet rs = stmt.executeQuery(query);
			// Ottengo i metadati del resultset
			ResultSetMetaData rsmd = rs.getMetaData();
			// prendo il numero di colonne del resultset
			colonne = rsmd.getColumnCount();

			// Creo l'arraylist scorrendo tutto il ResultSet
			while (rs.next()) {
				HashMap<String, String> pv = new HashMap<String, String>();
				for (int i = 0; i < colonne; i++) {
					String tmpVal = rs.getString(i + 1);
					String tmpCol = rsmd.getColumnLabel(i + 1);

					pv.put(tmpCol, tmpVal);
				}
				list.add(pv);

			}
			rs.close(); // Chiudo il ResultSet
			stmt.close(); // Chiudo lo Statement
		} catch (Exception e) {
			e.printStackTrace();
			errore = e.getMessage();
		}

		return list;
	}

	public ArrayList<HashMap<String, Object>> eseguiQueryObject(String query, boolean arrayMode) {

		ArrayList<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();

		int colonne = 0;
		try {
			// Creo lo Statement per l'esecuzione della query
			Statement stmt = db.createStatement();

			// DEBUG
			System.out.println(query);

			// Ottengo il ResultSet dell'esecuzione della query
			ResultSet rs = stmt.executeQuery(query);
			// Ottengo i metadati del resultset
			ResultSetMetaData rsmd = rs.getMetaData();
			// prendo il numero di colonne del resultset
			colonne = rsmd.getColumnCount();

			// Creo l'arraylist scorrendo tutto il ResultSet
			while (rs.next()) {
				HashMap<String, Object> pv = new HashMap<String, Object>();
				for (int i = 0; i < colonne; i++) {
					String tmpVal = rs.getString(i + 1);
					String tmpCol = rsmd.getColumnLabel(i + 1);

					pv.put(tmpCol, tmpVal);
				}
				list.add(pv);

			}
			rs.close(); // Chiudo il ResultSet
			stmt.close(); // Chiudo lo Statement
		} catch (Exception e) {
			e.printStackTrace();
			errore = e.getMessage();
		}

		return list;
	}
	
	public String eseguiQueryK1(String query, boolean arrayMode) {
		String result = "";
		int colonne = 0;
		try {
			// Creo lo Statement per l'esecuzione della query
			Statement stmt = db.createStatement();

			// DEBUG
			System.out.println(query);

			// Ottengo il ResultSet dell'esecuzione della query
			// ResultSet rs = stmt.executeQuery(query);
			int rs = stmt.executeUpdate(query);

			// Ottengo i metadati del resultset
			result = "ok";
			// rs.close(); // Chiudo il ResultSet
			stmt.close(); // Chiudo lo Statement
		} catch (Exception e) {
			e.printStackTrace();
			errore = e.getMessage();
			result = "error";
		}
		return result;

	}

	public ArrayList<HashMap<String, String>> eseguiQueryExcel(String query, boolean arrayMode) {

		ArrayList<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();

		int colonne = 0;
		try {
			// Creo lo Statement per l'esecuzione della query
			Statement stmt = db.createStatement();

			// DEBUG
			System.out.println(query);

			// Ottengo il ResultSet dell'esecuzione della query
			ResultSet rs = stmt.executeQuery(query);
			// Ottengo i metadati del resultset
			ResultSetMetaData rsmd = rs.getMetaData();
			// prendo il numero di colonne del resultset
			colonne = rsmd.getColumnCount();

			// Creo l'arraylist scorrendo tutto il ResultSet
			while (rs.next()) {
				HashMap<String, String> pv = new HashMap<String, String>();
				for (int i = 0; i < colonne; i++) {
					String tmpVal = rs.getString(i + 1);
					String tmpCol = rsmd.getColumnLabel(i + 1);

					// System.out.println("Val: "+tmpVal);
					// System.out.println("Col: "+tmpCol);
					if (tmpVal == null) {
						// System.out.println("Accesso ok: provo a inserire valore ");
						try {
							pv.put(tmpCol, "-");
						} catch (Exception e) {
							e.printStackTrace();
						}

					} else {
						pv.put(tmpCol, tmpVal);
					}

				}
				// System.out.println("PV: "+ pv);
				list.add(pv);
			}
			rs.close(); // Chiudo il ResultSet
			stmt.close(); // Chiudo lo Statement
		} catch (Exception e) {
			e.printStackTrace();
			errore = e.getMessage();
		}

		return list;
	}

	/**
	 * Esegue una query di aggiornamento sul Database
	 * 
	 * @param query
	 *            stringa che rappresenta un'istuzione SQL di tipo UPDATE da
	 *            eseguire
	 * @return TRUE se l'esecuzione e' andata a buon fine, FALSE se viene
	 *         sollevata un'eccezione
	 */
	public boolean eseguiAggiornamento(String query) {
		int numero = 0;
		boolean risultato = false;
		try {
			Statement stmt = db.createStatement();
			// DEBUG
			System.out.println(query);
			numero = stmt.executeUpdate(query);

			risultato = true;
			stmt.close();
		} catch (Exception e) {
			e.printStackTrace();
			errore = e.getMessage();
			risultato = false;
		}
		return risultato;
	}

	/**
	 * Chiude la connessione corrente con il database
	 */
	public void disconnetti() {
		try {
			db.close();
			connesso = false;
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Controlla lo stato della connessione con il database
	 * 
	 * @return TRUE se la connessione è aperta, FALSE altrimenti
	 */
	public boolean isConnesso() {
		return connesso;
	}

	/**
	 * Ritorna il messaggio d'errore dell'ultima eccezione sollevata
	 * 
	 * @return Stringa contenente la descrizione dell'errore
	 */
	public String getErrore() {
		return errore;
	}
}
