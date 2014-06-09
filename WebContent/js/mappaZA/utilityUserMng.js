var store_ruolo, store_permits;
var grid_perm;
var rel_ruolo_permessi = new Ext.util.HashMap();


/**
 * CARICA DATI UTILI PER LA GESTIONE UTENTE 
 */

function loadStore()
{
	/* Store combobox ruolo */
	
	Ext.define('comboruolo', 
	{
		extend : 'Ext.data.Model',
		fields : 
		[{
			name : 'ruolo',
			type : 'string'
		},{
			name : 'ruolo_id',
			type : 'string'
		}]
	});

	store_ruolo = Ext.create('Ext.data.Store',
	{
		model : 'comboruolo',
		autoLoad : true,
		proxy :
		{
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root+ constants.servlet,
			extraParams : 
			{
				task : 'roleList'
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


	/* Store elenco permessi */

	Ext.define('permits', 
	{
		extend : 'Ext.data.Model',
		fields : 
		[{
			name : 'nome',
			type : 'string'
		},
		{
			name : 'descrizione',
			type : 'string'
		},
		{
			name : 'permesso_id',
			type : 'string'
		}]
	});

	store_permits = Ext.create('Ext.data.Store',
	{
		model : 'permits',
		autoLoad : true,
		proxy :
		{
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root+ constants.servlet,
			extraParams : 
			{
				task : 'permitsList'
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
	
}


function loadRelRuoloPermessi()
{
	/* Load HASHMAP rel_ruolo_permessi */
	
	Ext.Ajax.request
	({
		url : 'http://' + constants.ip + constants.root + constants.servlet,
		params:
		{
			task: 'estraiPermessiDeiRuoli'
		},
		callback : function(opt, success, response) 
		{
			var cdata = Ext.JSON.decode(response.responseText);
			var p = null;
			
			rel_ruolo_permessi.add(cdata[0].idr, p);
			
			for(var i=1; i<cdata.length; i++)
			{
				if(cdata[i].idr != cdata[i-1].idr)
					rel_ruolo_permessi.add(cdata[i].idr, p);
			}
			
			var key = rel_ruolo_permessi.getKeys();
			for(var i=0; i<key.length; i++)
			{
				var temp = new Array();
				for(var j=0; j<cdata.length; j++)
				{
					if(cdata[j].idr == key[i])
						temp.push(cdata[j].idp);
					
					rel_ruolo_permessi.add(key[i], temp);
				}
			}
			
			return rel_ruolo_permessi;
		}
	});
}


/**
 * AGGIUNGI UTENTE
 */

function addUser()
{
	if(store_ruolo.getCount() == 0)
	{
		Ext.Msg.show
		({
		     title :'Messaggio',
		     height : '300 px',
		     msg : 'Impossibile aggiungere un nuovo utente prima di aver creato un ruolo.',
		     buttons : Ext.MessageBox.OK,
		     fn : showResult,
		     icon: Ext.Msg.WARNING
		});
		
		function showResult(btn)
		{
	        if(btn == 'ok')
	        	gestioneRuoloPermessi();
		}
	}
	else
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
					xtype: 'combobox',
					id : 'prova',
					store : store_ruolo,
					emptyText : ' Scegli il ruolo...',
					editable : false,
					name : 'ruolo',
					displayField: 'ruolo',
					fieldLabel : 'Ruolo',
					margin : '10 10 10 7 px',
					labelWidth: 90,
					width : 330
				}]
		});
	
		
		var winAddUser = new Ext.Window
		({
			id: 'winAddUser',
			width : 380,
			height : 240,
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
	
					var nome = Ext.JSON.encode(input.nome);
					var pwd = Ext.JSON.encode(input.pwd);
					var confpwd = Ext.JSON.encode(input.confpwd);
					var ruolo = Ext.JSON.encode(input.ruolo);
					
					if(input.nome != "" && input.ruolo != null && input.pwd != "" && input.confpwd != "")
					{	
						if(pwd == confpwd)
						{
							var hash_pwd = SHA1(pwd);
							
							Ext.Ajax.request
							({
								url : 'http://' + constants.ip + constants.root + constants.servlet,
								params:
								{
				  					task: 'addUser',
				  					nome : nome,
				  					pwd : hash_pwd,
				  					ruolo : ruolo 
								},
								success : function(response)
								{
									Ext.getCmp('winAddUser').close();
									Ext.Msg.alert('&nbspMessaggio', '&nbsp '+input.nome.toUpperCase()+' e\' stato/a aggiunto.');
									if(ruolo_id == 1)
										grid_admin_user.getStore().loadPage(1);
									else
										grid_user.getStore().loadPage(1);
								}
								
							});
						}else
							Ext.MessageBox.alert('&nbspAttenzione', '&nbspErrore inserimento Password.');
					}else 
						Ext.Msg.alert('&nbspAttenzione', '&nbspRiempire tutti i campi.');
				}
			}]
		});
		
		if(ruolo_id == 1)
			winAddUser.setTitle('Aggiungi Utente M&T');
		else
			winAddUser.setTitle('Aggiungi Utente');
		
		winAddUser.show();
		winAddUser.center();
		Ext.getCmp('add_user').toggle(true);
	}
}


