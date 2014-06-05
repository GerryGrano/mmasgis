var grid_admin_user, store_admin_user;

function adminUserMng()
{
	loadStore();
	loadRelRuoloPermessi();
	
	/* controllo apertura/chiusura finestre */
	
	if(Ext.getCmp('winAdminUserMng') != null)
	{
		if(Ext.getCmp('winNewUser') != null)
			Ext.getCmp('winNewUser').close();
		
		if(Ext.getCmp('winAddUser') != null)
			Ext.getCmp('winAddUser').close();
		
		if(Ext.getCmp('winModUser') != null)
			Ext.getCmp('winModUser').close();
		
		if(Ext.getCmp('winModNome') != null)
			Ext.getCmp('winModNome').close();
		
		if(Ext.getCmp('winModPwd') != null)
			Ext.getCmp('winModPwd').close();
		
		if(Ext.getCmp('winModRuolo') != null)
			Ext.getCmp('winModRuolo').close();
		
		if(Ext.getCmp('winRuoloPermessi') != null)
			Ext.getCmp('winRuoloPermessi').close();
		
		if(Ext.getCmp('winRuoliAziende') != null)
			Ext.getCmp('winRuoliAziende').close();

		Ext.getCmp('winAdminUserMng').close();
		return;
	}
	
	
	Ext.define('adminGridUtenti', 
	{
		extend : 'Ext.data.Model',
		fields : 
		[{
			name : 'azienda_id',
			type : 'string'
		},
		{
			name : 'azienda',
			type : 'string'
		},
		{
			name : 'utente_id',
			type : 'string'
		},
		{
			name : 'nome_utente',
			type : 'string'
		},
		{
			name : 'ruolo_id',
			type : 'string'
		},
		{
			name : 'ruolo',
			type : 'string'
		}]
	});

	store_admin_user = Ext.create('Ext.data.Store',
	{
		model : 'adminGridUtenti',
		autoLoad : true,
		proxy :
		{
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root+ constants.servlet,
			extraParams : 
			{
				task : 'adminUserList'
			},
			reader : 
			{
				type : 'json',
				root : 'results'
			},
			actionMethods : 
			{
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			}
		}
	});
	
	
	var toolbar = Ext.create('Ext.toolbar.Toolbar',
	{
		height: 43,
		items:
		[{
			id: 'add_user',
			text : '&nbsp<b>Aggiungi utente</b>',
			icon : 'img/add_icon.png',
			scale : 'medium',
			padding : '5 5 5 5',
			margin : '0 3 0 0',
			menu : 
				[{
					text : '<b>Nuovo Utente',
					handler : newUser
				},
				{
					text : 'Utente M&T',
					handler : addUser
				}],
			handler : function() 
			{	
				if(Ext.getCmp('winNewUser') != null)
					Ext.getCmp('winNewUser').close();
				
				if(Ext.getCmp('winAddUser') != null)
					Ext.getCmp('winAddUser').close();
			}
		}, '-',
		{
			id : 'mod_user',
			xtype : 'splitbutton',
			text : '&nbsp<b>Modifica utente&nbsp</b>',
			icon : 'img/mod_icon.png',
			scale : 'medium',
			disabled: true,
			padding : '7 7 7 7',
			margin: '0 3 0 3',
			handler : function()
			{
				if(Ext.getCmp('winModUser') != null)
					Ext.getCmp('winModUser').close();
				else
				{
					if(Ext.getCmp('winModNome') != null)
						Ext.getCmp('winModNome').close();
					else if(Ext.getCmp('winModPwd') != null)
							Ext.getCmp('winModPwd').close();
						else if(Ext.getCmp('winModRuolo') != null)
								Ext.getCmp('winModRuolo').close();
							else
								modUser();
				}
			},
			menu: 
				[{
					text : '<b>Modifica Nome Utente',
					handler : modNome
				}, 
				{
					text: 'Modifica Password',
					handler : modPwd
				}, 
				{
					id : 'modruolo',
					text: 'Modifica Ruolo',
					handler : modRuolo
				}]
		}, '-',
		{
			id : 'del_user',
			text : '&nbsp<b>Elimina utente</b>',
			icon : 'img/del.png',
			scale : 'medium',
			padding : '7 7 7 7',
			margin: '0 3 0 3',
			disabled: true,
			handler : eliminaUtente
		},
		{ xtype : 'tbfill'},
		{
			id : 'ruolo_permessi',
			text : '&nbsp<b>Ruolo-Permessi</b>',
			tooltip : "Gestione ruolo permessi",
			icon : 'img/handicon_medium.png',
			scale : 'medium',
			padding : '7 7 7 7',
			menu: 
				[{
					text: '<b>Ruoli Aziende',
					handler : gestioneRuoloAziende
				},
				{
					text : 'Ruoli M&T',
					handler : gestioneRuoloPermessi
				}],
			handler : function()
			{
				if(Ext.getCmp('winRuoliAziende') != null)
					Ext.getCmp('winRuoliAziende').close();
				
				if(Ext.getCmp('winRuoloPermessi') != null)
					Ext.getCmp('winRuoloPermessi').close();
			}
		}]
	});
	
	grid_admin_user = Ext.create('Ext.grid.Panel',
	{
		store : store_admin_user,
		width : 689,
		height : 370,
		stripeRows: true,
		autoScroll: true,
		columnLines : true,
		columns:
		[{
			dataIndex : 'nome_utente', 
			text : 'Nome utente',
			flex : 1
		},
		{
			dataIndex : 'ruolo', 
			text : 'Ruolo',
			flex : 1	
		},
		{
			dataIndex : 'azienda', 
			text : 'Azienda',
			flex : 1
		 }]
	});
	
	var winAdminUserMng = new Ext.Window 
	({
		id : 'winAdminUserMng',
		title : 'Gestione utenti AMMINISTRATORE ',
		width : 700,
		height : 500,
		resizable : false,
		items : 
		[{
			tbar: toolbar, 
			frame : true,
			border: false
		}, grid_admin_user],
		
		buttons : 
		[{
			text : 'Okay',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3 5',
			handler : function() { Ext.getCmp('winAdminUserMng').close(); }
		}],
		
		listeners : { beforeclose : function() { Ext.getCmp('usermng_button').toggle(false); } }
	});
	
	winAdminUserMng.show();
	winAdminUserMng.center();
	Ext.getCmp('usermng_button').toggle(true);
	
	
	grid_admin_user.getSelectionModel().on
	({
	    selectionchange: function(sm, selections) 
	    {
	        if (selections.length) 
	        {
	            Ext.getCmp("mod_user").enable();
	            Ext.getCmp("del_user").enable();
	            
	            if(selections[0].data.azienda == "M&T")
		    		Ext.getCmp("modruolo").enable();
	            else 
	            	Ext.getCmp("modruolo").disable();
	        } else 
	        {
	        	Ext.getCmp("mod_user").disable();
	        	Ext.getCmp("del_user").disable();
	        }
	    }
	});
};



