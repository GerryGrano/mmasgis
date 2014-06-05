var selectedParValues = [];
var selectedPotValues = [];
var selectedMarValues = [];
var selectedSerValues = [];
var selectedFatValues = [];

var selectedParValuesAz = [];
var selectedPotValuesAz = [];
var selectedMarValuesAz = [];

var height = 360;
var width = 300;

function resetFilter() {
	Ext.getCmp('radio1').setValue(true);
	Ext.getCmp('radio2').setValue(false);
	Ext.getCmp('radio3').setValue(false);
	selectedParValues = [];
	Ext.getCmp('SelPar').getStore().loadData(selectedParValues, false);
	selectedPotValues = [];
	Ext.getCmp('SelPot').getStore().loadData(selectedParValues, false);
	selectedMarValues = [];
	Ext.getCmp('SelMar').getStore().loadData(selectedParValues, false);
	selectedSerValues = [];
	Ext.getCmp('SelSer').getStore().loadData(selectedSerValues, false);
	selectedFatValues = [];
	Ext.getCmp('SelFat').getStore().loadData(selectedFatValues, false);
	
	if(custom=='1') {
		selectedParValuesAz = [];
		Ext.getCmp('SelParAz').getStore().loadData(selectedParValuesAz, false);
		selectedPotValuesAz = [];
		Ext.getCmp('SelPotAz').getStore().loadData(selectedParValuesAz, false);
		selectedMarValuesAz = [];
		Ext.getCmp('SelMarAz').getStore().loadData(selectedParValuesAz, false);
	}
}

