var selectedParValuesExport = [];
var selectedPotValuesExport = [];
var selectedMarValuesExport = [];

var selectedParValuesExportAz = [];
var selectedPotValuesExportAz = [];
var selectedMarValuesExportAz = [];
var dataSelectedHeader = [];
var dataSelectedQuery = [];
var inputCliente = "IF(cliente=0, 'No', 'Si') AS cliente";
var height = 360;
var width = 300;

function showCheck() {

	// ////////////////////////////////////////////////
	// MODEL
	// ////////////////////////////////////////////////

	Ext.define('ExcelClassModelPar', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});
	
	Ext.define('ExcelClassModelParAz', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});

	
	
	Ext.define('ExcelClassModelPot', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});
	
	Ext.define('ExcelClassModelPotAz', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});
	
	
	Ext.define('ExcelClassModelMar', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});
	
	Ext.define('ExcelClassModelMarAz', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});

	// ///////////////////////////////////////////////////
	// STORE
	// ///////////////////////////////////////////////////
	
	var excel_selected_par = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'text'
		} ],
		data : selectedParValuesExport
	});
	
	var excel_selected_par_az = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'text'
		} ],
		data : selectedParValuesExportAz
	});

	var excel_selected_pot = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'text'
		} ],
		data : selectedPotValuesExport
	});
	
	var excel_selected_pot_az = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'text'
		} ],
		data : selectedPotValuesExportAz
	});

	var excel_selected_mar = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'text'
		} ],
		data : selectedMarValuesExport
	});
	
	var excel_selected_mar_az = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'text'
		} ],
		data : selectedMarValuesExportAz
	});
	
	var excelClassePar = Ext.create('Ext.data.Store', {
		model : 'ExcelClassModelPar',
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
	
	var excelClasseParAz = Ext.create('Ext.data.Store', {
		model : 'ExcelClassModelParAz',
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

	var excelClassePot = Ext.create('Ext.data.Store', {
		model : 'ExcelClassModelPot',
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
				category : 'pot'
			}
		}
	});
	
	var excelClassePotAz = Ext.create('Ext.data.Store', {
		model : 'ExcelClassModelPotAz',
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
				category : 'pot'
			}
		}
	});

	var excelClasseMar = Ext.create('Ext.data.Store', {
		model : 'ExcelClassModelMar',
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
	
	var excelClasseMarAz = Ext.create('Ext.data.Store', {
		model : 'ExcelClassModelMarAz',
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


	// ///////////////////////////////////////////////////
	// GRIDPANEL
	// ///////////////////////////////////////////////////

	var classePanPar = Ext.create('Ext.grid.Panel', {
		id : 'classePanPar',
		title : 'Classe',
		hideHeaders : true,
		store : excelClassePar,
		columns : [
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				dataIndex : 'id',
				text : 'classe',
				hidden : true
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						excelClassePar.load();
						
						var data = new Array(
								excelClassePar.data.items[rowIndex].data.id,
								excelClassePar.data.items[rowIndex].data.text
							);
						flag = false;
						for (n in selectedParValuesExport) {
							var s = selectedParValuesExport[n];
							if (s[0] == excelClassePar.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
						selectedParValuesExport.push(data);
						excel_selected_par.loadData(selectedParValuesExport, false);
						}
						
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var classePanParAz = Ext.create('Ext.grid.Panel', {
		id : 'classePanParAz',
		title : 'Classe',
		hideHeaders : true,
		store : excelClasseParAz,
		columns : [
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				dataIndex : 'id',
				text : 'classe',
				hidden : true
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						excelClasseParAz.load();
						
						var data = new Array(
								excelClasseParAz.data.items[rowIndex].data.id,
								excelClasseParAz.data.items[rowIndex].data.text
							);
						flag = false;
						for (n in selectedParValuesExportAz) {
							var s = selectedParValuesExportAz[n];
							if (s[0] == excelClasseParAz.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
						selectedParValuesExportAz.push(data);
						excel_selected_par_az.loadData(selectedParValuesExportAz, false);
						}
						
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	var classePanPot = Ext.create('Ext.grid.Panel', {
		id : 'classePanPot',
		title : 'Classe',
		hideHeaders : true,
		store : excelClassePot,
		columns : [
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				dataIndex : 'id',
				text : 'classe',
				hidden : true
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						excelClassePot.load();
						
						var data = new Array(
								excelClassePot.data.items[rowIndex].data.id,
								excelClassePot.data.items[rowIndex].data.text
							);
						flag = false;
						for (n in selectedPotValuesExport) {
							var s = selectedPotValuesExport[n];
							if (s[0] == excelClassePot.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
						selectedPotValuesExport.push(data);
						excel_selected_pot.loadData(selectedPotValuesExport, false);
						}
				
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var classePanPotAz = Ext.create('Ext.grid.Panel', {
		id : 'classePanPotAz',
		title : 'Classe',
		hideHeaders : true,
		store : excelClassePotAz,
		columns : [
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				dataIndex : 'id',
				text : 'classe',
				hidden : true
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						excelClassePotAz.load();
						
						var data = new Array(
								excelClassePotAz.data.items[rowIndex].data.id,
								excelClassePotAz.data.items[rowIndex].data.text
							);
						flag = false;
						for (n in selectedPotValuesExportAz) {
							var s = selectedPotValuesExportAz[n];
							if (s[0] == excelClassePotAz.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
						selectedPotValuesExportAz.push(data);
						excel_selected_pot_az.loadData(selectedPotValuesExportAz, false);
						}
						
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	var classePanMar = Ext.create('Ext.grid.Panel', {
		id : 'classePanMar',
		title : 'Classe',
		hideHeaders : true,
		store : excelClasseMar,
		columns : [
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				dataIndex : 'id',
				text : 'classe',
				hidden : true
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						excelClasseMar.load();
						
						var data = new Array(
								excelClasseMar.data.items[rowIndex].data.id,
								excelClasseMar.data.items[rowIndex].data.text
							);
						flag = false;
						for (n in selectedMarValuesExport) {
							var s = selectedMarValuesExport[n];
							if (s[0] == excelClasseMar.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
						selectedMarValuesExport.push(data);
						excel_selected_mar.loadData(selectedMarValuesExport, false);
						}
						
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var classePanMarAz = Ext.create('Ext.grid.Panel', {
		id : 'classePanMarAz',
		title : 'Classe',
		hideHeaders : true,
		store : excelClasseMarAz,
		columns : [
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				dataIndex : 'id',
				text : 'classe',
				hidden : true
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						excelClasseMarAz.load();
						
						var data = new Array(
								excelClasseMarAz.data.items[rowIndex].data.id,
								excelClasseMarAz.data.items[rowIndex].data.text
							);
						flag = false;
						for (n in selectedMarValuesExportAz) {
							var s = selectedMarValuesExportAz[n];
							if (s[0] == excelClasseMarAz.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
						selectedMarValuesExportAz.push(data);
						excel_selected_mar_az.loadData(selectedMarValuesExportAz, false);
						}
						
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	
	var value_selected_par = Ext.create('Ext.grid.Panel', {
		id : 'SelPar',
		title : 'Parametri selezionati ',
		store : excel_selected_par,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
					{
					text : 'nome',
					flex : 1,
					dataIndex : 'text'
				},
				{
					dataIndex : 'id',
					text : 'classe',
					hidden : true
				},
				{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/delete.gif',
					tooltip : 'Elimina questo valore',
					handler : function(grid, rowIndex, colIndex) {
						for (n in selectedParValuesExport) {
							var s = selectedParValuesExport[n];
							if (s[0] == excel_selected_par.data.items[rowIndex].data.id) {
								var e = selectedParValuesExport.splice(n, 1);
							}
						}
						excel_selected_par.remove(excel_selected_par.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var value_selected_par_az = Ext.create('Ext.grid.Panel', {
		id : 'SelParAz',
		title : 'Parametri selezionati ',
		store : excel_selected_par_az,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
					{
					text : 'nome',
					flex : 1,
					dataIndex : 'text'
				},
				{
					dataIndex : 'id',
					text : 'classe',
					hidden : true
				},
				{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/delete.gif',
					tooltip : 'Elimina questo valore',
					handler : function(grid, rowIndex, colIndex) {
						for (n in selectedParValuesExportAz) {
							var s = selectedParValuesExportAz[n];
							if (s[0] == excel_selected_par_az.data.items[rowIndex].data.id) {
								var e = selectedParValuesExportAz.splice(n, 1);
							}
						}
						excel_selected_par_az.remove(excel_selected_par_az.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	var value_selected_pot = Ext.create('Ext.grid.Panel', {
		id : 'SelPot',
		title : 'Parametri selezionati ',
		store : excel_selected_pot,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
				{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				dataIndex : 'id',
				text : 'classe',
				hidden : true
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/delete.gif', 
					tooltip : 'Elimina questo valore',
					handler : function(grid, rowIndex, colIndex) {
						for (n in selectedPotValuesExport) {
							var s = selectedPotValuesExport[n];
							if (s[0] == excel_selected_pot.data.items[rowIndex].data.id) {
								var e = selectedPotValuesExport.splice(n, 1);
							}
						}
						excel_selected_pot.remove(excel_selected_pot.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var value_selected_pot_az = Ext.create('Ext.grid.Panel', {
		id : 'SelPotAz',
		title : 'Parametri selezionati ',
		store : excel_selected_pot_az,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
					{
					text : 'nome',
					flex : 1,
					dataIndex : 'text'
				},
				{
					dataIndex : 'id',
					text : 'classe',
					hidden : true
				},
				{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/delete.gif', 
					tooltip : 'Elimina questo valore',
					handler : function(grid, rowIndex, colIndex) {
						for (n in selectedPotValuesExportAz) {
							var s = selectedPotValuesExportAz[n];
							if (s[0] == excel_selected_pot_az.data.items[rowIndex].data.id) {
								var e = selectedPotValuesExportAz.splice(n, 1);
							}
						}
						excel_selected_pot_az.remove(excel_selected_pot_az.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	var value_selected_mar = Ext.create('Ext.grid.Panel', {
		id : 'SelMar',
		title : 'Parametri selezionati ',
		store : excel_selected_mar,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
					{
					text : 'nome',
					flex : 1,
					dataIndex : 'text'
				},
				{
					dataIndex : 'id',
					text : 'classe',
					hidden : true
				},
				{
					xtype : 'actioncolumn',
					width : 35,
					items : [ {
						icon : 'img/delete.gif',
						tooltip : 'Elimina questo valore',
						handler : function(grid, rowIndex, colIndex) {
							for (n in selectedMarValuesExport) {
								var s = selectedMarValuesExport[n];
								if (s[0] == excel_selected_mar.data.items[rowIndex].data.id) {
									var e = selectedMarValuesExport.splice(n, 1);
								}
							}
						excel_selected_mar.remove(excel_selected_mar.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var value_selected_mar_az = Ext.create('Ext.grid.Panel', {
		id : 'SelMarAz',
		title : 'Parametri selezionati ',
		store : excel_selected_mar_az,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
					{
					text : 'nome',
					flex : 1,
					dataIndex : 'text'
				},
				{
					dataIndex : 'id',
					text : 'classe',
					hidden : true
				},
				{
					xtype : 'actioncolumn',
					width : 35,
					items : [ {
						icon : 'img/delete.gif',
						tooltip : 'Elimina questo valore',
						handler : function(grid, rowIndex, colIndex) {
							for (n in selectedMarValuesExportAz) {
								var s = selectedMarValuesExportAz[n];
								if (s[0] == excel_selected_mar_az.data.items[rowIndex].data.id) {
									var e = selectedMarValuesExportAz.splice(n, 1);
								}
							}
						excel_selected_mar_az.remove(excel_selected_mar_az.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	// ////////////////////////////////////////////////////////
	//			Checkbox anagrafica pv
	// ////////////////////////////////////////////////////////
	
	   var selectAnagrafica = {
		        xtype: 'fieldcontainer',
		        layout: 'hbox',
		        width: 600,
		        items: [{
		            defaultType: 'checkbox', // each item will be a checkbox
		            flex: 1,
		            width: 180,
			        height:220,
			        bodyPadding: 10,
		            title: 'Punto Vendita',
		            layout: 'anchor',
		            defaults: {
		                anchor: '100%',
		                hideEmptyLabel: false
		            },
		            items: [{
	                     xtype: 'hiddenfield',
	                     name: 'id'
	                 }, {
	                     name: 'RagioneSociale',
	                     fieldLabel: 'Ragione Sociale',
	                     inputValue: 'nome1 AS RagioneSociale',
	                     id        : 'checkbox1'
	                 }, {
	                     name: 'cliente',
	                     fieldLabel: 'cliente',
	                     inputValue: inputCliente,
	                     id        : 'checkbox2'
	                 }, {
	                     name: 'titolare',
	                     fieldLabel: 'Titolare',
	                     inputValue: 'nome2 AS titolare',
	                     id        : 'checkbox3'
	                 }, {
	                     name: 'codFiscale',
	                     fieldLabel: 'Cod. Fis./P. IVA',
	                     inputValue: 'cf_pi AS codFiscale',
	                     id        : 'checkbox4'
	                 }, {
	                	margins: '0 30 0 0',
			              border: false,
	                      labelWidth: 100,
	                      minWidth: 60,
	                      name: 'potenzialeMMAS',
	                      fieldLabel: "Potenziale MMAS",
	                      inputValue: 'SQL_CALC_FOUND_ROWS IF(rel_pv_pot.tc_clpot_id=1, rel_pv_pot.valore, NULL) AS potenzialeMMAS',
	                      id        : 'checkbox5'
	                  },{
	                      border: false,
	                      labelWidth: 100,
	                      minWidth: 257,
	                      name: 'aggiornamento',
	                      fieldLabel: "aggiornamento",
	                      inputValue: 'data_aggiornamento AS aggiornamento',
	                      id        : 'checkbox6'
	                  
		             },],
		                bbar: [
		                       {
		                           text: 'Select All',
		                           handler: function() {
		                               var checkbox1 = Ext.getCmp('checkbox1'),
		                                   checkbox2 = Ext.getCmp('checkbox2'),
		                                   checkbox3 = Ext.getCmp('checkbox3'),
		                               checkbox4 = Ext.getCmp('checkbox4'),
	                                   checkbox5 = Ext.getCmp('checkbox5'),
		                               checkbox6 = Ext.getCmp('checkbox6');
		                               
		                               checkbox1.setValue(true);
		                
		                               checkbox2.setValue(true);
		                               checkbox3.setValue(true);
		                               checkbox4.setValue(true);
		                               checkbox5.setValue(true);
		                               checkbox6.setValue(true);

		                           }
		                       },
		                       {
		                           text: 'Deseleziona tutto',
		                           handler: function() {
		                               var checkbox1 = Ext.getCmp('checkbox1'),
		                               		checkbox2 = Ext.getCmp('checkbox2'),
		                                   	checkbox3 = Ext.getCmp('checkbox3'),
		                               		checkbox4 = Ext.getCmp('checkbox4'),
		                               		checkbox5 = Ext.getCmp('checkbox5'),
		                               		checkbox6 = Ext.getCmp('checkbox6');
		                               checkbox1.setValue(false);
		                               checkbox2.setValue(false);
		                               checkbox3.setValue(false);
		                               checkbox4.setValue(false);
		                               checkbox5.setValue(false);
		                               checkbox6.setValue(false);

		                           }
		                       }
		                   ]
		        }, {
		            xtype: 'component',
		            width: 10
		        }, {
		        defaultType: 'checkbox', // each item will be a checkbox
		        flex: 1,
	            width: 180,
		        height:220,
		        bodyPadding: 10,
	            title: 'Indirizzo',
	            layout: 'anchor',
	            defaults: {
	                anchor: '100%',
	                hideEmptyLabel: false
	            },
	            items: [{
	            	xtype: 'hiddenfield',
                     name: 'id'
                 },{
	                 name: 'indirizzo',
                     fieldLabel: 'indirizzo',
                     inputValue: 'indirizzo',
                     id        : 'checkbox7',
                 },{
		             margins: '0 30 0 0',
		             border: false,
                     labelWidth: 100,
                     minWidth: 60,
		             name: 'provincia',
		             fieldLabel: 'provincia',
                     inputValue: 'provincia',
                     id        : 'checkbox8'
		           }, {
		           	 left: '15px',
		             border: false,
                     labelWidth: 100,
                     minWidth: 258,
		             fieldLabel: 'cap',
		             name: 'cap',
                     inputValue: 'cap',
                     id        : 'checkbox9'
                 }, {
                     name: 'comune',
                     fieldLabel: 'Comune',
                     inputValue: 'comune',
                     id        : 'checkbox10'                 
                     }],
		                bbar: [
		                       {
		                           text: 'Seleziona tutto',
		                           handler: function() {
		                               var checkbox7 = Ext.getCmp('checkbox7'),
		                                   checkbox8 = Ext.getCmp('checkbox8'),
		                                   checkbox9 = Ext.getCmp('checkbox9'),
		                               		checkbox10 = Ext.getCmp('checkbox10');

		                               
		                               checkbox7.setValue(true);
		                               checkbox8.setValue(true);
		                               checkbox9.setValue(true);
		                               checkbox10.setValue(true);
		                           }
		                       },
		                       {
		                           text: 'Deseleziona',
		                           handler: function() {
		                               var checkbox7 = Ext.getCmp('checkbox7'),
	                                   checkbox8 = Ext.getCmp('checkbox8'),
	                                   checkbox9 = Ext.getCmp('checkbox9');
		                               checkbox10 = Ext.getCmp('checkbox10');
	                               
	                               checkbox7.setValue(false);
	                               checkbox8.setValue(false);
	                               checkbox9.setValue(false);
	                               checkbox10.setValue(false);
		                           }
		                       }
		                   ]
	        }, {
	            xtype: 'component',
	            width: 10
	        },{
	            defaultType: 'checkbox', // each item will be a checkbox
	            	flex: 1,
		            width: 180,
			        height:220,
			        bodyPadding: 10,
		            title: 'Contatti',
		            layout: 'anchor',
		            defaults: {
		                anchor: '100%',
		                hideEmptyLabel: false
		            },
		            items: [{
		            	xtype: 'hiddenfield',
	                     name: 'id'
	                 },{
	                     fieldLabel: 'telefono',
	                     name: 'telefono',
	                     inputValue: 'tel1 AS telefono',
	                     id        : 'checkbox11'
	                 }, {
	                     fieldLabel: 'telefono1',
	                     name: 'telefono2',
	                     inputValue: 'tel2 AS telefono2',
	                     id        : 'checkbox12'
	                 }, {
	                     fieldLabel: 'telefono3',
	                     name: 'telefono3',
	                     inputValue: 'tel3 AS telefono3',
	                     id        : 'checkbox13'
	                 }, {
	                     name: 'email',
	                     fieldLabel: 'mail',
	                     inputValue: 'email',
	                     id        : 'checkbox14'
	                 }, {
	                     fieldLabel: 'fax',
	                     name: 'fax',
	                     inputValue: 'fax',
	                     id        : 'checkbox15'
	                 }, {
	                     fieldLabel: 'sito',
	                     name: 'sito',
	                     inputValue: 'sito',
	                     id        : 'checkbox16'
	                 }, {
	                     fieldLabel: 'note',
	                     name: 'note',
	                     inputValue: 'note',
	                     id        : 'checkbox17'
	                 }],
		                bbar: [
		                       {
		                           text: 'Seleziona tutto',
		                           handler: function() {
		                               var checkbox11 = Ext.getCmp('checkbox11'),
		                                   checkbox12 = Ext.getCmp('checkbox12'),
		                                   checkbox13 = Ext.getCmp('checkbox13'),
		                                   checkbox14 = Ext.getCmp('checkbox14'),
		                                   checkbox15 = Ext.getCmp('checkbox15'),
		                               		checkbox16 = Ext.getCmp('checkbox16'),
		                               		checkbox17 = Ext.getCmp('checkbox17');
		                               checkbox11.setValue(true);
		                               checkbox12.setValue(true);
		                               checkbox13.setValue(true);
		                               checkbox14.setValue(true);
		                               checkbox15.setValue(true);
		                               checkbox16.setValue(true);
		                               checkbox17.setValue(true);
		                               
		                           }
		                       },
		                       {
		                           text: 'Deseleziona tutto',
		                           handler: function() {
		                        	      var checkbox11 = Ext.getCmp('checkbox11'),
		                                   checkbox12 = Ext.getCmp('checkbox12'),
		                                   checkbox13 = Ext.getCmp('checkbox13'),
		                                   checkbox14 = Ext.getCmp('checkbox14'),
		                                   checkbox15 = Ext.getCmp('checkbox15'),
		                               		checkbox16 = Ext.getCmp('checkbox16'),
			                               checkbox17 = Ext.getCmp('checkbox17');
		                              
		                               checkbox11.setValue(false);
		                               checkbox12.setValue(false);
		                               checkbox13.setValue(false);
		                               checkbox14.setValue(false);
		                               checkbox15.setValue(false);
		                               checkbox16.setValue(false);
		                               checkbox17.setValue(false);
		                           }
		                       }
		                   ]
		        }]
		    };


		// ////////////////////////////////////////////////////////
		//			Pot/Par/Mar
		// ////////////////////////////////////////////////////////
	var tab = Ext.create('Ext.tab.Panel', {
		width : 900,
		height : 230,
		activeTab : 0,
		
		items : [ {
			title : 'Potenziali',
			items : [ classePanPot, value_selected_pot ],
			layout : 'hbox'
		},{
			title : 'Parametri',
			items : [ classePanPar, value_selected_par ],
			layout : 'hbox'
		},{
			title : 'Marche',
			items : [ classePanMar, value_selected_mar ],
			layout : 'hbox'
		}]
		
	});
	
	if(custom=='1') {
	
		tab.add({
			title : 'Potenziali Aziendali',
			items : [ classePanPotAz, value_selected_pot_az ],
			layout : 'hbox'
		});
		
		tab.add({
			title : 'Parametri Aziendali',
			items : [ classePanParAz, value_selected_par_az ],
			layout : 'hbox'
		});
	
		tab.add({
			title : 'Marche Aziendali',
			items : [ classePanMarAz, value_selected_mar_az ],
			layout : 'hbox'
		});
	}
	var buttonExport = Ext.create('Ext.tab.Panel', {
		width : 900,
		
		dockedItems : [ {
			xtype : 'toolbar',
			items : [ {
				text : 'Esporta risultati',
				tooltip : 'Esporta risultati selezionati',
				icon : 'img/ok.png',
				scale : 'medium',
				handler : function() {
					
					cbCheck();
					excelExport();
					excelResetData();
				}
			}]
		} ]
	});
	
	
	var window = new Ext.Window({
		height : 555,
		width : 615,
		title : 'Selezionare i dati da esportare',
		items : [ selectAnagrafica, tab, buttonExport ],
		closeAction : 'destroy',
		listeners : {
			beforeclose : function(panel, eOpts) {
				Ext.getCmp('excelButton').enable();
			}
		}
	});

	window.show();
	window.center();

}

//verifica il risultato della checkbox per l'invio al server
function cbCheck(){
	//dataSelectedHeader="";
	//dataSelectedQuery="";
	i=1;
	t = 0;
	checkCount=17;
	for( i ; i<(checkCount+1) ; i++ ){
		
	nomeCheck = 'checkbox'+i;
	 alfa = Ext.getCmp(nomeCheck).id;
	if (alfa == ("checkbox5") && Ext.getCmp(nomeCheck).getValue())
    	{
		 	dataSelectedHeader.push(Ext.getCmp(nomeCheck).name);
			dataSelectedQuery.push(Ext.getCmp(nomeCheck).inputValue);
			//Ext.getCmp(checkbox5).setValue(false);
    	}
		
	}
	j=1;
	for( j ; j<(checkCount+1) ; j++ ){
	
	nomeCheck2 = 'checkbox'+j;
	 alfa = Ext.getCmp(nomeCheck2).id;
	 
	if (alfa != ("checkbox5") && Ext.getCmp(nomeCheck2).getValue())
    	{
		dataSelectedHeader.push(Ext.getCmp(nomeCheck2).name);
		dataSelectedQuery.push(Ext.getCmp(nomeCheck2).inputValue);
		//Ext.getCmp(nomeCheck).setValue(false);
    	}
	}
	 
	//alert("cb header "+dataSelectedHeader);
	//alert("CheckBox spuntati"+dataSelectedQuery);
}
function excelExport() {
	
    var form = document.getElementById('estrazioni');
    var element1 = document.createElement("input"), 
    	element2 = document.createElement("input"), 
    	element3 = document.createElement("input"),
    	element4 = document.createElement("input"), 
    	element44 = document.createElement("input"),
    	element1custom = document.createElement("input"), 
    	element2custom = document.createElement("input"), 
    	element3custom = document.createElement("input");
    form.action = 'http://' + constants.ip + constants.root + constants.servlet;
    form.task.value = 'fullExcel';
    form.censimento.value = dbname;
		
        if (selectedParValuesExport.length != 0) {
            filterString = "";
            for (i in selectedParValuesExport) {
                filterString = filterString + selectedParValuesExport[i][1] + "," + selectedParValuesExport[i][0] + "|";
            }		 
            filterString = filterString.substring(0, (filterString.length - 1));
            //store.proxy.extraParams.parametri = filterString;
           
            element1.setAttribute("type", "hidden");
            element1.setAttribute("value", filterString);
            element1.setAttribute("name", "parametri");
            element1.setAttribute("id","parametri");
            document.getElementById("estrazioni").appendChild(element1);
        }
        
        if (selectedParValuesExportAz.length != 0) {
            filterString = "";
            for (i in selectedParValuesExportAz) {
                filterString = filterString + selectedParValuesExportAz[i][1] + "," + selectedParValuesExportAz[i][0] + "|";
            }		 
            filterString = filterString.substring(0, (filterString.length - 1));
            //store.proxy.extraParams.parametri = filterString;
           
            element1custom.setAttribute("type", "hidden");
            element1custom.setAttribute("value", filterString);
            element1custom.setAttribute("name", "parametriAz");
            element1custom.setAttribute("id","parametriAz");
            document.getElementById("estrazioni").appendChild(element1custom);
        }
		
        if (selectedMarValuesExport.length != 0) {
            filterString = "";
            for (i in selectedMarValuesExport) {
                filterString = filterString + selectedMarValuesExport[i][1] + "," + selectedMarValuesExport[i][0] + "|";
            }		 
            filterString = filterString.substring(0, (filterString.length - 1));
            //store.proxy.extraParams.parametri = filterString;
           
            element2.setAttribute("type", "hidden");
            element2.setAttribute("value", filterString);
            element2.setAttribute("name", "marche");
            element2.setAttribute("id","marche");
            document.getElementById("estrazioni").appendChild(element2);
        }
        
        if (selectedMarValuesExportAz.length != 0) {
            filterString = "";
            for (i in selectedMarValuesExportAz) {
                filterString = filterString + selectedMarValuesExportAz[i][1] + "," + selectedMarValuesExportAz[i][0] + "|";
            }		 
            filterString = filterString.substring(0, (filterString.length - 1));
            //store.proxy.extraParams.parametri = filterString;
           
            element2custom.setAttribute("type", "hidden");
            element2custom.setAttribute("value", filterString);
            element2custom.setAttribute("name", "marcheAz");
           element2custom.setAttribute("id","marcheAz");
            document.getElementById("estrazioni").appendChild(element2custom);
        }
		
        if (selectedPotValuesExport.length != 0) {
            filterString = "";
            for (i in selectedPotValuesExport) {
                filterString = filterString + selectedPotValuesExport[i][1] + "," + selectedPotValuesExport[i][0] + "|";
            }		 
            filterString = filterString.substring(0, (filterString.length - 1));
            //store.proxy.extraParams.parametri = filterString;
          
            element3.setAttribute("type", "hidden");
            element3.setAttribute("value", filterString);
            element3.setAttribute("name", "potenziali");
           element3.setAttribute("id","potenziali");
            document.getElementById("estrazioni").appendChild(element3);
        }
        
        if (selectedPotValuesExportAz.length != 0) {
            filterString = "";
            for (i in selectedPotValuesExportAz) {
                filterString = filterString + selectedPotValuesExportAz[i][1] + "," + selectedPotValuesExportAz[i][0] + "|";
            }		 
            filterString = filterString.substring(0, (filterString.length - 1));
            //store.proxy.extraParams.parametri = filterString;
          
            element3custom.setAttribute("type", "hidden");
            element3custom.setAttribute("value", filterString);
            element3custom.setAttribute("name", "potenzialiAz");
         element3custom.setAttribute("id","potenzialiAz");
            document.getElementById("estrazioni").appendChild(element3custom);
        }
        if (dataSelectedHeader.length != 0) {
            dataSelectedHeader.toString();        	
          
            element4.setAttribute("type", "hidden");
            element4.setAttribute("value", dataSelectedHeader);
            element4.setAttribute("name", "checkHeader");
          element4.setAttribute("id","checkHeader");
            document.getElementById("estrazioni").appendChild(element4);
        }
        if (dataSelectedQuery.length != 0) {
            dataSelectedQuery.toString();        	
        
            element44.setAttribute("type", "hidden");
            element44.setAttribute("value", dataSelectedQuery);
            element44.setAttribute("name", "checkQuery");
          element44.setAttribute("id","query");
            document.getElementById("estrazioni").appendChild(element44);
        }
   
    form.reg.value = reg;
    form.pro.value = pro;
    form.com.value = com;
    form.cap.value = cap;
    //alert("CheckBox aggiunti "+element3.getAttribute("parametri"));
    //alert("CheckBox aggiunti "+element4.getAttribute("check"));
    //form.header.value = getExcelHeader('griglia');
    form.submit();	
    
    if (selectedParValuesExport.length != 0) {
	//document.getElementById("estrazioni").removeChild(element1);
	form.removeChild(document.getElementById("parametri"));
	
	}
	if (selectedMarValuesExport.length != 0) {
	//document.getElementById("estrazioni").removeChild(element2);
	form.removeChild(document.getElementById("marche"));
	
	}
	if (selectedPotValuesExport.length != 0) {
	//document.getElementById("estrazioni").removeChild(element3);
	form.removeChild(document.getElementById("potenziali"));
	
	}
	//alert("pulizia...");
	if (dataSelectedHeader.length != 0) {
		//alert("pulizia1");
	//document.getElementById("estrazioni").removeChild(element4);
	form.removeChild(document.getElementById("checkHeader"));
	
	}
	if (dataSelectedQuery.length != 0) {
		//alert("pulizia2");
	//document.getElementById("estrazioni").removeChild(element44);
	form.removeChild(document.getElementById("query"));
	
	}
	//alert("pulizia finita");
	if (selectedParValuesExportAz.length != 0) {
	//document.getElementById("estrazioni").removeChild(element1custom);
	   form.removeChild(document.getElementById("parametriAz"));
	}
	if (selectedMarValuesExportAz.length != 0) {
	//document.getElementById("estrazioni").removeChild(element2custom);
	   form.removeChild(document.getElementById("marcheAz"));
	
	}
	if (selectedPotValuesExportAz.length != 0) {
	//document.getElementById("estrazioni").removeChild(element3custom);
	   form.removeChild(document.getElementById("potenzialiAz"));
	
	}
}
function excelResetData() {
	
	
	dataSelectedHeader=[];
	dataSelectedQuery=[];

	
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