var store;
var grid;
var req;
var ids_array;
var filter_flag = 0;
var check_cliente;
var confirm = "";
var confirm2 = "";
var text = "";
var text2 = "";
var layers = [['REGIONE'], ['PROVINCIA'], ['COMUNE'], ['AREE CAP E COMUNI']];
var excelCustomer='';
var res=new Array();
Ext.onReady(function() {
	Ext.QuickTips.init();
	//"ser","fatt","pot_az","par_az","mar_az"
	
	Ext.define('PvInfo', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'potenziale',
			type : 'real'
		}, {
			name : 'cod_cliente',
			type : 'string'
		}, {
			name : 'fax',
			type : 'string'
		}, {
			name : 'cliente',
			type : 'string'
		}, {
			name : 'titolare',
			type : 'string'
		}, {
			name : 'pv_id',
			type : 'string'
		}, {
			name : 'email',
			type : 'string'
		}, {
			name : 'sito',
			type : 'string'
		}, {
			name : 'cod_mmas',
			type : 'string'
		}, {
			name : 'ragione_sociale',
			type : 'string'
		}, {
			name : 'indirizzo',
			type : 'string'
		}, {
			name : 'cap',
			type : 'string'
		}, {
			name : 'comune',
			type : 'string'
		}, {
			name : 'provincia',
			type : 'string'
		}, {
			name : 'telefono',
			type : 'string'
		}, {
			name : 'telefono2',
			type : 'string'
		}, {
			name : 'telefono3',
			type : 'string'
		}, {
			name : 'codice_fiscale',
			type : 'string'
		}, {
			name : 'data_aggiornamento',
			type : 'data'
		}, {
			name: 'note',
			type: 'string'
		}]
	});

	Ext.define('ClassModelMar', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'text',
			type : 'string'
		}]
	});

	storeBrandsAnalysis = Ext.create('Ext.data.Store', {
		model : 'ClassModelMar',
		autoLoad : true,
		reader : {
			type : 'json',
			root : 'censimento',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				id : 'id'
			},
			actionMethods : {
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			},
			extraParams : {
				task : 'getClass',
				censimento : dbname,
				category : 'mar'
			}
		}
	});

	Ext.define('ClassModelSer', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'text',
			type : 'string'
		}]
	});

	storeServicesAnalysis = Ext.create('Ext.data.Store', {
		model : 'ClassModelSer',
		autoLoad : true,
		reader : {
			type : 'json',
			root : 'censimento',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				id : 'id'
			},
			actionMethods : {
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			},
			extraParams : {
				task : 'getClass',
				censimento : dbname,
				category : 'ser'
			}
		}
	});
	
	Ext.define('ClassModelMarAz', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'text',
			type : 'string'
		}]
	});

	storeBrandsAnalysisAz = Ext.create('Ext.data.Store', {
		model : 'ClassModelMarAz',
		autoLoad : true,
		reader : {
			type : 'json',
			root : 'censimento',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				id : 'id'
			},
			actionMethods : {
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			},
			extraParams : {
				task : 'getClassAz',
				censimento : dbname,
				category : 'mar'
			}
		}
	});

	Ext.define('ClassModelPar', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}]
	});

	storeAggPar = Ext.create('Ext.data.Store', {
		model : 'ClassModelPar',
		autoLoad : true,
		reader : {
			type : 'json',
			root : 'censimento',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				id : 'id'
			},
			actionMethods : {
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			},
			extraParams : {
				task : 'getClass',
				censimento : dbname,
				category : 'par'
			}
		}
	});

	Ext.define('ClassModelParAz', {
		extend : 'Ext.data.Model',
		fields : [
		          // {name:'id',type:'integer'},
		          {
		          	name : 'text',
		          	type : 'string'
		          }]
	});

	storeAggParAz = Ext.create('Ext.data.Store', {
		model : 'ClassModelParAz',
		autoLoad : true,
		reader : {
			type : 'json',
			root : 'censimento',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				id : 'id'
			},
			actionMethods : {
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			},
			extraParams : {
				task : 'getClassAz',
				censimento : dbname,
				category : 'par'
			}
		}
	});

	store = Ext.create('Ext.data.Store', {
		pageSize : 500,
		model : 'PvInfo',
		remoteSort : true,
		listeners : {
			load : function(store) {

				// Ext.getCmp('numRow').setText("Numero Anagrafiche: " +
				// store.getCount());
				Ext.getCmp('griglia').setLoading(false);
			}
		},
		reader : {
			type : 'json',
			root : 'selections',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			idProperty : 'pv_id',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				totalProperty : 'total',
				id : 'id'
			},
			actionMethods : {
				create : 'POST',
				read : 'POST',
				update : 'POST',
				destroy : 'POST'
			},
			extraParams : {
				// selections: selection_string,
				reg : reg,
				pro : pro,
				com : com,
				cap : cap,
				task : 'paging',
				censimento : dbname,
				customer : customer,
				parametri : '',
				marche : '',
				potenziali : '',
				parametriAz : '',
				marcheAz : '',
				potenzialiAz : ''//,
					// servizi: ''
					// sort: init_sort
			}
		}
	});

	Ext.define('ClassModelPot', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}]
	});
	storeAggPot = Ext.create('Ext.data.Store', {
		model : 'ClassModelPot',
		autoLoad : true,
		reader : {
			type : 'json',
			root : 'censimento',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				// successProperty: 'success',
				id : 'id'
			},

			actionMethods : {
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			},
			extraParams : {
				task : 'getClass',
				censimento : dbname,
				category : 'pot'
			}
		}
	});
	var bottomToolbar=Ext.create('Ext.toolbar.Paging', {
		id: 'bottom',
		 beforeLoad : function() {
			 
			 grid.setLoading('Caricamento pagina... Attendere');
		 },
		 store : store,
		 displayInfo : true,
		 beforePageText : 'Pagina',
		 afterPageText : 'di {0}',
		 displayMsg : 'PV visualizzati da {0} a {1} - Totale PV: {2}',
		 emptyMsg : "Nessun record presente",
		 /*
		  * 
		  * pulsante dell'apertura scheda anagrafica utile per l'utilizzo con i tablet
		  * 
		  * 
		  */
		 items: {
		        xtype : 'button',
		        id: 'aprischeda',
			    text: 'Apri Scheda',
			    renderTo: Ext.getBody(),
			    handler: function() {
			    	var selection = grid.getView().getSelectionModel().getSelection()[0];
					 //console.debug(selection.data.pv_id);
			    	/*
			    	 * fa una richiesta al server per conoscere quali tab visualizzare oppure no 
			    	 * a seconda delle tabelle contenute nel censimento o tabelle vuote
			    	 * 
			    	 */
					 Ext.Ajax.request({
				     		url: 'http://' + constants.ip + constants.root + constants.servlet,
					  			params:{
					  				task : 'allGetClass',
					  				id : selection.data.pv_id,
					  				censimento : dbname
					  			},
							  	success: function(response){
							  		var obj = Ext.decode(response.responseText);
							  		showTabPanel(selection.index,obj.results);
							  		
							  	}
					  	});
			    }
		 }
			 
	 });
	
	/////////////////////////////////////////////////////////////
	Ext.define('ClassModelPotAz', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}]
	});
	storeAggPotAz = Ext.create('Ext.data.Store', {
		model : 'ClassModelPot',
		autoLoad : true,
		reader : {
			type : 'json',
			root : 'censimento',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				// successProperty: 'success',
				id : 'id'
			},

			actionMethods : {
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			},
			extraParams : {
				task : 'getClass',
				censimento : dbname,
				category : 'pot_az'
			}
		}
	});
	//////////////////////////////////////////////////////////////
	Ext.define('ClassModelFatt', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}]
	});
	storeAggFatt = Ext.create('Ext.data.Store', {
		model : 'ClassModelFatt',
		autoLoad : true,
		reader : {
			type : 'json',
			root : 'censimento',
			successProperty : 'success',
			id : 'id'
		},
		proxy : {
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			reader : {
				type : 'json',
				root : 'results',
				// successProperty: 'success',
				id : 'id'
			},

			actionMethods : {
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			},
			extraParams : {
				task : 'getClass',
				censimento : dbname,
				category : 'fatt'
			}
		}
	});
	/*
	 * Ext.define('ClassModelSer', { extend: 'Ext.data.Model', fields: [
	 * {name:'id',type:'integer'}, { name:'text', type:'string' }] }); storeAggSer =
	 * Ext.create('Ext.data.Store', { model: 'ClassModelSer', autoLoad: true,
	 * reader: { type: 'json', root: 'censimento', successProperty: 'success', id:
	 * 'id' }, proxy: { type: 'ajax', url: 'http://'+constants.ip+ constants.root +
	 * constants.servlet, reader: { type: 'json', root: 'results',
	 * //successProperty: 'success', id: 'id' },
	 * 
	 * actionMethods: { create: 'GET', read: 'GET', update: 'GET', destroy: 'GET' },
	 * extraParams: { task: 'getClass', censimento: dbname, category: 'ser' } }
	 * });
	 */
	// create the grid
	grid = Ext.create('Ext.grid.Panel', {
		
		frame : true,
		layout : 'fit',
		title : 'Elenco Anagrafiche: ' + dbname,
		id : 'griglia',
		store : store,
		emptyText : 'Nessun record presente',
		columns : [/*
		 * { dataIndex: 'pv_id', flex: 1, text: "id", hidden: true },
		 */{
			 dataIndex : 'cod_mmas',
			 flex : 1,
			 text : 'Codice MMAS'
		 }, {
			 dataIndex : 'cliente',
			 flex : 0.5,
			 text : 'Cliente'
		 }, {
			 dataIndex : 'cod_cliente',
			 flex : 1,
			 text : 'Codice cliente'
		 }, {
			 dataIndex : 'potenziale',
			 flex : 1,
			 text : 'Potenziale MMAS'
		 }, {
			 dataIndex : 'ragione_sociale',
			 flex : 2.5,
			 text : 'Ragione Sociale'
		 }, {
			 dataIndex : 'indirizzo',
			 flex : 2.2,
			 text : 'Indirizzo'
		 }, {
			 dataIndex : 'cap',
			 flex : 0.6,
			 text : 'Cap'
		 }, {
			 dataIndex : 'comune',
			 flex : 1.3,
			 text : 'Comune'
		 }, {
			 dataIndex : 'provincia',
			 flex : 0.6,
			 text : 'Provincia'
		 }, {
			 dataIndex : 'telefono',
			 flex : 1.1,
			 text : 'Telefono'
		 }, {
			 dataIndex : 'telefono2',
			 flex : 1.1,
			 text : 'Telefono 2'
		 }, {
			 dataIndex : 'telefono3',
			 flex : 1.1,
			 text : 'Telefono 3'
		 }, {
			 dataIndex : 'codice_fiscale',
			 flex : 1.1,
			 text : 'C.F./P.IVA'
		 }, {
			 dataIndex : 'titolare',
			 flex : 1,
			 text : 'Titolare',
			 hidden : true
		 }, {
			 dataIndex : 'email',
			 flex : 1,
			 text : 'Mail',
			 hidden : true
		 }, {
			 dataIndex : 'fax',
			 flex : 1,
			 text : 'Fax',
			 hidden : true
		 }, {
			 dataIndex : 'sito',
			 flex : 1,
			 text : 'Sito',
			 hidden : true
		 }],
		 bbar : bottomToolbar/*Ext.create('Ext.PagingToolbar', {
			 beforeLoad : function() {
				 
				 grid.setLoading('Caricamento pagina... Attendere');
			 },
			 store : store,
			 displayInfo : true,
			 beforePageText : 'Pagina',
			 afterPageText : 'di {0}',
			 displayMsg : 'PV visualizzati da {0} a {1} - Totale PV: {2}',
			 emptyMsg : "Nessun record presente",
			 activeItem: 'aprischeda'
				 
		 })*/,
		 dockedItems : [{
			 xtype : 'toolbar',
			 height : 60,
			 // width: 600,
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
				 id : 'filterButton',
				 // text: 'Filtri',
				 icon : 'img/filterGrey.png',
				 width : 50,
				 height : 50,
				 scale : 'medium',
				 tooltip : 'applica filtri ai risultati',
				 cls : 'filterButton',
				 handler : function() {
					 
							  		showFilters(res);
									Ext.getCmp('filterButton').disable();
						  		
							  	
					  
					 
				 }
			 }, '-', {
				 id : 'searchButton',
				 // text: 'Cerca',
				 icon : 'img/searchGrey.png',
				 width : 50,
				 height : 50,
				 scale : 'medium',
				 tooltip : 'cerca nelle anagrafiche',
				 cls : 'searchButton',
				 handler : function() {

					 showSearch();
					 Ext.getCmp('searchButton').disable();
				 }
			 }, '-', {
				 id : 'undoButton',
				 icon : 'img/undoGrey.png',
				 width : 50,
				 height : 50,
				 scale : 'medium',
				 tooltip : 'annulla tutti i filtri',
				 cls : 'undoButton',
				 handler : function() {

					 clearFilter();
				 }
			 }, '-', {
				 id : 'excelButton',
				 icon : 'img/expView.png',
				 width : 50,
				 height : 50,
				 scale : 'medium',
				 tooltip : 'salva anagrafica in formato excel',
				 cls : 'expButton',
				 handler : function() {

					 excelExportAll();
				 }
			 }, '-',
			 /*
			  * { id: 'excelButtonTot', //text: 'Esporta con selezione da finestra',
			  * icon : 'img/expTot.png', width : 50, height : 50,
			  * 
			  * scale: 'medium', tooltip: 'show', cls: 'expTotButton', handler:
			  * function() { showCheck(); } }, '-',
			  */
			 {
				 icon : 'img/pv.png',
				 width : 50,
				 height : 50,
				 id : 'PvAnalysisButton',
				 scale : 'medium',
				 tooltip : 'Analisi potenziale mmas',
				 cls : 'pvButton',
				 handler : function() {

					 Ext.getCmp('PvAnalysisButton').disable();
					 var classePOT = Ext.create('Ext.grid.Panel', {
						 height : 170,
						 id : 'gridAggPot',
						 frame : false,
						 store : storeAggPot,
						 columns : [{
							 text : 'classe potenziali',
							 flex : 2,
							 dataIndex : 'text',
							 resizable : false
						 }, {
							 text : 'id',
							 dataIndex : 'id',
							 hidden : true
						 }],

						 listeners : {
							 /*
							  * itemdblclick: function(dv, record, item, index, e) {
							  * //console.debug(record.data['id']); classe = record.data['id'];
							  * //console.debug(layer); aggregazionePar(classe); }
							  */
						 }
					 });

					 var lcbpv = Ext.create('Ext.FormPanel', {
						 frame : true,
						 items : [{
							 xtype : 'fieldset',
							 flex : 1,
							 title : 'Livello di aggregazione',
							 defaultType : 'radio',
							 layout : 'anchor',
							 defaults : {
								 anchor : '100%',
								 hideEmptyLabel : false
							 },
							 items : [{
								 checked : true,
								 boxLabel : 'Regioni',
								 name : 'liv',
								 inputValue : 'regione'
							 }, {
								 checked : false,
								 boxLabel : 'Province',
								 name : 'liv',
								 inputValue : 'provincia'
							 }, {
								 checked : false,
								 boxLabel : 'Comuni',
								 name : 'liv',
								 inputValue : 'comune'
							 }, {
								 checked : false,
								 boxLabel : 'Aree CAP e comuni',
								 name : 'liv',
								 inputValue : 'cap'
							 }]
						 }]

					 });
					 var w3 = new Ext.Window({
						 height : 380,
						 width : 350,
						 title : "Analisi distribuzione pv",
						 resizable : false,
						 items : [classePOT, lcbpv],
						 dockedItems : [{
							 xtype : 'toolbar',
							 dock : 'bottom',
							 items : [{
								 xtype : 'tbfill'
							 }, {
								 text : 'Apri',
								 icon : 'img/ok.png',
								 scale : 'medium',
								 handler : function() {

									 var selectionPot = classePOT.getView().getSelectionModel().getSelection()[0];
									 aggregazioneTerr(selectionPot.data.id, lcbpv.getForm().getFieldValues().liv);
								 }
							 }]
						 }],
						 listeners : {
							 beforeclose : function() {

								 Ext.getCmp('PvAnalysisButton').enable();

							 }

						 }
					 });
					 w3.show();
					 w3.center();
					 // Ext.getCmp('PvAnalysisButton').disable();
				 }
			 }, '-', {
				 icon : 'img/par.png',
				 width : 50,
				 height : 50,
				 id : 'ParAnalysisButton',
				 scale : 'medium',
				 tooltip : 'crea statistiche in base a parametri',
				 cls : 'parButton',
				 handler : function() {

					 Ext.getCmp('ParAnalysisButton').disable();
					 var fpb3 = Ext.create('Ext.grid.Panel', {
						 height : 170,
						 id : 'gridAggPar',
						 frame : false,
						 store : storeAggPar,
						 columns : [{
							 text : 'classe di aggreagazione',
							 flex : 2,
							 dataIndex : 'text',
							 resizable : false
						 }, {
							 text : 'id',
							 dataIndex : 'id',
							 hidden : true
						 }],
						 listeners : {
							 /*
							  * itemdblclick: function(dv, record, item, index, e) {
							  * //console.debug(record.data['id']); classe = record.data['id'];
							  * //console.debug(layer); aggregazionePar(classe); }
							  */
						 }
					 });

					 var lcb = Ext.create('Ext.FormPanel', {
						 frame : true,
						 items : [{
							 xtype : 'fieldset',
							 flex : 1,
							 title : 'Livello di aggregazione',
							 defaultType : 'radio',
							 layout : 'anchor',
							 defaults : {
								 anchor : '100%',
								 hideEmptyLabel : false
							 },
							 items : [{
								 checked : true,
								 boxLabel : 'Regioni',
								 name : 'liv',
								 inputValue : 'reg'
							 }, {
								 checked : false,
								 boxLabel : 'Province',
								 name : 'liv',
								 inputValue : 'pro'
							 }, {
								 checked : false,
								 boxLabel : 'Comuni',
								 name : 'liv',
								 inputValue : 'com'
							 }, {
								 checked : false,
								 boxLabel : 'Aree CAP e comuni',
								 name : 'liv',
								 inputValue : 'cap'
							 }]
						 }]

					 });

					 var w3 = new Ext.Window({
						 height : 380,
						 width : 350,
						 title : "Aggregazione Parametri",
						 resizable : false,
						 items : [fpb3, lcb],
						 dockedItems : [{
							 xtype : 'toolbar',
							 dock : 'bottom',
							 items : [{
								 xtype : 'tbfill'
							 }, {
								 text : 'Apri',
								 icon : 'img/ok.png',
								 scale : 'medium',
								 handler : function() {

									 var selection = fpb3.getView().getSelectionModel().getSelection()[0];
									 aggregazionePar(selection.data.id, lcb.getForm().getFieldValues().liv);
								 }
							 }]
						 }],
						 listeners : {
							 beforeclose : function() {

								 Ext.getCmp('ParAnalysisButton').enable();
							 }
						 }
					 });
					 w3.show();
					 w3.center();
					 // Ext.getCmp('ParAnalysisButton').disable();
				 }
			 }]
		 }],
		 listeners : {
			 itemdblclick : function(dv, record, item, index, e) {
				 //console.debug('click');
				 //console.debug(dv);
				 //console.debug(record);
				 //console.debug(item);
				 //console.debug(index);
				 var selection = grid.getView().getSelectionModel().getSelection()[0];
				 //console.debug(selection.data.pv_id);
				 /*
			    	 * fa una richiesta al server per conoscere quali tab visualizzare oppure no 
			    	 * a seconda delle tabelle contenute nel censimento o tabelle vuote
			    	 * 
			    	 */
				 Ext.Ajax.request({
			     		url: 'http://' + constants.ip + constants.root + constants.servlet,
				  			params:{
				  				task : 'allGetClass',
							//category : 'ser',
							id : selection.data.pv_id,
							censimento : dbname
				  			},
						  	success: function(response){
						  		var obj = Ext.decode(response.responseText);
						  		//console.debug(obj);
						  		//console.debug(obj.results.length);
						  		//ser=obj.results.length;
						  		showTabPanel(selection.index,obj.results);
						  		
						  	}
				  	});
				 //console.debug(selection.index);
				 //showTabPanel(selection.index);
			 }
		 }
	});
	
	brandsBtn=Ext.create('Ext.button.Button',{
		 icon : 'img/mar.png',
		 width : 50,
		 height : 50,
		 id : 'brandsAnalysisButton',
		 scale : 'medium',
		 tooltip : 'crea statistiche in base a categorie e marche',
		 cls : 'marButton',
		 handler : function() {

			 Ext.getCmp('brandsAnalysisButton').disable();
			 var fpb = Ext.create('Ext.grid.Panel', {
				 height : 342,
				 id : 'gridBrandsAnalysis',
				 frame : false,
				 store : storeBrandsAnalysis,
				 columns : [{
					 text : 'Classificazione marche',
					 flex : 1,
					 dataIndex : 'text',
					 resizable : false
				 }, {
					 text : 'id',
					 dataIndex : 'id',
					 hidden : true
				 }],
				 listeners : {
					 itemdblclick : function(dv, record, item, index, e) {

						 /*
						  * Fires when an item is double clicked.
						  * 
						  * Available since: 4.0.0
						  * 
						  * Parameters this : Ext.view.View record : Ext.data.Model The
						  * record that belongs to the item item : HTMLElement The item's
						  * element index : Number The item's index e : Ext.EventObject
						  * The raw event object eOpts : Object The options object passed
						  * to Ext.util.Observable.addListener.
						  * 
						  */
						 // console.debug(record.data['id']);
						 classId = record.data['id'];
						 className = record.data['text'];
						 brandsAnalysis(classId, className);
					 }
				 }
			 });

			 var w = new Ext.Window({
				 height : 385,
				 width : 350,
				 title : "Aggregazione Marche",
				 resizable : false,
				 items : [fpb],
				 dockedItems : [{
					 xtype : 'toolbar',
					 dock : 'bottom',
					 items : [{
						 xtype : 'tbfill'
					 }, {
						 text : 'Apri',
						 icon : 'img/ok.png',
						 scale : 'medium',
						 handler : function() {

							 var selection = fpb.getView().getSelectionModel().getSelection()[0];
							 brandsAnalysis(selection.data.id, selection.data.text);
						 }
					 }]
				 }],
				 listeners : {
					 beforeclose : function() {

						 Ext.getCmp('brandsAnalysisButton').enable();
					 }
				 }
			 });
			 w.show();
			 w.center();
			 // Ext.getCmp('brandsAnalysisButton').disable();
		 }
	 });
	// !!!!!!!!!!!!PARTE PERSONALIZZATI --> custom == 1
	serBtn=Ext.create('Ext.button.Button',{
		 icon : 'img/ser.png',
		 width : 50,
		 height : 50,
		 id : 'servicesAnalysisButton',
		 scale : 'medium',
		 tooltip : 'crea statistiche in base ai servizi',
		 cls : 'serButton',
		 handler : function() {
			 Ext.getCmp('servicesAnalysisButton').disable();
			 var fpb = Ext.create('Ext.grid.Panel', {
				 height : 342,
				 id : 'gridservicesAnalysis',
				 frame : false,
				 store : storeServicesAnalysis,
				 columns : [{
					 text : 'Classificazione servizi',
					 flex : 1,
					 dataIndex : 'text',
					 resizable : false
				 }, {
					 text : 'id',
					 dataIndex : 'id',
					 hidden : true
				 }],
				 listeners : {
					 itemdblclick : function(dv, record, item, index, e) {

						 /*
						  * Fires when an item is double clicked.
						  * 
						  * Available since: 4.0.0
						  * 
						  * Parameters this : Ext.view.View record : Ext.data.Model The
						  * record that belongs to the item item : HTMLElement The item's
						  * element index : Number The item's index e : Ext.EventObject
						  * The raw event object eOpts : Object The options object passed
						  * to Ext.util.Observable.addListener.
						  * 
						  */
						 // console.debug(record.data['id']);
						 classId = record.data['id'];
						 //console.log(classId);
						 className = record.data['text'];
						 
						 // console.log(className);
						 servicesAnalysis(classId, className);
					 }
				 }
			 });

			 var w = new Ext.Window({
				 height : 385,
				 width : 350,
				 title : "Aggregazione Servizi",
				 resizable : false,
				 items : [fpb],
				 dockedItems : [{
					 xtype : 'toolbar',
					 dock : 'bottom',
					 items : [{
						 xtype : 'tbfill'
					 }, {
						 text : 'Apri',
						 icon : 'img/ok.png',
						 scale : 'medium',
						 handler : function() {

							 var selection = fpb.getView().getSelectionModel().getSelection()[0];
							 servicesAnalysis(selection.data.id, selection.data.text);
						 }
					 }]
				 }],
				 listeners : {
					 beforeclose : function() {

						 Ext.getCmp('servicesAnalysisButton').enable();
					 }
				 }
			 });
			 w.show();
			w.center();
		 }
	});
	Ext.Ajax.request({
 		url: 'http://' + constants.ip + constants.root + constants.servlet,
  			params:{
  				task : 'findTableClassTask',
  				censimento : dbname
  			},
		  	success: function(response){
		  		var obj = Ext.decode(response.responseText);
		  		//console.debug(obj.results);
		  		for(var i=0;i<5;i++){
		  			res[i]=obj.results[i];
		  		}
		  		//console.debug("ser "+res[0]);
		  		//console.debug("fatt "+res[1]);
		  		//console.debug("pot_az "+res[2]);
		  		//console.debug("par_az "+res[3]);
		  		//console.debug("mar_az "+res[4]);
		  		if(res[0]!='0'){
		  			grid.down('toolbar').add('-');
		  			grid.down('toolbar').add(serBtn);
		  		}
		  		grid.down('toolbar').add('-');
		  		grid.down('toolbar').add(brandsBtn);
		  		if (custom == '1') {

		  			fattBtn=Ext.create('Ext.button.Button',{
		  					 icon : 'img/fatt.png',
		  					 width : 50,
		  					 height : 50,
		  					 id : 'FattAnalysisButton',
		  					 scale : 'medium',
		  					 tooltip : 'Analisi fatturati',
		  					 cls : 'fattButton',
		  					 handler : function() {

		  						 Ext.getCmp('FattAnalysisButton').disable();
		  						 var classeFATT = Ext.create('Ext.grid.Panel', {
		  							 height : 170,
		  							 id : 'gridAggFatt',
		  							 frame : false,
		  							 store : storeAggFatt,
		  							 columns : [{
		  								 text : 'classe fatturati',
		  								 flex : 2,
		  								 dataIndex : 'text',
		  								 resizable : false
		  							 }, {
		  								 text : 'id',
		  								 dataIndex : 'id',
		  								 hidden : true
		  							 }],

		  							 listeners : {
		  								 /*
		  								  * itemdblclick: function(dv, record, item, index, e) {
		  								  * //console.debug(record.data['id']); classe = record.data['id'];
		  								  * //console.debug(layer); aggregazionePar(classe); }
		  								  */
		  							 }
		  						 });

		  						 var lcbfatt = Ext.create('Ext.FormPanel', {
		  							 frame : true,
		  							 items : [{
		  								 xtype : 'fieldset',
		  								 flex : 1,
		  								 title : 'Livello di aggregazione',
		  								 defaultType : 'radio',
		  								 layout : 'anchor',
		  								 defaults : {
		  									 anchor : '100%',
		  									 hideEmptyLabel : false
		  								 },
		  								 items : [{
		  									 checked : true,
		  									 boxLabel : 'Regioni',
		  									 name : 'liv',
		  									 inputValue : 'regione'
		  								 }, {
		  									 checked : false,
		  									 boxLabel : 'Province',
		  									 name : 'liv',
		  									 inputValue : 'provincia'
		  								 }, {
		  									 checked : false,
		  									 boxLabel : 'Comuni',
		  									 name : 'liv',
		  									 inputValue : 'comune'
		  								 }, {
		  									 checked : false,
		  									 boxLabel : 'Aree CAP e comuni',
		  									 name : 'liv',
		  									 inputValue : 'cap'
		  								 }]
		  							 }]

		  						 });
		  						 var w3 = new Ext.Window({
		  							 height : 380,
		  							 width : 350,
		  							 title : "Analisi distribuzione fatturati",
		  							 resizable : false,
		  							 items : [classeFATT, lcbfatt],
		  							 dockedItems : [{
		  								 xtype : 'toolbar',
		  								 dock : 'bottom',
		  								 items : [{
		  									 xtype : 'tbfill'
		  								 }, {
		  									 text : 'Apri',
		  									 icon : 'img/ok.png',
		  									 scale : 'medium',
		  									 handler : function() {

		  										 var selectionPot = classeFATT.getView().getSelectionModel().getSelection()[0];
		  										 aggregazioneTerrFatt(selectionPot.data.id, lcbfatt.getForm().getFieldValues().liv);
		  									 }
		  								 }]
		  							 }],
		  							 listeners : {
		  								 beforeclose : function() {

		  									 Ext.getCmp('FattAnalysisButton').enable();

		  								 }

		  							 }
		  						 });
		  						 w3.show();
		  						 w3.center();
		  						 // Ext.getCmp('FattAnalysisButton').disable();
		  					 }
		  				 
		  			});
		  			////////////////////
		  			potAziendaBtn=Ext.create('Ext.button.Button',{
		  				 icon : 'img/pvAz.png',
		  				 width : 50,
		  				 height : 50,
		  				 id : 'PvAzAnalysisButton',
		  				 scale : 'medium',
		  				 tooltip : 'Analisi potenziale azienda mmas',
		  				 cls : 'pvButton',
		  				 handler : function() {

		  					 Ext.getCmp('PvAzAnalysisButton').disable();
		  					 var classePOTaz = Ext.create('Ext.grid.Panel', {
		  						 height : 170,
		  						 id : 'gridAggPotAz',
		  						 frame : false,
		  						 store : storeAggPotAz,
		  						 columns : [{
		  							 text : 'classe potenziali azienda',
		  							 flex : 2,
		  							 dataIndex : 'text',
		  							 resizable : false
		  						 }, {
		  							 text : 'id',
		  							 dataIndex : 'id',
		  							 hidden : true
		  						 }],

		  						 listeners : {
		  							 /*
		  							  * itemdblclick: function(dv, record, item, index, e) {
		  							  * //console.debug(record.data['id']); classe = record.data['id'];
		  							  * //console.debug(layer); aggregazionePar(classe); }
		  							  */
		  						 }
		  					 });

		  					 var lcbpvAz = Ext.create('Ext.FormPanel', {
		  						 frame : true,
		  						 items : [{
		  							 xtype : 'fieldset',
		  							 flex : 1,
		  							 title : 'Livello di aggregazione',
		  							 defaultType : 'radio',
		  							 layout : 'anchor',
		  							 defaults : {
		  								 anchor : '100%',
		  								 hideEmptyLabel : false
		  							 },
		  							 items : [{
		  								 checked : true,
		  								 boxLabel : 'Regioni',
		  								 name : 'liv',
		  								 inputValue : 'regione'
		  							 }, {
		  								 checked : false,
		  								 boxLabel : 'Province',
		  								 name : 'liv',
		  								 inputValue : 'provincia'
		  							 }, {
		  								 checked : false,
		  								 boxLabel : 'Comuni',
		  								 name : 'liv',
		  								 inputValue : 'comune'
		  							 }, {
		  								 checked : false,
		  								 boxLabel : 'Aree CAP e comuni',
		  								 name : 'liv',
		  								 inputValue : 'cap'
		  							 }]
		  						 }]

		  					 });
		  					 var w3 = new Ext.Window({
		  						 height : 380,
		  						 width : 350,
		  						 title : "Analisi distribuzione pv azienda",
		  						 resizable : false,
		  						 items : [classePOTaz, lcbpvAz],
		  						 dockedItems : [{
		  							 xtype : 'toolbar',
		  							 dock : 'bottom',
		  							 items : [{
		  								 xtype : 'tbfill'
		  							 }, {
		  								 text : 'Apri',
		  								 icon : 'img/ok.png',
		  								 scale : 'medium',
		  								 handler : function() {

		  									 var selectionPotAz = classePOTaz.getView().getSelectionModel().getSelection()[0];
		  									 aggregazioneTerrAz(selectionPotAz.data.id, lcbpvAz.getForm().getFieldValues().liv);
		  								 }
		  							 }]
		  						 }],
		  						 listeners : {
		  							 beforeclose : function() {

		  								 Ext.getCmp('PvAzAnalysisButton').enable();

		  							 }

		  						 }
		  					 });
		  					 w3.show();
		  					 w3.center();
		  					 // Ext.getCmp('PvAnalysisButton').disable();
		  				 }
		  			 });
		  			////////////////////
		  			parAziendaBtn = Ext.create('Ext.button.Button', {
		  				id : 'ParAzAnalysisButton',
		  				icon : 'img/parAz.png',
		  				width : 50,
		  				height : 50,
		  				scale : 'medium',
		  				tooltip : 'crea statistiche in base a parametri aziendali',
		  				handler : function() {

		  					Ext.getCmp('ParAzAnalysisButton').disable();
		  					var fpb4 = Ext.create('Ext.grid.Panel', {
		  						height : 170,
		  						id : 'gridAggParAz',
		  						frame : false,
		  						store : storeAggParAz,
		  						columns : [{
		  							text : 'classe di aggreagazione',
		  							flex : 2,
		  							dataIndex : 'text',
		  							resizable : false
		  						}, {
		  							text : 'id',
		  							dataIndex : 'id',
		  							hidden : true
		  						}]
		  					});

		  					var lcb = Ext.create('Ext.FormPanel', {
		  						frame : true,
		  						items : [{
		  							xtype : 'fieldset',
		  							flex : 1,
		  							title : 'Livello di aggregazione',
		  							defaultType : 'radio',
		  							layout : 'anchor',
		  							defaults : {
		  								anchor : '100%',
		  								hideEmptyLabel : false
		  							},
		  							items : [{
		  								checked : true,
		  								boxLabel : 'Regioni',
		  								name : 'liv',
		  								inputValue : 'reg'
		  							}, {
		  								checked : false,
		  								boxLabel : 'Province',
		  								name : 'liv',
		  								inputValue : 'pro'
		  							}, {
		  								checked : false,
		  								boxLabel : 'Comuni',
		  								name : 'liv',
		  								inputValue : 'com'
		  							}, {
		  								checked : false,
		  								boxLabel : 'Aree CAP e comuni',
		  								name : 'liv',
		  								inputValue : 'cap'
		  							}]
		  						}]
		  					});

		  					var w4 = new Ext.Window({
		  						height : 380,
		  						width : 350,
		  						title : "Aggregazione Parametri Azienda",
		  						resizable : false,
		  						items : [fpb4, lcb],
		  						dockedItems : [{
		  							xtype : 'toolbar',
		  							dock : 'bottom',
		  							items : [{
		  								xtype : 'tbfill'
		  							}, {
		  								text : 'Apri',
		  								icon : 'img/ok.png',
		  								scale : 'medium',
		  								handler : function() {

		  									var selection = fpb4.getView().getSelectionModel().getSelection()[0];
		  									aggregazioneParAzienda(selection.data.id, lcb.getForm().getFieldValues().liv);
		  								}
		  							}]
		  						}],
		  						listeners : {
		  							beforeclose : function() {

		  								Ext.getCmp('ParAzAnalysisButton').enable();
		  							}
		  						}
		  					});
		  					w4.show();
		  					w4.center();
		  					// Ext.getCmp('ParAzAnalysisButton').disable();
		  				}
		  			});

		  			marAziendaBtn = Ext.create('Ext.button.Button', {
		  				id : 'brandsAnalysisAzButton',
		  				icon : 'img/marAz.png',
		  				width : 50,
		  				height : 50,
		  				scale : 'medium',
		  				tooltip : 'crea statistiche in base a marche aziendali',
		  				handler : function() {

		  					Ext.getCmp('brandsAnalysisAzButton').disable();
		  					var fpb = Ext.create('Ext.grid.Panel', {
		  						height : 342,
		  						id : 'gridBrandsAnalysisAz',
		  						frame : false,
		  						store : storeBrandsAnalysisAz,
		  						columns : [{
		  							text : 'Classificazione marche',
		  							flex : 1,
		  							dataIndex : 'text',
		  							resizable : false
		  						}, {
		  							text : 'id',
		  							dataIndex : 'id',
		  							hidden : true
		  						}],
		  						listeners : {
		  							itemdblclick : function(dv, record, item, index, e) {

		  								// console.debug(record.data['id']);
		  								classId = record.data['id'];
		  								className = record.data['text'];
		  								brandsAnalysisAz(classId, className);
		  							}
		  						}
		  					});

		  					var w = new Ext.Window({
		  						height : 375,
		  						width : 350,
		  						title : "Aggregazione Marche Azienda",
		  						resizable : false,
		  						items : [fpb],
		  						dockedItems : [{
		  							xtype : 'toolbar',
		  							dock : 'bottom',
		  							items : [{
		  								xtype : 'tbfill'
		  							}, {
		  								text : 'Apri',
		  								icon : 'img/ok.png',
		  								scale : 'medium',
		  								handler : function() {

		  									var selection = fpb.getView().getSelectionModel().getSelection()[0];
		  									brandsAnalysisAz(selection.data.id, selection.data.text);
		  								}
		  							}]
		  						}],
		  						listeners : {
		  							beforeclose : function() {

		  								Ext.getCmp('brandsAnalysisAzButton').enable();
		  							}
		  						}
		  					});
		  					w.show();
		  					w.center();
		  					// Ext.getCmp('brandsAnalysisAzButton').disable();
		  				}
		  			});
		  			if(res[1]!='0'){
		  				grid.down('toolbar').add('-');
		  				grid.down('toolbar').add(fattBtn);
		  			}
		  			if(res[2]!='0'){
		  				grid.down('toolbar').add('-');
		  				grid.down('toolbar').add(potAziendaBtn);
		  			}
		  			if(res[3]!='0'){
		  				grid.down('toolbar').add('-');
		  				grid.down('toolbar').add(parAziendaBtn);
		  			}
		  			if(res[4]!='0'){
		  				grid.down('toolbar').add('-');
		  				grid.down('toolbar').add(marAziendaBtn);
		  			}

		  		}
		  	}
  	});		
	//console.debug(res);
	// Ext.getCmp('brandsAnalysisButton').disable();
	//console.debug('prova: '+res[0]);
	

	new Ext.Viewport({
		frame : true,
		layout : 'fit',
		items : [grid],
		listeners : {
			afterrender : function(item) {

				checkAuth('grid');
			}
		}
	});

	store.loadPage(1);
	
	function showTabPanel(index,results) {
		//var selection = grid.getView().getSelectionModel().getSelection()[0];
		
		var store = grid.getStore();
		var selModel = grid.getSelectionModel();
		var selection = selModel.getLastSelected();
		
		if (selection.data.cliente == 'Si') {
			check_cliente = true;
		}
		else{
			check_cliente = false;
		}
		
		var headerTab = Ext.create('Ext.form.Panel', {
			frame : true,
			width : '100%',
			// bodyPadding: 15,
			fieldDefaults : {
				labelAlign : 'left',
				labelWidth : 100,
				anchor : '100%'
			},
			xtype : 'form',
			/** INIZIO* */
			items : [{
				layout : 'column',
				defaults : {
					columnWidth : 0.3,
					layout : 'form',
					border : false,
					xtype : 'panel'
				},
				bodyStyle : 'padding:10px;background-color:#F1F1F1',
				// bodyStyle: 'padding:5px 0 5px 9px;background-color:#F1F1F1',
				items : [{

					xtype : 'displayfield',
					name : 'codice_mmas',
					fieldLabel : 'Codice MMAS',
					value : selection.data.cod_mmas

				}, {

					xtype : 'checkboxfield',
					name : 'cliente',
					fieldLabel : 'Cliente',
					checked : check_cliente,
					readOnly : true
				}, {

					xtype : 'displayfield',
					name : 'cod_cliente',
					fieldLabel : 'Codice Cliente',
					value : selection.data.cod_cliente
				},{
					xtype: 'displayfield',
					border: true,
					labelWidth: 100,
					name: 'data_aggiornamento',
					readOnly: true,
					fieldLabel: 'Aggiornamento',
					value: aggData(selection.data.data_aggiornamento)
				}]
			}]
		});

		var f = Ext.create('Ext.form.Panel', {
			frame : true,
			width : '100%',
			// bodyPadding: 15,
			// bodyStyle: 'padding:5px;background-color:#3b3b3d',
			fieldDefaults : {
				labelAlign : 'left',
				labelWidth : 100,
				anchor : '100%'
			},
			xtype : 'form',
			items : [{
				layout : 'column',
				defaults : {
					columnWidth : 0.5,
					layout : 'form',
					border : false,
					xtype : 'panel',
					bodyStyle : 'padding:0 9px 0 9px'
				},
				items : [{
					bodyStyle : 'padding:0 9px 0 9px',
					items : [{
						xtype : 'hiddenfield',
						name : 'id',
						value: selection.data.pv_id
					}, {
						xtype : 'textfield',
						name : 'ragione_sociale',
						fieldLabel : 'Ragione Sociale',
						value : selection.data.ragione_sociale
					}, {
						xtype : 'textfield',
						name : 'titolare',
						fieldLabel : 'Titolare',
						value : selection.data.titolare
					}, {
						xtype : 'textfield',
						name : 'codice_fiscale',
						fieldLabel : 'Cod. Fis./P. IVA',
						value : selection.data.codice_fiscale
					}, {
						xtype : 'fieldcontainer',
						// fieldLabel: 'Password',
						layout : {
							type : 'hbox',
							align : 'stretch'
						},
						items : [{
							xtype : 'textfield',
							margins : '0 15 0 0',
							border : false,
							labelWidth : 100,
							// minWidth: 0,
							name : 'potenziale_mmas',
							readOnly : true,
							fieldLabel : "Potenziale MMAS",
							value : pot(selection.data.potenziale)
						}]
					}, {
						xtype : 'textfield',
						name : 'indirizzo',
						fieldLabel : 'Indirizzo',
						value : selection.data.indirizzo
					}, {
						xtype : 'fieldcontainer',
						layout : {
							type : 'hbox',
							align : 'strech'
						},
						items : [{
							xtype : 'textfield',
							margins : '0 15 0 0',
							border : false,
							labelWidth : 100,
							minWidth : 60,
							name : 'provincia',
							fieldLabel : 'Provincia',
							value : selection.data.provincia
						}, {
							xtype : 'textfield',
							border : false,
							labelWidth : 60,
							// minWidth: 200,
							fieldLabel : 'Cap',
							name : 'Cap',
							value : selection.data.cap
						}]
					}, {
						xtype : 'textfield',
						name : 'comune',
						fieldLabel : 'Comune',
						value : selection.data.comune
					}]
				}, {
					bodyStyle : 'padding:3px 9px 0 9px',
					items : [{
						xtype : 'textfield',
						fieldLabel : 'Telefono',
						name : 'telefono',
						value : selection.data.telefono
					}, {
						xtype : 'textfield',
						fieldLabel : 'Telefono 1',
						name : 'telefono1',
						value : aggTel(selection.data.telefono2)
					}, {
						xtype : 'textfield',
						fieldLabel : 'Telefono 2',
						name : 'telefono2',
						value : aggTel(selection.data.telefono3)
					}, {
						xtype : 'textfield',
						name : 'email',
						fieldLabel : 'Mail',
						value : selection.data.email
					}, {
						xtype : 'textfield',
						fieldLabel : 'Fax',
						name : 'fax',
						value : selection.data.fax
					}, {
						xtype : 'textfield',
						fieldLabel : 'Sito',
						name : 'sito',
						value : selection.data.sito
					}/*
					 * , { xtype: 'textfield', fieldLabel: 'Altro', readOnly: true,
					 * name: 'sito', //value: selection.data.sito }
					 */
					]
				}]
			}]
		});
		var tabs = Ext.createWidget('tabpanel', {
			id : 'tabs',
			renderTo : document.body,
			height : 260,
			plain : true,
			defaults : {
				layout : 'fit',
				bodyPadding : 0
			}

		});
		//servicesGridFactory(selection.data.pv_id);
		tabs.add({
			title : 'Potenziali MMAS',
			closable : false,
			items : potentialsGridFactory(selection.data.pv_id)
		});
		tabs.add({
			title : 'Parametri MMAS',
			closable : false,
			items : parametersGridFactory(selection.data.pv_id)
		});
		tabs.add({
			title : 'Marche MMAS',
			closable : false,
			items : brandsGridFactory(selection.data.pv_id)
		});
		//console.debug(serLength);
		if(results[0]!='0'){
			//console.debug(serLength);
			tabs.add({
				title : 'Servizi MMAS',
				closable : false,
				items : servicesGridFactory(selection.data.pv_id)
			});
		}
		tabs.add({
			title : 'Note',
			closable : false,
			items : noteGridFactory(selection.data.pv_id)
		});


		if (custom == '1') {
			if(results[1]!='0'){
				tabs.add({
					title : 'Fatturati',
					closable : false,
					items : fatturatiGridFactory(selection.data.pv_id)
				});
			}
			if(results[2]!='0'){
				tabs.add({
					title : 'Potenziali Az',
					itemId : 'pot_az',
					closable : false,
					items : potentialsAziendaFactory(selection.data.pv_id)
				});
			}
			if(results[3]!='0'){
				tabs.add({
					title : 'Parametri Az',
					itemId : 'par_az',
					closable : false,
					items : parametersAziendaFactory(selection.data.pv_id)
				});
			}
			if(results[4]!='0'){
				tabs.add({
					title : 'Marche Az',
					itemId : 'mar_az',
					closable : false,
					items : brandsAziendaFactory(selection.data.pv_id)
				});
			}
		}

		var w = new Ext.Window({
			height : 580,
			width : 960,
			minHeight : 460,
			minWidth : 800,
			resizable : true,
			modal: true,

			title : "scheda Anagrafica di " + selection.data.ragione_sociale,
			items : [headerTab, f, tabs],
			dockedItems: [{ 
			  xtype:'toolbar', 
			  dock:'top', 
			  items: [
			  {
					icon : 'img/first.png',
					id : 'FirstButton',
					width : 24,
					height : 24,
				   	xtype:'button',
				   	tooltip : 'First',
				    handler: function() {
				    	w.close();
					        	
					    var recordIndex = 0;
					    var nextRecord = store.getAt(recordIndex);
					    selModel.select(nextRecord);
					    var selection=selModel.getLastSelected();
					    /*
				    	 * fa una richiesta al server per conoscere quali tab visualizzare oppure no 
				    	 * a seconda delle tabelle contenute nel censimento o tabelle vuote
				    	 * 
				    	 */  		
					    Ext.Ajax.request({
				     		url: 'http://' + constants.ip + constants.root + constants.servlet,
					  			params:{
					  				task : 'allGetClass',
					  				//category : 'ser',
					  				id : selection.data.pv_id,
					  				censimento : dbname
					  			},
							  	success: function(response){
							  		var obj = Ext.decode(response.responseText);
							  		//console.debug(obj);
							  		//console.debug(obj.results.length);
							  		//ser=obj.results.length;
							  		showTabPanel(recordIndex,obj.results);
							  		
							  	}
					  	});
					}
	   	      }, 
			  {
	   	    	  	icon : 'img/back.png',
	   	    	  	id : 'BackButton',
					width : 24,
					height : 24,
			   		xtype:'button',
			   		tooltip : 'Back',
			        handler: function() {
			        	w.close();
			        	
			      		var recordIndex = store.indexOf(selection);
			      		var nextRecord = store.getAt(recordIndex - 1);
			      		selModel.select(nextRecord);
			      		var sel=selModel.getLastSelected();
			      		/*
				    	 * fa una richiesta al server per conoscere quali tab visualizzare oppure no 
				    	 * a seconda delle tabelle contenute nel censimento o tabelle vuote
				    	 * 
				    	 */
			      		Ext.Ajax.request({
				     		url: 'http://' + constants.ip + constants.root + constants.servlet,
					  			params:{
					  				task : 'allGetClass',
					  				//category : 'ser',
					  				id : sel.data.pv_id,
					  				censimento : dbname
					  			},
							  	success: function(response){
							  		var obj = Ext.decode(response.responseText);
							  		//console.debug(obj);
							  		//console.debug(obj.results.length);
							  		//ser=obj.results.length;
							  		showTabPanel(recordIndex - 1,obj.results);
							  		
							  	}
					  	});
					}
			    }, 
			  	{
			    	icon : 'img/next.png',
	   	    	  	id : 'NextButton',
					width : 24,
					height : 24,
			   		xtype:'button',
			   		tooltip : 'Next',
			        handler: function() {
			        	w.close();
			        	
			      		var recordIndex = store.indexOf(selection);
			      		var nextRecord = store.getAt(recordIndex + 1);
			      		selModel.select(nextRecord);
			      		var sel=selModel.getLastSelected();
			      		/*
				    	 * fa una richiesta al server per conoscere quali tab visualizzare oppure no 
				    	 * a seconda delle tabelle contenute nel censimento o tabelle vuote
				    	 * 
				    	 */
			      		Ext.Ajax.request({
				     		url: 'http://' + constants.ip + constants.root + constants.servlet,
					  			params:{
					  				task : 'allGetClass',
					  				//category : 'ser',
					  				id : sel.data.pv_id,
								    censimento : dbname
					  			},
							  	success: function(response){
							  		var obj = Ext.decode(response.responseText);
							  		//console.debug(obj);
							  		//console.debug(obj.results.length);
							  		//ser=obj.results.length;
							  		showTabPanel(recordIndex + 1,obj.results);
							  		
							  	}
					  	});
					}
			    },
			  	{
			    	icon : 'img/last.png',
	   	    	  	id : 'LastButton',
					width : 24,
					height : 24,
			   		xtype:'button',
			   		tooltip : 'Last',
			        handler: function() {
			        	w.close();
			        	
			      		var recordIndex = 499;
			      		var nextRecord = store.getAt(recordIndex);
			      		//console.debug("Ultimo: "+selModel.select(nextRecord));
			      		selModel.select(nextRecord);
			      		var selection=selModel.getLastSelected();
			      		//console.debug(selection);
			      		/*
				    	 * fa una richiesta al server per conoscere quali tab visualizzare oppure no 
				    	 * a seconda delle tabelle contenute nel censimento o tabelle vuote
				    	 * 
				    	 */
			      		Ext.Ajax.request({
				     		url: 'http://' + constants.ip + constants.root + constants.servlet,
					  			params:{
					  				task : 'allGetClass',
					  				//category : 'ser',
					  				id : selection.data.pv_id,
					  				censimento : dbname
					  			},
							  	success: function(response){
							  		var obj = Ext.decode(response.responseText);
							  		//console.debug(obj);
							  		//console.debug(obj.results.length);
							  		//ser=obj.results.length;
							  		showTabPanel(recordIndex,obj.results);
							  		
							  	}
					  	});
					}
			    },'-' ,
			  	//{xtype: 'tbfill'}, 
			  	{
			    	icon : 'img/pdfNEW.png',
	   	    	  	id : 'PDFButton',
					width : 30,
					height : 30,
			   		xtype:'button',
			   		tooltip : 'Salva PDF',
			  		handler: function() {
			  			exportPDF(selection.data.pv_id, custom); 
			  		}
			  	}/*,{ 
			  		xtype:'button',
			  		text:'Salva modifiche',
			  		width: 100,
			  		id: 'SalvaButton',
			  		handler: function() {
			  			var form = f.getForm();
			  			var keyvalues=form.getFieldValues();
			  			var encodedata=Ext.JSON.encode(keyvalues);
			  			var mapPar=returnStoreParGrid();
			  			var mapMar=returnStoreMarGrid();
			  			var deleteMar=returnDeleteMarGrid();
			  			var mapServ=returnStoreSerGrid();
			  			var deleteServ=returnDeleteSerGrid();
			  			var noteForm=returnFormNote();
			  			var mapParAz=returnStoreParAzGrid();
			  			var mapMarAz=returnStoreMarAzGrid();
			  			var deleteMarAz=returnDeleteMarAzGrid();
			  			///////////////////////////////////////////
			  			var encodeMapPar=Ext.JSON.encode(mapPar.map);
			  			var encodeMapMar=Ext.JSON.encode(mapMar);
			  			var encodeDeleteMarGrid=Ext.JSON.encode(deleteMar);
			  			var encodeMapServ=Ext.JSON.encode(mapServ);
			  			var encodeDeleteServGrid=Ext.JSON.encode(deleteServ);
			  			var encodeNoteForm=Ext.JSON.encode(noteForm);
			  			var encodeMapParAz=Ext.JSON.encode(mapParAz.map);
			  			var encodeMapMarAz=Ext.JSON.encode(mapMarAz);
			  			var encodeDeleteMarAzGrid=Ext.JSON.encode(deleteMarAz);
			  			Ext.Ajax.request({
			  				url: 'http://' + constants.ip + constants.root + constants.servlet,
			  				params:{
			  					task: 'salvaAnagrafica',
			  					censimento: dbname,
			  					anagrafica: encodedata,
			  					mapPar : encodeMapPar,
			  					mapMar : encodeMapMar,
			  					deleteMar : encodeDeleteMarGrid,
			  					mapServ : encodeMapServ,
			  					deleteSer: encodeDeleteServGrid,
			  					note: encodeNoteForm,
			  					mapParAz: encodeMapParAz,
			  					mapMarAz: encodeMapMarAz,
			  					deleteMarAz: encodeDeleteMarAzGrid
			  				},
			  				timeout: 3000,
					  		success: function(response){
					  				w.close();
					  				alert("Salvataggio eseguito");
					  				clearFilter();
					  				//svuoto tutte le variabili tranne le note e le anagrafiche
					  				mapPar.clear();
					  				mapMar.length=0;
					  				deleteMar.length=0;
					  				mapServ.length=0;
					  				deleteServ.length=0;
					  				mapParAz.clear();
					  				mapMarAz.length=0;
					  				deleteMarAz.length=0;
					  		}
			  			});
			  			
			  		}
			  		
			  	}*/
			 ] 
			}],
			/*
			 * dockedItems: [{ xtype:'toolbar', dock:'bottom', items: [{ // 3 }] }],
			 */
			closeAction : 'destroy',
			listeners : {
				afterrender : function(thisCmp, eOpts) {

					// console.debug(Ext.getCmp('tabs').items);
					// console.debug(Ext.getCmp('tabs').items.getAt(1).items.getAt(0).items.getAt(0).getStore().data.length);
				}
			}

		});
		w.show();
		w.center();
		tabs.setActiveTab(0);
	}

	if((id_offerta != "null") && (id_offerta != "")) {
		grid.down('toolbar').add('-');
		grid.down('toolbar').add(RiservaOffertaBtn);
	}else{
		if((id_vetrina != "null") && (id_vetrina != "")) {
			grid.down('toolbar').add('-');
			grid.down('toolbar').add(RiservaVetrinaBtn);
		}
	}
	
	
	grid.setLoading('Caricamento anagrafiche');

}); // END ONREADY FUNCTION

