Ext.define('Parameters', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'parametro',
		type : 'string'
	}, {
		name : 'valore',
		type : 'string'
	}, {
		name : 'id',
		type : 'integer'
	},{
		name : 'classeId',
		type : 'string'
	}]
});

Ext.define('ParametersAzienda', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'parametro',
		type : 'string'
	}, {
		name : 'valore',
		type : 'string'
	}, {
		name : 'id',
		type : 'integer'
	},{
		name : 'classeId',
		type : 'string'
	}]
});

Ext.define('Potentials', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'potenziale',
		type : 'string'
	}, {
		name : 'fascia',
		type : 'string'
	}, {
		name : 'valore',
		type : 'string'
	}, {
		name : 'id',
		type : 'integer'
	} ]
});

Ext.define('Fatturati', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'fatturato',
		type : 'string'
	}, {
		name : 'fascia',
		type : 'string'
	}, {
		name : 'valore',
		type : 'string'
	}, {
		name : 'id',
		type : 'integer'
	} ]
});

Ext.define('PotentialsAzienda', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'potenziale',
		type : 'string'
	}, {
		name : 'fascia',
		type : 'string'
	}, {
		name : 'valore',
		type : 'string'
	}, {
		name : 'id',
		type : 'integer'
	} ]
});

Ext.define('Brands', {
	extend : 'Ext.data.Model',
	fields : [
	/* {name:'valore', type:'string'}, */
	{
		name : 'text',
		type : 'string'
	}, {
		name : 'pv_id',
		type : 'integer'
	}, {
		name : 'id',
		type : 'integer'
	} ]
});

Ext.define('BrandsAzienda', {
	extend : 'Ext.data.Model',
	fields : [
	/* {name:'valore', type:'string'}, */
	{
		name : 'text',
		type : 'string'
	}, {
		name : 'pv_id',
		type : 'integer'
	}, {
		name : 'id',
		type : 'integer'
	} ]
});
Ext.define('Services', {
	extend : 'Ext.data.Model',
	fields : [
	/* {name:'valore', type:'string'}, */
	{
		name : 'text',
		type : 'string'
	}, {
		name : 'pv_id',
		type : 'integer'
	}, {
		name : 'id',
		type : 'integer'
	} ]
});
Ext.define('ServicesValues', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'valore',
		type : 'string'
	}, {
		name : 'classeId',
		type : 'integer'
	},{
		name : 'servizioId',
		type : 'integer'
	} ]
});

Ext.define('BrandsValues', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'valore',
		type : 'string'
	}, {
		name : 'classeId',
		type : 'integer'
	},{
		name : 'marcaId',
		type : 'integer'
	} ]
});

