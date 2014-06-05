/**
 * Store del componente TreePanel
 */
var store = Ext.create('Ext.data.TreeStore', {
	proxy : {
		type : 'ajax',
		url : 'http://' + constants.ip + constants.root + constants.servlet,
		reader : {
			type : 'json'
		},
		extraParams : {
			task : 'getNodes'
		}
	},
	root : {
		text : 'Regioni',
		id : '0',
		expanded : true,
		rootVisible : false
	}

});

/**
 * TreePanel
 */
tree = Ext.create('Ext.tree.Panel', {
	id : 'tree',
	store : store,
	flex : 0.4,
	//resizable : true,
	selModel: Ext.create('Ext.selection.RowModel', {
    mode: 'MULTI'
	}),
	title : 'Territori',
	listeners : {
		select: function(th, record, index, eOpts) {
			//console.debug(record);
			getNodes(record.raw.codice, record.raw.layer);
		},
		itemclick : function(view, rec, item, index, eventObj) {

			getNodes(rec.raw.codice, rec.raw.layer);
		}
	},
	dockedItems : [{
		xtype : 'toolbar',
		items : [{
			xtype : 'button',
			text : 'Chiudi tutto',
			icon : 'img/up_small.png',
			id : 'collapseTree',
			handler : function() {

				var toolbar = this.up('toolbar');
				toolbar.disable();

				tree.collapseAll(function() {

					toolbar.enable();
				});
			}
		}, {
			xtype : 'button',
			text : 'Cerca',
			icon : 'img/search_small.png',
			id : 'searchUtbPanelButton',
			handler : function() {

				searchUTB();
			}
		}]
	}]
});

/**
 * Pannello di ricerca UTB sull'albero
 */
function searchUTB() {

	var f = new Ext.create('Ext.form.Panel', {
		id : 'formpanelUTB',
		width : 300,
		height : 150,
		bodyPadding : 10,
		items : [{
			xtype : 'fieldcontainer',
			defaultType : 'radiofield',
			id : 'layerSelector',
			layout : 'vbox',
			items : [{
				boxLabel : 'Province',
				name : 'layer',
				inputValue : 'provincia',
				id : 'radio1',
				checked : true
			}, {
				boxLabel : 'Comuni',
				name : 'layer',
				inputValue : 'comune',
				id : 'radio2'
			}, {
				boxLabel : 'Cap',
				name : 'layer',
				inputValue : 'Cap',
				id : 'radio3'
			}]
		}, {
			xtype : 'textfield',
			text : 'nome',
			id : 'fieldCerca',
			listeners : {
				specialkey : function(field, e) {

					if (e.getKey() === e.ENTER) {
						doSearch();
					}
				}
			}
		}, {
			xtype : 'button',
			text : 'Cerca',
			id : 'searchUtbButton',
			handler : function() {

				doSearch();
			}
		}, {
			xtype : 'button',
			text : 'Reset',
			handler : function() {

				Ext.getCmp('fieldCerca').setValue("");
			}
		}]
	});

	var w = new Ext.Window({
		id : 'searchUTB',
		height : 180,
		width : 300,
		title : "Cerca UTB",
		items : [f],
		listeners : {
			beforeclose : function(panel, eOpts) {

				Ext.getCmp('searchUtbPanelButton').enable();
			}
		}
	});

	w.show();
	w.center();
	Ext.getCmp('searchUtbPanelButton').disable();
}

/**
 * Invia ricerca sull'albero
 */
function doSearch() {

	var layer = null;

	if (Ext.getCmp('radio1').getValue())
		layer = Ext.getCmp('radio1').inputValue;
	if (Ext.getCmp('radio2').getValue())
		layer = Ext.getCmp('radio2').inputValue;
	if (Ext.getCmp('radio3').getValue())
		layer = Ext.getCmp('radio3').inputValue;

	if (Ext.getCmp('fieldCerca').getValue() != "") {
		getFid(layer, Ext.getCmp('fieldCerca').getValue());
		Ext.getCmp('tree').getView().focus();
	}
	else {
		Ext.Msg.alert('Attenzione', 'Riempire la casella di testo!');
	}
}

