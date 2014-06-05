var store_user;
var grid_user;

function stdUserMng()
{
	loadStore();
	loadRelRuoloPermessi();
	
	/* Controllo apertura/chiusura finestre */
	
	if(Ext.getCmp('winStdUserMng') != null)
	{
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

		Ext.getCmp('winStdUserMng').close();
		return;
	}
	
	/* Store dati utenti */
	
	Ext.define('GridUtenti', 
	{
		extend : 'Ext.data.Model',
		fields : 
		[{
			name : 'utente_id',
			type : 'string'
		},
		{
			name : 'nome_utente',
			type : 'string'
		},
		{
			name : 'ruolo',
			type : 'string'
		},
		{
			name : 'zona',
			type : 'string'
		}]
	});

	store_user = Ext.create('Ext.data.Store',
	{
		model : 'GridUtenti',
		autoLoad : true,
		proxy :
		{
			type : 'ajax',
			url : 'http://' + constants.ip + constants.root+ constants.servlet,
			extraParams : 
			{
				task : 'userList'
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
			handler : function()
			{
				if(Ext.getCmp('winAddUser') != null)
					Ext.getCmp('winAddUser').close();
				else
					addUser();
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
			handler : delUser
		},
		{ xtype : 'tbfill'},
		{
			id : 'ruolo_permessi',
			text : '&nbsp<b>Ruolo-Permessi</b>',
			tooltip : "Gestione ruolo permessi",
			icon : 'img/handicon_medium.png',
			scale : 'medium',
			padding : '7 7 7 7',
			handler : function()
			{
				if(Ext.getCmp('winRuoloPermessi') != null)
					Ext.getCmp('winRuoloPermessi').close();
				else
					gestioneRuoloPermessi();
			}
			
		}]
	});

	
	grid_user = Ext.create('Ext.grid.Panel',
	{
		store : store_user,
		width : 689,
		height : 370,
		emptyText : "Nessun utente presente.",
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
			text : 'Zona Assegnata',
			flex : 1,
			dataIndex : 'zona' 
		}]
	});
			
			
	var winStdUserMng = new Ext.Window 
	({
		id : 'winStdUserMng',
		title : 'Gestione Utenti '+username.toUpperCase(),
		width : 700,
		height : 500,
		resizable : false,
		items : 
		[{
			tbar: toolbar, 
			frame : true,
			border: false
		}, grid_user],
		
		buttons : 
		[{
			text : 'Okay',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3 5',
			handler : function() { Ext.getCmp('winStdUserMng'); }
		}],
	
		listeners : { beforeclose : function() { Ext.getCmp('usermng_button').toggle(false); } }
	});
		
	winStdUserMng.show();
	winStdUserMng.center();
	Ext.getCmp('usermng_button').toggle(true);
	
	
	grid_user.getSelectionModel().on
	({
	    selectionchange: function(sm, selections) 
	    {
	        if (selections.length) 
	        {
	            Ext.getCmp("mod_user").enable();
	            Ext.getCmp("del_user").enable();
	        } else 
	        {
	        	Ext.getCmp("mod_user").disable();
	        	Ext.getCmp("del_user").disable();
	        }
	    }
	});
}