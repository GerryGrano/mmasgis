package it.metmi.mmasgis.servlet;

import it.metmi.mmasgis.util.Const;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * SERVLET
 * 
 * @version 2.1 02/06/2013
 * 
 */
@WebServlet(description = "servlet MMASGIS", urlPatterns = { "/MmasgisServlet" })
public class MmasgisServlet extends HttpServlet implements Servlet {

	private static final long serialVersionUID = 1L;
	HashMap<String, Task> taskActions;

	/**
	 * Costruttore della classe, crea un hashmap contenente tutti i nomi dei
	 * task ammessi e le rispettive classi da istanziare.
	 * <p>
	 * <code>taskActions = new HashMap<String, Task>();</code>
	 * <p>
	 * <code>taskActions.put("login", new LoginTask());</code>
	 * <p>
	 * <code>taskActions.put("excel", new ExcelTask());</code>
	 * <p>
	 * In questo modo se la servlet riceve il parametro task=login, istanzia la
	 * classe LoginTask
	 */
	public MmasgisServlet() {
		super();
		// hashmap che contiene tutti i possibili task gestiti dalla servlet
		taskActions = new HashMap<String, Task>();

		// ACCESSI
		taskActions.put("login", new LoginTask());
		taskActions.put("loginK1", new LoginK1());
		taskActions.put("logout", new LogoutTask());
		taskActions.put("logoutO", new LogoutOffTask());
		taskActions.put("logoutV", new LogoutVetrTask());

		//GESTIONE UTENTI
		taskActions.put("userList", new UserList());
		taskActions.put("roleList", new RoleList());
		taskActions.put("addUser", new AddUser());
		taskActions.put("modUser", new ModUser());
		taskActions.put("delUser", new DelUser());
		taskActions.put("permitsList", new PermitsList());
		taskActions.put("addRuolo", new addRuolo());
		taskActions.put("modNomeRuolo", new ModNomeRuolo());
		taskActions.put("delRuolo", new DelRuolo());
		taskActions.put("estraiPermessiDeiRuoli", new EstraiPermessiDeiRuoli());
		taskActions.put("modRelRuoloPermesso", new ModRelRuoloPermesso());
		taskActions.put("addRelRuoloPermesso", new AddRelRuoloPermesso());
		taskActions.put("adminUserList", new AdminUserList());
		taskActions.put("addNewUser", new AddNewUser());
		taskActions.put("delNewUser", new DelNewUser());
		taskActions.put("listaRuoloAziende", new ListaRuoloAziende());


		//PRELEVA AGENTI
		taskActions.put("getAgenti", new AssegnaAgenti() );

		//PRELEVA ZONE
		taskActions.put("getZone", new PrelevaZone() );

		// GESTIONE DATI GEOGRAFICI
		taskActions.put("getNodes", new NodeTask());
		taskActions.put("getSigla", new SiglaTask());
		taskActions.put("getFid", new FidTask());
		// DOPO SELEZIONE AREA EFFETTUA LA RICERCA DEI PUNTI VENDITA
		taskActions.put("paging", new ListTask());
		// CLASSI E VALORI
		taskActions.put("getClass", new ClassTask());
		taskActions.put("getValue", new ValueTask());
		taskActions.put("allGetClass", new AllClassTask());
		taskActions.put("findTableClassTask", new FindTableClassTask());
		// PERSONALIZZAZIONI
		taskActions.put("getClassAz", new ClassAzTask());
		taskActions.put("getValueAz", new ValueAzTask());
		// RICERCA VALORI POTENZIALI PARAMETRI MARCHE SERVIZI
		taskActions.put("potentialsList", new PotentialsList());
		taskActions.put("parametersList", new ParametersList());
		taskActions.put("brandsValues", new BrandsValuesList());
		taskActions.put("fatturatiList", new FatturatiList());
		taskActions.put("noteList", new NoteList());

		// work in progress: da fare..
		taskActions.put("servicesValues", new ServicesValuesList());
		// PERSONALIZZAZIONI
		taskActions.put("potentialsListAz", new PotentialsAziendaList());
		taskActions.put("parametersListAz", new ParametersAziendaList());
		taskActions.put("brandsValuesAz", new BrandsValuesAziendaList());
		// work in progress: da fare..
		taskActions.put("servicesValuesAz", new ServicesValuesAziendaList());
		// ANALYSIS
		taskActions.put("aggTer", new PvAnalysis());
		taskActions.put("aggTerAz", new PvAzAnalysis());
		taskActions.put("aggPar", new ParAnalysis());
		taskActions.put("brandsAnalysis", new BrandsAnalysis());
		taskActions.put("servicesAnalysis", new ServicesAnalysis());
		taskActions.put("aggTerFatt", new FattAnalysis());
		// PERSONALIZZAZIONI
		taskActions.put("aggParAz", new ParAziendaAnalysis());
		taskActions.put("brandsAnalysisAz", new BrandsAziendaAnalysis());
		// work in progress..
		taskActions.put("servicesAnalysisAz", new ServicesAziendaAnalysis());
		// K1
		taskActions.put("promoKubettONE", new PromoK());
		taskActions.put("promoKubettONEV", new PromoKV());
		taskActions.put("pvCount", new PvCount());
		taskActions.put("completaO", new CompletaOffTask());
		taskActions.put("completaV", new CompletaVetrTask());
		// work in progress: da fare..
		taskActions.put("promoTab", new promoTab());
		// EXPORT TO EXCEL
		taskActions.put("exportStat", new ExportStat());
		taskActions.put("excel", new ExcelTask());
		taskActions.put("text", new TextTask());

		// work in progress: da fare..controlli su parametri ricevuti dalla
		// finestra di dialogo
		taskActions.put("fullExcel", new FullExcelTask());
		// EXPORT TO PDF
		taskActions.put("pdfAnagrafica", new PdfTask());
		//save anagrafica
		taskActions.put("salvaAnagrafica", new AnagraficaTask());
		taskActions.put("salvaParAnagrafica", new AnagraficaParTask());
		taskActions.put("salvaMarAnagrafica", new AnagraficaMarTask());
		taskActions.put("salvaSerAnagrafica", new AnagraficaServTask());
		taskActions.put("getValuePar",new GetValueParTask());
		taskActions.put("getValueMar", new GetValueMarTask());
		taskActions.put("getValueSer", new GetValueServTask());
		taskActions.put("salvaParAzAnagrafica",new AnagraficaParAzTask());
		taskActions.put("salvaMarAzAnagrafica", new AnagraficaMarAzTask());
		taskActions.put("getValueParAz",new GetValueParAzTask());
		taskActions.put("getValueMarAz", new GetValueMarAzTask());
	}

	/**
	 * questo metodo viene chiamato quando la servlet riceve una richiesta HTTP
	 * POST, e si occupa di invocare il metodo doTask della classe
	 * corrispondente
	 * 
	 * @param request la richiesta HTTP
	 * @param response la risposta HTTP
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
	IOException {
		try {
			// setto la codifica della risposta http
			response.setCharacterEncoding("utf8");

			// prendo il parametro task ricevuto via http
			String task = request.getParameter("task").toString();
			// System.out.println(task);

			// istanzio la classe relativa che si occupa di eseguire il task
			taskActions.get(task).doTask(request, response);

		} catch (NullPointerException e) {
			// se il task non e' tra i consentiti, reindirizzo ad una pagina di
			// errore
			response.sendRedirect(Const.errorPage);
		}
	}

	/**
	 * questo metodo viene chiamato quando la servlet riceve una richiesta HTTP
	 * GET a sua volta invoca il metodo doPost
	 * 
	 * @param request
	 *            la richiesta HTTP
	 * @param response
	 *            la risposta HTTP
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		// nel caso di richieste in GET richiamo il metodo POST
		doPost(request, response);
	}
}