/** 
 * MODIFICA UTENTE
 **/

function modUser()
{
	var selection, azienda;
	
	if(ruolo_id == 1)
	{
		selection = grid_admin_user.getView().getSelectionModel().getSelection()[0];
		azienda = selection.data.azienda;
	}
	else
	{
		selection = grid_user.getView().getSelectionModel().getSelection()[0];
		azienda = null;
	}
	
	var utente_id = selection.data.utente_id;
	var nome = selection.data.nome_utente;
	var ruolo = selection.data.ruolo;
	
	var fmod = new Ext.form.Panel
	({
		id : 'fmod',
		defaultType : 'textfield',
		bodyPadding : 5,
		frame : true,
		width : 370,
		items : 
			[{
				fieldLabel : 'Nome utente',
				name : 'nome',
				value : nome,
				emptyText : ' Nome Cognome',
				margin : '7 10 10 7 px',
				labelWidth: 90,
				width : 330
			},
			{
				fieldLabel : 'Password',
				name : 'pwd',
				inputType: 'password',
				emptyText : ' Nuova Password',
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
				id : 'comboruolo',
				xtype: 'combobox',
				store : store_ruolo,
				name : 'ruolo',
				value : ruolo,
				editable : false,
				displayField: 'ruolo',
				fieldLabel : 'Ruolo',
				margin : '10 10 10 7 px',
				labelWidth: 90,
				width : 330
			}]
	});
	
	var winModUser = new Ext.Window
	({
		id : 'winModUser',
		title : 'Modifica Utente',
		width : 380,
		height : 240,
		resizable : false,
		items : fmod,
		listeners : { beforeclose : function() { Ext.getCmp('mod_user').toggle(false); } },
		buttons : 
		[{
			text : 'Salva',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3',
			handler : function()
			{
				var id_utente = Ext.JSON.encode(utente_id);
				var input = fmod.getForm().getFieldValues();
				var nome_mod, pwd_mod, confpwd_mod, ruolo_mod;
				
				if(azienda != null && azienda != 'M&T')
				{
					nome_mod = Ext.JSON.encode(input.nome);
					pwd_mod = Ext.JSON.encode(input.pwd);
					confpwd_mod = Ext.JSON.encode(input.confpwd);
					ruolo_mod = Ext.JSON.encode(ruolo);	
				}
				else
				{
					nome_mod = Ext.JSON.encode(input.nome);
					pwd_mod = Ext.JSON.encode(input.pwd);
					confpwd_mod = Ext.JSON.encode(input.confpwd);
					ruolo_mod = Ext.JSON.encode(input.ruolo);
				}
				
			
				if(input.nome != "" && ruolo_mod != null && input.pwd != "" && input.confpwd != "")
				{	
					if(pwd_mod == confpwd_mod)
					{
						var hash_pwd_mod = SHA1(pwd_mod);
						
						Ext.Ajax.request
						({
							url : 'http://' + constants.ip + constants.root + constants.servlet,
							params:
							{
			  					task: 'modUser',
			  					id : id_utente,
			  					nome : nome_mod,
			  					pwd : hash_pwd_mod,
			  					ruolo : ruolo_mod
							},
							success : function(response)
							{
								Ext.getCmp('winModUser').close();
								Ext.Msg.alert('&nbspMessaggio', '&nbsp Modifica effettuata.');
								
								if(ruolo_id == 1)
									grid_admin_user.getStore().loadPage(1);
								else
									grid_user.getStore().loadPage(1);
								
							}
						});
					}else
						Ext.MessageBox.alert('&nbspAttenzione', '&nbspErrore inserimento Password.');
				}else 
					Ext.Msg.alert('&nbspAttenzione', '&nbspRiempire tutti i campi.');
			}
		}]
	});
	
	winModUser.show();
	winModUser.center();
	Ext.getCmp('mod_user').toggle(true);
	
	if(azienda != null && azienda != "M&T")
		Ext.getCmp("comboruolo").disable();
		
}