function clearFilter() {

	ids_array = [];
	filter_flag = 0;
	grid.getStore().proxy.extraParams.customer="entrambi";
	excelCustomer="entrambi";
	grid.getStore().proxy.extraParams.parametri = "";
	grid.getStore().proxy.extraParams.potenziali = "";
	grid.getStore().proxy.extraParams.marche = "";
	grid.getStore().proxy.extraParams.servizi = "";
	grid.getStore().proxy.extraParams.fatturati = "";

	grid.getStore().proxy.extraParams.parametriAz = "";
	grid.getStore().proxy.extraParams.potenzialiAz = "";
	grid.getStore().proxy.extraParams.marcheAz = "";

	delete grid.getStore().proxy.extraParams.search;

	grid.getStore().loadPage(1);
}

//funzione per recuperare i parametri get
function parseGetVars() {

	var args = new Array();
	var query = window.location.search.substring(1);
	if (query) {
		// divido la querystring in blocchi sulla base del carattere &
		// (il carattere & ?? usato per concatenare i diversi parametri della URL)
		var strList = query.split('&');
		// faccio un ciclo per leggere i blocchi individuati nella querystring
		for (str in strList) {
			// divido ogni blocco mediante il simbolo uguale
			// (uguale ?? usato per l'assegnazione del valore)
			var parts = strList[str].split('=');
			// inserisco nella array args l'accoppiata nome = valore di ciascun
			// parametro presente nella querystring
			args[unescape(parts[0])] = unescape(parts[1]);
		}
	}
	return args;
}

