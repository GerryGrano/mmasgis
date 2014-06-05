var store;
var grid;
var req;
var ids_array;
var filter_flag = 0;
var check_cliente;

var confirm2 = "";
var text = "";
var text2 = "";
var layers = [['REGIONE'], ['PROVINCIA'], ['COMUNE'], ['AREE CAP E COMUNI']];

Ext.onReady(function() {

	Ext.QuickTips.init();
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
			name : 'mail',
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
				parametri : '',
				marche : '',
				potenziali : '',
				parametriAz : '',
				marcheAz : '',
				potenzialiAz : '',
				servizi : ''
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
	Ext.define('ClassModelSer', {
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
				category : 'ser'
			}
		}
	});
	// create the grid
	grid = Ext
	.create(
			'Ext.grid.Panel',
			{
				frame : true,
				layout : 'fit',
				title : 'Elenco Anagrafiche: ' + dbname,
				id : 'griglia',
				store : store,
				emptyText : 'Nessun record presente',
				columns : [/*
				 * { dataIndex: 'pv_id', flex: 1, text: "id",
				 * hidden: true },
				 */{
					 dataIndex : 'cod_mmas',
					 flex : 0.8,
					 text : 'Codice MMAS'
				 }, {
					 dataIndex : 'cliente',
					 flex : 0.4,
					 text : 'Cliente'
				 }, {
					 dataIndex : 'cod_cliente',
					 flex : 0.8,
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
				 bbar : Ext.create('Ext.PagingToolbar', {
					 beforeLoad : function() {

						 grid.setLoading('Caricamento pagina... Attendere');
					 },
					 store : store,
					 displayInfo : true,
					 beforePageText : 'Pagina',
					 afterPageText : 'di {0}',
					 displayMsg : 'PV visualizzati da {0} a {1} - Totale PV: {2}',
					 emptyMsg : "Nessun record presente"
				 }),
				 dockedItems : [{
					 xtype : 'toolbar',
					 height : 60,
					 // width: 600,
					 items : [
					          {
					          	xtype : 'box',
					          	autoEl : {
					          		tag : 'img',
					          		src : 'img/logo_mmas.png'
					          	},
					          	id : 'mmas',
					          	width : 110,
					          	height : 50
					          },
					          '-',
					          {
					          	id : 'filterButton',
					          	// text: 'Filtri',
					          	icon : 'img/filterGrey.png',
					          	width : 50,
					          	height : 50,
					          	scale : 'medium',
					          	tooltip : 'applica filtri ai risultati',
					          	cls : 'filterButton',
					          	handler : function() {

					          		showFilters();
					          		Ext.getCmp('filterButton').disable();
					          	}
					          },
					          '-',
					          {
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
					          },
					          '-',
					          // { xtype: 'tbspacer', width: 20 }

					          /*
					           * { text: 'Esporta pagina', icon : 'img/exp.png', scale:
					           * 'medium', tooltip: 'esporta la vista attuale in formato
					           * excel', handler: function() { excelExport(); } },
					           */
					          {
					          	id : 'undoButton',
					          	// text: 'Annulla filtri e ricerca',
					          	icon : 'img/undoGrey.png',
					          	width : 50,
					          	height : 50,
					          	scale : 'medium',
					          	tooltip : 'annulla tutti i filtri',
					          	cls : 'undoButton',
					          	handler : function() {

					          		clearFilter();
					          	}
					          },
					          '-',
					          {
					          	xtype : 'tbfill'
					          },
					          '-',
					          {
					          	icon : 'img/k1.png',
					          	id : 'KButton',
					          	width : 56,
					          	height : 50,
					          	store : 'storeKone',
					          	scale : 'medium',
					          	tooltip : 'Crea offerta',
					          	margin : '0 80px 0 0',
					          	handler : function() {

					          		Ext.Ajax
					          		.request({
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
					          				name = confirm.name;
					          				console.debug(confirm);
					          				Ext.Msg
					          				.confirm(
					          						'Confirm Box',
					          						'Hai selezionato ' + number.toString()
					          						+ ' punti vendita riguardanti l' + '\''
					          						+ 'offerta:" ' + name.toString() + ' ". ' + '\n'
					          						+ 'Codice offerta numero:' + offerta + ' CONFERMI? ',
					          						function(buttonText) {

					          							if (buttonText == "no") {
					          								Ext.Msg
					          								.alert('No',
					          								"Operazione annullata. Premi nuovamente 'Kubettone' per inviare la richiesta");
					          							}
					          							if (buttonText == "yes") {
					          								/*
					          								 * Ext.MessageBox.show({ msg: 'Il
					          								 * tempo previsto dipende dal
					          								 * numero di pv da includere
					          								 * nell\'offerta', progressText:
					          								 * 'Salvataggio in corso...',
					          								 * width:300, wait:true,
					          								 * waitConfig: {interval:30000}
					          								 * });
					          								 */
					          								var box2 = Ext.MessageBox.wait(
					          										'Attendi mentre viene terminata la richiesta',
					          								'Inserimento in corso');
					          								Ext.Ajax
					          								.request({
					          									url : 'http://' + constants.ip + constants.root
					          									+ constants.servlet,
					          									params : {
					          										reg : reg,
					          										pro : pro,
					          										com : com,
					          										cap : cap,
					          										task : 'promoKubettONE',
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
					          										// console.debug(confirm2);
					          										confirm2 = confirm2.results;
					          										// console.debug(confirm2);

					          										if (confirm2.toString() == "ok") {
					          											location.href = "http://gis.di.unimi.it/k1-azienda/src/offerta_riservata_correttamente.php";
					          											// location.href =
					          											// "http://www.metmi.it/k1_aziende/src/offerta_riservata_correttamente.php";
					          										}
					          										else if (confirm2.toString() == "error") {
					          											alert("Operazione non eseguita: esegui di nuovo l'inserimento dell'offerta da kubettONE");
					          											// location.href =
					          											// "http://www.metmi.it/k1_aziende/src/offerta_inserita.php";
					          											location.href = "http://gis.di.unimi.it/k1-azienda/src/offerta_inserita.php";
					          										}
					          									}
					          								});// fine richiesta 2 ajax
					          							}
					          						});
					          			}
					          		});
					          	}
					          }]
				 // fine finestra di dialogo
				 }],
				 listeners : {
					 itemdblclick : function(dv, record, item, index, e) {

						 showTabPanel();
					 }
				 }
			});
	// !!!!!!!!!!!!PARTE PERSONALIZZATI --> custom == 1
	if (custom == '1') {

		parAziendaBtn = Ext.create('Ext.button.Button', {
			id : 'ParAzAnalysisButton',
			text : 'PAZ',
			scale : 'medium',
			tooltip : 'crea statistiche in base ai parametri aziendali',
			handler : function() {

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
					}]
				/*
				 * , listeners: { beforeclose: function() {
				 * Ext.getCmp('ParAzAnalysisButton').enable(); } }
				 */
				});
				w4.show();
				w4.center();
				// Ext.getCmp('ParAzAnalysisButton').disable();
			}
		});

		marAziendaBtn = Ext.create('Ext.button.Button', {
			id : 'brandsAnalysisAzButton',
			text : 'MAZ',
			scale : 'medium',
			tooltip : '',
			handler : function() {

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
					}]
				/*
				 * , listeners: { beforeclose: function() {
				 * Ext.getCmp('brandsAnalysisAzButton').enable(); } }
				 */
				});
				w.show();
				w.center();
				// Ext.getCmp('brandsAnalysisAzButton').disable();
			}
		});

		grid.down('toolbar').add(parAziendaBtn);
		grid.down('toolbar').add('-');
		grid.down('toolbar').add(marAziendaBtn);

	}

	new Ext.Viewport({
		frame : true,
		layout : 'fit',
		items : [grid]
	});

	store.loadPage(1);

	function showTabPanel() {

		var selection = grid.getView().getSelectionModel().getSelection()[0];

		if (selection.data.cliente == 'Si') {
			check_cliente = true;
		}
		else
			check_cliente = false;

		var headerTab = Ext.create('Ext.form.Panel', {
			frame : true,
			width : '100%',

			// bodyPadding: 15,
			fieldDefaults : {
				labelAlign : 'left',
				labelWidth : 100,
				anchor : '100%',

			},
			xtype : 'form',
			/** INIZIO* */
			items : [{
				layout : 'column',
				defaults : {
					columnWidth : 0.3,
					layout : 'form',
					border : false,
					xtype : 'panel',

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

					xtype : 'textfield',
					name : 'cod_cliente',
					readOnly : true,
					fieldLabel : 'Codice Cliente',
					value : selection.data.cod_cliente
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
				anchor : '100%',
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
						name : 'id'
					}, {
						xtype : 'textfield',
						name : 'ragione_sociale',
						readOnly : true,
						fieldLabel : 'Ragione Sociale',
						value : selection.data.ragione_sociale
					}, {
						xtype : 'textfield',
						name : 'titolare',
						readOnly : true,
						fieldLabel : 'Titolare',
						value : selection.data.titolare
					}, {
						xtype : 'textfield',
						name : 'codice_fiscale',
						readOnly : true,
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
						}, {
							xtype : 'textfield',

							border : false,
							labelWidth : 60,
							// minWidth: 200,
							name : 'data_aggiornamento',
							readOnly : true,
							fieldLabel : "Agg",
							value : aggData(selection.data.data_aggiornamento)
						}]

					}, {
						xtype : 'textfield',
						name : 'indirizzo',
						readOnly : true,
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
							readOnly : true,
							fieldLabel : 'Provincia',
							value : selection.data.provincia
						}, {

							xtype : 'textfield',
							border : false,
							labelWidth : 60,
							// minWidth: 200,
							fieldLabel : 'Cap',
							readOnly : true,
							name : 'Cap',
							value : selection.data.cap
						}]
					}, {
						xtype : 'textfield',
						name : 'comune',
						readOnly : true,
						fieldLabel : 'Comune',
						value : selection.data.comune
					}]
				}, {
					bodyStyle : 'padding:3px 9px 0 9px',
					items : [{
						xtype : 'textfield',
						fieldLabel : 'Telefono',
						readOnly : true,
						name : 'telefono',
						value : selection.data.telefono
					}, {
						xtype : 'textfield',
						fieldLabel : 'Telefono 1',
						readOnly : true,
						name : 'telefono',
						value : aggTel(selection.data.telefono2),
					}, {
						xtype : 'textfield',
						fieldLabel : 'Telefono 2',
						readOnly : true,
						name : 'telefono',
						value : aggTel(selection.data.telefono3),
					}, {
						xtype : 'textfield',
						name : 'mail',
						readOnly : true,
						fieldLabel : 'Mail',
						value : selection.data.mail
					}, {
						xtype : 'textfield',
						fieldLabel : 'Fax',
						readOnly : true,
						name : 'fax',
						value : selection.data.fax
					}, {
						xtype : 'textfield',
						fieldLabel : 'Sito',
						readOnly : true,
						name : 'sito',
						value : selection.data.sito
					}, {
						xtype : 'textfield',
						fieldLabel : 'Altro',
						readOnly : true,
						name : 'sito',
						// value: selection.data.sito
					}]
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
		tabs.add({
			title : 'Servizi MMAS',
			closable : false,
			items : servicesGridFactory(selection.data.pv_id)
		});

		if (custom == '1') {

			tabs.add({
				title : 'Potenziali Azienda',
				itemId : 'pot_az',
				closable : false,
				items : potentialsAziendaFactory(selection.data.pv_id)
			});

			tabs.add({
				title : 'Parametri Azienda',
				itemId : 'par_az',
				closable : false,
				items : parametersAziendaFactory(selection.data.pv_id)
			});

			tabs.add({
				title : 'Marche Azienda',
				itemId : 'mar_az',
				closable : false,
				items : brandsAziendaFactory(selection.data.pv_id)
			});

		}

		var w = new Ext.Window({
			height : 560,
			width : 960,
			minHeight : 460,
			minWidth : 800,
			resizable : true,

			title : "scheda Anagrafica di " + selection.data.ragione_sociale,
			items : [headerTab, f, tabs],

			dockedItems : [{
				xtype : 'toolbar',
				dock : 'top',
				items : [{
					// 3
					xtype : 'button',
					text : 'Previous',
					width : 60
				}, {
					xtype : 'tbfill'
				}, {
					xtype : 'button',
					text : 'Next',
					width : 60
				}]
			}],
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

	grid.setLoading('Caricamento anagrafiche');

}); // END ONREADY FUNCTION

function clearFilter() {

	ids_array = [];
	filter_flag = 0;

	grid.getStore().proxy.extraParams.parametri = "";
	grid.getStore().proxy.extraParams.potenziali = "";
	grid.getStore().proxy.extraParams.marche = "";
	grid.getStore().proxy.extraParams.servizi = "";

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

//metodo che ritorna un messaggio se la data di aggiornamento non � presente
function aggData(v) {

	a = v.split(" ");
	if (v == '') {
		return '-';
	}
	return a[0];
}
//metodo che ritorna un valore se il telefono non � presente
function aggTel(v) {

	// a = v.split(" ");
	if (v == '') {
		return '-';
	}
	else if ((v == 'null')) {
		return '-';
	}
	return a[0];
}

function brandsAnalysis(classId, className) {

	// console.debug(classId);
	f = document.getElementById("aggregazionemarche");
	// console.debug(f);
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

	// console.debug(f);
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

function applyFilter() {

	grid.getStore().proxy.extraParams.parametri = "";
	grid.getStore().proxy.extraParams.potenziali = "";
	grid.getStore().proxy.extraParams.marche = "";
	
	grid.getStore().proxy.extraParams.parametriAz = "";
	grid.getStore().proxy.extraParams.potenzialiAz = "";
	grid.getStore().proxy.extraParams.marcheAz = "";
	
	filter_flag = 1;

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
			filterString = filterString + selectedSerValues[i][1] + "," + selectedSerValues[i][0] + "|";
		}
		filterString = filterString.substring(0, (filterString.length - 1));
		grid.getStore().proxy.extraParams.servizi = filterString;
		// console.debug(store.proxy.extraParams.potenziali);
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

	for (i = 0; i < array.length; i++) {
		if (array[i] == item) {
			return true;
		}
	}
	return false;
}
function excelExportAll() {

	var form = document.getElementById('estrazioni');
	var element1,element2,element3;
	form.action = 'http://' + constants.ip + constants.root + constants.servlet;
	form.task.value = 'excel';
	form.censimento.value = dbname;

	if (filter_flag == 1) {
		if (selectedParValues.length != 0) {
			filterString = "";
			for (i in selectedParValues) {
				filterString = filterString + selectedParValues[i][1] + "," + selectedParValues[i][0] + "|";
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			// store.proxy.extraParams.parametri = filterString;
			element1 = document.createElement("input");
			element1.setAttribute("type", "hidden");
			element1.setAttribute("value", filterString);
			element1.setAttribute("name", "parametri");
			element1.setAttribute("id", "parametri");
			document.getElementById("estrazioni").appendChild(element1);
		}

		if (selectedParValuesAz.length != 0) {
			filterString = "";
			for (i in selectedParValuesAz) {
				filterString = filterString + selectedParValuesAz[i][1] + "," + selectedParValuesAz[i][0]
				+ "|";
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			// store.proxy.extraParams.parametri = filterString;
			element1custom = document.createElement("input");
			element1custom.setAttribute("type", "hidden");
			element1custom.setAttribute("value", filterString);
			element1custom.setAttribute("name", "parametriAz");
			element1custom.setAttribute("id", "parametriAz");
			document.getElementById("estrazioni").appendChild(element1custom);
		}

		if (selectedMarValues.length != 0) {
			filterString = "";
			for (i in selectedMarValues) {
				filterString = filterString + selectedMarValues[i][1] + "," + selectedMarValues[i][0] + "|";
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			// store.proxy.extraParams.parametri = filterString;
			element2 = document.createElement("input");
			element2.setAttribute("type", "hidden");
			element2.setAttribute("value", filterString);
			element2.setAttribute("name", "marche");
			element2.setAttribute("id", "marche");
			document.getElementById("estrazioni").appendChild(element2);
		}

		if (selectedMarValuesAz.length != 0) {
			filterString = "";
			for (i in selectedMarValuesAz) {
				filterString = filterString + selectedMarValuesAz[i][1] + "," + selectedMarValuesAz[i][0]
				+ "|";
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			// store.proxy.extraParams.parametri = filterString;
			element2custom = document.createElement("input");
			element2custom.setAttribute("type", "hidden");
			element2custom.setAttribute("value", filterString);
			element2custom.setAttribute("name", "marcheAz");
			element2custom.setAttribute("id", "marcheAz");
			document.getElementById("estrazioni").appendChild(element2custom);
		}

		if (selectedPotValues.length != 0) {
			filterString = "";
			for (i in selectedPotValues) {
				filterString = filterString + selectedPotValues[i][1] + "," + selectedPotValues[i][0] + "|";
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			// store.proxy.extraParams.parametri = filterString;
			element3 = document.createElement("input");
			element3.setAttribute("type", "hidden");
			element3.setAttribute("value", filterString);
			element3.setAttribute("name", "potenziali");
			element3.setAttribute("id", "potenziali");
			document.getElementById("estrazioni").appendChild(element3);
		}

		if (selectedPotValuesAz.length != 0) {
			filterString = "";
			for (i in selectedPotValuesAz) {
				filterString = filterString + selectedPotValuesAz[i][1] + "," + selectedPotValuesAz[i][0]
				+ "|";
			}
			filterString = filterString.substring(0, (filterString.length - 1));
			// store.proxy.extraParams.parametri = filterString;
			element3custom = document.createElement("input");
			element3custom.setAttribute("type", "hidden");
			element3custom.setAttribute("value", filterString);
			element3custom.setAttribute("name", "potenzialiAz");
			element3custom.setAttribute("id", "potenzialiAz");
			document.getElementById("estrazioni").appendChild(element3custom);
		}
	}

	form.reg.value = reg;
	form.pro.value = pro;
	form.com.value = com;
	form.cap.value = cap;

	form.header.value = getExcelHeader('griglia');
	form.submit();

	form.removeChild(document.getElementById("parametri"));
	form.removeChild(document.getElementById("marche"));
	form.removeChild(document.getElementById("potenziali"));
	form.removeChild(document.getElementById("servizi"));

	form.removeChild(document.getElementById("parametriAz"));
	form.removeChild(document.getElementById("marcheAz"));
	form.removeChild(document.getElementById("potenzialiAz"));
}

function excelExport() {

	data = new Array();
	for (i in grid.getStore().data.items) {
		data[i] = grid.getStore().data.items[i].data;
		//console.debug(data[i]);

	}
	encodedData = Ext.JSON.encode(data);
	//console.debug(encodedData);
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
		//if (!store.columns[n].hidden) {
		arr.push(store.columns[n].dataIndex);
		//}
	}

	encodedHeader = Ext.JSON.encode(arr);
	//console.debug(encodedHeader);
	return encodedHeader;
}
