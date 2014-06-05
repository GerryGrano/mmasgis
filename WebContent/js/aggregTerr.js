//Ext.override(Ext.data.proxy.Ajax, { timeout:270000 });
Ext.require(['Ext.data.*', 'Ext.grid.*']);

Ext.define('Pot', {
	extend : 'Ext.data.Model',
	fields : []
});
var hide = true;
var intestazione;
var primaColonna;
Ext.onReady(function() {

	Ext.QuickTips.init();

	Ext.define('AggTerModel', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'Territorio',
			type : 'string'
		},{
			name : 'CAP',
			type : 'integer'
		}, {
			name : 'NumPV',
			type : 'real'
		}, {
			name : 'Percentuale_PV',
			type : 'real'
		}, {
			name : 'NumClienti',
			type : 'real'
		},{
			name : 'Rapp_clienti_pv',
			type : 'real'
		}, {
			name : 'Percentuale_Clienti',
			type : 'real'
		}, {
			name : 'Potenziale',
			type : 'real'
		}, {
			name : 'Potenziale Clienti',
			type : 'real'
		},{
			name : 'Rapp_potCliente_potPV',
			type : 'real'
		},{
			name : 'Percentuale_Pot',
			type : 'real'
		}],
		idProperty : 'cap'
	});
	var terrToolbar = Ext.create('Ext.toolbar.Toolbar', {
		height : 60,
		id : 'terrToolbar',
		items : [{
			xtype : 'box',
			autoEl : {
				tag : 'img',
				src : 'img/logo_mmas.png'
			},
			id : 'mmas',
			width : 110,
			height : 50
		}, '-', {
			id : 'expStatPvBtn',
			// text: 'Esporta statistiche',
			icon : 'img/expView.png',
			width : 50,
			height : 50,
			scale : 'medium',
			tooltip : 'esporta il risultato in formato excel',
			handler : function() {
				excelExport();
			}
		}, {
			xtype : 'textfield',
			width: 200,
			id : 'base_num',
			fieldLabel : 'Base Numerica ',
			readOnly : true
		}, {
			xtype : 'textfield',
			width: 200,
			id : 'base_cl',
			fieldLabel : 'Base Clienti ',
			readOnly : true
		}, {
			xtype : 'textfield',
			width: 200,
			id : 'base_pot',
			fieldLabel : 'Totale Potenziali ',
			readOnly : true
		}]
	});

	aggTerStore = Ext.create('Ext.data.Store', {
		remoteSort : true,
		model : 'AggTerModel',
		listeners : {
			load : function(store) {

				// Ext.getCmp('numRow').setText("Numero Anagrafiche: " +
				// store.getCount());
				Ext.getCmp('grigliaAggregazioneTerr').setLoading(false);

				Ext.getCmp('base_num').setValue(aggTerGrid.store.getProxy().getReader().rawData.base_num);
				// console.debug(brandsGrid.store.getProxy().getReader().rawData.base_num);
				Ext.getCmp('base_cl').setValue(aggTerGrid.store.getProxy().getReader().rawData.base_cl);
				Ext.getCmp('base_pot').setValue(aggTerGrid.store.getProxy().getReader().rawData.base_pot);
			}
		}/*
			 * , reader: { type: 'json', root: 'selections', successProperty:
			 * 'success', id: 'cap' }
			 */,
		proxy : {
			type : 'ajax',
			// idProperty: 'pv_id',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				// totalProperty: 'total',
				id : 'cap'
			},
			actionMethods : {
				create : 'POST',
				read : 'POST',
				update : 'POST',
				destroy : 'POST'
			},
			extraParams : {
				// selections: selection_string,
				task : 'aggTer',
				censimento : dbname,
				classe : classe,
				layer : layer,
				reg : reg,
				pro : pro,
				com : com,
				cap : cap,
				parametri : parametri,
				potenziali : potenziali,
				marche : marche
			}
		}
	});

	if (layer == 'cap') {
		hide = false;
		intestazione = 'Aree CAP e Comuni';
		primaColonna = 'Comune';
	}
	else {
		intestazione = layer;
		primaColonna = layer;
	}

	aggTerGrid = Ext.create('Ext.grid.GridPanel', {
		frame : true,
		layout : 'fit',
		title : 'Analisi distribuzione pv: ' + dbname + ' -> ' + intestazione,
		id : 'grigliaAggregazioneTerr',
		store : aggTerStore,
		selType : 'cellmodel',
		tbar : terrToolbar,
		emptyText : 'Nessun record presente',
		columns : [{
			dataIndex : 'base_num',
			name : 'base_num',
			text : 'base_num',
			hidden : true
		}, {
			dataIndex : 'base_cl',
			text : 'base_cl',
			hidden : true
		}, {
			dataIndex : 'base_pot',
			text : 'base_pot',
			hidden : true
		}, {
			dataIndex : 'Territorio',
			text : primaColonna,
			flex : 1
		},
		    {
			dataIndex : 'NumPV',
			text : 'Numero PV',
			flex : 0.5
		}, {
			dataIndex : 'Percentuale_PV',
			flex : 0.5,
			text : "% PV"
		}, {
			dataIndex : 'NumClienti',
			flex : 1,
			text : "Numero clienti"
		},{
			dataIndex: 'Rapp_clienti_pv',
			flex : 1,
			text : 'Rapporto Clienti-PV'
		}, {
			dataIndex : 'Percentuale_Clienti',
			flex : 1,
			text : "% clienti"
		}, {
			dataIndex : 'Potenziale',
			flex : 1,
			text : "Potenziale"
		}, {
			dataIndex : 'Potenziale Clienti',
			flex : 1,
			text : "Potenziale Clienti"
		},{
			dataIndex : 'Rapp_potCliente_potPV',
			flex : 1,
			text : 'Rapp PotCliente-PotPV'
		}, {
			dataIndex : 'Percentuale_Pot',
			flex : 1,
			text : "% Potenziale"
		}],
		//inserisce la colonna CAP solamente se il layer scelto è Aree Cap e Comuni
		listeners:{
			afterrender:function() {
				if(layer=='cap'){
					var CapColumn = Ext.create('Ext.grid.column.Column', {
						dataIndex: 'CAP',
						text: 'CAP',
						flex : 0.4
					});
					this.headerCt.insert(this.columns.length-9, CapColumn);
					this.getView().refresh();
				}
			}
		}
	});

	new Ext.Viewport({
		frame : true,
		layout : 'fit',
		items : [aggTerGrid],
		listeners : {
			afterrender : function(item) {

				checkAuth('statPv');
			}
		}
	});

	Ext.getCmp('grigliaAggregazioneTerr').setLoading('Caricamento Aggregazione Territoriale');
	aggTerStore.load();
	//console.log(aggTerStore);

});
function excelExport() {
	data = new Array();
	for (i in aggTerGrid.getStore().data.items) {
		//console.debug(aggTerGrid.getStore().data.items[i].data);
		data[i] = aggTerGrid.getStore().data.items[i].data;
		//console.debug(data[i]);

	}
	var base_num=Ext.getCmp('base_num').getValue();		//valori da inserire nel file excel
	var base_pot=Ext.getCmp('base_pot').getValue();
	data_base=new Array();
	data_base[0]=base_num;
	data_base[1]=base_pot;
	data_base[2]='pot';
	var encodedBase=Ext.JSON.encode(data_base);

	encodedData = Ext.JSON.encode(data);
	var form = document.getElementById('estrazioni');
	form.action = 'http://' + constants.ip + constants.root + constants.servlet;
	form.task.value = 'exportStat';
	form.censimento.value = dbname;
	form.selections.value = encodedData;
	form.data_base.value=encodedBase;		//valori da inserire nel file excel
	//personalizzazione commento su prima cella file excel
	form.valore.value=layer;
	form.aggregazione.value='Aggregazione Territoriale';
	///////////////////////////////////////////////////////////
	form.header.value = getExcelHeader('grigliaAggregazioneTerr');
	form.submit();
}
function getExcelHeader(cmp) {
	store = Ext.getCmp(cmp);
	arr = new Array();
	dataOutput = new Array();
	for (n in store.columns) {
		// if (!store.columns[n].hidden) {
		arr.push(store.columns[n].dataIndex);
		// }
	}
	dataOutput = arr.slice(3, 14);
	//console.debug(dataOutput);
	encodedHeader = Ext.JSON.encode(dataOutput);
	// console.debug(encodedHeader);
	return encodedHeader;
}