function showFilters(results) {
	//console.debug('filtri: '+results);
	// ////////////////////////////////////////////////
	// MODEL
	// ////////////////////////////////////////////////

	Ext.define('ClassModelPar', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});
	
	Ext.define('ClassModelParAz', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});

	Ext.define('ValueModelPar', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}, {
			name : 'class_id',
			type : 'integer'
		}, {
			name : 'class_text',
			type : 'string'
		} ]
	});

	Ext.define('ValueModelParAz', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}, {
			name : 'class_id',
			type : 'integer'
		}, {
			name : 'class_text',
			type : 'string'
		} ]
	});
	
	Ext.define('ClassModelPot', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});
	
	Ext.define('ClassModelPotAz', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});

	Ext.define('ValueModelPot', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}, {
			name : 'class_id',
			type : 'integer'
		} ]
	});
	
	Ext.define('ValueModelPotAz', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}, {
			name : 'class_id',
			type : 'integer'
		} ]
	});

	Ext.define('ClassModelMar', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});
	
	Ext.define('ClassModelMarAz', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});

	Ext.define('ValueModelMar', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}, {
			name : 'class_id',
			type : 'integer'
		} ]
	});
	
	Ext.define('ValueModelMarAz', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}, {
			name : 'class_id',
			type : 'integer'
		} ]
	});
	Ext.define('ClassModelSer', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});

	Ext.define('ValueModelSer', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}, {
			name : 'class_id',
			type : 'integer'
		}, {
			name : 'class_text',
			type : 'string'
		} ]
	});
	Ext.define('ClassModelFat', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		} ]
	});
	Ext.define('ValueModelFat', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'id',
			type : 'integer'
		}, {
			name : 'text',
			type : 'string'
		}, {
			name : 'class_id',
			type : 'integer'
		} ]
	});
	// ///////////////////////////////////////////////////
	// STORE
	// ///////////////////////////////////////////////////

	var store_selected_par = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'class_id'
		}, {
			name : 'nome'
		} ],
		data : selectedParValues
	});
	
	var store_selected_par_az = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'class_id'
		}, {
			name : 'nome'
		} ],
		data : selectedParValuesAz
	});

	var store_selected_pot = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'class_id'
		}, {
			name : 'nome'
		} ],
		data : selectedPotValues
	});
	
	var store_selected_pot_az = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'class_id'
		}, {
			name : 'nome'
		} ],
		data : selectedPotValuesAz
	});

	var store_selected_mar = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'class_id'
		}, {
			name : 'nome'
		} ],
		data : selectedMarValues
	});
	
	var store_selected_mar_az = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'class_id'
		}, {
			name : 'nome'
		} ],
		data : selectedMarValuesAz
	});
	var store_selected_ser = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'class_id'
		}, {
			name : 'nome'
		} ],
		data : selectedSerValues
	});
	var store_selected_fat = Ext.create('Ext.data.ArrayStore', {
		fields : [ {
			name : 'id'
		}, {
			name : 'class_id'
		}, {
			name : 'nome'
		} ],
		data : selectedFatValues
	});
	var storeClassePar = Ext.create('Ext.data.Store', {
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
	
	var storeClasseParAz = Ext.create('Ext.data.Store', {
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

	var storeClassePot = Ext.create('Ext.data.Store', {
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
	
	var storeClassePotAz = Ext.create('Ext.data.Store', {
		model : 'ClassModelPotAz',
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

	var storeClasseMar = Ext.create('Ext.data.Store', {
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
	
	var storeClasseMarAz = Ext.create('Ext.data.Store', {
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
	var storeClasseSer = Ext.create('Ext.data.Store', {
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
	var storeClasseFat = Ext.create('Ext.data.Store', {
		model : 'ClassModelFat',
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
				category : 'fatt'
			}
		}
	});
	var storeValorePar = Ext.create('Ext.data.Store', {
		model : 'ValueModelPar',
		autoLoad : false,
		reader : {
			type : 'json',
			root : 'classe',
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
				task : 'getValue',
				id : '',
				category : 'par',
				censimento : dbname
			}
		}
	});
	
	var storeValoreParAz = Ext.create('Ext.data.Store', {
		model : 'ValueModelParAz',
		autoLoad : false,
		reader : {
			type : 'json',
			root : 'classe',
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
				task : 'getValueAz',
				id : '',
				category : 'par',
				censimento : dbname
			}
		}
	});

	var storeValorePot = Ext.create('Ext.data.Store', {
		model : 'ValueModelPot',
		autoLoad : false,
		reader : {
			type : 'json',
			root : 'classe',
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
				task : 'getValue',
				id : '',
				category : 'pot',
				censimento : dbname
			}
		}
	});
	
	var storeValorePotAz = Ext.create('Ext.data.Store', {
		model : 'ValueModelPotAz',
		autoLoad : false,
		reader : {
			type : 'json',
			root : 'classe',
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
				task : 'getValueAz',
				id : '',
				category : 'pot',
				censimento : dbname
			}
		}
	});

	var storeValoreMar = Ext.create('Ext.data.Store', {
		model : 'ValueModelMar',
		autoLoad : false,
		reader : {
			type : 'json',
			root : 'classe',
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
				task : 'getValue',
				id : '',
				category : 'mar',
				censimento : dbname
			}
		}
	});
	
	var storeValoreMarAz = Ext.create('Ext.data.Store', {
		model : 'ValueModelMarAz',
		autoLoad : false,
		reader : {
			type : 'json',
			root : 'classe',
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
				task : 'getValueAz',
				id : '',
				category : 'mar',
				censimento : dbname
			}
		}
	});
	var storeValoreSer = Ext.create('Ext.data.Store', {
		model : 'ValueModelSer',
		autoLoad : false,
		reader : {
			type : 'json',
			root : 'classe',
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
				task : 'getValue',
				id : '',
				category : 'ser',
				censimento : dbname
			}
		}
	});
	var storeValoreFat = Ext.create('Ext.data.Store', {
		model : 'ValueModelFat',
		autoLoad : false,
		reader : {
			type : 'json',
			root : 'classe',
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
				task : 'getValue',
				id : '',
				category : 'fatt',
				censimento : dbname
			}
		}
	});
	// ///////////////////////////////////////////////////
	// GRIDPANEL
	// ///////////////////////////////////////////////////
	var chooseClient = Ext.create('Ext.form.Panel', {
		 id: 'chooseClient',
		 frame : true,
		 flex: 1,
		 items : [{
			 xtype : 'fieldset',
			 flex : 1,
			 defaultType : 'radio',
			 layout : 'anchor',
			 defaults : {
				 anchor : '100%',
				 hideEmptyLabel : false
			 },
			 items : [{
				 id: 'radio1',
				 checked : true,
				 boxLabel : 'Seleziona Clienti e non Clienti',
				 name : 'liv',
				 inputValue : 'entrambi'
			 }, {
				 id: 'radio2',
				 checked : false,
				 boxLabel : 'Seleziona solo Clienti',
				 name : 'liv',
				 inputValue : 'clienti'
			 }, {
				 id: 'radio3',
				 checked : false,
				 boxLabel : 'Seleziona solo non Clienti',
				 name : 'liv',
				 inputValue : 'no_clienti'
			 }]
		 }]

	 });
	
	
	var classePar = Ext.create('Ext.grid.Panel', {
		id : 'classePar',
		title : 'Classe',
		hideHeaders : true,
		store : storeClassePar,
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
							storeValorePar.proxy.extraParams.id = storeClassePar.data.items[rowIndex].data.id;
							storeValorePar.load();
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var classeParAz = Ext.create('Ext.grid.Panel', {
		id : 'classeParAz',
		title : 'Classe',
		hideHeaders : true,
		store : storeClasseParAz,
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
							storeValoreParAz.proxy.extraParams.id = storeClasseParAz.data.items[rowIndex].data.id;
							storeValoreParAz.load();
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	var classePot = Ext.create('Ext.grid.Panel', {
		id : 'classePot',
		title : 'Classe',
		hideHeaders : true,
		store : storeClassePot,
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
							storeValorePot.proxy.extraParams.id = storeClassePot.data.items[rowIndex].data.id;
							storeValorePot.load();
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var classePotAz = Ext.create('Ext.grid.Panel', {
		id : 'classePotAz',
		title : 'Classe',
		hideHeaders : true,
		store : storeClassePotAz,
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
							storeValorePotAz.proxy.extraParams.id = storeClassePotAz.data.items[rowIndex].data.id;
							storeValorePotAz.load();
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	var classeMar = Ext.create('Ext.grid.Panel', {
		id : 'classeMar',
		title : 'Classe',
		hideHeaders : true,
		store : storeClasseMar,
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
								storeValoreMar.proxy.extraParams.id = storeClasseMar.data.items[rowIndex].data.id;
								storeValoreMar.load();
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var classeMarAz = Ext.create('Ext.grid.Panel', {
		id : 'classeMarAz',
		title : 'Classe',
		hideHeaders : true,
		store : storeClasseMarAz,
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
								storeValoreMarAz.proxy.extraParams.id = storeClasseMarAz.data.items[rowIndex].data.id;
								storeValoreMarAz.load();
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	var classeSer = Ext.create('Ext.grid.Panel', {
		id : 'classeSer',
		title : 'Classe',
		hideHeaders : true,
		store : storeClasseSer,
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
								storeValoreSer.proxy.extraParams.id = storeClasseSer.data.items[rowIndex].data.id;
								storeValoreSer.load();
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	var classeFat = Ext.create('Ext.grid.Panel', {
		id : 'classeFat',
		title : 'Classe',
		hideHeaders : true,
		store : storeClasseFat,
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
							storeValoreFat.proxy.extraParams.id = storeClasseFat.data.items[rowIndex].data.id;
							storeValoreFat.load();
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	var valorePar = Ext.create('Ext.grid.Panel', {
		id : 'valorePar',
		title : 'Valore',
		hideHeaders : true,
		store : storeValorePar,
		columns : [
			{
				dataIndex : 'class_id',
				text : 'classe',
				hidden : true
			},
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				text : 'classe',
				hidden : true,
				dataIndex : 'classe_text'
			},
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				 
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						var data = new Array(
							storeValorePar.data.items[rowIndex].data.id,
							storeValorePar.data.items[rowIndex].data.class_id,
							storeValorePar.data.items[rowIndex].data.class_text
							+ ": "+ storeValorePar.data.items[rowIndex].data.text
						);
						 /* itemdblclick: function(dv, record, item, index, e){	//console.log(record);
                              //alert('working'+record.data.pv_id);
                              //menuContext.showAt(e.xy);
                              var selection = f.getView().getSelectionModel().getSelection()[0];
                              //console.debug(selection.data.nome);
                              showFeatures(selection.data.nome, selection.data.custom);		*/			
						flag = false;
						for (n in selectedParValues) {
							var s = selectedParValues[n];
							if (s[0] == storeValorePar.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
							selectedParValues.push(data);
							store_selected_par.loadData(selectedParValues, false);
						}
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var valoreParAz = Ext.create('Ext.grid.Panel', {
		id : 'valoreParAz',
		title : 'Valore',
		hideHeaders : true,
		store : storeValoreParAz,
		columns : [
			{
				dataIndex : 'class_id',
				text : 'classe',
				hidden : true
			},
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				text : 'classe',
				hidden : true,
				dataIndex : 'classe_text'
			},
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						var data = new Array(
							storeValoreParAz.data.items[rowIndex].data.id,
							storeValoreParAz.data.items[rowIndex].data.class_id,
							storeValoreParAz.data.items[rowIndex].data.class_text
							+ ": "+ storeValoreParAz.data.items[rowIndex].data.text
						);
											
						flag = false;
						for (n in selectedParValuesAz) {
							var s = selectedParValuesAz[n];
							if (s[0] == storeValoreParAz.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
							selectedParValuesAz.push(data);
							store_selected_par_az.loadData(selectedParValuesAz, false);
						}
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	var valorePot = Ext.create('Ext.grid.Panel', {
		id : 'valorePot',
		title : 'Valore',
		hideHeaders : true,
		store : storeValorePot,
		columns : [
			{
				dataIndex : 'class_id',
				text : 'classe',
				hidden : true
			},
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						var data = new Array(
							storeValorePot.data.items[rowIndex].data.id,
							storeValorePot.data.items[rowIndex].data.class_id,
							storeValorePot.data.items[rowIndex].data.text
						);
											
						flag = false;
						for (n in selectedPotValues) {
							var s = selectedPotValues[n];
							if (s[0] == storeValorePot.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
							selectedPotValues.push(data);
							store_selected_pot.loadData(selectedPotValues, false);
						}
					}
				} ]
			}
		],
		height : height,
		width : width
	});
	
	var valorePotAz = Ext.create('Ext.grid.Panel', {
		id : 'valorePotAz',
		title : 'Valore',
		hideHeaders : true,
		store : storeValorePotAz,
		columns : [
			{
				dataIndex : 'class_id',
				text : 'classe',
				hidden : true
			},
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						var data = new Array(
							storeValorePotAz.data.items[rowIndex].data.id,
							storeValorePotAz.data.items[rowIndex].data.class_id,
							storeValorePotAz.data.items[rowIndex].data.text
						);
											
						flag = false;
						for (n in selectedPotValuesAz) {
							var s = selectedPotValuesAz[n];
							if (s[0] == storeValorePotAz.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
							selectedPotValuesAz.push(data);
							store_selected_pot_az.loadData(selectedPotValuesAz, false);
						}
					}
				} ]
			}
		],
		height : height,
		width : width
	});

	var valoreMar = Ext.create('Ext.grid.Panel', {
		id : 'valoreMar',
		title : 'Valore',
		hideHeaders : true,
		store : storeValoreMar,
		columns : [
			{
				dataIndex : 'class_id',
				text : 'classe',
				hidden : true
			},
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						var data = new Array(
							storeValoreMar.data.items[rowIndex].data.id,
							storeValoreMar.data.items[rowIndex].data.class_id,
							storeValoreMar.data.items[rowIndex].data.text
						);
						
						flag = false;
						for (n in selectedMarValues) {
							var s = selectedMarValues[n];
							if (s[0] == storeValoreMar.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
							selectedMarValues.push(data);
							store_selected_mar.loadData(selectedMarValues, false);
						}
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var valoreMarAz = Ext.create('Ext.grid.Panel', {
		id : 'valoreMarAz',
		title : 'Valore',
		hideHeaders : true,
		store : storeValoreMarAz,
		columns : [
			{
				dataIndex : 'class_id',
				text : 'classe',
				hidden : true
			},
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						var data = new Array(
							storeValoreMarAz.data.items[rowIndex].data.id,
							storeValoreMarAz.data.items[rowIndex].data.class_id,
							storeValoreMarAz.data.items[rowIndex].data.text
						);
						
						flag = false;
						for (n in selectedMarValuesAz) {
							var s = selectedMarValuesAz[n];
							if (s[0] == storeValoreMarAz.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
							selectedMarValuesAz.push(data);
							store_selected_mar_az.loadData(selectedMarValuesAz, false);
						}
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	var valoreSer = Ext.create('Ext.grid.Panel', {
		id : 'valoreSer',
		title : 'Valore',
		hideHeaders : true,
		store : storeValoreSer,
		columns : [
			{
				dataIndex : 'class_id',
				text : 'classe',
				hidden : true
			},
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						var data = new Array(
							storeValoreSer.data.items[rowIndex].data.id,
							storeValoreSer.data.items[rowIndex].data.class_id,
							storeValoreSer.data.items[rowIndex].data.text
						);
						
						flag = false;
						for (n in selectedSerValues) {
							var s = selectedSerValues[n];
							if (s[0] == storeValoreSer.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
							selectedSerValues.push(data);
							store_selected_ser.loadData(selectedSerValues, false);
						}
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	var valoreFat = Ext.create('Ext.grid.Panel', {
		id : 'valoreFat',
		title : 'Valore',
		hideHeaders : true,
		store : storeValoreFat,
		columns : [
			{
				dataIndex : 'class_id',
				text : 'classe',
				hidden : true
			},
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				text : 'nome',
				flex : 1,
				dataIndex : 'text'
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/mininext.png',
					tooltip : 'Mostra valori',
					handler : function(grid, rowIndex, colIndex) {
						var data = new Array(
							storeValoreFat.data.items[rowIndex].data.id,
							storeValoreFat.data.items[rowIndex].data.class_id,
							storeValoreFat.data.items[rowIndex].data.text
						);
											
						flag = false;
						for (n in selectedFatValues) {
							var s = selectedFatValues[n];
							if (s[0] == storeValoreFat.data.items[rowIndex].data.id) {
								flag = true;
							}
						}
						if (!flag) {
							selectedFatValues.push(data);
							store_selected_fat.loadData(selectedFatValues, false);
						}
					}
				} ]
			}
		],
		height : height,
		width : width
	});
	
	var selected_par = Ext.create('Ext.grid.Panel', {
		id : 'SelPar',
		title : 'Parametri selezionati ',
		store : store_selected_par,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				dataIndex : 'class_id',
				text : 'class',
				hidden : true
			},
			{
				dataIndex : 'nome',
				text : 'Nome',
				flex : 2
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/delete.gif',
					tooltip : 'Elimina questo valore',
					handler : function(grid, rowIndex, colIndex) {
						for (n in selectedParValues) {
							var s = selectedParValues[n];
							if (s[0] == store_selected_par.data.items[rowIndex].data.id) {
								var e = selectedParValues.splice(n, 1);
							}
						}
						store_selected_par.remove(store_selected_par.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var selected_par_az = Ext.create('Ext.grid.Panel', {
		id : 'SelParAz',
		title : 'Parametri selezionati ',
		store : store_selected_par_az,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				dataIndex : 'class_id',
				text : 'class',
				hidden : true
			},
			{
				dataIndex : 'nome',
				text : 'Nome',
				flex : 2
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/delete.gif',
					tooltip : 'Elimina questo valore',
					handler : function(grid, rowIndex, colIndex) {
						for (n in selectedParValuesAz) {
							var s = selectedParValuesAz[n];
							if (s[0] == store_selected_par_az.data.items[rowIndex].data.id) {
								var e = selectedParValuesAz.splice(n, 1);
							}
						}
						store_selected_par_az.remove(store_selected_par_az.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	var selected_pot = Ext.create('Ext.grid.Panel', {
		id : 'SelPot',
		title : 'Parametri selezionati ',
		store : store_selected_pot,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				dataIndex : 'class_id',
				text : 'class',
				hidden : true
			},
			{
				dataIndex : 'nome',
				text : 'Nome',
				flex : 2
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/delete.gif', 
					tooltip : 'Elimina questo valore',
					handler : function(grid, rowIndex, colIndex) {
						for (n in selectedPotValues) {
							var s = selectedPotValues[n];
							if (s[0] == store_selected_pot.data.items[rowIndex].data.id) {
								var e = selectedPotValues.splice(n, 1);
							}
						}
						store_selected_pot.remove(store_selected_pot.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var selected_pot_az = Ext.create('Ext.grid.Panel', {
		id : 'SelPotAz',
		title : 'Parametri selezionati ',
		store : store_selected_pot_az,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
		columns : [
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				dataIndex : 'class_id',
				text : 'class',
				hidden : true
			},
			{
				dataIndex : 'nome',
				text : 'Nome',
				flex : 2
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/delete.gif', 
					tooltip : 'Elimina questo valore',
					handler : function(grid, rowIndex, colIndex) {
						for (n in selectedPotValuesAz) {
							var s = selectedPotValuesAz[n];
							if (s[0] == store_selected_pot_az.data.items[rowIndex].data.id) {
								var e = selectedPotValuesAz.splice(n, 1);
							}
						}
						store_selected_pot_az.remove(store_selected_pot_az.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});

	var selected_mar = Ext.create('Ext.grid.Panel', {
		id : 'SelMar',
		title : 'Parametri selezionati ',
		store : store_selected_mar,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
			columns : [
				{
					dataIndex : 'id',
					text : 'valore',
					hidden : true
				},
				{
					dataIndex : 'class_id',
					text : 'class',
					hidden : true
				},
				{
					dataIndex : 'nome',
					text : 'Nome',
					flex : 2
				},
				{
					xtype : 'actioncolumn',
					width : 35,
					items : [ {
						icon : 'img/delete.gif',
						tooltip : 'Elimina questo valore',
						handler : function(grid, rowIndex, colIndex) {
							for (n in selectedMarValues) {
								var s = selectedMarValues[n];
								if (s[0] == store_selected_mar.data.items[rowIndex].data.id) {
									var e = selectedMarValues.splice(n, 1);
								}
							}
						store_selected_mar.remove(store_selected_mar.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	
	var selected_mar_az = Ext.create('Ext.grid.Panel', {
		id : 'SelMarAz',
		title : 'Parametri selezionati ',
		store : store_selected_mar_az,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
			columns : [
				{
					dataIndex : 'id',
					text : 'valore',
					hidden : true
				},
				{
					dataIndex : 'class_id',
					text : 'class',
					hidden : true
				},
				{
					dataIndex : 'nome',
					text : 'Nome',
					flex : 2
				},
				{
					xtype : 'actioncolumn',
					width : 35,
					items : [ {
						icon : 'img/delete.gif',
						tooltip : 'Elimina questo valore',
						handler : function(grid, rowIndex, colIndex) {
							for (n in selectedMarValuesAz) {
								var s = selectedMarValuesAz[n];
								if (s[0] == store_selected_mar_az.data.items[rowIndex].data.id) {
									var e = selectedMarValuesAz.splice(n, 1);
								}
							}
						store_selected_mar_az.remove(store_selected_mar_az.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	var selected_ser = Ext.create('Ext.grid.Panel', {
		id : 'SelSer',
		title : 'Servizi selezionati ',
		store : store_selected_ser,
		hideHeaders : true,
		emptyText : 'nessun parametro selezionato',
			columns : [
				{
					dataIndex : 'id',
					text : 'valore',
					hidden : true
				},
				{
					dataIndex : 'class_id',
					text : 'class',
					hidden : true
				},
				{
					dataIndex : 'nome',
					text : 'Nome',
					flex : 2
				},
				{
					xtype : 'actioncolumn',
					width : 35,
					items : [ {
						icon : 'img/delete.gif',
						tooltip : 'Elimina questo valore',
						handler : function(grid, rowIndex, colIndex) {
							for (n in selectedSerValues) {
								var s = selectedSerValues[n];
								if (s[0] == store_selected_ser.data.items[rowIndex].data.id) {
									var e = selectedSerValues.splice(n, 1);
								}
							}
						store_selected_ser.remove(store_selected_ser.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	var selected_fat = Ext.create('Ext.grid.Panel', {
		id : 'SelFat',
		title : 'Fatturati selezionati ',
		store : store_selected_fat,
		hideHeaders : true,
		emptyText : 'nessun fatturato selezionato',
		columns : [
			{
				dataIndex : 'id',
				text : 'valore',
				hidden : true
			},
			{
				dataIndex : 'class_id',
				text : 'class',
				hidden : true
			},
			{
				dataIndex : 'nome',
				text : 'Nome',
				flex : 2
			},
			{
				xtype : 'actioncolumn',
				width : 35,
				items : [ {
					icon : 'img/delete.gif',
					tooltip : 'Elimina questo valore',
					handler : function(grid, rowIndex, colIndex) {
						for (n in selectedFatValues) {
							var s = selectedFatValues[n];
							if (s[0] == store_selected_fat.data.items[rowIndex].data.id) {
								var e = selectedFatValues.splice(n, 1);
							}
						}
						store_selected_fat.remove(store_selected_fat.data.items[rowIndex]);
					}
				} ]
			} 
		],
		height : height,
		width : width
	});
	// ////////////////////////////////////////////////////////
	// ////////////////////////////////////////////////////////
	var tab = Ext.create('Ext.tab.Panel', {
		width : 900,
		height : 500,
		activeTab : 0,
		dockedItems : [ {
			xtype : 'toolbar',
			items : [ {
				text : 'Applica Filtro',
				tooltip : 'Applica Filtri',
				icon : 'img/ok.png',
				scale : 'medium',
				handler : function() {
					applyFilter(chooseClient.getForm().getFieldValues().liv);
				}
			}, {
				text : 'Reset',
				tooltip : 'Cancella filtro',
				icon : 'img/del.png',
				scale : 'medium',
				handler : function() {
					resetFilter();
				}
			} ]
		} ],
		items : [ {
			title : 'Dati generali',
			items :[chooseClient],
			layout : 'hbox'
		},{
			title : 'Potenziali',
			items : [ classePot, valorePot, selected_pot ],
			layout : 'hbox'
		},{
			title : 'Parametri',
			items : [ classePar, valorePar, selected_par ],
			layout : 'hbox'
		}]
	});
		if(results[0]!='0'){
			tab.add({
				title : 'Servizi',
				items : [ classeSer, valoreSer, selected_ser ],
				layout : 'hbox'
			});
		}
		tab.add({
			title : 'Marche',
			items : [ classeMar, valoreMar, selected_mar ],
			layout : 'hbox'
		});
	
	
	if(custom=='1') {
		if(results[1]!='0'){
			tab.add({
				title : 'Fatturati',
				items : [ classeFat, valoreFat, selected_fat ],
				layout : 'hbox'
			});
		}
		if(results[2]!='0'){
			tab.add({
				title : 'Potenziali Az',
				items : [ classePotAz, valorePotAz, selected_pot_az ],
				layout : 'hbox'
			});
		}
		if(results[3]!='0'){
			tab.add({
				title : 'Parametri Az',
				items : [ classeParAz, valoreParAz, selected_par_az ],
				layout : 'hbox'
			});
		}
		if(results[4]!='0'){
			tab.add({
				title : 'Marche Az',
				items : [ classeMarAz, valoreMarAz, selected_mar_az ],
				layout : 'hbox'
			});
		}
	}
	
	var window = new Ext.Window({
		height : 455,
		width : 910,
		title : 'Filtri',
		items : [ tab ],
		closeAction : 'destroy',
		listeners : {
			beforeclose : function(panel, eOpts) {
				Ext.getCmp('filterButton').enable();
				
			}
		}
	});

	window.show();
	window.center();

}