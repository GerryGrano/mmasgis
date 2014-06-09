/**
* INIT TOOLBAR
*/


//controlla permessi per accedere a ZA

toolbar = Ext.create('Ext.toolbar.Toolbar', {
	// renderTo: document.body,
	// width : 500,
	/*SE volessi visualizzare i pulsanti in base a permessi

	listeners : {
		afterrender : function(component, eOpts) {
			checkAuth('top');

		}
	},*/
	height : 60,
	items : [ {
		xtype : 'box',
		autoEl : {
			tag : 'img',
			src : 'img/logo_mmas.png'
		},
		id : 'mmas',
		width : 110,
		height : 50,
		margin : '0 10 0 0'
	}, '-', {
		tooltip : 'Seleziona censimenti',
		width : 50,
		height : 50,
		id : 'databaseButton',
		icon : 'img/censimenti.png',
		scale : 'medium',
		margin : '0 10 0 10 ',
		handler : showCensimenti
	}, {
		id : 'sposta_button',
		width : 50,
		height : 50,
		enableToggle : true,
		tooltip : 'Sposta',
		handler : panButtonClicked,
		icon : 'img/arrowHand.png',
		scale : 'medium',
		style : 'margin:0 10px 0 55px'
	}, {
		id : 'select_button',
		width : 52,
		height : 50,
		enableToggle : true,
		tooltip : 'Seleziona',
		handler : selectButtonClicked,
		icon : 'img/arrowGrey.png',
		scale : 'medium',
		style : 'margin:0 0 0 10px'
	}, {
		id : 'reg_button',
		enableToggle : true,
		width : 52,
		height : 50,
		icon : 'img/regioni.png',
		scale : 'medium',
		handler : showRegioni
	}, {
		id : 'prov_button',
		enableToggle : true,
		width : 52,
		height : 50,
		icon : 'img/province.png',
		scale : 'medium',
		handler : showProvince
	}, {
		id : 'com_button',
		enableToggle : true,
		width : 52,
		height : 50,
		icon : 'img/comuni.png',
		scale : 'medium',
		handler : showComuni
	}, {
		id : 'cap_button',
		enableToggle : true,
		width : 52,
		height : 50,
		icon : 'img/cap.png',
		scale : 'medium',
		handler : showCap

	}, {
		id : 'deselect_button',
		tooltip : 'Deseleziona tutto',
		width : 50,
		height : 50,
		handler : unselectFeatures,
		icon : 'img/unselect.png',
		scale : 'medium',
		style : 'margin:0 0 0 10px'
	}, '-',

	/* Bottone gestione utente*/
	{
		id : 'usermng_button',
		tooltip : 'Gestione utente',
		width : 50,
		height : 50,
		icon : 'img/gestione_utente.png',
		scale : 'medium',
		style : 'margin: 0 0 0 10px',
		handler : function()
		{
			if(ruolo_id == 1)
				adminUserMng();
			else
				stdUserMng();
		}
	},

	{
		xtype : 'tbfill'
	},

	/* Bottone zone analysis*/
	{
		id : 'za_button',
		tooltip : 'Zone Analysis',
		enableToggle : true,
		width : 120,
		height : 50,
		handler : zoneAnalysis,
		icon : 'img/zone_analysis.png',
		scale : 'medium'

	},

	{
		id : 'logout_button',
		tooltip : 'Esci',
		width : 50,
		height : 50,
		handler : logout,
		icon : 'img/logout_medium.png',
		scale : 'medium'
	} ]
});