function pot(v) {

	if (v == '') {
		return 'valore non disponibile';
	}
	return v;
}

//metodo che ritorna un messaggio se la data di aggiornamento non è presente
function aggData(v) {
	//console.debug(v);
	a = v.split("-");
	if (v == '') {
		return '-';
	}
	return a[2].substring(0,2)+"-"+a[1]+"-"+a[0];
}
//metodo che ritorna un valore se il telefono non è presente
function aggTel(v) {

	b = v.split(" ");
	if (v == '') {
		return '-';
	}
	else if ((v == 'null')) {
		return '-';
	}
	return b[0];
}

function brandsAnalysis(classId, className) {

	//console.debug(classId);
	f = document.getElementById("aggregazionemarche");
	window.open("", "aggmar");

	f.censimento.value = dbname;
	f.classId.value = classId;
	f.className.value = className;
	f.reg.value = reg;
	f.pro.value = pro;
	f.com.value = com;
	f.cap.value = cap;
	f.parametri.value = grid.getStore().proxy.extraParams.parametri;
	f.potenziali.value = grid.getStore().proxy.extraParams.potenziali;
	f.marche.value = grid.getStore().proxy.extraParams.marche;

	//console.debug(f);
	f.submit();
}

function servicesAnalysis(classId, className) {

	//console.debug(classId);
	f = document.getElementById("aggregazioneservizi");
	window.open("", "aggser");

	f.censimento.value = dbname;
	f.classId.value = classId;
	f.className.value = className;
	f.reg.value = reg;
	f.pro.value = pro;
	f.com.value = com;
	f.cap.value = cap;
	f.parametri.value = grid.getStore().proxy.extraParams.parametri;
	f.potenziali.value = grid.getStore().proxy.extraParams.potenziali;
	f.marche.value = grid.getStore().proxy.extraParams.marche;

	//console.debug(f);
	f.submit();
}