/** 
 * MODIFICA NOME UTENTE
 **/

function modNome()
{
	var selection = null;
	
	if(ruolo_id == 1)
		selection = grid_admin_user.getView().getSelectionModel().getSelection()[0];
	else
		selection = grid_user.getView().getSelectionModel().getSelection()[0];
		
	var utente_id = selection.data.utente_id;
	var nome = selection.data.nome_utente;
	
	var form = new Ext.form.Panel
	({
		id : 'form',
		defaultType : 'textfield',
		bodyPadding : 5,
		frame : true,
		width : 370,
		items : 
			[{
				fieldLabel : 'Nome utente',
				name : 'nome',
				value : nome,
				margin : '7 10 10 7 px',
				labelWidth: 90,
				width : 330
			}]
	});
	
	var winModNome = new Ext.Window
	({
		id : 'winModNome',
		title : 'Modifica Nome Utente',
		layout: 'fit',
		resizable : false,
		items : form,
		listeners : { beforeclose : function() { Ext.getCmp('mod_user').toggle(false); } },
		buttons : 
		[{
			text : 'Salva',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3',
			handler : function() 
			{
				var id_utente = Ext.JSON.encode(utente_id);
				var input = form.getForm().getFieldValues();
				
				if(input.nome == nome || input.nome == "")
				{
					Ext.getCmp('winModNome').close();
					Ext.Msg.alert('&nbspMessaggio', '&nbspNon sono state apportate modifiche.');
				}
				else
				{
					var nome_mod = Ext.JSON.encode(input.nome);
		
					Ext.Ajax.request
					({
						url : 'http://' + constants.ip + constants.root + constants.servlet,
						params:
						{
		  					task: 'modUser',
		  					id : id_utente,
		  					nome : nome_mod
						},
						success : function(response)
						{
							Ext.getCmp('winModNome').close();
							Ext.Msg.alert('&nbspMessaggio', '&nbsp Modifica effettuata.');
							
							if(ruolo_id == 1)
								grid_admin_user.getStore().loadPage(1);
							else
								grid_user.getStore().loadPage(1);
						}
						
					});
				}	
			}
		}]
	});
	
	winModNome.show();
	winModNome.center();
	Ext.getCmp('mod_user').toggle(true); 
}


/** 
 * MODIFICA PASSWORD
 **/

