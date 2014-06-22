/**
 * STORE PER LO SCENARIO
 */

var numS = 1;
var id_scenario;
var loaded = false;
var saved = false;
var openAfterSaving = false;
var fine_caricamento = true;
var tot_territori_da_caricare = 0;
var tot_territori_caricati = 0;

//Lo imposto: - true quando avvengono modifiche allo scenario
//- false quando lo scenario viene salvato
var modified = false;

var nomeScenLoaded;
var lista_scenari = [];

//array per la gestione del panel Scenario
var myDataScenari = [];

//Array per il controllo delle modifiche tra scenario caricato e salvato
var myDataLoaded = [];
var myZoneLoaded = [];
//Array utili alla gestione dell'upload su DB di uno scenario
var myDataToInsert = [];
var myDataToDelete = [];
var myDataToUpdate = [];
var myZoneToInsert = [];
var myZoneToDelete = [];
var myZoneToUpdate = [];

var store_scenario = Ext.create('Ext.data.ArrayStore', {
	// autoLoad: true,
	// autoSync: true,
	fields : [{
		name : 'scenario'
	}, {
		name : 'scenario_id'
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
				openFromDB(listScenDB, winScenDB);
			}
		},{
			xtype : 'button',
			icon : 'img/save16x16.png',
			id : 'saveScenario',
			handler : function(){
				exportScenario(myDataScenari);
			}
		},{
			xtype : 'button',
			icon : 'img/modify_small.png',
			id : 'modifyScenario',
			handler : modScenario
		},{
			xtype: 'tbfill'
		},{
			xtype : 'button',
			icon : 'img/db_apply16x16.png',
			id : 'applyScenario',
			handler : function(){
				applyDB(myDataScenari, applyScen, savedCheck, id_scenario, myDataZone, myZoneLoaded);
			}		
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
						//applyDB(myDataScenari, applyScen, savedCheck, id_scenario, myDataZone, myZoneLoaded);
						exportScenario(myDataScenari,myDataZone,myDataBox);
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
	if( (scenAp > 0) && (modified == true)){
		askSave(function(){
			if(answ === 'cancel'){
				return;
			}
			else if(answ === 'no'){
				unselectFeatures();
				myDataScenari.pop();
				
				//Svuoto gli array di confronto
				var d = 0;
				var z = 0;
				var dz = 0;
				while(d < myDataLoaded.length){
					myDataLoaded.pop();
				}
				while(z < myZoneLoaded.length){
					myZoneLoaded.pop();
				}
				while(dz < myDataZone.length){
					myDataZone.pop();
				}	
				
				var dataS = new Array('Scenario '+(numS++), '','');
				myDataScenari.push(dataS);
				Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
				resetZone();
				addZone();
				loaded = false;
			}
			else if(answ === 'yes'){
				// inserire funzione di salvataggio su file
				//applyDB(myDataScenari, applyScen, savedCheck, id_scenario, myDataZone, myZoneLoaded);
				exportScenario(myDataScenari,myDataZone,myDataBox);
				console.log('salvataggio eseguito');
				
				unselectFeatures();
				myDataScenari.pop();
				
				//Svuoto gli array di confronto
				var d = 0;
				var z = 0;
				var dz = 0;
				while(d < myDataLoaded.length){
					myDataLoaded.pop();
				}
				while(z < myZoneLoaded.length){
					myZoneLoaded.pop();
				}
				while(dz < myDataZone.length){
					myDataZone.pop();
				}
				
				var dataS = new Array('Scenario '+(numS++), '','');
				myDataScenari.push(dataS);
				Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
				resetZone();
				addZone();
				loaded = false;
			}
		});
	}
	else{
		//Svuoto gli array di confronto
		var d = 0;
		var z = 0;
		var dz = 0;
		while(d < myDataLoaded.length){
			myDataLoaded.pop();
		}
		while(z < myZoneLoaded.length){
			myZoneLoaded.pop();
		}
		while(dz < myDataZone.length){
			myDataZone.pop();
		}
		myDataScenari.pop();
		
		var dataS = new Array('Scenario '+(numS++), '','');
		myDataScenari.push(dataS);
		Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
		resetZone();
		addZone();
		loaded = false;
	}
}

function openScenario(id_scenario){
	loadScen(loadScenario, id_scenario);
}

function loadScen(callback, id_scenario){
	var scenAp = store_scenario.getCount();
	if((scenAp > 0) && (modified == true)){
		askSave(function(){
			if(answ === 'cancel'){
				return;
			}
			else if(answ === 'no'){
				unselectFeatures();
				
				//Svuoto gli array di confronto
				var d = 0;
				var z = 0;
				var dz = 0;
				while(d < myDataLoaded.length){
					myDataLoaded.pop();
				}
				while(z < myZoneLoaded.length){
					myZoneLoaded.pop();
				}
				while(dz < myDataZone.length){
					myDataZone.pop();
				}
				console.log(myDataZone);
				
				
				callback(id_scenario, myDataZone, myZoneLoaded);
				resetZone();
				addZone();
			}
			else if(answ === 'yes'){
				openAfterSaving = true;
				//Inserire funzione di salvataggio su file, applyDB salva su Data Base
				//applyDB(myDataScenari, applyScen, savedCheck, id_scenario, myDataZone, myZoneLoaded);
				exportScenario(myDataScenari,myDataZone,myDataBox);
			}
		});
	}
	else{
		//Svuoto gli array di confronto
		var d = 0;
		var z = 0;
		var dz = 0;
		while(d < myDataLoaded.length){
			myDataLoaded.pop();
		}
		while(z < myZoneLoaded.length){
			myZoneLoaded.pop();
		}
		while(dz < myDataZone.length){
			myDataZone.pop();
		}
		
		callback(id_scenario, myDataZone, myZoneLoaded);
	}
}

function loadScenario(scenario, myData, myZone) {
		var cdata = '';
		
		console.log(myData);
		console.log(myZone);
		
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
	
				console.log(cdata);
				//carico risultati query nello store scenario
				myDataScenario = cdata.slice(0);
				myDataLoaded = cdata.slice(0);
				
				//aggiornamento del panel Scenario
				var nome_scenario = cdata[0].nome_scenario;
				var dataS = new Array(nome_scenario, scenario);
				nomeScenLoaded = nome_scenario;
				myDataScenari.pop();
				myDataScenari.push(dataS);
				Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
				
				//console.log(myDataScenario);
				//store_scenario.loadData(myDataScenario,false);
	
				var i;
				var j = 0;
				var colori = [];
				var col, add;
	
				for (i = 0; i < cdata.length; i++) {
					
					//Riempimento del panel Zone con le zone caricate
					add = true;
					colori[i] = cdata[i].colore;
					console.log(cdata[i].colore);
					for(col = 0; col < i; col++){
						if(colori[col] == cdata[i].colore){
							add = false;
						}
					}
					if(add){
						var r = {
		            			color : cdata[i].colore,
		            			zona : cdata[i].nome,
		            			id : cdata[i].zona_id,
		            			agente : "",
		            			space : ""
		            		};
		            	myDataZone.push(r);
			            //myZoneLoaded.push(myDataZone[j]);
		            	myZoneLoaded.push({
	            			color : cdata[i].colore,
	            			zona : cdata[i].nome,
	            			id : cdata[i].zona_id,
	            			agente : "",
	            			space : ""
	            		});
			            j++;
			            
		            	Ext.getCmp('zoneSel').getStore().loadData(myDataZone, false);
					}
					
					var fid = null;
					var type = null;
					var layer = cdata[i].tabella_territorio;
					var cod = cdata[i].tc_territorio_id;
	
					if((layer != null) && (cod != null)){
						switch (layer) {
						case "regione" :
							fid = "reg2011_g." + cod;
							type = "reg2011_g";
							break;
						case "provincia" :
							fid = "prov2011_g." + cod;
							type = "prov2011_g";
							break;
						case "comune" :
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
	
				}
	
	
				//SOLUZIONE PROVA 
				//caricamento nel box solo di zona x
				//myDataScenario ordinato per zone
	
				var zona="2";
	
				//trova colore e nome di zona x colore
				var colore,nome;
				for (var index=0; index< myDataScenario.length && myDataScenario[index]["zona_id"] <= zona ;index++){
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
				
				//
				nome_scenario = myDataScenari[0][0];
				//
				
				//Certifico il caricamento
				loaded = true;
				console.log(myDataZone);
				console.log(myZoneLoaded);
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
	unselectFeatures();
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
	var scenAp = store_scenario.getCount();
	if(scenAp > 0){
		modScen(doModScen);
	}
	else{
		Ext.Msg.show({
		     title:'Notifica',
		     msg: 'Devi avere uno scenario aperto se vuoi cambiargli il nome!',
		     buttons: Ext.Msg.OK,
		     buttonText: {ok: 'Ok'},
		     icon: Ext.Msg.WARNING,
		     fn: function(btn){
		    	 	answ = btn;
		    	 }
		});
	}
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
	var dataS = new Array(nome, myDataScenari[0][1]);
	myDataScenari.pop();
	myDataScenari.push(dataS);
	Ext.getCmp('scenarioAp').getStore().loadData(myDataScenari, false);
	modified = true;
}

/**
 * FUNZIONI CHE APPLICANO AL DB LE MODIFICHE SVOLTE SULLO SCENARIO
 */

function applyDB(myDataScenari, callback1, callback2, id_scenario, myDataZone, myZoneLoaded){
	console.log("Dentro funz applyDB");
	callback1(applyScenario, myDataScenari, savedCheck, id_scenario);
	//callback2(waitSaving, id_scenario, myDataZone, myZoneLoaded);
}

function applyScen(callback, myDataScenari, callback2, id_scenario){
	console.log("Dentro funz applyScen");
	var scenAp = store_scenario.getCount();
	if(scenAp > 0){
		askApply(function(){
			if(answ === 'cancel'){
				return;
			}
			else if(answ === 'ok'){
				callback(myDataScenari, scenUpdate, callback2, id_scenario);
			}
		});
	}
	else{
		Ext.Msg.show({
		     title:'Notifica',
		     msg: 'Devi avere uno scenario aperto se vuoi applicare modifiche al DataBase!',
		     buttons: Ext.Msg.OK,
		     buttonText: {ok: 'Ok'},
		     icon: Ext.Msg.WARNING,
		     fn: function(btn){
		    	 	answ = btn;
		    	 }
		});
	}
}

function applyScenario(myDataScenari, callback, callback2, id_scenario){
	console.log("Dentro funz applyScenario");
	var i = 0;
	var d = 0;
	var u = 0;
	var zi = 0;
	var zd = 0;
	var zu = 0;
	var nameChanged = false;
	var found = false;
	var territori = "";
	if(myDataScenario.length != 0){
		territori = Ext.encode(myDataScenario);
	}
	var zone = Ext.encode(myDataZone);

	//Controllo se lo scenario vada aggiunto o aggiornato
	
	if(loaded){//In questo caso lo scenario va aggiornato
		
		//Controllo se il nome dello scenario è cambiato
		if(nomeScenLoaded != myDataScenari[0][0]){
			nameChanged = true;
		}
		
		//Controllo le differenze tra zone caricate e quelle che si stanno per salvare
		for(var z = 0; z < myDataZone.length; z++){
			console.log(myZoneLoaded);
			loopZ : for(var z2 = 0; z2 < myZoneLoaded.length; z2++){
						console.log(myDataZone[z]);
						console.log(myZoneLoaded[z2]);
						console.log(myDataZone[z] + " " + myZoneLoaded[z2]);
						if(myDataZone[z]["id"] == myZoneLoaded[z2]["id"]){
							if((myDataZone[z]["zona"] != myZoneLoaded[z2]["zona"]) ||
							   (myDataZone[z]["color"] != myZoneLoaded[z2]["color"])							
							){
								myZoneToUpdate[zu] = myDataZone.slice(z,z+1);	
								zu++;
								console.log(myZoneToUpdate);
							}
							found = true;
							break loopZ;
						}
					}
			if(!found){
				myZoneToInsert[zi] = myDataZone.slice(z,z+1);
				zi++;
			}
			found = false;
		}
		
		for(var z = 0; z < myZoneLoaded.length; z++){
			loopZS : for(var z2 = 0; z2 < myDataZone.length; z2++){
						if(myZoneLoaded[z]["id"] == myDataZone[z2]["id"]){
							found = true;
						}
					}
			if(!found){
				if(myZoneLoaded.slice(z,z+1) != null){
					myZoneToDelete[zd] = myZoneLoaded.slice(z,z+1);
					zd++;
				}
			}
			found = false;
		}
		
		//Controllo le differenze tra scenario caricato e quello che si sta per salvare
		for(var c = 0; c < myDataScenario.length; c++){
			if(myDataScenario[c]["tc_territorio_id"] != undefined){
				loopC : for(var c2 = 0; c2 < myDataLoaded.length; c2++){
							console.log(myDataScenario);
							if(myDataScenario[c]["tc_territorio_id"] == myDataLoaded[c2]["tc_territorio_id"]){
								if(myDataScenario[c]["zona_id"] != myDataLoaded[c2]["zona_id"]){
									myDataToUpdate[u] = myDataScenario.slice(c,c+1);	
									u++;
								}
								found = true;
								break loopC;
							}
						}
				if(!found){
					myDataToInsert[i] = myDataScenario.slice(c,c+1);
					i++;
				}
				found = false;
			}
		}
		
		for(var c = 0; c < myDataLoaded.length; c++){
			loopS : for(var c2 = 0; c2 < myDataScenario.length; c2++){
						if(myDataLoaded[c]["tc_territorio_id"] == myDataScenario[c2]["tc_territorio_id"]){
							found = true;
						}
						else{
							console.log(myDataLoaded[c]["tc_territorio_id"]);
							console.log(myDataScenario[c2]["tc_territorio_id"]);
						}
					}
			if(!found){
				if(myDataLoaded[c]["tc_territorio_id"] != null){
					myDataToDelete[d] = myDataLoaded.slice(c,c+1);
					d++;
				}
			}
			found = false;
		}
		callback(callback2,id_scenario,myDataToInsert,myDataToUpdate,myDataToDelete,myZoneToInsert,myZoneToUpdate,myZoneToDelete,nameChanged);
	}
	else{//In questo caso lo scenario è nuovo e va aggiunto
	
		console.log("zona");
		console.log(zone);
		
		Ext.Ajax.request({
			waitMsg : 'wait...',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			params : {
				task : 'applyScenario',
				nome_scenario : myDataScenari[0][0],
				zone : zone,
				territori : territori
			},
			success : function(response) {
				var cdata1 = "";
				cdata1 = Ext.JSON.decode(response.responseText);
				myDataScenari[0][1] = cdata1[0];
				if(!(openAfterSaving)){
					setForUpdate();
				}
				else{
					callback2(waitSaving, id_scenario);
				}
			},
			callback : function(opt, success, response) {
				loaded = true;
				modified = false;
				saved = true;
			}
			
		});
		
		console.log("territori2");
		console.log(territori);
	}
	
}

//Funzione di aggiornamento di uno scenario già salvato su DB
function scenUpdate(callback2,id_scenario,myDataToInsert,myDataToUpdate,myDataToDelete,myZoneToInsert,myZoneToUpdate,myZoneToDelete,nameChanged){
	
	var toInsert = Ext.encode(myDataToInsert);
	var toUpdate = Ext.encode(myDataToUpdate);
	var toDelete = Ext.encode(myDataToDelete);
	var zToInsert = Ext.encode(myZoneToInsert);
	var zToUpdate = Ext.encode(myZoneToUpdate);
	var zToDelete = Ext.encode(myZoneToDelete);
	console.log(toInsert);
	console.log(toUpdate);
	console.log(toDelete);
	console.log(zToInsert);
	console.log(zToUpdate);
	console.log(zToDelete);
	
	Ext.Ajax.request({
		waitMsg : 'wait...',
		url : 'http://' + constants.ip + constants.root + constants.servlet,
		params : {
			task : 'updateScenario',
			nome_scenario : myDataScenari[0][0],
			scenario_id : myDataScenari[0][1],
			toInsert : toInsert,
			toUpdate : toUpdate,
			toDelete : toDelete,
			zToInsert : zToInsert,
			zToUpdate : zToUpdate,
			zToDelete : zToDelete,
			nameChanged : nameChanged
		},
		success : function(response) {
			if(!(openAfterSaving)){
				setForUpdate();
			}
			else{
				callback2(waitSaving, id_scenario);
			}
		},
		callback : function(opt, success, response) {
			loaded = true;
			modified = false;
			saved = true;
		}
	});
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

	var gml = new OpenLayers.Format.GML.v3();
	gml.extractAttributes = true;
	var features = gml.read(request.responseText);


	//estraggo colore
	//this sarebbe il parametro scope della chiamata al geoserver
	var colore = GetURLParameter(request.responseXML.URL,"colore");

	var stileColore=null;
	//copia feature dalla risposta di geoserver
	var feat=features[0];
	//aggiungo feature all albero
	addToTree(feat);


	//se nel parametri ce il colore...crea stile ed aggiungilo alla feature
	if( feat != null) {
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

	//quando ho caricato tutti i territori
	//tolgo il caricamento aspettando 500 ms
	tot_territori_caricati++;
	if (tot_territori_caricati == tot_territori_da_caricare){
        //carica la zona selezionata nel panel ZA (ovvero lultima)
        //LoadZonaInBox(myDataScenario[myDataScenario.length-1].nome);
        setTimeout(function () {
        	 	Ext.getCmp('mapDiv').setLoading(false);
                Ext.getCmp('gridSel').setLoading(false);
            	Ext.getCmp('zoneSel').setLoading(false);

        }, 500);
      }
      LoadZonaInBox(ZonaSelezionata[1]);

}

/**
 * RICHIESTA DI CONFERMA PER APPLICAZIONE SCENARIO SU DB
 */

function askApply(callback){
	Ext.Msg.show({
	     title:'Conferma applicazione modifiche su DataBase',
	     msg: 'Stai per applicare le modifiche al DataBase. Confermi la scelta?',
	     buttons: Ext.Msg.OKCANCEL,
	     buttonText: {ok: 'Ok', cancel: 'Annulla'},
	     icon: Ext.Msg.QUESTION,
	     fn: function(btn){
	    	 	answ = btn;
	    	 	callback(answ);
	    	 }
	});
}

function setForUpdate(){
	var cdata2 = "";
	
	//Setto le variabili di caricamento in vista di un possibile update nella stessa sessione
	
	Ext.Ajax.request({
		waitMsg : 'wait...',
		url : 'http://' + constants.ip + constants.root + constants.servlet,
		params : {
			task : 'getScenario',
			scenario : myDataScenari[0][1]
		},
		success : function(response) {
			//Svuoto gli array di confronto
			var d = 0;
			var z = 0;
			var dz = 0;
			var ds = 0;
			var db = 0;
			var d1 = 0;
			var d2 = 0;
			var d3 = 0;
			var d4 = 0;
			var d5 = 0;
			var d6 = 0;
			
			while(d < myDataLoaded.length){
				myDataLoaded.pop();
			}
			while(z < myZoneLoaded.length){
				myZoneLoaded.pop();
			}
			while(dz < myDataZone.length){
				myDataZone.pop();
			}
			while(ds < myDataScenario.length){
				myDataScenario.pop();
			}
			while(db < myDataBox.length){
				myDataBox.pop();
			}
			while(d1 < myDataToInsert.length){
				myDataToInsert.pop();
			}
			while(d2 < myDataToDelete.length){
				myDataToDelete.pop();
			}
			while(d3 < myDataToUpdate.length){
				myDataToUpdate.pop();
			}
			while(d4 < myZoneToInsert.length){
				myZoneToInsert.pop();
			}
			while(d5 < myZoneToDelete.length){
				myZoneToDelete.pop();
			}
			while(d6 < myZoneToUpdate.length){
				myZoneToUpdate.pop();
			}
	
		},
		callback : function(opt, success, response) {
			cdata2 = Ext.JSON.decode(response.responseText);
			console.log(cdata2);
			
			myDataLoaded = cdata2.slice(0);
			console.log(myDataLoaded);
			
			var nome_scenario = cdata2[0].nome_scenario;
			nomeScenLoaded = nome_scenario;

			var i, i2;
			var colori = [];
			var col, add;
			for (i = 0; i < cdata2.length; i++) {
				add = true;
				colori[i] = cdata2[i].colore;
				for(col = 0; col < i; col++){
					if(colori[col] == cdata2[i].colore){
						add = false;
					}
				}
				if(add){
					var r = {
	            			color : cdata2[i].colore,
	            			zona : cdata2[i].nome,
	            			id : cdata2[i].zona_id,
	            			agente : "",
	            			space : ""
	            		};
					myZoneLoaded.push(r);
				}
			}
			
			/*for(i2 = 0; i2 < cdata2.length; i2++){
				var zid;
				for(zid = 0; zid < myDataZone.length; zid++){
					if(myDataZone[zid].zona == cdata2[i2].nome){
						myDataZone[zid].id = cdata2[i2].zona_id;
					}
				}
			}*/
			
			myDataZone = myZoneLoaded.slice(0);
			myDataScenario = myDataLoaded.slice(0);
			myDataBox = myDataLoaded.slice(0);
			console.log(myDataZone);
			Ext.getCmp('zoneSel').getStore().loadData(myDataZone, false);
			
		}
	});
}

/**
 * Funzione che permette di selezionare lo scenario da caricare dal Data Base
 */
function openFromDB(callback, callback2) {
	
	//Store degli scenari caricabili da DB
	var storeScenDB = Ext.create('Ext.data.ArrayStore', {
		storeId: 'storeScenDB',
		autoLoad : false,
		autoSync : true,
		fields : [ {
			name : 'scenario_id'
		}, {
			name : 'nome'
		}, {
			name : 'mod_data'
		} ],
		data : lista_scenari
	});
	
	var f = Ext.create('Ext.grid.Panel',
			{
				id : 'gridScenariDB',
				frame : false,
				store : storeScenDB,
				height : '250',
				bodyPadding : 0,
				hideHeaders : false,
				constrainHeader : true,
				fieldDefaults : {
					labelAlign : 'left',
					labelWidth : 90,
					anchor : '100%'
				},
				columns : [ {
					text : 'Nome',
					flex : 0.5,
					dataIndex : 'nome'
				}, {
					text : 'Ultima modifica',
					flex : 0.5,
					dataIndex : 'mod_data'
				}, {
					text : 'custom',
					flex : 0,
					dataIndex : 'custom',
					hidden : true
				} ],
				listeners : {
					itemdblclick : function(dv, record, item, index, e) {
						var selection = f.getView().getSelectionModel().getSelection()[0];
						console.debug(selection.data.nome);
						openScenario(selection.data.scenario_id);
						Ext.getCmp('winScenDB').close();
					}
				}
			});
	
	callback();
	
	Ext.getCmp('gridScenariDB').getStore().loadData(lista_scenari, false);
	var storeL = false;
	while(!(storeL)){
		if((Ext.StoreManager.lookup(storeScenDB).isLoading())){
			storeL = false;
		}
		else{
			storeL = true;
			callback2(f);
		}
	}
}

function listScenDB(){
	var cdata = "";
	
	//Richiesta al DB
	Ext.Ajax.request({
		waitMsg : 'wait...',
		url : 'http://' + constants.ip + constants.root + constants.servlet,
		params : {
			task : 'getListScen'
		},
		success : function(response) {
			//cdata = Ext.JSON.decode(response.responseText);
		},
		callback : function(opt, success, response) {
			cdata = Ext.JSON.decode(response.responseText);
			var st = Ext.getCmp('gridScenariDB').getStore();
			var db;
			for(db = 0; db < cdata.length; db++){
				st.insert(db, cdata[db]);
				st.getAt(db).data.scenario_id = cdata[db]["scenario_id"];
				//lista_scenari[db]["scenario_id"] = cdata[db]["scenario_id"];
				st.getAt(db).data.nome = cdata[db]["nome"];
				//lista_scenari[db]["nome"] = cdata[db]["nome"];
				if(cdata[db]["mod_data"] == null){
					st.getAt(db).data.mod_data = cdata[db]["ins_data"];
					//lista_scenari[db]["mod_data"] = cdata[db]["ins_data"];
				}
				else{
					st.getAt(db).data.mod_data = cdata[db]["mod_data"];
					//lista_scenari[db]["mod_data"] = cdata[db]["mod_data"];
				}
			}
			//st.loadData(lista_scenari, false);
		}
	});
	
}

function winScenDB(f){
	
		var w = new Ext.Window({
			id : 'winScenDB',
			resizable : false,
			width : 300,
			height : 300,
			// maximizable: true,
			// resizable : true,
			autoScroll : true,
			title : "Scenari presenti su Data Base",
			items : [f],
			dockedItems : [ {
				xtype : 'toolbar',
				dock : 'bottom',
				items : [
				         {
				        	 xtype : 'tbfill'
				         },
				         {
				        	 text : 'Carica',
				        	 tooltip : 'Carica scenario da Data Base',
				        	 icon : 'img/ok.png',
				        	 scale : 'medium',
				        	 handler : function() {
				        		 var selection = f.getView().getSelectionModel().getSelection()[0];
				        		 // console.debug(chooseClient.getForm().getFieldValues().liv);
				        		 id_scenario = selection.data.scenario_id;
				        		 console.log(id_scenario);
				        		 openScenario(selection.data.scenario_id);
				        		 w.close();
				        	 }
				         } ]
			} ],
			listeners : {
				beforeclose : function() {
					Ext.getCmp('openScenario').enable();
				}
			}
		});
		w.show();
		w.center();
		Ext.getCmp('openScenario').disable();
		
}

function savedCheck(callback, id_scenario) {
    //Aspetto il salvataggio dello scenario prima di caricarne un altro
	console.log("Dentro funz savedCheck");
    callback(loadScenario, id_scenario);
}

function waitSaving(callback, id_scenario){
    setTimeout(function(){
    	console.log(saved);
        if(!saved){
            waitSaving(loadScenario);
        } 
        else{
        	console.log('salvataggio eseguito');
			unselectFeatures();
			//Svuoto gli array di confronto
			var d = 0;
			var z = 0;
			var dz = 0;
			while(d < myDataLoaded.length){
				myDataLoaded.pop();
			}
			while(z < myZoneLoaded.length){
				myZoneLoaded.pop();
			}
			while(dz < myDataZone.length){
				myDataZone.pop();
			}
			
			callback(id_scenario, myDataZone, myZoneLoaded);
			openAfterSaving = false;
			resetZone();
			addZone();
        }
    }, 10);
}


//funzione che visualizza sul layer vettoriale
// i territori provenienti dal territorio frammentare
function visualizzaZoneDisgregati(request) {

  var gml = new OpenLayers.Format.GML.v3();
  gml.extractAttributes = true;
  var features = gml.read(request.responseText);
  //estraggo colore
  //this sarebbe il parametro scope della chiamata al geoserver
  var colore = this;
  //copia feature dalla risposta di geoserver
  var feat=features[0];
  //aggiungo feature all albero
  addToTree(feat);

  //devo aggiungere feature alla zona vecchia
  addFeaturesToGridDisgregata(feat);

  //se nel parametri ce il colore...crea stile ed aggiungilo alla feature
  if (colore!=null){
    var stileColore2 = {
        strokeColor : '#ffffff',
        fillColor : '#'+colore,
        // fillColor : '#3FF87F',
        fillOpacity : 0.65,
        strokeWidth : 0.7,
        cursor : 'crosshair'
    };
    feat.style=stileColore2;
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

