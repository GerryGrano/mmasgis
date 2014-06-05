var tree,selected,map,toolbar,regioni,province,comuni,cap,select,selectionControl,dragpan,labels,panel,r,myfeature,selectFeature;
var scenario, zone, panelZA, scenarioAp, zoneSel, answ;
var url = "http://" + constants.ip + "geoserver/mmasgis/wms";
var opacity = 1;
//array contente [NOME_TERRITORIO,LAYER,FID_GEOSERVER,ZONA_ID,COLORE]
var myDataScenario = [];
//array per la popolazione dello store di box
var myDataBox =[];
//array del tipo {zona_id,nome;colore...id_agente?}
var ZonaSelezionata=[];
var TitoloBox=null;
var deseleziona_tutto=0;


var stileColore = {
		strokeColor : '#ffffff',
		fillColor : '#' + ZonaSelezionata[2],
		// fillColor : '#3FF87F',
		fillOpacity : 0.65,
		strokeWidth : 0.7,
		cursor : 'crosshair'
};

var myData = [];
var f;

Ext.BLANK_IMAGE_URL = './extjs/resources/themes/images/default/tree/s.gif';

/**
 * APPLICATION MAIN ENTRY POINT
 */
Ext.onReady(function() {

	Ext.QuickTips.init();

	/**
	 * PANEL CONTENITORE DI ALBERO E GRID, LAYOUT VBOX PER DISPOSIZIONE VERTICALE
	 */
	var rightPanel = new Ext.Panel({
		layout: {
			type: 'vbox'
		},
		//layout : 'column',
		region : 'west',
		width : 250,
		//resizable: true,
		// height: 650,
		// collapsible: true,
		items : [tree, selected]

	});

	/**
	 * PANEL ZONE ANALYSIS, LAYOUT VBOX PER DISPOSIZIONE VERTICALE
	 */
	var leftPanel = new Ext.Panel({
		id : 'zone_analysis_panel',
		layout: {
			type: 'vbox'
		},
		//layout : 'column',
		region : 'east',
		width : 250,
		//resizable: true,
		// height: 650,
		// collapsible: true,
		// items : [scenario, zone],
		hidden: true
	});
	
	/**
	 * PANEL CONTENITORE "PADRE": CONTIENE MAPPA, PANEL DESTRO (SINISTRO) CON ALBERO E GRID E PANEL SINISTRO (DESTRO) PER ZONE ANALYSIS
	 */
	var viewport = new Ext.Viewport({
		title : 'MMASGIS',
		id : 'simplestbl',
		layout : 'border',
		listeners : {
			afterrender : function(component, eOpts) {
				checkAuth('map');
			}
		},
		renderTo : Ext.getBody(),
		items : [{
			region : 'center',
			layout : 'fit',
			frame : true,
			border : false,
			html : '<div id="map" class="smallmap" ></div>'
		}, {
			region : 'north',
			tbar : toolbar,
			layout : 'fit',
			frame : true,
			border : false
		}, rightPanel]
	});

	var panZoom = new OpenLayers.Control.PanZoom();

	panZoom.onButtonClick = function(evt) {

		var btn = evt.buttonElement;
		switch (btn.action) {
			case "panup" :
				this.map.pan(0, -this.getSlideFactor("h"));
				break;
			case "pandown" :
				this.map.pan(0, this.getSlideFactor("h"));
				break;
			case "panleft" :
				this.map.pan(-this.getSlideFactor("w"), 0);
				break;
			case "panright" :
				this.map.pan(this.getSlideFactor("w"), 0);
				break;
			case "zoomin" :
				this.map.zoomIn();
				break;
			case "zoomout" :
				this.map.zoomOut();
				break;
			case "zoomworld" :
				proj = new OpenLayers.Projection("EPSG:4326");
				point = new OpenLayers.LonLat(12, 42);
				map.setCenter(point.transform(proj, map.getProjectionObject()), 6);
				break;
		}
	};

	// MAPPA
	map = new OpenLayers.Map('map', {
		div : "map",
		projection : "EPSG:900913",
		displayProjection : "EPSG:4326",
		controls : [panZoom, new OpenLayers.Control.Navigation()]
	});

	map.addControl(new OpenLayers.Control.LayerSwitcher());

	gmap_hybrid = new OpenLayers.Layer.Google("Google Hybrid",
	{
		type : google.maps.MapTypeId.HYBRID,
		numZoomLevels : 20
	});

	gmap_terrain = new OpenLayers.Layer.Google("Google Terrain", 
	{
		type : google.maps.MapTypeId.TERRAIN,
		numZoomLevels : 20
	});

	gmap_streets = new OpenLayers.Layer.Google("Google Streets", 
	{
		numZoomLevels : 20
	});

	// LAYER REGIONI
	regioni = new OpenLayers.Layer.WMS("regioni", url, {
		layers : 'mmasgis:reg2011_g',
		transparent : "true",
		format : 'image/png'
	}, {
		opacity : opacity,
		isBaseLayer : false
	});

	// LAYER PROVINCE
	province = new OpenLayers.Layer.WMS("province", url, {
		layers : 'mmasgis:prov2011_g',
		transparent : "true",
		format : 'image/png'
	}, {
		opacity : 0.5,
		isBaseLayer : false
	});

	// LAYER COMUNI
	comuni = new OpenLayers.Layer.WMS("comuni", url, {
		layers : 'mmasgis:com2011_g',
		transparent : "true",
		format : 'image/png'
	}, {
		opacity : 0.5,
		isBaseLayer : false
	});

	// LAYER CAP
	cap = new OpenLayers.Layer.WMS("CAP", url, {
		layers : 'mmasgis:CapCR2006',
		transparent : "true",
		format : 'image/png'
	}, {
		opacity : 0.3,
		isBaseLayer : false
	});
	
	// LAYER VETTORIALE IN OVERLAY PER LA SELEZIONE E86F38
	var mySelStyleProp = {
		strokeColor : '#ffffff',
		fillColor : '#3FF87F',
		// fillColor : '#3FF87F',
		fillOpacity : 0.2,
		strokeWidth : 0.7,
		cursor : 'crosshair'

	};
	select = new OpenLayers.Layer.Vector("Selezioni", {
		// styleMap:
		// new
		// OpenLayers.Style(mySelStyleProp,OpenLayers.Feature.Vector.style["select"]),
		styleMap : new OpenLayers.Style(mySelStyleProp, OpenLayers.Feature.Vector.style["temporary"])

	});

	// AGGIUNGO LAYER ALLA MAPPA
	map.addLayers([gmap_streets, gmap_hybrid, gmap_terrain, regioni, province, comuni, cap, select]);

	// CONTROLLO PER PAN E DRAG SULLA MAPPA
	dragpan = new OpenLayers.Control.DragPan();
	map.addControl(dragpan);

	//
	selectionControl = new OpenLayers.Control.GetFeature({
		protocol : OpenLayers.Protocol.WFS.fromWMSLayer(regioni),
		box : true,
		toggle : true,
		clickout: false,
		// multipleKey: "shiftKey",
		toggleKey : "ctrlKey"
	});

	// REGISTRO EVENTI PER SELEZIONARE CON CLICK IN E DESELEZIONARE CON
	// CLICK OUT
	selectionControl.events.register("featureselected", this, function(e) {
		
		// personalizzo la feature con il colore della zona		
		e.feature.style = stileColore;
		// aggiungi alla mappa
		select.addFeatures([e.feature]);
		//aggiungi a myDataScenario e myDataBox
		addFeaturesToGrid(e.feature);
		
	});
	
	selectionControl.events.register("featureunselected", this, function(e) {

		//rimuovi feature solo dalla mappa
		select.removeFeatures([e.feature]);
		/**ottimizzaione: 
		*se ho cliccato il pulsante "deselect all" 
		*non ce bisogno di rimuovere la singola feture 
		**/
		if (deseleziona_tutto==0)
			removeFeaturesFromGrid(e.feature.fid);

	});

	map.addControl(selectionControl);
	selectionControl.activate();
	proj = new OpenLayers.Projection("EPSG:4326");
	point = new OpenLayers.LonLat(12, 42);
	map.setCenter(point.transform(proj, map.getProjectionObject()), 6);
	Ext.getCmp('select_button').toggle(true);
	Ext.getCmp('reg_button').toggle(true);
}); // eo function onReady