function modPwd()
{
	var selection = null;
	
	if(ruolo_id == 1)
		selection = grid_admin_user.getView().getSelectionModel().getSelection()[0];
	else
		selection = grid_user.getView().getSelectionModel().getSelection()[0];
	
	var utente_id = selection.data.utente_id;
	var nome = selection.data.nome_utente;
	
	var form = new Ext.form.Panel
	({
		id : 'form',
		defaultType : 'textfield',
		bodyPadding : 5,
		frame : true,
		width : 370,
		items : 
			[{
				fieldLabel : 'Password',
				name : 'pwd',
				inputType: 'password',
				emptyText : ' Nuova Password',
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
			}]
	});
	
	var winModPwd = new Ext.Window
	({
		id : 'winModPwd',
		title : 'Modifica Password di '+nome,
		layout: 'fit',
		resizable : false,
		items : form,
		listeners : { beforeclose : function() { Ext.getCmp('mod_user').toggle(false); } },
		buttons : 
		[{
			text : 'Salva',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3',
			handler : function() 
			{
				var id_utente = Ext.JSON.encode(utente_id);
				var input = form.getForm().getFieldValues();
				var pwd_mod = Ext.JSON.encode(input.pwd);
				var confpwd_mod = Ext.JSON.encode(input.confpwd);
				
				if(pwd_mod == confpwd_mod)
				{
					var hash_pwd_mod = SHA1(pwd_mod);
					
					Ext.Ajax.request
					({
						url : 'http://' + constants.ip + constants.root + constants.servlet,
						params:
						{
		  					task: 'modUser',
		  					id : id_utente,
		  					pwd : hash_pwd_mod
						},
						success : function(response)
						{
							Ext.getCmp('winModPwd').close();
							Ext.Msg.alert('&nbspMessaggio', '&nbsp Modifica effettuata.');
						}
						
					});
				}else
					Ext.MessageBox.alert('&nbspAttenzione', '&nbspErrore inserimento Password.');
			}
		}]
	});
	
	winModPwd.show();
	winModPwd.center();
	Ext.getCmp('mod_user').toggle(true);
}


/** 
 * MODIFICA RUOLO
 **/

function modRuolo()
{
	var selection = null;
	
	if(ruolo_id == 1)
		selection = grid_admin_user.getView().getSelectionModel().getSelection()[0];
	else
		selection = grid_user.getView().getSelectionModel().getSelection()[0];
	
	var utente_id = selection.data.utente_id;
	var nome = selection.data.nome_utente;
	var ruolo = selection.data.ruolo;
	
	var form = new Ext.form.Panel
	({
		id : 'form',
		defaultType : 'textfield',
		bodyPadding : 5,
		frame : true,
		width : 370,
		items : 
			[{
				xtype: 'combobox',
				store : store_ruolo,
				name : 'ruolo',
				value : ruolo,
				editable : false,
				displayField: 'ruolo',
				fieldLabel : 'Ruolo',
				margin : '10 10 10 7 px',
				labelWidth: 90,
				width : 330
			}]
	});
	
	var winModRuolo = new Ext.Window
	({
		id : 'winModRuolo',
		title : 'Modifica Ruolo di '+nome,
		layout: 'fit',
		resizable : false,
		items : form,
		listeners : { beforeclose : function() { Ext.getCmp('mod_user').toggle(false); } },
		buttons : 
		[{
			text : 'Salva',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3',
			handler : function() 
			{
				var id_utente = Ext.JSON.encode(utente_id);
				var input = form.getForm().getFieldValues();
				
				if(input.ruolo == ruolo)
				{
					Ext.getCmp('winModRuolo').close();
					Ext.Msg.alert('&nbspMessaggio', '&nbspNon sono state apportate modifiche.');
				}
				else
				{
					var ruolo_mod = Ext.JSON.encode(input.ruolo);
					
					Ext.Ajax.request
					({
						url : 'http://' + constants.ip + constants.root + constants.servlet,
						params:
						{
		  					task: 'modUser',
		  					id : id_utente,
		  					ruolo : ruolo_mod
						},
						success : function(response)
						{
							Ext.getCmp('winModRuolo').close();
							
							if(ruolo_id == 1)
								grid_admin_user.getStore().loadPage(1);
							else
								grid_user.getStore().loadPage(1);
							
							Ext.Msg.alert('&nbspMessaggio', '&nbsp Modifica effettuata.');
						}
						
					});
				}	
			}
		}]
	});
	
	winModRuolo.show();
	winModRuolo.center();
	Ext.getCmp('mod_user').toggle(true);
	
}


