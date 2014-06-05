Ext.require(['Ext.data.*', 'Ext.grid.*']);

Ext.define('Param', {
	extend : 'Ext.data.Model',
	fields : []
});

Ext.onReady(function() {

	Ext.QuickTips.init();
	parToolbar = Ext.create('Ext.toolbar.Toolbar', {
		height : 60,
		id : 'parToolbar',
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
			id : 'expStatParBtn',
			// text: 'Esporta statistiche',
			icon : 'img/expView.png',
			width : 50,
			height : 50,
			scale : 'medium',
			tooltip : 'esporta il risultato in formato excel',
			handler : function() {

				excelExport();
			}
		}]
	});

	store = Ext.create('Ext.data.Store', {
		model : 'Param',
		proxy : {
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results'
			},
			extraParams : {
				task : 'aggPar',
				censimento : dbname,
				classe : classe,
				liv : liv,
				reg : reg,
				pro : pro,
				com : com,
				cap : cap,
				parametri : parametri,
				potenziali : potenziali,
				marche : marche
			}
		},
		listeners : {
			'metachange' : function(store, meta) {

				grid.reconfigure(store, meta.columns);
			},
			load : function(store) {

				Ext.getCmp('gridAggPar').setLoading(false);
				// setto la larghezza della prima colonna a 250px
				grid.columns[0].setWidth(250);
				// le altre colonne vengono dimensionate cosi: (lunghezza testo * 5px) +
				// 30px
				for ( var i = 1; i < grid.columns.length; i++) {
					grid.columns[i].setWidth((grid.columns[i].text.length * 5) + 30);
				}

				// if(store.getProxy().getReader().rawData.idn.hide) {
				grid.columns[grid.columns.length - 1].setVisible(false);
				// }

			}
		}
	});

	grid = Ext.create('Ext.grid.Panel', {
		id : 'gridAggPar',
		frame : true,
		columnLines : true,
		layout : 'fit',
		title : 'Aggregazione Parametri: ' + dbname,
		emptyText : 'Nessun record presente',
		tbar : parToolbar,
		features : [{
			ftype : 'summary'
		}],
		store : store,
		columns : [ // queste colonne vengono riconfigurate in base al contenuto del
								// json
		{
			text : '-',
			dataIndex : 'col1'
		}, {
			text : '-',
			dataIndex : 'col2'
		}]
	});

	new Ext.Viewport({
		frame : true,
		layout : 'fit',
		items : [grid],
		listeners : {
			afterrender : function(item) {

				checkAuth('statPar');
			}
		}
	});

	Ext.getCmp('gridAggPar').setLoading('Caricamento Aggregazione Parametri');
	store.load();

});

function excelExport() {
	Ext.Ajax.request({
 		url: 'http://' + constants.ip + constants.root + constants.servlet,
  			params:{
  				task : 'getClass',
  				category : 'par',
  				censimento : dbname
  			},
		  	success: function(response){
		  		var testo='';
		  		var obj = Ext.decode(response.responseText);
		  		for(var i=0;i<obj.results.length;i++){
		  			if(obj.results[i].id==classe){
		  				testo=obj.results[i].text;
		  				break;
		  			}
		  		}
		  		data = new Array();
		  		for (i in grid.getStore().data.items) {
		  			data[i] = grid.getStore().data.items[i].data;
		  			// console.debug(data[i]);

		  		}
		  		encodedData = Ext.JSON.encode(data);
		  		//console.debug(testo);
		  		var form = document.getElementById('estrazioni');
		  		form.action = 'http://' + constants.ip + constants.root + constants.servlet;
		  		form.task.value = 'exportStat';
		  		form.censimento.value = dbname;
		  		form.selections.value = encodedData;
		  		form.valore.value=testo;
		  		form.aggregazione.value='Aggregazione Parametri';
		  		form.header.value = getExcelHeader('gridAggPar');
		  		form.submit();
		  		
		  	}
  	});
	
}
function getExcelHeader(cmp) {

	store = Ext.getCmp(cmp);

	arr = new Array();
	var cont = 0;
	dataOutput = new Array();
	for (n in store.columns) {
		// if (!store.columns[n].hidden) {
		arr.push(store.columns[n].dataIndex);
		cont++;
		// }
	}
	--cont;
	dataOutput = arr.slice(0, cont);

	encodedHeader = Ext.JSON.encode(dataOutput);
	// console.debug(encodedHeader);
	return encodedHeader;
}
