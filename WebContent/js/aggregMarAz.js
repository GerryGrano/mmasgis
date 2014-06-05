Ext.override(Ext.data.proxy.Ajax, { timeout:270000 });

Ext.onReady(function() {
	Ext.QuickTips.init();

	Ext.define('BrandsAzModel', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'marca',
			type: 'string'
		},{
			name: 'num_pv',
			type: 'real'
		}, {
			name: 'numerica',
			type: 'real'
		}, {
			name: 'pot_pv',
			type: 'real'
		}, {
			name: 'ponderata',
			type: 'real'
		}, {
			name: 'pot_marca',
			type: 'real'
		}, {
			name: 'ind_marca',
			type: 'real'
		}, {
			name: 'eff_marca',
			type: 'real'
		}, {
			name: 'eff_valore',
			type: 'real'
		}]
	});

	var brandsAzToolbar = Ext.create('Ext.toolbar.Toolbar', {
    	height: 60,
    	id: 'brandsAzToolbar',
    	items: [
    	        {
			xtype:'box',
			autoEl: {tag: 'img', src:'img/logo_mmas.png'},
			id: 'mmas', 
		    width : 110,
		    height : 50
		}, '-',
    	{
    	id: 'expStatMarAzBtn',
	    //text: 'Esporta statistiche',
	    icon   : 'img/expView.png',
	    width : 50,
        height : 50,
        scale: 'medium',
	    tooltip: 'esporta il risultato in formato excel',
	    handler: function() {
	        excelExport();
	    }
        },{
    		xtype: 'textfield',
    		id: 'base_num',
    		width: 200,
    		fieldLabel: 'Base Numerica ',
    		readOnly: true
    	},{
    		xtype: 'textfield',
    		id: 'base_pot',
    		width: 200,
    		fieldLabel: 'Base Potenziale ',
    		readOnly: true
    	}]
    });
	
	brandsAzStore = Ext.create('Ext.data.Store', {
		remoteSort: true,
		model: 'BrandsAzModel',
		listeners: {
			load: function(store) {
				//Ext.getCmp('numRow').setText("Numero Anagrafiche: " + store.getCount());
				Ext.getCmp('grigliaAnalisiMarcheAz').setLoading(false);
				
				Ext.getCmp('base_num').setValue(brandsAzGrid.store.getProxy().getReader().rawData.base_num);
				//console.debug(brandsGrid.store.getProxy().getReader().rawData.base_num);
				Ext.getCmp('base_pot').setValue(brandsAzGrid.store.getProxy().getReader().rawData.base_pot);
			}
		},
		reader: {
			type: 'json',
			root: 'selections',
			successProperty: 'success',
			id: 'id'
		},
		proxy: {
			type: 'ajax',
			//idProperty: 'pv_id',
			url: 'http://'+constants.ip+constants.root+constants.servlet,
			reader: {
				type: 'json',
				root: 'results',
				//totalProperty: 'total',
				id: 'id'
			},
			actionMethods: {
				create: 'POST',
				read: 'POST',
				update: 'POST',
				destroy: 'POST'
			},
			extraParams: {
				//selections: selection_string,
				task: 'brandsAnalysisAz',
				censimento: dbname,
				classe: classId,
				reg: reg,
				pro: pro,
				com: com,
				cap: cap,
				parametri: parametri,
				potenziali: potenziali,
				marche: marche
			}
		}
	});
	
	
	
	
	brandsAzGrid = Ext.create('Ext.grid.Panel', {
		frame: true,
		layout: 'fit',
		title: 'Analisi Marche: ' + dbname + ' -> ' + className,
		id: 'grigliaAnalisiMarcheAz',
		store: brandsAzStore,
		selType: 'cellmodel',
		tbar: brandsAzToolbar,
		emptyText: 'Nessun record presente',
		columns: [
		{
			dataIndex: 'base_num',
			name: 'base_num',
			text: 'base_num',
			hidden: true
		},{
			dataIndex: 'base_pot',
			text: 'base_pot',
			hidden: true
		},{
			dataIndex: 'marca',
			flex: 1.8,
			text: "Marca"
		},{
			dataIndex: 'num_pv',
			flex: 1,
			text: "Numerosita' PV"
		}, {
			dataIndex: 'numerica',
			flex: 1,
			text: 'Numerica di marca %'
		}, {
			dataIndex: 'pot_pv',
			flex: 1,
			text: "Potenzialita' PV"
		}, {
			dataIndex: 'ponderata',
			flex: 1,
			text: 'Ponderata %'
		}, {
			dataIndex: 'pot_marca',
			flex: 1,
			text: 'Potenziale di marca'
		}, {
			dataIndex: 'ind_marca',
			flex: 1,
			text: 'Indice di marca %'
		}, {
			dataIndex: 'eff_marca',
			flex: 1,
			text: 'Efficienza marca'
		}, {
			dataIndex: 'eff_valore',
			flex: 1,
			text: 'Efficienza valore'
		}]
	});
		
	new Ext.Viewport({
		frame:true,
		layout: 'fit',
		items: [ brandsAzGrid ],
		listeners : {
			afterrender : function(item) {

				checkAuth('statMarAz');
			}
		}
	});
	
	Ext.getCmp('grigliaAnalisiMarcheAz').setLoading('Caricamento Analisi Marche Azienda');
	brandsAzStore.load();

});
function excelExport() {
	
	
    data = new Array();
    for (i in brandsAzGrid.getStore().data.items) {
        data[i] = brandsAzGrid.getStore().data.items[i].data;
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
    //console.debug(encodedData);
    var form = document.getElementById('estrazioni');
    form.action = 'http://' + constants.ip + constants.root + constants.servlet;
    form.task.value = 'exportStat';
    form.censimento.value = dbname;
    form.selections.value = encodedData;
    form.data_base.value=encodedBase;				//valori da inserire nel file excel
  //personalizzazione commento su prima cella file excel
    form.valore.value=className;
	form.aggregazione.value='Aggregazione Marche Azienda';
//////////////////////////////////////////////////////////
    form.header.value = getExcelHeader('grigliaAnalisiMarcheAz');
    form.submit();	
}
function getExcelHeader(cmp) {
    store = Ext.getCmp(cmp);

       arr = new Array();
    dataOutput = new Array();
    for (n in store.columns) {
        //if (!store.columns[n].hidden) {
            arr.push(store.columns[n].dataIndex);
        //}
    }
    dataOutput = arr.slice(2,12);
	
    encodedHeader = Ext.JSON.encode(dataOutput);
    //console.debug(encodedHeader);
      return encodedHeader;
}