/** 
 * ELIMINA UTENTE
 */

function delUser()
{
	var selection = null;
	
	if(ruolo_id == 1)
		selection = grid_admin_user.getView().getSelectionModel().getSelection()[0];
	else
		selection = grid_user.getView().getSelectionModel().getSelection()[0];
	
	var utente_id = selection.data.utente_id;
	var nome_utente = selection.data.nome_utente;
	
	Ext.Msg.show
	({
	     title :'Conferma',
	     height : '300 px',
	     msg : 'Sei sicuro di voler eliminare '+nome_utente.toUpperCase()+' dal sistema?',
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
        				task: 'delUser',
        				id : utente_id
	        		},
	        		success : function(response)
	        		{
	        			Ext.Msg.alert('Messaggio', '&nbsp '+nome_utente.toUpperCase()+' e\' stato rimosso.');
	        			
	        			if(ruolo_id == 1)
							grid_admin_user.getStore().loadPage(1);
						else
							grid_user.getStore().loadPage(1);
	        			
	        		}
	        	});
	        }
	 };
}


/** 
 * GESTIONE RUOLO-PERMESSI
 */

var tabs_ruoli;

function gestioneRuoloPermessi()
{	
	tabs_ruoli = Ext.createWidget('tabpanel', 
	{
		id : 'tabs',
		anchor : '100% 100%',
		height : 337,
		plain : true,
		defaults : 
		{
			layout : 'fit',
			bodyPadding : 0
		}
	});
	
	store_ruolo.load(function(records, operation, success) 
	{
		var i;
		for (i=0; i<records.length; i++)
		{
			tabs_ruoli.add
			({
				id : records[i].data.ruolo_id,
				title : records[i].data.ruolo,
				closable : false,
				items : gridSelectPerm(records[i].data.ruolo_id)
			});
		}
		
		tabs_ruoli.setActiveTab(0);
	});
	

	var winRuoloPermessi = new Ext.Window
	({
		id : 'winRuoloPermessi',
		title : 'Gestione Ruolo-Permessi',
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
				id: 'add_ruolo',
				text : '&nbsp Aggiungi Ruolo',
				icon : 'img/add_icon.png',
				scale : 'medium',
				margin : '0 3 0 0',
				padding : '5 5 5 5',
				handler : function() 
				{
					if(Ext.getCmp('winAddRuolo') != null)
						Ext.getCmp('winAddRuolo').close();
					else
					{
						var formAdd = new Ext.form.Panel
						({
							id : 'formAdd',
							frame : true,
							bodyPadding : 5,
							width : 370,
							items : 
							[{
								xtype: 'textfield',
								fieldLabel : 'Nome Ruolo',
								name : 'nome',
								emptyText : ' Nome Ruolo',
								margin : '7 10 10 7',
								labelWidth: 90,
								width : 330
							}]
						});
						
						var winAddRuolo = new Ext.Window
						({
							id : 'winAddRuolo',
							title : 'Aggiungi Ruolo',
							width : 380,
							height : 135,
							resizable : false,
							items : formAdd,
							listeners : { beforeclose : function() { Ext.getCmp('add_ruolo').toggle(false); } },
							buttons : 
							[{
								text : 'Salva',
								icon : 'img/ok.png',
								scale : 'medium',
								margin : '3',
								handler : function()
								{
									var input = formAdd.getForm().getFieldValues();
									var nome_ruolo = Ext.JSON.encode(input.nome);
									
									Ext.Ajax.request
						        	({
						        		url : 'http://' + constants.ip + constants.root + constants.servlet,
						        		params:
						        		{
					        				task: 'addRuolo',
					        				nome_ruolo : nome_ruolo
						        		},
						        		success : function(response)
						        		{
						        			var cdata = Ext.JSON.decode(response.responseText);
						        		
						        			tabs_ruoli.add
						        			({
						        				id : cdata[0].ruolo_id,
						        				title : input.nome,
						        				closable : false,
						        				items : gridSelectPerm(cdata[0].ruolo_id)
						        			});
						        			
						        			tabs_ruoli.setActiveTab(cdata[0].ruolo_id);
						        		}
						        	});
									
									Ext.getCmp('winAddRuolo').close();
								}
							}]
						});
							
						winAddRuolo.show();
						winAddRuolo.center();
						Ext.getCmp('add_ruolo').toggle(true);
					}
				}
			},
			{
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
					
					var winModNomeRuolo = new Ext.Window
					({
						id : 'winModNomeRuolo',
						title : 'Modifica Nome Ruolo',
						width : 380,
						height : 135,
						resizable : false,
						items : formMod,
						listeners : { beforeclose : function() { Ext.getCmp('mod_nome_ruolo').toggle(false); } },
						buttons : 
						[{
							text : 'Salva',
							icon : 'img/ok.png',
							scale : 'medium',
							margin : '3',
							handler : function()
							{
								var input = formMod.getForm().getFieldValues();
								var ruolo_mod = Ext.JSON.encode(input.nome);
								
								if(input.nome == ruolo || input.nome == "")
								{
									Ext.getCmp('winModNomeRuolo').close();
									Ext.Msg.alert('&nbspMessaggio', '&nbsp Non sono state apportate modifiche.');	
								}
								else
								{
									Ext.Ajax.request
						        	({
						        		url : 'http://' + constants.ip + constants.root + constants.servlet,
						        		params:
						        		{
					        				task: 'modNomeRuolo',
					        				id_ruolo : id_ruolo,
					        				mod : ruolo_mod
						        		},
						        		success : function(response)
						        		{
						        			Ext.getCmp(id_ruolo).setTitle(input.nome);
						        			
						        			if(ruolo_id == 1)
												grid_admin_user.getStore().loadPage(1);
											else
												grid_user.getStore().loadPage(1);
						        		}
						        	});
									
									Ext.getCmp('winModNomeRuolo').close();
								}
									
							}
						}]
					});
						
					winModNomeRuolo.show();
					winModNomeRuolo.center();
					Ext.getCmp('mod_nome_ruolo').toggle(true);
				}
			},
			{
				id: 'del_ruolo',
				text : '&nbsp Elimina Ruolo',
				icon : 'img/del.png',
				scale : 'medium',
				padding : '5 5 5 5',
				handler : function() 
				{
					var ruolo_sel = tabs_ruoli.activeTab.title;
					var id_ruolo = tabs_ruoli.activeTab.id;
					
					Ext.Msg.show
					({
					     title :'Conferma',
					     height : '300 px',
					     msg : 'Sei sicuro di voler eliminare il ruolo '+ruolo_sel.toUpperCase()+' dal sistema?',
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
			        				task: 'delRuolo',
			        				ruolo_id : id_ruolo
				        		},
				        		success : function(response)
				        		{
				        			if(response.status == '204')
				        			{
				        				Ext.Msg.show
				    					({
				    					     title :'Attenzione',
				    					     height : '300 px',
				    					     msg : 'Impossibile eliminare '+ruolo_sel.toUpperCase()+' perche\' assegnato ad un utente.',
				    					     buttons : Ext.MessageBox.OK,
				    					     icon: Ext.Msg.ERROR
				    					});
				        			}
				        			else
				        			{
				        				var rem = Ext.getCmp(id_ruolo);
					        			tabs_ruoli.remove(rem);
				        			}
				        		}
				        	});
				        }
					 };	
				}
			}]
		}, tabs_ruoli],
		
		buttons : 
		[{
			id : 'applica',
			text : 'Applica',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3',
			disabled: true,
			handler : salvaModifiche
		},
		{
			text : 'Chiudi',
			icon : 'img/del.png',
			scale : 'medium',
			margin : '3',
			handler : function() { Ext.getCmp('winRuoloPermessi').close(); }
		}]
	});
	
	if(ruolo_id == 1)
		winRuoloPermessi.setTitle('Gestione Ruolo-Permessi M&T');
	
	winRuoloPermessi.show();
	winRuoloPermessi.center();	
	Ext.getCmp('ruolo_permessi').toggle(true);
}