/**
 * recupera dal db la sigla del nodo
 * @param codice
 * @param tipo
 * @param nome
 * @param fid
 */
function getSigla(codice, tipo, nome, fid) {

	var cdata = '';

	// console.debug(tipo);

	Ext.Ajax.request({
		waitMsg : 'wait...',
		url : 'http://' + constants.ip + constants.root + constants.servlet,
		params : {
			task : 'getSigla',
			layer : tipo,
			fid : codice
		},
		success : function(response) {

			cdata = Ext.JSON.decode(response.responseText);
			// console.debug(cdata.sigla);
		},
		callback : function(opt, success, respon) {

			// console.debug(response.responseText);
			// var cdata = Ext.JSON.decode(response.responseText);
			// console.debug(cdata.sigla);
			var data = new Array(nome, tipo.substring(0, 3), fid, cdata.sigla);
			myData.push(data);
			//console.debug(myData);
			Ext.getCmp('gridSel').getStore().loadData(myData, false);
		}
	});

}

/**
 * INPUT 
 * 		nome layer "regione/i"
 * 		codice della tabella tree quindi fid di openlayer -1 
 * @param
 */

function fromNomiToFid(nome,codice) {

	nome = nome.substring(0,3);
	var fid = null;

	switch (nome) {

	case "reg":
		fid  = "reg2011_g";
		break;
	case "pro":
		fid = "prov2011_g";
		break;
	case "com":
		fid = "com2011_g";
		break;
	case "Cap":
		fid = "CapCR2006";
		break;
	}

	fid=fid.concat("."+(parseInt(codice)+1));
	return fid;

}