/**
* VISUALIZZA PANEL CON CENSIMENTI DISPONIBILI
*/
function showCensimenti() {

	// STORE DEI CENSIMENTI DISPONIBILI
	var store_censimenti = Ext.create('Ext.data.ArrayStore', {
		autoLoad : true,
		autoSync : true,
		fields : [ {
			name : 'nome'
		}, {
			name : 'nomePers'
		}, {
			name : 'custom'
		} ],
		data : lista_censimenti
	});

	var f = Ext
	.create(
			'Ext.grid.Panel',
			{
				id : 'gridCensimenti',
				frame : false,
				store : store_censimenti,
				height : '210',
				bodyPadding : 0,
				hideHeaders : true,
				fieldDefaults : {
					labelAlign : 'left',
					labelWidth : 90,
					anchor : '100%'
				},
				columns : [ {
					text : 'Nome',
					flex : 1,
					dataIndex : 'nome',
					hidden : true
				}, {
					text : 'Nome',
					flex : 1,
					dataIndex : 'nomePers'
				}, {
					text : 'custom',
					flex : 0,
					dataIndex : 'custom',
					hidden : true
				} ],
				listeners : {
					itemdblclick : function(dv, record, item, index, e) {

						var selection = f.getView().getSelectionModel()
						.getSelection()[0];
						// console.debug(selection.data.nome);
						showFeatures(selection.data.nome,
								selection.data.custom);
					}
				}

			});

	var w = new Ext.Window({
		resizable : false,
		width : 300,
		height : 300,
		// maximizable: true,
		// resizable : true,
		autoScroll : true,
		title : "censimenti disponibili",
		items : [ f /* ,chooseClient */],
		dockedItems : [ {
			xtype : 'toolbar',
			dock : 'bottom',
			items : [
							{
								xtype : 'tbfill'
							},
							{
								text : 'Apri',
								tooltip : 'Apri censimento',
								icon : 'img/ok.png',
								scale : 'medium',
								handler : function() {

									var selection = f.getView().getSelectionModel()
									.getSelection()[0];
									// console.debug(chooseClient.getForm().getFieldValues().liv);
									showFeatures(selection.data.nome,
											selection.data.custom);
								}
							} ]
		} ],
		listeners : {
			beforeclose : function() {

				Ext.getCmp('databaseButton').enable();
			}
		}
	});
	w.show();
	w.center();
	Ext.getCmp('databaseButton').disable();
}

/**
* ATTIVA FUNZIONI DI DRAG E PAN SULLA MAPPA
*/
function panButtonClicked() {

	Ext.getCmp('sposta_button').toggle(true);
	Ext.getCmp('select_button').toggle(false);
	dragpan.activate();
	selectionControl.deactivate();
	//loadScenario(1);
};

/**
* ATTIVA SELEZIONE SULLA MAPPA
*/
function selectButtonClicked() {

	Ext.getCmp('sposta_button').toggle(false);
	Ext.getCmp('select_button').toggle(true);
	selectionControl.activate();
	dragpan.deactivate();
};

/**
* ABILITA SELEZIONE SU REGIONI
*/
function showRegioni() {

	selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(regioni);
	Ext.getCmp('reg_button').toggle(true);
	Ext.getCmp('prov_button').toggle(false);
	Ext.getCmp('com_button').toggle(false);
	Ext.getCmp('cap_button').toggle(false);
}

/**
* ABILITA SELEZIONE SU PROVINCE
*/
function showProvince() {

	selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(province);
	Ext.getCmp('prov_button').toggle(true);
	Ext.getCmp('reg_button').toggle(false);
	Ext.getCmp('com_button').toggle(false);
	Ext.getCmp('cap_button').toggle(false);
}

/**
* ABILITA SELEZIONE SU COMUNI
*/
function showComuni() {

	selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(comuni);
	Ext.getCmp('com_button').toggle(true);
	Ext.getCmp('prov_button').toggle(false);
	Ext.getCmp('reg_button').toggle(false);
	Ext.getCmp('cap_button').toggle(false);
}

/**
* ABILITA SELEZIONE SU CAP
*/
function showCap() {

	selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(cap);
	Ext.getCmp('cap_button').toggle(true);
	Ext.getCmp('prov_button').toggle(false);
	Ext.getCmp('com_button').toggle(false);
	Ext.getCmp('reg_button').toggle(false);
}


/**
* APERTURA E CHIUSURA ZONE ANALYSIS
*/

