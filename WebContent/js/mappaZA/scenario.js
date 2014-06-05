/**
 * STORE PER LO SCENARIO
 */

var numS = 1;
//array per la gestione del panel Scenario
var myDataScenari = [];
var store_scenario = Ext.create('Ext.data.ArrayStore', {
	// autoLoad: true,
	// autoSync: true,
	fields : [{
		name : 'scenario'
	}, {
		name : 'fid'
	}],
	data : myDataScenari,
	listeners : {
		// Attivazione dei comandi per le zone solo con scenari aperti
		datachanged : function() {
			var scenAp = this.getCount();
			zoneSel = Ext.getCmp('zoneSel');
	        if(scenAp > 0){
	        	if(typeof zoneSel != 'undefined'){
	        		if (!(zoneSel.isVisible())){
	        			addZone();
	        		}
	        		else{
	        			addZone();
	        		}
	        	}
	        }
	        else{
	        	if(typeof zoneSel != 'undefined'){
	        		if (zoneSel.isVisible()){
	        			resetZone();
	        		}
	        	}
	        }
	    }
	}
});

/**
 * GRID PANEL PER LO SCENARIO
 */

scenario = Ext.create('Ext.grid.Panel', {
	id : 'scenarioAp',
	title : 'Scenario: ',
	store : store_scenario,
	viewConfig : {
		deferEmptyText : false
	},
	emptyText : 'Nessuno scenario aperto',
	width : 250,
	dockedItems : [{
		xtype : 'toolbar',
		items : [{
			xtype : 'button',
			icon : 'img/add16x16.png',
			id : 'newScenario',
			handler : newScenario
		},{
			xtype : 'button',
			icon : 'img/open_small.png',
			id : 'openScenario',
			handler : function(){
				loadScenario(1);
			}			
		},{
			xtype : 'button',
			icon : 'img/save16x16.png',
			id : 'saveScenario'
		},{
			xtype : 'button',
			icon : 'img/modify_small.png',
			id : 'modifyScenario',
			handler : modScenario
		}]
		
	}],	
	
	columns : [{
		text : 'Scenario',
		flex : 1,
		dataIndex : 'scenario'
	}, {
		xtype : 'actioncolumn',
		width : 35,
		items : [{
			icon : 'img/del2.png',
			tooltip : 'Elimina questo scenario',
			handler : function() {
				askSave(function(){
					if(answ === 'cancel'){
						return;
					}
					else if(answ === 'no'){
						deleteScen();
					}
					else if(answ === 'yes'){
						// inserire funzione di salvataggio su file
						console.log('salvataggio eseguito');
						deleteScen();
					}
				});
			}
		}]
	}]

});

/**
 * FUNZIONE PER CREARE UN NUOVO SCENARIO
 */

function newScenario(){
	var scenAp = store_scenario.getCount();
	if(scenAp > 0){
		askSave(function(){
			if(answ === 'cancel'){
				return;
			}
			else if(answ === 'no'){
				var dataS = new Array('Scenario '+(numS++), '','');
				myDataScenari.pop();
				myDataScenari.push(dataS);
				Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
				resetZone();
				addZone();
			}
			else if(answ === 'yes'){
				// inserire funzione di salvataggio su file
				console.log('salvataggio eseguito');
				var dataS = new Array('Scenario '+(numS++), '','');
				myDataScenari.pop();
				myDataScenari.push(dataS);
				Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
				resetZone();
				addZone();
			}
		});
	}
	else{
		var dataS = new Array('Scenario '+(numS++), '','');
		myDataScenari.push(dataS);
		Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
	}
}

/**
 * carica da db in storeScenario tutti i territori dello scenario come paramentro
 * e visualizza sulla mappa
 * 
 * @param scenario
 * 
 */