/**
 * Ottiene nodi dell'albero quando ci si clicca sopra
 * 
 * @param codice
 * @param layer
 */
function getNodes(codice, layer) {

	// SELEZIONE FEATURE
	var cod = parseInt(codice) + 1;
	var fid = null;
	var type = null;

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
		callback : handler,
		params : {
			REQUEST : "GetFeature",
			srsName : "EPSG:900913",
			SERVICE : "WFS",
			VERSION : "1.1.0",
			TYPENAME : "mmasgis:" + type,
			featureID : fid
		}
	});

}

/**
 * Gestore della risposta ricevuta da Geoserver Effettua parsing della risposta
 * e seleziona il territorio contenuto in essa
 * 
 * @param request
 */
function handler(request) {

	var gml = new OpenLayers.Format.GML.v3();
	gml.extractAttributes = true;
	var features = gml.read(request.responseText);

	if (contains(select.features, features[0]) == false) {
		select.addFeatures(features[0]);
		addFeaturesToGrid(features[0]);
	}
	if (hash_contains(selectionControl.features, features[0]) == false) {
		selectionControl.features[features[0].fid] = features[0];
	}
}

/**
 * Trova sequenza di fid corrispondenti alla gerarchia dei nodi dell'albero
 * 
 * @param layer
 * @param nome
 */
function getFid(layer, nome) {

	var cdata = null;

	Ext.Ajax.request({
		waitMsg : 'wait...',
		url : 'http://' + constants.ip + constants.root + constants.servlet,
		params : {
			layer : layer,
			nome : nome,
			task : 'getFid'
		},
		success : function(response) {

		},
		callback : function(opt, success, respon) {

			cdata = Ext.JSON.decode(respon.responseText);
			// var treepanel = Ext.getCmp('tree');
			// console.debug(cdata[0]);
			if (cdata[0] == "empty") {
				alert("nessun risultato");
			}
			else {
				var idx = cdata.length - 1;

				// trovo primo nodo
				var n1 = Ext.getCmp('tree').getRootNode().findChild("id", cdata[idx], true);
				// console.debug(n1);

				idx--;

				// chiamo funzione ricorsiva che trova ed espande gli altri e
				// seleziona l'ultimo sull'albero
				surfTree(n1, cdata, idx);
			}
		}
	});
}

/**
 * Scorre la gerarchia di fid, espande i nodi ed evidenzia sull'albero l'ultimo
 * (quello cercato)
 * 
 * @param node
 * @param cdata
 * @param idx
 */
function surfTree(node, cdata, idx) {

	// espando il nodo passato come parametro
	node.expand(false, function() {

		// quando ha caricato i figli, cerco il nodo successivo contenuto
		// nell'array cdata
		var n2 = node.findChild("id", cdata[idx], true);

		idx--;
		// procedo con il prossimo nodo se ce ne sono
		if (idx > -1)
			surfTree(n2, cdata, idx);
		// altrimenti se l'array ?? stato scorso tutto, evidenzio l'ultimo nodo
		// trovato
		else {
			setTimeout(function() {

				Ext.getCmp('tree').getSelectionModel().select(n2);
			}, 1000);
			// Ext.getCmp('tree').getSelectionModel().select(n2);

		}
	});
}

/**
 * Utility function
 * @param a
 * @param feature
 * @returns {Boolean}
 */
function contains(a, feature) {

	for ( var i = 0; i < a.length; i++) {
		if (a[i].fid == feature.fid) {
			return true;
		}
	}
	return false;
}

/**
 * Utility function
 * @param a
 * @param feature
 * @returns {Boolean}
 */
function hash_contains(a, feature) {

	for (i in a) {
		if (i == feature.fid) {
			return true;
		}
	}
	return false;
}