/** 
 * AGGIUNGI NUOVO UTENTE AZIENDA
 */

function newUser()
{		
	var formadd = new Ext.form.Panel
	({
		id : 'formadd',
		frame : true,
		bodyPadding : 5,
		width : 370,
		defaultType : 'textfield',
		items : 
			[{
				fieldLabel : 'Azienda',
				name : 'azienda',
				emptyText : ' Nome',
				margin : '10 10 15 7',
				labelWidth: 90,
				width : 330
			},{
				fieldLabel : 'Nome utente',
				name : 'nome',
				emptyText : ' Username',
				margin : '7 10 10 7',
				labelWidth: 90,
				width : 330
			},
			{
				fieldLabel : 'Password',
				name : 'pwd',
				inputType: 'password',
				emptyText : ' Inserisci',
				margin : '15 15 10 7 px',
				labelWidth: 90,
				width : 330
			},
			{
				fieldLabel : 'Conferma Password',
				name : 'confpwd',
				inputType: 'password',
				emptyText : ' Reinserisci',
				margin : '10 10 10 7 px',
				labelWidth: 90,
				width : 330
			},
			{
				fieldLabel : 'Ruolo',
				name : 'ruolo',
				emptyText : ' Nome',
				margin : '7 10 10 7',
				labelWidth: 90,
				width : 330
			}]
	});

	
	var winNewUser = new Ext.Window
	({
		id : 'winNewUser',
		title : 'Aggiungi Nuovo Utente',
		layout : 'fit',
		width : 380,
		height : 290,
		resizable : false,
		items : formadd,
		listeners : { beforeclose : function() { Ext.getCmp('add_user').toggle(false); } },
		buttons : 
		[{
			text : 'Aggiungi',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3',
			handler : function()
			{
				var input = formadd.getForm().getFieldValues();

				var azienda = Ext.JSON.encode(input.azienda);
				var nome = Ext.JSON.encode(input.nome);
				var pwd = Ext.JSON.encode(input.pwd);
				var confpwd = Ext.JSON.encode(input.confpwd);
				var ruolo = Ext.JSON.encode(input.ruolo);
				
				if(input.azienda !="" && input.nome != "" && input.pwd != "" && input.confpwd != "" && input.ruolo != "")
				{	
					if(pwd == confpwd)
					{
						var hash_pwd = SHA1(pwd);
						
						Ext.Ajax.request
						({
							url : 'http://' + constants.ip + constants.root + constants.servlet,
							params:
							{
			  					task: 'addNewUser',
			  					azienda : azienda,
			  					nome : nome,
			  					pwd : hash_pwd,
			  					ruolo : ruolo 
							},
							success : function(response)
							{
								Ext.getCmp('winNewUser').close();
								if(response.status == '204')
								{
									Ext.Msg.show
									({
									     title :'Attenzione',
									     height : '300 px',
									     msg : 'Impossibile aggiungere il primo utente dell\'azienda '+input.azienda.toUpperCase()+' perche\' esiste gia\'.',
									     buttons : Ext.MessageBox.OK,
									     icon: Ext.Msg.ERROR
									});
								}
								else
								{
									Ext.Msg.alert('&nbspMessaggio', '&nbspIl primo nuovo utente '+input.nome.toUpperCase()+' dell\'azienda '+input.azienda.toUpperCase()+' e\' stato/a aggiunto.');
									grid_admin_user.getStore().loadPage(1);
									loadRelRuoloPermessi();
								}
							}
						});
					}else
						Ext.MessageBox.alert('&nbspAttenzione', '&nbspErrore inserimento Password.');
				}else 
					Ext.Msg.alert('&nbspAttenzione', '&nbspRiempire tutti i campi.');
			}
		}]
	});
	
	winNewUser.show();
	winNewUser.center();
	Ext.getCmp('add_user').toggle(true);
};





