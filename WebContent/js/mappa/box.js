/**
 * STORE DEL GRID PANEL (features selezionate)
 */
var store_selected = Ext.create('Ext.data.ArrayStore', {
	// autoLoad: true,
	// autoSync: true,
	fields : [{
		name : 'nome'
	}, {
		name : 'layer'
	}, {
		name : 'fid'
	}, {
		name : 'sigla'
	}],
	data : myData
});


/**
 * GRID PANEL PER LE FEATURE SELEZIONATE
 */
selected = Ext.create('Ext.grid.Panel', {
	id : 'gridSel',
	title : 'Territori selezionati ',
	store : store_selected,
	emptyText : 'nessuna feature selezionata',
	flex : 0.6,
	width : 250,
	columns : [{
		text : 'Nome',
		flex : 2,
		dataIndex : 'nome'
	}, {
		text : 'Tipo',
		flex : 0.5,
		dataIndex : 'layer'
	}, {
		text : 'Sigla',
		flex : 1,
		dataIndex : 'sigla'
	}, {
		xtype : 'actioncolumn',
		width : 35,
		items : [{
			icon : 'img/del2.png', // Use a URL in the icon config
			tooltip : 'Elimina questa feature',
			handler : function(grid, rowIndex, colIndex) {

				// alert(myData[rowIndex][2]);
				unselectSingleFeature(myData[rowIndex][2]);
			}
		}]
	}]
});

/**
 * FUNZIONE DI DESELEZIONE DEL SINGOLO TERRITORIO
 * @param fid
 */
function unselectSingleFeature(fid) {

	var feature = selectionControl.features[fid];
	selectionControl.unselect(feature);
}