/**
 * SELEZIONE PERMESSI NEL GRID DEI RUOLI 
 */

function gridSelectPerm(ruolo_id)
{
	var perm;
	var i=0;
	
	/* Controlla se l'hashmap contiene il ruolo come chiave
	 * e nel caso restituisce l'array con i permessi di quel ruolo
	 */
	
	if(rel_ruolo_permessi.containsKey(ruolo_id))
		perm = rel_ruolo_permessi.get(ruolo_id);
	else
		perm = null;
		
	grid_perm = Ext.create('Ext.grid.Panel', 
	{
        store: store_permits,
        sortableColumns : false,
		layout : 'fit',
		columnLines: true,
		autoRender: true,
        columns: 
        [{
			text: '<center>Attivo</center>', 
			width: 50,
			dataIndex: 'permesso_id',
			listeners: { click : function() { Ext.getCmp('applica').enable(); } },
			renderer: function(value, meta, record)
				{
					if(perm != null)
					{
						if(value == perm[i])
						{
							i++;
							return '<center><input type="checkbox" checked="checked" name="'+ruolo_id+'"  value="'+value+'">';
						}
						else
							return '<center><input type="checkbox" name="'+ruolo_id+'" value="'+value+'">';	
					}
					else
						return '<center><input type="checkbox" name="'+ruolo_id+'" value="'+value+'">';	
				}
			},
	        {text: 'Permessi', flex: 0.5, dataIndex: 'nome'},
	        {text: 'Descrizione', flex: 1, dataIndex: 'descrizione'}
	   ]
    });
	
	return grid_perm;
}