/**
 * ELIMINA UTENTE 
 */

function eliminaUtente()
{
	var selection = grid_admin_user.getView().getSelectionModel().getSelection()[0];
	
	var id_azienda = selection.data.azienda_id;
	var azienda = selection.data.azienda;
	var id_utente = selection.data.utente_id;
	var nome_utente = selection.data.nome_utente;
	var id_ruolo = selection.data.ruolo_id;
	
	if(id_utente == user_id)
	{
		Ext.Msg.show
		({
		     title :'Attenzione',
		     height : '300 px',
		     msg : 'Impossibile eliminare l\'utente con cui si e\' loggati al sistema.',
		     buttons : Ext.MessageBox.OK,
		     icon: Ext.Msg.WARNING
		});
	}
	else if(azienda == "M&T")
			delUser();
		else
		{
			Ext.Msg.show
			({
			     title :'Conferma',
			     height : '300 px',
			     msg : 'Eliminando l\'utente principale dell\'azienda '+azienda.toUpperCase()+' questa non avra\' piu\' accesso al sistema.<br>Sei sicuro di voler eliminare tutti gli utenti e i ruoli ad essa connessi?',
			     buttons : Ext.MessageBox.YESNO,
			     fn : showResult,
			     icon: Ext.Msg.QUESTION
			});
	
			 function showResult(btn)
			 {
			        if(btn == 'yes')
			        {
			        	Ext.Ajax.request
			        	({
			        		url : 'http://' + constants.ip + constants.root + constants.servlet,
			        		params:
			        		{
		        				task: 'delNewUser',
		        				id_azienda : id_azienda,
		        				id_ruolo : id_ruolo
			        		},
			        		success : function(response)
			        		{
			        			grid_admin_user.getStore().loadPage(1);
			        			Ext.Msg.alert('Messaggio', '&nbsp '+azienda.toUpperCase()+' e\' stata rimossa.');
			        		}
			        	});
			        }
			 };
		}
}

	
/** 
 * GESTIONE RUOLO-PERMESSI AZIENDE
 */