function brandsAnalysisAz(classId, className) {

	// console.debug(classId);
	f = document.getElementById("aggregazionemarcheazienda");
	// console.debug(f);
	window.open("", "aggmaraz");

	f.censimento.value = dbname;
	f.classId.value = classId;
	f.className.value = className;
	f.reg.value = reg;
	f.pro.value = pro;
	f.com.value = com;
	f.cap.value = cap;
	f.parametri.value = grid.getStore().proxy.extraParams.parametri;
	f.potenziali.value = grid.getStore().proxy.extraParams.potenziali;
	f.marche.value = grid.getStore().proxy.extraParams.marche;

	// console.debug(f);
	f.submit();
}

function aggregazioneTerr(classe, layer) {

	f = document.getElementById("aggregazioneterr");
	window.open("", "aggterr");

	if (layer.length > 9)
		layer = 'cap';

	f.censimento.value = dbname;
	f.reg.value = reg;
	f.pro.value = pro;
	f.com.value = com;
	f.cap.value = cap;
	f.layer.value = layer;
	f.classe.value = classe;
	f.parametri.value = grid.getStore().proxy.extraParams.parametri;
	f.potenziali.value = grid.getStore().proxy.extraParams.potenziali;
	f.marche.value = grid.getStore().proxy.extraParams.marche;

	f.submit();
}