function salvaModifiche()
{	
	// array contenente gli id dei tab
	var ar_id_tab = tabs_ruoli.items.keys;
	
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
	    	else{
	    		
	    	}
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





















/**
 * ALGORITMO CRITTOGRAFIA PASSWORD
 */		

function SHA1 (msg) {
	 
    function rotate_left(n,s) {
        var t4 = ( n<<s ) | (n>>>(32-s));
        return t4;
    };
 
    function lsb_hex(val) {
        var str="";
        var i;
        var vh;
        var vl;
 
        for( i=0; i<=6; i+=2 ) {
            vh = (val>>>(i*4+4))&0x0f;
            vl = (val>>>(i*4))&0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };
 
    function cvt_hex(val) {
        var str="";
        var i;
        var v;
 
        for( i=7; i>=0; i-- ) {
            v = (val>>>(i*4))&0x0f;
            str += v.toString(16);
        }
        return str;
    };
 
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    };
 
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
 
    msg = Utf8Encode(msg);
 
    var msg_len = msg.length;
 
    var word_array = new Array();
    for( i=0; i<msg_len-3; i+=4 ) {
        j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
        msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
        word_array.push( j );
    }
 
    switch( msg_len % 4 ) {
        case 0:
            i = 0x080000000;
        break;
        case 1:
            i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
        break;
 
        case 2:
            i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
        break;
 
        case 3:
            i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8    | 0x80;
        break;
    }
 
    word_array.push( i );
 
    while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 
    word_array.push( msg_len>>>29 );
    word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
        for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
        for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
 
        for( i= 0; i<=19; i++ ) {
            temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
 
        for( i=20; i<=39; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
 
        for( i=40; i<=59; i++ ) {
            temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
 
        for( i=60; i<=79; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
 
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
 
    }
 
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
 
    return temp.toLowerCase();
}