function zoneAnalysis() {

	if (Ext.getCmp('zone_analysis_panel').isVisible()==false)
     unselectFeatures();

	panelZA = Ext.getCmp('zone_analysis_panel');
	scenarioAp = Ext.getCmp('scenarioAp');
	var scenAp = store_scenario.getCount();
	if(typeof panelZA != 'undefined'){
		if (panelZA.isVisible()){
			// Richiesta di eventuale salvataggio dei dati
			if(scenAp > 0){
				askSave(function(){
					if(answ === 'cancel'){
						return;
					}
					else if(answ === 'no'){
						closeZA(panelZA, scenarioAp);
					}
					else if(answ === 'yes'){
						// inserire funzione di salvataggio su file
						console.log('salvataggio eseguito');
						closeZA(panelZA, scenarioAp);
					}
				});
			}
			else{
				closeZA(panelZA, scenarioAp);
				enablesZAcomponent();
			}
		}
		else {
			disableZAcomponent();
			openZA(panelZA, scenarioAp);
		}
	}
}

// Apertura del pannello Zone Analysis
function openZA(panelZA, scenarioAp){
	Ext.getCmp('simplestbl').add(panelZA);
	panelZA.add(scenarioAp);
	panelZA.show();
	map.updateSize();
}

// Chiusura del pannello Zone Analysis
function closeZA(panelZA, scenarioAp){
	panelZA.hide();
	panelZA.remove(scenarioAp, false);
	if(typeof zoneSel != 'undefined'){
		panelZA.remove(zoneSel, false);
	}
	Ext.getCmp('simplestbl').remove(panelZA, false);

	// Svuotamento degli stores:
	store_scenario.removeAll();
	store_zone_selected.removeAll();
	myDataScenario = [];
	myDataZone = [];
	numS = 1;
	numZ = 1;

	map.updateSize();
}

/**
* RICHIESTA DI SALVATAGGIO DEI DATI PER ZONE ANALYSIS
*/

function askSave(callback){
	Ext.Msg.show({
			title:'Salvataggio scenario',
			msg: 'Lo scenario aperto non &#232 stato ancora salvato. Vorresti salvare su file le modifiche svolte?',
			buttons: Ext.Msg.YESNOCANCEL,
			buttonText: {yes: 'S&#236', no: 'No', cancel: 'Annulla'},
			icon: Ext.Msg.QUESTION,
			fn: function(btn){
					answ = btn;
					callback(answ);
				}
	});
}

/**
* LOGOUT
*/
function logout() {

	if (id_offerta == "" && id_vetrina == "") {

		if (confirm('Vuoi veramente effettuare il logout?'))
			window.location.href = "MmasgisServlet?task=logout";

	} else {
		if (id_offerta != "null") {
			window.location.href = "MmasgisServlet?task=logoutO";
			// location.href="http://www.metmi.it/k1_aziende/src/offerta_inserita.php?settore="+lista_censimenti[0][0]+"&id_offerta="+id_offerta;
			// location.href = "MmasgisServlet?task=logoutO";
		} else {
			if (id_vetrina != "null") {
				//location.href="http://www.metmi.it/k1_aziende/src/offerta_inserita.php?settore="+lista_censimenti[0][0]+"&id_offerta="+id_vetrina+"&vetrina=1;
				window.location.href = "MmasgisServlet?task=logoutV";
			}
		}
	}
}


/**
* DESELEZIONA TUTTO
*/
function unselectFeatures() {

  Ext.getCmp('gridSel').setTitle("Territori selezionati");
  //flag tasto deseleziona tutto = 1
  deseleziona_tutto=1;
  tot_territori_da_caricare = 0;
  tot_territori_caricati=0;
  selectionControl.unselectAll();
  myData = [];
  myDataZone = [];
  myDataBox = [];
  myDataScenario = [];
  Ext.getCmp('gridSel').getStore().loadData(myData, false);
  Ext.getCmp('zoneSel').getStore().loadData(myDataZone, false);

  //flag tasto deseleziona tutto = 0
  deseleziona_tutto=0;
  //se la zona analisi è aperta allora
  if (Ext.getCmp('zone_analysis_panel').isVisible()){
		disableZAcomponent();
	}

}