/**
 * INPUT fid "reg2011_g.17" OUTPUT "regioni"
 * 
 * @param
 */

function fromFidToNomi(fid) {

	var type = fid.split(".");
	var layer = type[0];

	var output = {
			tipo : "",
			tabella : ""
	};

	switch (layer) {

	case "reg2011_g":
		output.tipo = "regione";
		output.tabella = "regioni";
		break;
	case "prov2011_g":
		output.tipo = "province";
		output.tabella = "provincia";
		break;
	case "com2011_g":
		output.tipo = "comuni";
		output.tabella = "comune";
		break;
	case "CapCR2006":
		output.tipo = "Cap";
		output.tabella = "Cap";
		break;
	}

	return output;

}

/**
 * aggiunge feature gia aggiunta alla box nella mappa
 * 
 * @param feature
 */
function addFeaturesToMap(fid) {

	var layer = fid.split(".");	

	var request = OpenLayers.Request.GET({
		url : url,
		callback : visualizzaZone,
		params : {
			REQUEST : "GetFeature",
			srsName : "EPSG:900913",
			SERVICE : "WFS",
			VERSION : "1.1.0",
			TYPENAME : "mmasgis:" + layer[0],
			featureID : fid,
			colore : ZonaSelezionata[2]
		}
	});


}

/**
 * aggiunge feature all'elenco di quelle selezionate nel box della zona
 * selezionata e nell'array dello scenario
 * 
 * @param feature
 */

//devo construire un record da aggiungere a myDataScenario e myDataBox(box zona)
function addFeaturesToGrid(feature) {

	var cdata='';
	//suddivido il fid
	var fid = feature.fid;
	var type = fid.split(".");
	var tipo=null;
	var cod= parseInt(type[1]);

	var tabella=null;
	switch (type[0]) {

	case "reg2011_g" :
		tipo = "regioni";
		nome = feature.data.NOME_REG;
		break;
	case "prov2011_g" :
		tipo = "province";
		nome = feature.data.NOME_PRO;
		break;
	case "com2011_g" :
		tipo = "comuni";
		nome = feature.data.NOME_COM;
		break;
	case "CapCR2006" :
		tipo = "Cap";
		nome = feature.data.nome;
		break;
}


	// 	COLORE | NOME ZONA | NOME_TERRITORIO | SIGLA | TERR_ID(FID) | LAYER | ZONA_ID
	var data = {
			colore:ZonaSelezionata[2],
			nome:ZonaSelezionata[1],
			nome_territorio:nome,
			sigla:"",
			tabella_territorio:tipo,
			tc_territorio_id:""+cod,
			zona_id:ZonaSelezionata[0]
			};
	myDataBox.push(data);
	myDataScenario.push(data);
	//myDataScenario.sort(orderByZona);
	Ext.getCmp('gridSel').getStore().loadData(myDataBox, false);

}