var tab_ruolo_azienda;

function gestioneRuoloAziende()
{
	Ext.define('ruolo_azienda', 
	{
		extend : 'Ext.data.Model',
		fields : 
		[{
			name : 'ruolo',
			type : 'string'
		},{
			name : 'ruolo_id',
			type : 'string'
		},{
			name : 'nome_azienda',
			type : 'string'
		},{
			name : 'azienda_id',
			type : 'string'
		}]
	});

	var store_ruolo_azienda = Ext.create('Ext.data.Store',
	{
		model : 'ruolo_azienda',
		autoLoad : true,
		proxy :
		{
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root+ constants.servlet,
			extraParams : 
			{
				task : 'listaRuoloAziende', 
			},
			reader : 
			{
				type : 'json',
				root : 'results'
			},
			actionMethods : 
			{
				create : 'GET',
				read : 'GET',
				update : 'GET',
				destroy : 'GET'
			}
		}
	});
	
	tab_ruolo_azienda = Ext.createWidget('tabpanel', 
	{
		id : 'tabsAzienda',
		anchor : '100% 100%',
		height : 337,
		plain : true,
		defaults : 
		{
			layout : 'fit',
			bodyPadding : 0
		}
	});
	
	store_ruolo_azienda.load(function(records, operation, success) 
	{
		var i;
		for (i=0; i<records.length; i++)
		{
			tab_ruolo_azienda.add
			({
				id : records[i].data.ruolo_id,
				title : records[i].data.ruolo+" ("+records[i].data.nome_azienda+")",
				closable : false,
				height : 500,
				items : gridSelectPerm(records[i].data.ruolo_id)
			});
		}
		
		tab_ruolo_azienda.setActiveTab(0);
	});
	
	
	var winRuoliAziende = new Ext.Window
	({
		id : 'winRuoliAziende',
		title : 'Gestione Ruolo-Permessi AZIENDE',
		width : 550,
		height : 450,
		resizable : true,
		listeners : { beforeclose : function() { Ext.getCmp('ruolo_permessi').toggle(false); } },
		items :
		[{
			xtype : 'toolbar',
			dock : 'top',
			items : 
			[{
				id: 'mod_nome_ruolo',
				text : '&nbsp Modifica Nome Ruolo',
				icon : 'img/mod_icon.png',
				scale : 'medium',
				padding : '5 5 5 5',
				handler : function() 
				{ 
					var ruolo = tabs_ruoli.activeTab.title;
					var id_ruolo = tabs_ruoli.activeTab.id;
					
					var formMod = new Ext.form.Panel
					({
						id : 'formMod',
						frame : true,
						bodyPadding : 5,
						width : 370,
						items : 
						[{
							xtype: 'textfield',
							fieldLabel : 'Nome Ruolo',
							name : 'nome',
							value : ruolo,
							emptyText : ' Nome Ruolo',
							margin : '7 10 10 7',
							labelWidth: 90,
							width : 330
						}]
					});
					
					var wModNomeRuolo = new Ext.Window
					({
						title : 'Modifica Nome Ruolo',
						width : 380,
						height : 135,
						resizable : false,
						items : formMod,
						listeners : 
						{
							beforeclose : function() { Ext.getCmp('mod_nome_ruolo').toggle(false); }
						},
						buttons : 
						[{
							text : 'Salva',
							icon : 'img/ok.png',
							scale : 'medium',
							margin : '3',
//							handler : function()
//							{
//								var input = formMod.getForm().getFieldValues();
//								var ruolo_mod = Ext.JSON.encode(input.nome);
//								
//								if(input.nome == ruolo || input.nome == "")
//								{
//									Ext.Msg.alert('&nbspMessaggio', '&nbsp Non sono state apportate modifiche.');
//									wModNomeRuolo.close();	
//								}
//								else
//								{
//									Ext.Ajax.request
//						        	({
//						        		url : 'http://' + constants.ip + constants.root + constants.servlet,
//						        		params:
//						        		{
//					        				task: 'modNomeRuolo',
//					        				id_ruolo : id_ruolo,
//					        				mod : ruolo_mod
//						        		},
//						        		success : function(response)
//						        		{
//						        			Ext.getCmp(id_ruolo).setTitle(input.nome);
//						        			grid_user.getStore().loadPage(1);
//						        		}
//						        	});
//									
//									wModNomeRuolo.close();
//								}	
//							}
						}]
					});
						
					wModNomeRuolo.show();
					wModNomeRuolo.center();
					Ext.getCmp('mod_nome_ruolo').disable();
				}
			}]
		}, tab_ruolo_azienda],
		
		buttons : 
		[{
			id : 'applica',
			text : 'Applica',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3',
			disabled: true,
			handler : salvaModificheAziende
		},
		{
			text : 'Chiudi',
			icon : 'img/del.png',
			scale : 'medium',
			margin : '3',
			handler : function() { Ext.getCmp('winRuoliAziende').close(); }
		}]
	});
	
	winRuoliAziende.show();
	winRuoliAziende.center();	
	Ext.getCmp('ruolo_permessi').toggle(true);

}



