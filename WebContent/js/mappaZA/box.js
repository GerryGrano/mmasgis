/**
 * STORE DEL GRID PANEL (features selezionate)
 */
var store_selected = Ext.create('Ext.data.ArrayStore', {
	// autoLoad: true,
	// autoSync: true,
	fields : [{
		name : 'colore'
	}, {
		name : 'nome'
	}, {
		name : 'nome_territorio'
	}, {
		name : 'sigla'
	},{
		name : 'tabella_territorio'
	},{
		name : 'tc_territorio_id'
	},{
		name : 'zona_id'
	}],
	data : myDataBox
});


/**
 * GRID PANEL PER LE FEATURE SELEZIONATE
 */
selected = Ext.create('Ext.grid.Panel', {
	id : 'gridSel',
	title : 'Territori selezionati ',
	store : store_selected,
	viewConfig : {
		deferEmptyText : false
	},
	emptyText : 'Nessuna feature selezionata',
	flex : 0.6,
	width : 250,
	columns : [{
		text : 'Nome',
		flex : 2,
		dataIndex : 'nome_territorio'
	}, {
		text : 'Tipo',
		flex : 0.5,
		dataIndex : 'tabella_territorio',
		renderer: function(value) {
			return value.substring(0,3);
		}
	}, {
		text : 'Sigla',
		flex : 1,
		dataIndex : 'sigla'
	}, {
		xtype : 'actioncolumn',
		width : 35,
		items : [{
			icon : 'img/del2.png', // Use a URL in the icon config
			tooltip : 'Elimina questo territorio',
			handler : function(grid, rowIndex, colIndex) {
				
				//elimino il territorio dalla box
				var record = grid.getStore().getAt(rowIndex);
				grid.getStore().removeAt(rowIndex);
				
				//elimino il territorio dalla mappa
				var codice_tree = ""+(parseInt(record.data.tc_territorio_id)-1);
				var fid = fromNomiToFid(record.data.tabella_territorio,codice_tree);
				unselectSingleFeature(fid);				
				
				//l'evento "featureunselected" della mappa eliminera i territori dalla zona e Scenario
			}
		}]
	}]
});

/**
* FUNZIONE DI DESELEZIONE DEL SINGOLO TERRITORIO DA BOX e myDataScenario e myDataBox
* @param fid
*/
function eliminaTerritorioDaZona(nome,zona_id){

	//per ogni elemento presente in myDataBox
	for (n in myDataBox) {
		var record = myDataBox[n];
		if (record.nome_territorio == nome) {
		myDataBox.splice(n,1);
		break;
	}
}

	//per ogni elemento presente in myDataScenario
	for ( var n = 0; n < myDataScenario.length && myDataScenario[n].zona_id <= zona_id  ; n++) {
		if (myDataScenario[n].zona_id == zona_id && myDataScenario[n].nome_territorio == nome) {
			myDataScenario.splice(n	,1);
			break;
		}
	}

}


/**
 * FUNZIONE DI DESELEZIONE DEL SINGOLO TERRITORIO
 * @param fid
 */
function unselectSingleFeature(fid) {

	var feature = selectionControl.features[fid];
	selectionControl.unselect(feature);
}