function aggregazioneTerrFatt(classe, layer) {

	f = document.getElementById("aggregazioneterrfatt");
	window.open("", "aggterrfatt");

	if (layer.length > 9)
		layer = 'cap';

	f.censimento.value = dbname;
	f.reg.value = reg;
	f.pro.value = pro;
	f.com.value = com;
	f.cap.value = cap;
	f.layer.value = layer;
	f.classe.value = classe;
	f.parametri.value = grid.getStore().proxy.extraParams.parametri;
	f.potenziali.value = grid.getStore().proxy.extraParams.potenziali;
	f.marche.value = grid.getStore().proxy.extraParams.marche;

	f.submit();
}

function aggregazionePar(classe, livello) {

	f = document.getElementById("aggregazionepar");
	window.open("", "aggpar");

	f.censimento.value = dbname;
	f.reg.value = reg;
	f.pro.value = pro;
	f.com.value = com;
	f.cap.value = cap;
	f.classe.value = classe;
	f.liv.value = livello;
	f.parametri.value = grid.getStore().proxy.extraParams.parametri;
	f.potenziali.value = grid.getStore().proxy.extraParams.potenziali;
	f.marche.value = grid.getStore().proxy.extraParams.marche;

	f.submit();
}
function aggregazioneTerrAz(classe, layer) {

	f = document.getElementById("aggregazioneterraz");
	window.open("", "aggterraz");

	if (layer.length > 9)
		layer = 'cap';

	f.censimento.value = dbname;
	f.reg.value = reg;
	f.pro.value = pro;
	f.com.value = com;
	f.cap.value = cap;
	f.layer.value = layer;
	f.classe.value = classe;
	f.parametri.value = grid.getStore().proxy.extraParams.parametri;
	f.potenziali.value = grid.getStore().proxy.extraParams.potenziali;
	f.marche.value = grid.getStore().proxy.extraParams.marche;

	f.submit();
}
function aggregazioneParAzienda(classe, livello) {

	f = document.getElementById("aggregazioneparazienda");
	window.open("", "aggparaz");

	f.censimento.value = dbname;
	f.reg.value = reg;
	f.pro.value = pro;
	f.com.value = com;
	f.cap.value = cap;
	f.classe.value = classe;
	f.liv.value = livello;
	f.parametri.value = grid.getStore().proxy.extraParams.parametri;
	f.potenziali.value = grid.getStore().proxy.extraParams.potenziali;
	f.marche.value = grid.getStore().proxy.extraParams.marche;

	f.submit();
}