function salvaModificheAziende()
{	
	// array contenente gli id dei tab
	var ar_id_tab = tab_ruolo_azienda.items.keys;
	
	// hash map con valori modificati da inserire nel db
	var mod_hm = new Ext.util.HashMap();
	
	// scorro tutti i tab
	for(var i=0; i<ar_id_tab.length; i++)
	{
		// array con la checkbox del grid del tab i 
		var ar_perm = document.getElementsByName(ar_id_tab[i]);
		// array con i permessi selezionati
		var ar_check = new Array();
		
		if(ar_perm.length != 0)
		{	
			for(var j=0; j<ar_perm.length; j++)
			{
				// se check su permesso
				if(ar_perm[j].checked)
				{
					// insert valore in array
					ar_check.push(ar_perm[j].value);
				}
			}
			
			// key = id_ruolo, value = array permessi
			mod_hm.add(ar_id_tab[i], ar_check);
		}
	}

	
	mod_hm.each(function(key, value, length)
	{   
	    var update_perm = JSON.stringify(value);
	   
	    if(rel_ruolo_permessi.containsKey(key))
	    {
	    	// mi faccio restituire i permessi 
	    	var perm = JSON.stringify(rel_ruolo_permessi.get(key));
	    	
	    	// se sono state apportate modifiche rispetto 
	    	// alla situazione di partenza 
	    	if(update_perm != perm)
	    	{
	    		// UPDATE nel DB
	    		Ext.Ajax.request
	    		({
	    			url : 'http://' + constants.ip + constants.root + constants.servlet,
	    			params:
	    			{
	    					task: 'modRelRuoloPermesso',
	    					id_ruolo : Ext.JSON.encode(key),
	    					id_permessi : update_perm
	    			},
	    			success : function(response)
	    			{
	    				// update in HASHMAP 
	    				rel_ruolo_permessi.add(key, value);
	    				Ext.Msg.alert('Messaggio', '&nbsp Operazione avvenuta con successo!');
	    			}
	    		});
	    	}
	    	else
	    		console.debug("Non apportate modifiche a "+key);
	    }	
	    else
	    {
	    	// INSERT permessi
	    	Ext.Ajax.request
    		({
    			url : 'http://' + constants.ip + constants.root + constants.servlet,
    			params:
    			{
    					task: 'addRelRuoloPermesso',
    					id_ruolo : Ext.JSON.encode(key),
    					id_permessi : JSON.stringify(value)
    			},
    			success : function(response)
    			{
    				// update in HASHMAP 
    				rel_ruolo_permessi.add(key, value);
    				Ext.Msg.alert('Messaggio', '&nbsp Operazione avvenuta con successo!');
    			}
    		});
	    }
	});
	
	Ext.getCmp('applica').disable();
}

	

	