/*
 * function getSigla(codice, tipo, nome, fid) { var cdata = '';
 * 
 * Ext.Ajax.request({ waitMsg: 'wait...', url: 'get-nodes.jsp', params: { task:
 * 'sigla', layer: tipo, fid: codice }, success: function(response){ cdata =
 * Ext.JSON.decode(response.responseText); //console.debug(cdata.sigla); },
 * callback: function(opt,success,respon) {
 * //console.debug(response.responseText); //var cdata =
 * Ext.JSON.decode(response.responseText); //console.debug(cdata.sigla); var
 * data = new Array(nome, tipo.substring(0,3), fid, cdata.sigla);
 * myData.push(data); //console.debug(myData);
 * Ext.getCmp('gridSel').getStore().loadData(myData, false); } }) }
 * 
 */

/**
 * rimuove dall'elenco la feature passata come argomento, altrimenti rimuove tutto
 * @param featureFid
 */
function removeFeaturesFromGrid(featureFid) {

	var fid = featureFid.split(".");
	var layer = fid[0];
	var cod = fid[1];
	var trovato = false;
	var e=null;

	//elimino da scenario
	for (n in myDataScenario) {
		var record = myDataScenario[n];
		if (record.tc_territorio_id==cod && record.tabella_territorio.substring(0,3)==layer.substring(0,3)) {
			e = myDataScenario.splice(n, 1);
			//console.log("eliminato dallo scenario: ");
			//console.log(e);
			break;
		}
	}

	//se e = null allore esci dalla funzione
	if (e==null)
		return;

	//se il territorio fa parte della zona selezionata la elimino dal box
	if (e[0].zona_id==ZonaSelezionata[0]){

		//per ogni elemento della zona
		for (n in myDataBox) {
			var record = myDataBox[n];
			if (record.tc_territorio_id==cod && record.tabella_territorio.substring(0,3)==layer.substring(0,3)) {
				e = myDataBox.splice(n, 1);
				//console.log("myDataBox eliminato: ");
				//console.log(e);
				break;
			}
		}
		Ext.getCmp('gridSel').getStore().loadData(myDataBox, false);

	}

}


/**
 * INVIA SELEZIONI AL DATABASE TRAMITE GET
 * @param database
 * @param custom
 */
function showFeatures(database, custom) {
	var f = document.getElementById('showFeatures');
	r = 0;

	for (feature in selectionControl.features) {
		r++;
		feature_id = selectionControl.features[feature].fid;
		fid = feature_id.split(".");

		if (fid[0] == "reg2011_g") {
			f.reg.value = f.reg.value + selectionControl.features[feature].attributes['COD_REG'] + ",";
		}
		else if (fid[0] == "prov2011_g") {
			f.pro.value = f.pro.value + selectionControl.features[feature].attributes['COD_PRO'] + ",";
		}
		else if (fid[0] == "com2011_g") {
			f.com.value = f.com.value + selectionControl.features[feature].attributes['PRO_COM'] + ",";
		}
		else if (fid[0] == "CapCR2006") {
			f.cap.value = f.cap.value + selectionControl.features[feature].attributes['nome'] + ",";
		}
	}

	if (r > 0) {
		f.reg.value = f.reg.value.substring(0, f.reg.value.length - 1);
		f.pro.value = f.pro.value.substring(0, f.pro.value.length - 1);
		f.com.value = f.com.value.substring(0, f.com.value.length - 1);
		f.cap.value = f.cap.value.substring(0, f.cap.value.length - 1);

		f.custom.value = custom;
		f.dbname.value = database;
		//f.customer.value = customer;
		f.id_offerta.value = id_offerta;
		f.id_vetrina.value = id_vetrina;
		if(id_offerta == "" && id_vetrina == "") {
			win = window.open('', 'new_tab');

			f.submit();
			win.focus();
		}
		else {
			f.submit();
		}

		f.reg.value = "";
		f.pro.value = "";
		f.com.value = "";
		f.cap.value = "";

	}
	else {
		alert('nessun elemento selezionato');
	}

};

/**
 * DESELEZIONA TUTTO
 */
function unselectFeatures() {

	//flag tasto deseleziona tutto = 1
	deseleziona_tutto=1;
	selectionControl.unselectAll();
	myData = [];
	myDataBox = [];
	myDataScenario = [];
	Ext.getCmp('gridSel').getStore().loadData(myData, false);

	//flag tasto deseleziona tutto = 0
	deseleziona_tutto=0;
}
//EOF