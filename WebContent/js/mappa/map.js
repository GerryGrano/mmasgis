var tree,selected,map,toolbar,regioni,province,comuni,cap,select,selectionControl,dragpan,labels,panel,r,myfeature,selectFeature;
var url = "http://" + constants.ip + "geoserver/mmasgis/wms";
var opacity = 1;
var myData = [];
var f;

console.log("MAPPA SENZA ZA");
console.log("Abilitato a vedere tutta l'italia?");
console.log(admin_azienda);
console.log("Zona assegnata a questo agente");
console.log(zona_id);
console.log("Territori della zona");
console.log(territori_sele);




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
	 * PANEL CONTENITORE "PADRE": CONTIENE MAPPA E PANEL DESTRO CON ALBERO E GRID
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
		fillColor : '#f2960f',
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
		// multipleKey: "shiftKey",
		toggleKey : "ctrlKey"
	});

	// REGISTRO EVENTI PER SELEZIONARE CON CLICK IN E DESELEZIONARE CON
	// CLICK OUT
	selectionControl.events.register("featureselected", this, function(e) {

		select.addFeatures([e.feature]);
		addFeaturesToGrid(e.feature);
		
		//Soluzione BUG IE11
	    if ((navigator.userAgent).indexOf("Trident/7.0")> -1 && (navigator.userAgent).indexOf("like Gecko")> -1){
	    	selectButtonClicked();
	    	if (selectionControl.protocol.featureType=="reg2011_g")
	    		showRegioni();
	    	if (selectionControl.protocol.featureType=="prov2011_g")
	    		showProvince();
	    	if (selectionControl.protocol.featureType=="com2011_g")
	    		showComuni();
	    	if (selectionControl.protocol.featureType=="CapCR2006")
	    		showCap();
	    }
		
	});
	selectionControl.events.register("featureunselected", this, function(e) {

		removeFeaturesFromGrid(e.feature.fid);
		select.removeFeatures([e.feature]);
		
		//Soluzione BUG IE11
	    if ((navigator.userAgent).indexOf("Trident/7.0")> -1 && (navigator.userAgent).indexOf("like Gecko")> -1){
	    	selectButtonClicked();
	    	if (selectionControl.protocol.featureType=="reg2011_g")
	    		showRegioni();
	    	if (selectionControl.protocol.featureType=="prov2011_g")
	    		showProvince();
	    	if (selectionControl.protocol.featureType=="com2011_g")
	    		showComuni();
	    	if (selectionControl.protocol.featureType=="CapCR2006")
	    		showCap();
	    }

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
 * aggiunge feature all'elenco di quelle selezionate
 * @param feature
 */
function addFeaturesToGrid(feature) {

	var nome = null;
	var fid = feature.fid;
	var type = fid.split(".");

	switch (type[0]) {

		case "reg2011_g" :
			tipo = "regione";
			nome = feature.data.NOME_REG;
			sigla = getSigla(parseInt(type[1]) - 1, tipo, nome, fid);
			break;
		case "prov2011_g" :
			tipo = "provincia";
			nome = feature.data.NOME_PRO;
			sigla = getSigla(parseInt(type[1]) - 1, tipo, nome, fid);
			break;
		case "com2011_g" :
			tipo = "comune";
			nome = feature.data.NOME_COM;
			sigla = getSigla(parseInt(type[1]) + 1, tipo, nome, fid);
			break;
		case "CapCR2006" :
			tipo = "Cap";
			nome = feature.data.nome;
			sigla = getSigla(parseInt(type[1]) - 1, tipo, nome, fid);
			break;
	}

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

	if (featureFid == null) {
		myData = [];
	}
	else {
		// scorro array e tolgo quella giusta
		for (n in myData) {
			var s = myData[n];
			if (s[2] == featureFid) {
				e = myData.splice(n, 1);
				// console.debug("rimosso elemento: " + e);
			}
		}
	}
	Ext.getCmp('gridSel').getStore().loadData(myData, false);

}


/**
 * INVIA SELEZIONI AL DATABASE TRAMITE GET
 * @param database
 * @param custom
 */
function showFeatures(database, custom/*, results*/) {
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
			var win = window.open('', 'new_tab');
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
//EOF