function applyFilter(customer) {
	excelCustomer=customer;
	grid.getStore().proxy.extraParams.parametri = "";
	grid.getStore().proxy.extraParams.potenziali = "";
	grid.getStore().proxy.extraParams.marche = "";
	grid.getStore().proxy.extraParams.servizi = "";
	grid.getStore().proxy.extraParams.fatturati = "";
	grid.getStore().proxy.extraParams.customer = customer;
	grid.getStore().proxy.extraParams.parametriAz = "";
	grid.getStore().proxy.extraParams.potenzialiAz = "";
	grid.getStore().proxy.extraParams.marcheAz = "";

	filter_flag = 1;

	//console.log(customer);
	
	if (selectedParValues.length != 0) {
		filterString = "";
		for (i in selectedParValues) {
			filterString = filterString + selectedParValues[i][1] + "," + selectedParValues[i][0] + "|";
		}
		filterString = filterString.substring(0, (filterString.length - 1));
		grid.getStore().proxy.extraParams.parametri = filterString;
		// console.debug(store.proxy.extraParams.parametri);
	}
	if (selectedMarValues.length != 0) {
		filterString = "";
		for (i in selectedMarValues) {
			filterString = filterString + selectedMarValues[i][1] + "," + selectedMarValues[i][0] + "|";
		}
		filterString = filterString.substring(0, (filterString.length - 1));
		grid.getStore().proxy.extraParams.marche = filterString;
		// console.debug(store.proxy.extraParams.marche);
	}
	if (selectedPotValues.length != 0) {
		filterString = "";
		for (i in selectedPotValues) {
			filterString = filterString + selectedPotValues[i][1] + "," + selectedPotValues[i][0] + "|";
		}
		filterString = filterString.substring(0, (filterString.length - 1));
		grid.getStore().proxy.extraParams.potenziali = filterString;
		// console.debug(store.proxy.extraParams.potenziali);
	}
	
	if (selectedSerValues.length != 0) {
		filterString = "";
		for (i in selectedSerValues) {
			filterString = filterString + selectedSerValues[i][1] +"," + selectedSerValues[i][0] + "|";
		}
		filterString = filterString.substring(0, (filterString.length - 1));
		grid.getStore().proxy.extraParams.servizi = filterString;
	  //console.debug(store.proxy.extraParams.potenziali);
	 }
	if (selectedFatValues.length != 0) {
		filterString = "";
		for (i in selectedFatValues) {
			filterString = filterString + selectedFatValues[i][1] +"," + selectedFatValues[i][0] + "|";
		}
		filterString = filterString.substring(0, (filterString.length - 1));
		grid.getStore().proxy.extraParams.fatturati = filterString;
	  //console.debug(store.proxy.extraParams.potenziali);
	 }
	

	// BLOCCO PERSONALIZZAZIONE
	if (selectedParValuesAz.length != 0) {
		filterString = "";
		for (i in selectedParValuesAz) {
			filterString = filterString + selectedParValuesAz[i][1] + "," + selectedParValuesAz[i][0]
			+ "|";
		}
		filterString = filterString.substring(0, (filterString.length - 1));
		grid.getStore().proxy.extraParams.parametriAz = filterString;
		// console.debug(store.proxy.extraParams.parametri);
	}
	if (selectedMarValuesAz.length != 0) {
		filterString = "";
		for (i in selectedMarValuesAz) {
			filterString = filterString + selectedMarValuesAz[i][1] + "," + selectedMarValuesAz[i][0]
			+ "|";
		}
		filterString = filterString.substring(0, (filterString.length - 1));
		grid.getStore().proxy.extraParams.marcheAz = filterString;
		// console.debug(store.proxy.extraParams.marche);
	}
	if (selectedPotValuesAz.length != 0) {
		filterString = "";
		for (i in selectedPotValuesAz) {
			filterString = filterString + selectedPotValuesAz[i][1] + "," + selectedPotValuesAz[i][0]
			+ "|";
		}
		filterString = filterString.substring(0, (filterString.length - 1));
		grid.getStore().proxy.extraParams.potenzialiAz = filterString;
		// console.debug(store.proxy.extraParams.potenziali);
	}

	grid.getStore().loadPage(1);
	grid.setLoading('Applico filtri...attendere');
}