Ext.define('BrandsValuesAzienda', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'valore',
		type : 'string'
	}, {
		name : 'classeAzId',
		type : 'integer'
	},{
		name : 'marcaAzId',
		type : 'integer'
	} ]
});
Ext.define('Note', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'note',
		type : 'string'
	}]
});
function boldValue(val) { 
	return '<span style="font-weight:bold;">' + val + '</span>';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function potentialsGridFactory(pv_id) {
	var storePotentials = Ext.create('Ext.data.Store',
			{
				pageSize : 50,
				model : 'Potentials',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root+ constants.servlet,
					extraParams : {
						task : 'potentialsList',
						id : pv_id,
						censimento : dbname
					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	var PotentialsGrid = Ext.create('Ext.grid.Panel', {
		// height: 450,
		// width: 700,
		layout : 'fit',
		// title: 'Elenco Parametri ',
		store : storePotentials,
		// emptyText:'nessun parametro registrato',
		columns : [ {
			dataIndex : 'id',
			text : 'codice MMAS',
			hidden : true
		}, {
			dataIndex : 'potenziale',
			text : 'Potenziale',
			flex : 1
		}, {
			dataIndex : 'fascia',
			flex : 1,
			text : 'Fascia'
		}, {
			dataIndex : 'valore',
			flex : 1,
			text : 'Valore',
			renderer : boldValue
		} ]
	});
	return PotentialsGrid;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function potentialsAziendaFactory(pv_id) {

	var storePotentialsAzienda = Ext.create('Ext.data.Store',
			{
				pageSize : 50,
				model : 'PotentialsAzienda',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root
							+ constants.servlet,
					extraParams : {
						task : 'potentialsListAz',
						id : pv_id,
						censimento : dbname
					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	var PotentialsAziendaGrid = Ext.create('Ext.grid.Panel', {
		// height: 450,
		// width: 700,
		id : 'pot_az',
		layout : 'fit',
		// title: 'Elenco Parametri ',
		store : storePotentialsAzienda,
		// emptyText:'nessun parametro registrato',
		columns : [ {
			dataIndex : 'id',
			text : 'codice MMAS',
			hidden : true
		}, {
			dataIndex : 'potenziale',
			text : 'Potenziale',
			flex : 1
		}, {
			dataIndex : 'fascia',
			flex : 1,
			text : 'Fascia'
		}, {
			dataIndex : 'valore',
			flex : 1,
			text : 'Valore',
			renderer : boldValue
		} ]
	});

	return PotentialsAziendaGrid;

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var storeParGrid=new Ext.util.HashMap();
function parametersGridFactory(pv_id) {
	var storeParameters = Ext.create('Ext.data.Store',
			{
				pageSize : 50,
				model : 'Parameters',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root + constants.servlet,
					extraParams : {
						task : 'parametersList',
						id : pv_id,
						censimento : dbname

					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});
	
	var ParametersGrid = Ext.create('Ext.grid.Panel', {
		// height: 450,
		// width: 700,
		id : 'parametersGrid',
		layout : 'fit',
		// title: 'Elenco Parametri ',
		store : storeParameters,
		plugins: [
		          Ext.create('Ext.grid.plugin.CellEditing', {
		              clicksToEdit: 1
		          })
		],
		// emptyText:'nessun parametro registrato',
		columns : [ {
			dataIndex : 'id',
			text : 'codice MMAS',
			hidden : true
		}, {
			dataIndex : 'parametro',
			flex : 1,
			text : 'Parametro'
		}, {
			dataIndex: 'valore',
			flex : 1,
			text : 'Valore',
			renderer : boldValue,
            editor   : {
            	xtype: 'combobox',
            	emptyText: 'Aggiungi',
            	id: 'comboValues',
            	queryMode: 'local',
        	    editable: false,
        	    listeners: {
                    click: {
                        element: 'el', 
                        id: 'id_el_param',
                        fn: function(){ 
                        	var selectedCellRecord = ParametersGrid.getSelectionModel().getSelection()[0];
                        	var cellIndex = ParametersGrid.store.indexOf(selectedCellRecord);
                           	var classeId=storeParameters.getAt(cellIndex).data.classeId;
                        	Ext.Ajax.request({
        		  				url: 'http://' + constants.ip + constants.root + constants.servlet,
        		  				params:{
        		  					task: 'salvaParAnagrafica',
        		  					censimento: dbname,
        		  					classeId: classeId
        		  				},
        				  		success: function(response){
        				  			var array=new Array();
        				  			var obj = Ext.decode(response.responseText);
        				  			for(var i=0;i<obj.results.length;i++){
        				  				array.push({'valoriParametro':obj.results[i].valoriParametro});
        				  			}
        				  			Ext.define('storeValueParameters', {
        				  			     extend: 'Ext.data.Model',
        				  			     fields: [
        				  			         {name: 'valoriParametro', type: 'string'},
        				  			     ]
        				  			 });
        				  			var temporaryStore = Ext.create('Ext.data.Store', {
        				  				//autoDestroy: true,
        				  				model: 'storeValueParameters',
        				  				storeId: 'temporaryStoreValues',
        				  				autoLoad: true,
        				  				data : array
        				  			});
        				  			var f=Ext.getCmp('comboValues');
        				  			f.bindStore(temporaryStore);
        				  		}
        		  			});
                        }
                    },
                    select: function(){
                    	var f=Ext.getCmp('comboValues');
                    	var selectedCellRecord = ParametersGrid.getSelectionModel().getSelection()[0];
                       	var cellIndex = ParametersGrid.store.indexOf(selectedCellRecord);
                       	var classeId=storeParameters.getAt(cellIndex).data.classeId;
                        var valore=f.getValue();
                        Ext.Ajax.request({
                        	url: 'http://' + constants.ip + constants.root + constants.servlet,
                		  	params:{
                		  		task: 'getValuePar',
                		  		censimento: dbname,
                		  		valore: valore,
                		  		classeId: classeId
                		  	},
                		  	success: function(response){
                		  		var risp=Ext.decode(response.responseText);
                		  		var id_valore=risp.results[0].tc_par_id;
                		  		storeParGrid.add(classeId,id_valore);
                		  	}
                        });
                        
      				}
          		},
          		displayField: 'valoriParametro',
          		valueField: 'valoriParametro',
          		hiddenName: 'valoriParametro'
            }
		},{
        	dataIndex : 'classeId',
			text : 'ClasseId',
			hidden : true
        }]
	});
	return ParametersGrid;
}

function returnStoreParGrid(){
	return storeParGrid;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var storeParAzGrid=new Ext.util.HashMap();
function parametersAziendaFactory(pv_id) {
	var storeParametersAzienda = Ext.create('Ext.data.Store',
			{
				pageSize : 50,
				model : 'ParametersAzienda',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root
							+ constants.servlet,
					extraParams : {
						task : 'parametersListAz',
						id : pv_id,
						censimento : dbname

					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	var ParametersAziendaGrid = Ext.create('Ext.grid.Panel', {
		// height: 450,
		// width: 700,
		id : 'par_az',
		layout : 'fit',
		// title: 'Elenco Parametri ',
		store : storeParametersAzienda,
		plugins: [
		          Ext.create('Ext.grid.plugin.CellEditing', {
		              clicksToEdit: 1
		          })
		],
		// emptyText:'nessun parametro registrato',
		columns : [ {
			dataIndex : 'id',
			text : 'codice MMAS',
			hidden : true
		}, {
			dataIndex : 'parametro',
			flex : 1,
			text : 'Parametro'
		}, {
			dataIndex : 'valore',
			flex : 1,
			text : 'Valore',
			renderer : boldValue,
			editor   : {
            	xtype: 'combobox',
            	emptyText: 'Aggiungi',
            	id: 'comboValuesAz',
            	queryMode: 'local',
        	    editable: false,
        	    listeners: {
                    click: {
                        element: 'el', 
                        id: 'id_el_paramAz',
                        fn: function(){ 
                        	var selectedCellRecord = ParametersAziendaGrid.getSelectionModel().getSelection()[0];
                        	var cellIndex = ParametersAziendaGrid.store.indexOf(selectedCellRecord);
                           	var classeId=storeParametersAzienda.getAt(cellIndex).data.classeId;
                        	Ext.Ajax.request({
        		  				url: 'http://' + constants.ip + constants.root + constants.servlet,
        		  				params:{
        		  					task: 'salvaParAzAnagrafica',
        		  					censimento: dbname,
        		  					classeId: classeId
        		  				},
        				  		success: function(response){
        				  			var array=new Array();
        				  			var obj = Ext.decode(response.responseText);
        				  			for(var i=0;i<obj.results.length;i++){
        				  				array.push({'valoriParametroAz':obj.results[i].valoriParametroAz});
        				  			}
        				  			Ext.define('storeValueParametersAz', {
        				  			     extend: 'Ext.data.Model',
        				  			     fields: [
        				  			         {name: 'valoriParametroAz', type: 'string'}
        				  			     ]
        				  			 });
        				  			var temporaryStore = Ext.create('Ext.data.Store', {
        				  				//autoDestroy: true,
        				  				model: 'storeValueParametersAz',
        				  				storeId: 'temporaryStoreValuesAz',
        				  				autoLoad: true,
        				  				data : array
        				  			});
        				  			var f=Ext.getCmp('comboValuesAz');
        				  			f.bindStore(temporaryStore);
        				  		}
        		  			});
                        }
                    },
                    select: function(){
                    	var f=Ext.getCmp('comboValuesAz');
                    	var selectedCellRecord = ParametersAziendaGrid.getSelectionModel().getSelection()[0];
                       	var cellIndex = ParametersAziendaGrid.store.indexOf(selectedCellRecord);
                       	var classeId=storeParametersAzienda.getAt(cellIndex).data.classeId;
                        var valore=f.getValue();
                        Ext.Ajax.request({
                        	url: 'http://' + constants.ip + constants.root + constants.servlet,
                		  	params:{
                		  		task: 'getValueParAz',
                		  		censimento: dbname,
                		  		valore: valore,
                		  		classeId: classeId
                		  	},
                		  	success: function(response){
                		  		var risp=Ext.decode(response.responseText);
                		  		var id_valore=risp.results[0].tc_par_az_id;
                		  		storeParAzGrid.add(classeId,id_valore);
                		  	}
                        });
                        
      				}
          		},
          		displayField: 'valoriParametroAz',
          		valueField: 'valoriParametroAz',
          		hiddenName: 'valoriParametroAz'
			}
		} ]
	});

	return ParametersAziendaGrid;
}
function returnStoreParAzGrid(){
	return storeParAzGrid;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var storeMarGrid = new Array();
var deleteMarGrid= new Array();
function brandsGridFactory(pv_id) {

	var storeBrands = Ext.create('Ext.data.Store',
			{

				pageSize : 50,
				model : 'Brands',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root + constants.servlet,
					extraParams : {
						task : 'getClass',
						category : 'mar',
						id : pv_id,
						censimento : dbname

					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	var storeBrandsValues = Ext.create('Ext.data.Store',
			{
				pageSize : 50,
				model : 'BrandsValues',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root + constants.servlet,
					extraParams : {
						task : 'brandsValues',
						id : pv_id,
						censimento : dbname,
						brand_id : 1

					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	
	var BrandsGrid = Ext.create('Ext.grid.Panel',
					{
						// height: 450,
						flex : 1,
						// layout:'fit',
						// title: 'Elenco Parametri ',
						store : storeBrands,
						plugins: [
						          Ext.create('Ext.grid.plugin.CellEditing', {
						              clicksToEdit: 1
						          })
						],
						// emptyText:'nessun parametro registrato',
						columns : [ {
							dataIndex : 'pv_id',
							text : 'codice MMAS',
							hidden : true
						}, {
							dataIndex : 'id',
							text : 'codice brand',
							hidden : true
						}, {
							dataIndex : 'text',
							flex : 1,
							text : 'Classe Marca'
						},{
							flex :  1,
							text : 'Aggiungi una marca',
							dataIndex: '',
							editor   : {
								xtype: 'combobox',
								typeAhead: true,
							    triggerAction: 'all',
							    lazyRender: true,
								emptyText: 'Aggiungi',
								id: 'comboBrands',
								queryMode: 'local',
								editable: false,
								autoRender: true,
								autoShow : true,
								listeners: {
					        		click: {
					        			element: 'el', 
					        			id: 'id_el_brand',
					                    fn: function(){ 
					                    	var selectedCellRecord = BrandsGrid.getSelectionModel().getSelection()[0];
					                        var cellIndex = BrandsGrid.store.indexOf(selectedCellRecord);
					                        var classeId=storeBrands.getAt(cellIndex).data.id;
					                       // console.log(classeId);
					                       
					                    	Ext.Ajax.request({
					                    		url: 'http://' + constants.ip + constants.root + constants.servlet,
					        		  			params:{
					        		  				task: 'salvaMarAnagrafica',
					        		  				censimento: dbname,
					        		  				brand_id: 1,
					        		  				classeId: classeId
					        		  			},
					        				  	success: function(response){
					        				  		var array=new Array();
					        				  		var obj = Ext.decode(response.responseText);
					        				  		//console.log(obj);
					        				  		for(var i=0;i<obj.results.length;i++){
					        				  			array.push({'valoriMarche':obj.results[i].valore});
					        				  		}
					        				  		Ext.define('storeBrandsClass', {
					        				  		     extend: 'Ext.data.Model',
					        				  			 fields: [
					        				  			          {name: 'valoriMarche', type: 'string'},
					        				  			 ]
					        				  		});
					        				  		var temporaryStore = Ext.create('Ext.data.Store', {
					        				  			//autoDestroy: true,
					        				  			model: 'storeBrandsClass',
					        				  			storeId: 'temporaryStoreBrands',
					        				  			autoLoad: true,
					        				  			data : array
					        				  		});
					        				  		var f=Ext.getCmp('comboBrands');
					        				  		f.bindStore(temporaryStore);
					        				  	}
					        		  		});
					                    }
					        		},
				                    select: function(){
				                    	var f=Ext.getCmp('comboBrands');
				                    	var selectedCellRecord = BrandsGrid.getSelectionModel().getSelection()[0];
				                    	var cellIndex = BrandsGrid.store.indexOf(selectedCellRecord);
				                    	var classeId=storeBrands.getAt(cellIndex).data.id;
				                        var valore=f.getValue();
				                       // console.log(valore);
				                        Ext.Ajax.request({
				                        	url: 'http://' + constants.ip + constants.root + constants.servlet,
				                		  	params:{
				                		  		task: 'getValueMar',
				                		  		censimento: dbname,
				                		  		valore: valore
				                		  	},
				                		  	success: function(response){
				                		  		var risp=Ext.decode(response.responseText);
				                		  		var id_valore=risp.results[0].tc_mar_id;
				                		  		//console.log(id_valore);
				                		  		storeMarGrid.push(id_valore);
				                		  		storeMarGrid.push(valore);
				                		  		storeMarGrid.push(classeId);
				                		  	}
				                        });
				                        
				      				}
					          	},
					          	displayField: 'valoriMarche',
					          	valueField: 'valoriMarche',
					          	hiddenName: 'valoriMarche'
							}
						}],
						/*
							 * { xtype: 'actioncolumn', width: 35, items: [{
							 * icon : 'img/mininext.png', tooltip: 'Mostra
							 * valori', handler: function(grid, rowIndex,
							 * colIndex) { //console.debug(storeBrands.data);
							 * storeBrandsValues.proxy.extraParams.brand_id=storeBrands.data.items[rowIndex].data.brand_id;
							 * storeBrandsValues.load(); } }] }
							 */
						/*
						 * ,{ dataIndex: 'valore', flex: 1, text: 'Valore' }
						 */
						listeners : {
							selectionchange : function(view, selected, e) {
								//console.log(storeBrands.data.items[selected[0].index].data.id);
								storeBrandsValues.proxy.extraParams.brand_id = storeBrands.data.items[selected[0].index].data.id;
								storeBrandsValues.load();
							}
						}
					});
	
	
	var BrandsValuesGrid = Ext.create('Ext.grid.Panel', {
		// layout:'fit',
		flex : 1,
		store : storeBrandsValues,
		columns : [ {
			dataIndex : 'id',
			text : 'Codice MMAS',
			hidden : true
		},{
			dataIndex : 'valore',
			flex : 1,
			text : 'Valore',
			renderer : boldValue
		},{
			xtype : 'actioncolumn',
			width : 35,
			items : [{
				icon : 'img/del2.png', // Use a URL in the icon config
				tooltip : 'Elimina questa marca',
				handler : function(grid, rowIndex, colIndex) {
					var classeId=grid.getStore().getAt(rowIndex).data.classeId;
					//console.log(classeId);
					var marcaId=grid.getStore().getAt(rowIndex).data.marcaId;
					deleteMarGrid.push(classeId,marcaId);
					grid.getStore().removeAt(rowIndex);
				}
			}]
		}]
	});

	var BrandsPanel = Ext.create('Ext.Panel', {
		layout : {
			type : 'hbox',
			pack : 'start',
			align : 'stretch'
		},
		items : [ BrandsGrid,BrandsValuesGrid ]
	});

	return BrandsPanel;
}
function returnStoreMarGrid(){
	return storeMarGrid;
}
function returnDeleteMarGrid(){
	return deleteMarGrid;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var storeMarAzGrid=new Array();
var deleteMarAzGrid=new Array();
function brandsAziendaFactory(pv_id) {

	var storeBrandsAzienda = Ext.create('Ext.data.Store',
			{

				pageSize : 50,
				model : 'BrandsAzienda',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root
							+ constants.servlet,
					extraParams : {
						task : 'getClassAz',
						category : 'mar',
						id : pv_id,
						censimento : dbname

					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	var storeBrandsValuesAzienda = Ext.create('Ext.data.Store',
			{
				pageSize : 50,
				model : 'BrandsValuesAzienda',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root
							+ constants.servlet,
					extraParams : {
						task : 'brandsValuesAz',
						id : pv_id,
						censimento : dbname,
						brand_id : 1

					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	var BrandsGridAzienda = Ext.create('Ext.grid.Panel',
					{
						flex : 1,
						store : storeBrandsAzienda,
						plugins: [
						          Ext.create('Ext.grid.plugin.CellEditing', {
						              clicksToEdit: 1
						          })
						],
						columns : [ {
							dataIndex : 'pv_id',
							text : 'codice MMAS',
							hidden : true
						}, {
							dataIndex : 'id',
							text : 'codice brand',
							hidden : true
						}, {
							dataIndex : 'text',
							flex : 1,
							text : 'Classe Marca'
						},{
							flex :  1,
							text : 'Aggiungi una marca',
							dataIndex: '',
							editor   : {
								xtype: 'combobox',
								typeAhead: true,
							    triggerAction: 'all',
							    lazyRender: true,
								emptyText: 'Aggiungi',
								id: 'comboBrandsAz',
								queryMode: 'local',
								editable: false,
								autoRender: true,
								autoShow : true,
								listeners: {
					        		click: {
					        			element: 'el', 
					        			id: 'id_el_brand_az',
					                    fn: function(){ 
					                    	var selectedCellRecord = BrandsGridAzienda.getSelectionModel().getSelection()[0];
					                        var cellIndex = BrandsGridAzienda.store.indexOf(selectedCellRecord);
					                        var classeAzId=storeBrandsValuesAzienda.getAt(cellIndex).data.classeAzId;
					                       //console.log(classeAzId);
					                    	Ext.Ajax.request({
					                    		url: 'http://' + constants.ip + constants.root + constants.servlet,
					        		  			params:{
					        		  				task: 'salvaMarAzAnagrafica',
					        		  				censimento: dbname,
					        		  				brand_az_id: 1,
					        		  				classeAzId: classeAzId
					        		  			},
					        				  	success: function(response){
					        				  		var array=new Array();
					        				  		var obj = Ext.decode(response.responseText);
					        				  		//console.log(obj);
					        				  		for(var i=0;i<obj.results.length;i++){
					        				  			array.push({'valoriMarcheAz':obj.results[i].valore});
					        				  		}
					        				  		Ext.define('storeBrandsClassAz', {
					        				  		     extend: 'Ext.data.Model',
					        				  			 fields: [
					        				  			          {name: 'valoriMarcheAz', type: 'string'},
					        				  			 ]
					        				  		});
					        				  		var temporaryStore = Ext.create('Ext.data.Store', {
					        				  			//autoDestroy: true,
					        				  			model: 'storeBrandsClassAz',
					        				  			storeId: 'temporaryStoreBrandsAz',
					        				  			autoLoad: true,
					        				  			data : array
					        				  		});
					        				  		var f=Ext.getCmp('comboBrandsAz');
					        				  		f.bindStore(temporaryStore);
					        				  	}
					        		  		});
					                    }
					        		},
				                    select: function(){
				                    	var f=Ext.getCmp('comboBrandsAz');
				                    	var selectedCellRecord = BrandsGridAzienda.getSelectionModel().getSelection()[0];
				                    	var cellIndex = BrandsGridAzienda.store.indexOf(selectedCellRecord);
				                    	var classeAzId=storeBrandsValuesAzienda.getAt(cellIndex).data.classeAzId;
				                        var valore=f.getValue();
				                       // console.log(valore);
				                        Ext.Ajax.request({
				                        	url: 'http://' + constants.ip + constants.root + constants.servlet,
				                		  	params:{
				                		  		task: 'getValueMarAz',
				                		  		censimento: dbname,
				                		  		valore: valore
				                		  	},
				                		  	success: function(response){
				                		  		var risp=Ext.decode(response.responseText);
				                		  		var id_valore=risp.results[0].tc_mar_az_id;
				                		  		//console.log(id_valore);
				                		  		storeMarAzGrid.push(id_valore);
				                		  		storeMarAzGrid.push(valore);
				                		  		storeMarAzGrid.push(classeAzId);
				                		  	}
				                        });
				                        
				      				}
					          	},
					          	displayField: 'valoriMarcheAz',
					          	valueField: 'valoriMarcheAz',
					          	hiddenName: 'valoriMarcheAz'
							}
						}/*
							 * { xtype: 'actioncolumn', width: 35, items: [{
							 * icon : 'img/mininext.png', tooltip: 'Mostra
							 * valori', handler: function(grid, rowIndex,
							 * colIndex) { //console.debug(storeBrands.data);
							 * storeBrandsValues.proxy.extraParams.brand_id=storeBrands.data.items[rowIndex].data.brand_id;
							 * storeBrandsValues.load(); } }] }
							 */
						/*
						 * ,{ dataIndex: 'valore', flex: 1, text: 'Valore' }
						 */
						],
						listeners : {
								selectionchange : function(view, selected, e) {
									storeBrandsValuesAzienda.proxy.extraParams.brand_id = storeBrandsAzienda.data.items[selected[0].index].data.id;
									storeBrandsValuesAzienda.load();
								}
						}
					});

	var BrandsValuesAziendaGrid = Ext.create('Ext.grid.Panel', {
		// layout:'fit',
		flex : 1,
		store : storeBrandsValuesAzienda,
		columns : [ {
			dataIndex : 'id',
			text : 'Codice MMAS',
			hidden : true
		}, {
			dataIndex : 'valore',
			flex : 1,
			text : 'Valore',
			renderer : boldValue
		},{
			xtype : 'actioncolumn',
			width : 35,
			items : [{
				icon : 'img/del2.png', // Use a URL in the icon config
				tooltip : 'Elimina questa marca',
				handler : function(grid, rowIndex, colIndex) {
					var classeAzId=grid.getStore().getAt(rowIndex).data.classeAzId;
					//console.log(classeId);
					var marcaAzId=grid.getStore().getAt(rowIndex).data.marcaAzId;
					deleteMarAzGrid.push(classeAzId,marcaAzId);
					grid.getStore().removeAt(rowIndex);
				}
			}]
		} ]
	});

	var BrandsPanelAzienda = Ext.create('Ext.Panel', {
		layout : {
			type : 'hbox',
			pack : 'start',
			align : 'stretch'
		},
		items : [ BrandsGridAzienda, BrandsValuesAziendaGrid ]
	});

	return BrandsPanelAzienda;
}
function returnStoreMarAzGrid(){
	return storeMarAzGrid;
}
function returnDeleteMarAzGrid(){
	return deleteMarAzGrid;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var storeSerGrid = new Array();
var deleteSerGrid=new Array();
var storeSerLength=0;
function servicesGridFactory(pv_id) {
	var storeServices = Ext.create('Ext.data.Store',
			{

				pageSize : 50,
				model : 'Services',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root + constants.servlet,
					extraParams : {
						task : 'getClass',
						category : 'ser',
						id : pv_id,
						censimento : dbname

					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	var storeServicesValues = Ext.create('Ext.data.Store',
			{
				pageSize : 50,
				model : 'ServicesValues',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root + constants.servlet,
					extraParams : {
						task : 'servicesValues',
						id : pv_id,
						censimento : dbname,
						brand_id : 1

					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	var ServicesGrid = Ext.create('Ext.grid.Panel',{
						// height: 450,
						flex : 1,
						// layout:'fit',
						// title: 'Elenco Parametri ',
						store : storeServices,
						// emptyText:'nessun parametro registrato',
						plugins: [
						          Ext.create('Ext.grid.plugin.CellEditing', {
						              clicksToEdit: 1
						          })
						],
						columns : [ {
							dataIndex : 'pv_id',
							text : 'codice MMAS',
							hidden : true
						}, {
							dataIndex : 'id',
							text : 'codice servizio',
							hidden : true
						}, {
							dataIndex : 'text',
							flex : 1,
							text : 'Classe Servizio'
						},{
							flex: 1,
							text: 'Aggiungi un servizio',
							dataIndex: '',
							editor   : {
							xtype: 'combobox',
							typeAhead: true,
						    triggerAction: 'all',
						    lazyRender: true,
							emptyText: 'Aggiungi',
							id: 'comboServices',
							queryMode: 'local',
							editable: false,
							autoRender: true,
							autoShow : true,
							listeners: {
				        		click: {
				        			element: 'el', 
				        			id: 'id_el_serv',
				                    fn: function(){ 
				                    	var selectedCellRecord = ServicesGrid.getSelectionModel().getSelection()[0];
				                        var cellIndex = ServicesGrid.store.indexOf(selectedCellRecord);
				                        var classeId=storeServices.getAt(cellIndex).data.id;
				                       // console.log(classeId);
				                    	Ext.Ajax.request({
				                    		url: 'http://' + constants.ip + constants.root + constants.servlet,
				        		  			params:{
				        		  				task: 'salvaSerAnagrafica',
				        		  				censimento: dbname,
				        		  				brand_id: 1,
				        		  				classeId: classeId
				        		  			},
				        				  	success: function(response){
				        				  		var array=new Array();
				        				  		var obj = Ext.decode(response.responseText);
				        				  		//console.log(obj);
				        				  		for(var i=0;i<obj.results.length;i++){
				        				  			array.push({'valoriServizi':obj.results[i].valore});
				        				  		}
				        				  		Ext.define('storeServicesClass', {
				        				  		     extend: 'Ext.data.Model',
				        				  			 fields: [
				        				  			          {name: 'valoriServizi', type: 'string'}
				        				  			 ]
				        				  		});
				        				  		var temporaryStore = Ext.create('Ext.data.Store', {
				        				  			//autoDestroy: true,
				        				  			model: 'storeServicesClass',
				        				  			storeId: 'temporaryStoreServices',
				        				  			autoLoad: true,
				        				  			data : array
				        				  		});
				        				  		var f=Ext.getCmp('comboServices');
				        				  		f.bindStore(temporaryStore);
				        				  	}
				        		  		});
				                    }
				        		},
			                    select: function(){
			                    	var f=Ext.getCmp('comboServices');
			                    	var selectedCellRecord = ServicesGrid.getSelectionModel().getSelection()[0];
			                    	var cellIndex = ServicesGrid.store.indexOf(selectedCellRecord);
			                    	var classeId=storeServices.getAt(cellIndex).data.id;
			                        var valore=f.getValue();
			                       // console.log(valore);
			                        Ext.Ajax.request({
			                        	url: 'http://' + constants.ip + constants.root + constants.servlet,
			                		  	params:{
			                		  		task: 'getValueSer',
			                		  		censimento: dbname,
			                		  		valore: valore
			                		  	},
			                		  	success: function(response){
			                		  		var risp=Ext.decode(response.responseText);
			                		  		var id_valore=risp.results[0].tc_ser_id;
			                		  		//console.log(id_valore);
			                		  		storeSerGrid.push(id_valore);
			                		  		storeSerGrid.push(valore);
			                		  		storeSerGrid.push(classeId);
			                		  	}
			                        });
			                        
			      				}
				          	},
				          	displayField: 'valoriServizi',
				          	valueField: 'valoriServizi',
				          	hiddenName: 'valoriServizi'
							}
						}/*
							 * { xtype: 'actioncolumn', width: 35, items: [{
							 * icon : 'img/mininext.png', tooltip: 'Mostra
							 * valori', handler: function(grid, rowIndex,
							 * colIndex) { //console.debug(storeBrands.data);
							 * storeBrandsValues.proxy.extraParams.brand_id=storeBrands.data.items[rowIndex].data.brand_id;
							 * storeBrandsValues.load(); } }] }
							 */
						/*
						 * ,{ dataIndex: 'valore', flex: 1, text: 'Valore' }
						 */
						],
						listeners : {
							selectionchange : function(view, selected, e) {
								//console.log(storeBrands.data.items[selected[0].index].data.id);
								storeServicesValues.proxy.extraParams.service_id = storeServices.data.items[selected[0].index].data.id;
								storeServicesValues.load();
							}
						}
						/*listeners : {
							itemclick : function(dv, record, item, index, e) {
								storeServicesValues.proxy.extraParams.service_id = storeServices.data.items[index].data.id;
								storeServicesValues.load();
								// console.debug(record);
							}
						}*/
					});

	var ServicesValuesGrid = Ext.create('Ext.grid.Panel', {
		// layout:'fit',
		flex : 1,
		store : storeServicesValues,
		columns : [ {
			dataIndex : 'id',
			text : 'Codice MMAS',
			hidden : true
		}, {
			dataIndex : 'valore',
			flex : 1,
			text : 'Valore',
			renderer : boldValue
		},{
			xtype : 'actioncolumn',
			width : 35,
			items : [{
				icon : 'img/del2.png', // Use a URL in the icon config
				tooltip : 'Elimina questa marca',
				handler : function(grid, rowIndex, colIndex) {
					var classeId=grid.getStore().getAt(rowIndex).data.classeId;
					//console.log(classeId);
					var servizioId=grid.getStore().getAt(rowIndex).data.servizioId;
					//console.log(servizioId);
					deleteSerGrid.push(classeId,servizioId);
					grid.getStore().removeAt(rowIndex);
				}
			}]
		} ]
	});

	var ServicesPanel = Ext.create('Ext.Panel', {
		layout : {
			type : 'hbox',
			pack : 'start',
			align : 'stretch'
		},
		items : [ ServicesGrid, ServicesValuesGrid ]
	});
	//console.log(storeServices);
	//console.log(storeServices.getCount());
	//storeSerLength=storeServices.data.length;
	//console.debug('store: '+storeServices.data.length);
	return ServicesPanel;
	
}

function returnStoreSerGrid(){
	return storeSerGrid;
}
function returnDeleteSerGrid(){
	return deleteSerGrid;
}
function getStoreSerLength(){
	return storeSerLength;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function fatturatiGridFactory(pv_id) {
	var storeFatturati = Ext.create('Ext.data.Store',
			{
				pageSize : 50,
				model : 'Fatturati',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root + constants.servlet,
					extraParams : {
						task : 'fatturatiList',
						id : pv_id,
						censimento : dbname
					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});

	var FatturatiGrid = Ext.create('Ext.grid.Panel', {
		layout : 'fit',
		store : storeFatturati,
		columns : [ {
			dataIndex : 'id',
			text : 'codice MMAS',
			hidden : true
		}, {
			dataIndex : 'fatturato',
			text : 'Fatturato',
			flex : 1
		}, {
			dataIndex : 'fascia',
			flex : 1,
			text : 'Fascia'
		}, {
			dataIndex : 'valore',
			flex : 1,
			text : 'Valore',
			renderer : boldValue
		} ]
	});
	return FatturatiGrid;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function noteGridFactory(pv_id) {
	/*var storeNote = Ext.create('Ext.data.Store',{
				pageSize : 50,
				model : 'Note',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					idProperty : 'pv_id',
					url : 'http://' + constants.ip + constants.root+ constants.servlet,
					extraParams : {
						task : 'noteList',
						id : pv_id,
						censimento : dbname
					},
					reader : {
						type : 'json',
						root : 'results'
					},
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					}
				}
			});*/
	
	var selModel = grid.getSelectionModel();
	var selection = selModel.getLastSelected();
	
	var formNote= Ext.create('Ext.form.FormPanel', {
	    id			  : 'id_form_note',
        title      	  : 'Aggiorna le tue note',
        items: [{
            xtype     : 'textareafield',
            id 		  : 'text_note',
            grow      : true,
            anchor    : '100%',
            labelAlign: 'top',
            frame	  : true,
            title	  : 'Inserisci le nuove note',
            bodyStyle : 'padding:15px 15px 15px 15px;',
           	value	  : selection.data.note,
    		id        : 'testo'
        }]
    });    
   
    return formNote;  
	/*var formNote = Ext.create('Ext.grid.Panel', {
		// height: 450,
		// width: 700,
		layout : 'fit',
		// title: 'Elenco Parametri ',
		store : storeNote,
		// emptyText:'nessun parametro registrato',
		columns : [{
			dataIndex : 'note',
			text : 'Note',
			flex : 1
		}]
	});
	return formNote;*/
}
function returnFormNote(){
	return Ext.getCmp('id_form_note').items.items[0].value;
}