function loadScenario(scenario) {
	var cdata = '';
	//prima di caricare lo scenario cancella tutti i territori
	//unselectFeatures();

	Ext.Ajax.request({
		waitMsg : 'wait...',
		url : 'http://' + constants.ip + constants.root + constants.servlet,
		params : {
			task : 'getScenario',
			scenario : scenario
		},
		success : function(response) {
			//cdata = Ext.JSON.decode(response.responseText);
		},
		callback : function(opt, success, response) {
			cdata = Ext.JSON.decode(response.responseText);

			//carico risultati query nello store scenario
			myDataScenario = cdata;
			//store_scenario.loadData(myDataScenario,false);

			var i;

			for (i = 0; i < cdata.length; i++) {
				var fid = null;
				var type = null;
				var layer = cdata[i].tabella_territorio;
				var cod = cdata[i].tc_territorio_id;

				switch (layer) {
				case "regioni" :
					fid = "reg2011_g." + cod;
					type = "reg2011_g";
					break;
				case "province" :
					fid = "prov2011_g." + cod;
					type = "prov2011_g";
					break;
				case "comuni" :
					fid = "com2011_g." + cod;
					type = "com2011_g";
					break;
				case "Cap" :
					fid = "CapCR2006." + cod;
					type = "CapCR2006";
					break;
				}

				var request = OpenLayers.Request.GET({
					url : url,
					callback : visualizzaZone,
					params : {
						REQUEST : "GetFeature",
						srsName : "EPSG:900913",
						SERVICE : "WFS",
						VERSION : "1.1.0",
						TYPENAME : "mmasgis:" + type,
						featureID : fid,
						colore : cdata[i].colore
					}
				});

			}


			//SOLUZIONE PROVA 
			//caricamento nel box solo di zona x
			//myDataScenario ordinato per zone

			var zona="2";

			//trova colore e nome di zona x colore
			var colore,nome;
			for (index=0; index< myDataScenario.length && myDataScenario[index]["zona_id"] <= zona ;index++){
				if (myDataScenario[index]["zona_id"] ==  zona){
					colore=myDataScenario[index]["colore"];
					nome = myDataScenario[index]["nome"];
					break;
				}
			}			
			ZonaSelezionata=new Array(zona,nome,colore);
			stileColore = {
					strokeColor : '#ffffff',
					fillColor : '#' + ZonaSelezionata[2],
					// fillColor : '#3FF87F',
					fillOpacity : 0.65,
					strokeWidth : 0.7,
					cursor : 'crosshair'
			};

			//carico zona 
			LoadZonaInBox(ZonaSelezionata[0]);
		}
	});
}

/**
 * FUNZIONE PER AZZERARE LE ZONE DOPO LA CREAZIONE DI UN NUOVO SCENARIO
 */

function resetZone(){
	zoneSel.hide();
	panelZA.remove(zoneSel, false);
	store_zone_selected.removeAll();
	myDataZone = [];
	numZ = 1;
}


/**
 * FUNZIONE PER ATTIVARE I COMANDI PER LE ZONE
 */

function addZone(){
	panelZA.add(zoneSel);
	zoneSel.show();
}


/**
 * FUNZIONE PER ELIMINARE LO SCENARIO APERTO
 */

function deleteScen(){
	myDataScenari.pop();
	Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
	resetZone();
}


/**
 * FUNZIONI PER MODIFICARE IL NOME DELLO SCENARIO
 */

function modScenario(){
	modScen(doModScen);
}

function modScen(callback){
	Ext.Msg.show({
		title : 'Modifica scenario',
		msg : 'Specifica il nuovo nome:',
		buttons : Ext.Msg.OKCANCEL,
		buttonText: {ok: 'Fatto', cancel: 'Annulla'},
		prompt  : { maxlength : 30, autocapitalize : false },
		value : myDataScenari[0][0],
		fn : function(btn, text){
			if (btn === 'ok'){
	    	 	callback(text);
			}
			else if(btn === 'cancel'){
				return;
			}
		}
	});
}

function doModScen(text){
	var nome = text;
	var dataS = new Array(nome, '','');
	myDataScenari.pop();
	myDataScenari.push(dataS);
	Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
}

/**
 * funzione che estrare il valore del parametro dall'url
 * 
 * 
 * @param URL
 * @param parametro
 */
function GetURLParameter(URL,parametro)
{
	var sPageURL = URL;
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) 
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == parametro) 
		{
			return sParameterName[1];
		}
	}
}

//funzione che visualizza sul layer vettoriale la risposta di GeoServer
function visualizzaZone(request) {

	console.log(request);
	var gml = new OpenLayers.Format.GML.v3();
	gml.extractAttributes = true;
	var features = gml.read(request.responseText);

	//estraggo colore
	var colore = GetURLParameter(request.responseXML.URL,"colore");
	var stileColore=null;
	//copia feature dalla risposta di geoserver
	var feat=features[0];

	//se nel parametri ce il colore...crea stile ed aggiungilo alla feature
	if (colore!=null){		
		stileColore = {
				strokeColor : '#ffffff',
				fillColor : '#'+colore,
				// fillColor : '#3FF87F',
				fillOpacity : 0.65,
				strokeWidth : 0.7,
				cursor : 'crosshair'
		};
		feat.style=stileColore;
	}

	//aggiungi alla mappa
	if (contains(select.features, features[0]) == false) {
		//aggiungi feature al layer select
		select.addFeatures(feat);
	}

	//aggiungi il controllo
	if (hash_contains(selectionControl.features, features[0]) == false) {
		selectionControl.features[features[0].fid] = features[0];
	}
}