function contains(array, item) {

	for (var i = 0; i < array.length; i++) {
		if (array[i] == item) {
			return true;
		}
	}
	return false;
}

function excelExportAll() {

	var form = document.getElementById('estrazioni');
	var element1,element2,element3, element4, element5;
	form.action = 'http://' + constants.ip + constants.root + constants.servlet;
	form.task.value = 'excel';
	if (grid.getStore().proxy.extraParams.search != undefined) {
		form.search.value = grid.getStore().proxy.extraParams.search;
	}
	else {
		form.search.value = '';
	}

	
	form.censimento.value = dbname;
	form.customer.value= excelCustomer;
	//console.log(excelCustomer);
	if (filter_flag == 1) {
		if (selectedParValues.length != 0) {
			filterString = '';
			for (i in selectedParValues) {
				filterString = filterString + selectedParValues[i][1] + "," + selectedParValues[i][0] + "|";
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			//console.debug('parametri: '+filterString);
			// store.proxy.extraParams.parametri = filterString;
			element1 = document.createElement('input');
			element1.setAttribute('type', 'hidden');
			element1.setAttribute('value', filterString);
			element1.setAttribute('name', 'parametri');
			element1.setAttribute('id', 'parametri');
			document.getElementById('estrazioni').appendChild(element1);
		}

		if (selectedParValuesAz.length != 0) {
			filterString = '';
			for (i in selectedParValuesAz) {
				filterString = filterString + selectedParValuesAz[i][1] + ',' + selectedParValuesAz[i][0]
				+ '|';
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			//console.debug('parametriAz: '+filterString);
			// store.proxy.extraParams.parametri = filterString;
			element1custom = document.createElement('input');
			element1custom.setAttribute('type', 'hidden');
			element1custom.setAttribute('value', filterString);
			element1custom.setAttribute('name', 'parametriAz');
			element1custom.setAttribute('id', 'parametriAz');
			document.getElementById('estrazioni').appendChild(element1custom);
		}

		if (selectedMarValues.length != 0) {
			filterString = '';
			for (i in selectedMarValues) {
				filterString = filterString + selectedMarValues[i][1] + ',' + selectedMarValues[i][0] + '|';
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			//console.debug('marche: '+filterString);
			// store.proxy.extraParams.parametri = filterString;
			element2 = document.createElement('input');
			element2.setAttribute('type', 'hidden');
			element2.setAttribute('value', filterString);
			element2.setAttribute('name', 'marche');
			element2.setAttribute('id', 'marche');
			document.getElementById('estrazioni').appendChild(element2);
		}

		if (selectedMarValuesAz.length != 0) {
			filterString = '';
			for (i in selectedMarValuesAz) {
				filterString = filterString + selectedMarValuesAz[i][1] + ',' + selectedMarValuesAz[i][0]
				+ '|';
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			//console.debug('marcheAz: '+filterString);
			// store.proxy.extraParams.parametri = filterString;
			element2custom = document.createElement('input');
			element2custom.setAttribute('type', 'hidden');
			element2custom.setAttribute('value', filterString);
			element2custom.setAttribute('name', 'marcheAz');
			element2custom.setAttribute('id', 'marcheAz');
			document.getElementById('estrazioni').appendChild(element2custom);
		}

		if (selectedPotValues.length != 0) {
			filterString = '';
			for (i in selectedPotValues) {
				filterString = filterString + selectedPotValues[i][1] + ',' + selectedPotValues[i][0] + '|';
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			//console.debug('potenziali: '+filterString);
			// store.proxy.extraParams.parametri = filterString;
			element3 = document.createElement('input');
			element3.setAttribute('type', 'hidden');
			element3.setAttribute('value', filterString);
			element3.setAttribute('name', 'potenziali');
			element3.setAttribute('id', 'potenziali');
			document.getElementById('estrazioni').appendChild(element3);
		}

		if (selectedPotValuesAz.length != 0) {
			filterString = '';
			for (i in selectedPotValuesAz) {
				filterString = filterString + selectedPotValuesAz[i][1] + ',' + selectedPotValuesAz[i][0]
				+ '|';
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			//console.debug('potenzialiAz: '+filterString);
			// store.proxy.extraParams.parametri = filterString;
			element3custom = document.createElement('input');
			element3custom.setAttribute('type', 'hidden');
			element3custom.setAttribute('value', filterString);
			element3custom.setAttribute('name', 'potenzialiAz');
			element3custom.setAttribute('id', 'potenzialiAz');
			document.getElementById('estrazioni').appendChild(element3custom);
		}
		if (selectedSerValues.length != 0) {
			filterString = '';
			for (i in selectedSerValues) {
				filterString = filterString + selectedSerValues[i][1] + ',' + selectedSerValues[i][0] + '|';
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			//console.debug('servizi: '+filterString);
			// store.proxy.extraParams.parametri = filterString;
			element4 = document.createElement('input');
			element4.setAttribute('type', 'hidden');
			element4.setAttribute('value', filterString);
			element4.setAttribute('name', 'servizi');
			element4.setAttribute('id', 'servizi');
			document.getElementById('estrazioni').appendChild(element4);
		}
		if (selectedFatValues.length != 0) {
			filterString = '';
			for (i in selectedFatValues) {
				filterString = filterString + selectedFatValues[i][1] + ',' + selectedFatValues[i][0] + '|';
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			//console.debug('fatturati: '+filterString);
			// store.proxy.extraParams.parametri = filterString;
			element5 = document.createElement('input');
			element5.setAttribute('type', 'hidden');
			element5.setAttribute('value', filterString);
			element5.setAttribute('name', 'fatturati');
			element5.setAttribute('id', 'fatturati');
			document.getElementById('estrazioni').appendChild(element5);
		}
	}

	form.reg.value = reg;
	form.pro.value = pro;
	form.com.value = com;
	form.cap.value = cap;

	form.header.value = getExcelHeader('griglia');
	form.submit();

	if(document.getElementById('parametri')!=null){
		//console.debug(document.getElementById('parametri'));
		document.getElementById('parametri').parentNode.removeChild(document.getElementById('parametri'));
	}
	if(document.getElementById('marche')!=null){
		document.getElementById('marche').parentNode.removeChild(document.getElementById('marche'));
	}
	if(document.getElementById('potenziali')!=null){
		document.getElementById('potenziali').parentNode.removeChild(document.getElementById('potenziali'));
	}
	if(document.getElementById('servizi')!=null){
		document.getElementById('servizi').parentNode.removeChild(document.getElementById('servizi'));
	}
	if(document.getElementById('fatturati')!=null){
		document.getElementById('fatturati').parentNode.removeChild(document.getElementById('fatturati'));
	}
	if(document.getElementById('parametriAz')!=null){
		document.getElementById('parametriAz').parentNode.removeChild(document.getElementById('parametriAz'));
	}
	if(document.getElementById('marcheAz')!=null){
		document.getElementById('marcheAz').parentNode.removeChild(document.getElementById('marcheAz'));
	}
	if(document.getElementById('potenzialiAz')!=null){
		document.getElementById('potenzialiAz').parentNode.removeChild(document.getElementById('potenzialiAz'));
	}
}


function exportPDF(pv, cust) {

	encodedData = Ext.JSON.encode(pv);
	encodedData2 = Ext.JSON.encode(cust);
	// console.debug(encodedData);
	var form = document.getElementById('pdf');
	form.action = 'http://' + constants.ip + constants.root + constants.servlet;
	form.task.value = 'pdfAnagrafica';
	form.censimento.value = dbname;
	form.pv.value = pv;
	form.custom.value = cust;
	form.submit();
}

function excelExport() {

	data = new Array();
	for (i in grid.getStore().data.items) {
		data[i] = grid.getStore().data.items[i].data;
		// console.debug(data[i]);

	}
	encodedData = Ext.JSON.encode(data);
	// console.debug(encodedData);
	var form = document.getElementById('estrazioni');
	form.action = 'http://' + constants.ip + constants.root + constants.servlet;
	form.task.value = 'excel';
	form.censimento.value = dbname;
	form.selections.value = encodedData;
	form.header.value = getExcelHeader('griglia');
	form.submit();
}

function getExcelHeader(cmp) {

	store = Ext.getCmp(cmp);

	arr = new Array();
	for (n in store.columns) {
		// if (!store.columns[n].hidden) {
		arr.push(store.columns[n].dataIndex);
		// }
	}

	encodedHeader = Ext.JSON.encode(arr);
	// console.debug(encodedHeader);
	return encodedHeader;
}

RiservaOffertaBtn = Ext.create('Ext.button.Button',{
			icon : 'img/RiservaOfferta.png',
			id : 'KButton',
			width : 65,
			height : 52,
			store : 'storeKone',
			scale : 'medium',
			tooltip : 'Riserva offerta',
			margin : '0 80px 0 0',
			handler : function() {

				Ext.Ajax.request({
					url : 'http://' + constants.ip + constants.root + constants.servlet,
					params : {
						reg : reg,
						pro : pro,
						com : com,
						cap : cap,
						task : 'pvCount',
						censimento : dbname,
						parametri : grid.getStore().proxy.extraParams.parametri,
						marche : grid.getStore().proxy.extraParams.marche,
						potenziali : grid.getStore().proxy.extraParams.potenziali
						// offerta: offerta,
						// settore: settore
					},
					timeout : 3000,
					success : function(response) {

						text = response.responseText;
						confirm = Ext.JSON.decode(text);
						number = confirm.results;
						//name = confirm.name;
						//console.debug(confirm);
						Ext.Msg.confirm(
								'Confirm Box',
								'Hai selezionato ' + number.toString() + ' punti vendita riguardanti l'
								+ '\'' + 'offerta numero:" ' + id_offerta + ' ". ' + '\n'
								+ ' CONFERMI? ',
								function(buttonText) {

									if (buttonText == "no") {
										Ext.Msg
										.alert('No',
										"Operazione annullata. Premi nuovamente 'Kubettone' per inviare la richiesta");
									}
									if (buttonText == "yes") {
										/*
										 * Ext.MessageBox.show({ msg: 'Il tempo previsto
										 * dipende dal numero di pv da includere
										 * nell\'offerta', progressText: 'Salvataggio in
										 * corso...', width:300, wait:true, waitConfig:
										 * {interval:30000} });
										 */
										var box2 = Ext.MessageBox.wait(
												'Attendi mentre viene terminata la richiesta',
										'Inserimento in corso');
										Ext.Ajax.request({
											url : 'http://' + constants.ip + constants.root + constants.servlet,
											params : {
												reg : reg,
												pro : pro,
												com : com,
												cap : cap,
												task : 'promoKubettONE',
												offerta: id_offerta,
												censimento : dbname,
												parametri : grid.getStore().proxy.extraParams.parametri,
												marche : grid.getStore().proxy.extraParams.marche,
												potenziali : grid.getStore().proxy.extraParams.potenziali
												// offerta: offerta,
												// settore: settore
											},
											timeout : 3000000,
											success : function(response) {

												box2.hide();
												text2 = response.responseText;
												confirm2 = Ext.JSON.decode(text2);
												//console.debug(confirm2);
												confirm2 = confirm2.results;
												//console.debug(confirm2);

												if (confirm2.toString() == "ok") {
													window.location.href = "MmasgisServlet?task=completaO";
												}
												else if (confirm2.toString() == "error") {
													alert("Operazione non eseguita: esegui di nuovo l'inserimento dell'offerta da kubettONE");
													// location.href =
													//location.href="http://www.metmi.it/k1_aziende/src/offerta_inserita.php?settore="+dbname+"&id_offerta="+id_offerta;
													location.href = "http://gis.di.unimi.it/k1-azienda/src/offerta_inserita.php?settore="+dbname+"&id_offerta="+id_offerta;
												}
											}
										});// fine richiesta 2 ajax
									}
								});
					}
				});
			}
		});

RiservaVetrinaBtn = Ext.create('Ext.button.Button',{
	icon : 'img/RiservaVetrina.png',
	id : 'KButton',
	width : 65,
	height : 52,
	store : 'storeKone',
	scale : 'medium',
	tooltip : 'Riserva vetrina',
	margin : '0 80px 0 0',
	handler : function() {

		Ext.Ajax.request({
			url : 'http://' + constants.ip + constants.root + constants.servlet,
			params : {
				reg : reg,
				pro : pro,
				com : com,
				cap : cap,
				task : 'pvCount',
				censimento : dbname,
				parametri : grid.getStore().proxy.extraParams.parametri,
				marche : grid.getStore().proxy.extraParams.marche,
				potenziali : grid.getStore().proxy.extraParams.potenziali
				// offerta: offerta,
				// settore: settore
			},
			timeout : 3000,
			success : function(response) {

				text = response.responseText;
				confirm = Ext.JSON.decode(text);
				number = confirm.results;
				//name = confirm.name;
				//console.debug(confirm);
				//console.debug(id_vetrina);
				Ext.Msg.confirm(
						'Confirm Box',
						'Hai selezionato ' + number.toString() + ' punti vendita riguardanti la'
						+ ' vetrina numero:" ' + id_vetrina + ' ". ' + '\n'
						+ ' CONFERMI? ',
						function(buttonText) {

							if (buttonText == "no") {
								Ext.Msg
								.alert('No',
								"Operazione annullata. Premi nuovamente 'Kubettone' per inviare la richiesta");
							}
							if (buttonText == "yes") {
								/*
								 * Ext.MessageBox.show({ msg: 'Il tempo previsto
								 * dipende dal numero di pv da includere
								 * nell\'offerta', progressText: 'Salvataggio in
								 * corso...', width:300, wait:true, waitConfig:
								 * {interval:30000} });
								 */
								var box2 = Ext.MessageBox.wait(
										'Attendi mentre viene terminata la richiesta',
								'Inserimento in corso');
								Ext.Ajax.request({
									url : 'http://' + constants.ip + constants.root + constants.servlet,
									params : {
										reg : reg,
										pro : pro,
										com : com,
										cap : cap,
										task : 'promoKubettONEV',
										vetrina: id_vetrina,
										censimento : dbname,
										parametri : grid.getStore().proxy.extraParams.parametri,
										marche : grid.getStore().proxy.extraParams.marche,
										potenziali : grid.getStore().proxy.extraParams.potenziali
										// offerta: offerta,
										// settore: settore
									},
									timeout : 3000000,
									success : function(response) {

										box2.hide();
										text2 = response.responseText;
										confirm2 = Ext.JSON.decode(text2);
										//console.debug(confirm2);
										confirm2 = confirm2.results;
										//console.debug(confirm2);

										if (confirm2.toString() == "ok") {
											window.location.href = "MmasgisServlet?task=completaV";
										}
										else if (confirm2.toString() == "error") {
											alert("Operazione non eseguita: esegui di nuovo l'inserimento dell'offerta da kubettONE");
											// location.href =
											//location.href = "http://www.metmi.it/k1_aziende/src/offerta_inserita.php?settore="+dbname+"&id_offerta="+id_vetrina+"&vetrina=1";
											location.href = "http://gis.di.unimi.it/k1-azienda/src/offerta_inserita.php?settore="+dbname+"&id_offerta="+id_vetrina+"&vetrina=1";
										}
									}
								});// fine richiesta 2 ajax
							}
						});
			}
		});
	}
});

