var grid_user;

/**
 * STORE DATI UTENTE
 */

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
	}]
});

var store_user = Ext.create('Ext.data.Store',
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


/**
 * STORE RUOLO
 */

Ext.define('comboruolo', 
{
	extend : 'Ext.data.Model',
	fields : 
	[{
		name : 'ruolo',
		type : 'string'
	}]
});

var store_ruolo = Ext.create('Ext.data.Store',
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


/**
 * STORE PERMESSI
 */

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

var store_permits = Ext.create('Ext.data.Store',
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


/**
 * GESTIONE UTENTI
 */

function winusermng()
{
	var toolbar = Ext.create('Ext.toolbar.Toolbar',
	{
		height: 43,
		items:
		[{
			id: 'add_user',
			text : 'Aggiungi utente',
			icon : 'img/add_icon2.png',
			scale : 'medium',
			handler : useradd
		},
		{
			id : 'mod_user',
			xtype : 'splitbutton',
			text : 'Modifica utente',
			icon : 'img/mod_icon.png',
			scale : 'medium',
			disabled: true,
			margin: '0 7 0 7',
			menu: [{text: 'Modifica Nome Utente'}, {text: 'Modifica Password'}, {text: 'Modifica Ruolo'}],
			handler : mod_user
		},
		{
			id : 'del_user',
			text : 'Elimina utente',
			icon : 'img/del.png',
			scale : 'medium',
			disabled: true,
			handler : del_user
		},
		{ xtype : 'tbfill'},
		{
			text : 'Ruolo-Permessi',
			tooltip : "Gestione ruolo permessi",
			icon : 'img/handicon_medium.png',
			scale : 'medium',
			handler : mngruolo
			
		}]
	});

	
	grid_user = Ext.create('Ext.grid.Panel',
	{
		store : store_user,
		//renderTo: Ext.getBody(),
		//layout: 'fit',
		width : 689,
		height : 370,
		//flex : 1,
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
			dataIndex : 'utente_id' 
		}]
	});
	
	
	var win = new Ext.Window 
	({
		title : 'Gestione utenti',
		width : 700,
		height : 500,
		resizable : false,
		items : 
		[{
			tbar: toolbar, 
			//layout : 'fit',
			frame : true,
			border: false
		}, grid_user],
		
		buttons : 
		[{
			text : 'Okay',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3 5',
			handler : function() { win.close(); }
		}],
		
		listeners : 
		{
			beforeclose : function() { Ext.getCmp('usermng_button').enable(); }
		}
	});
	
	win.show();
	win.center();
	
	Ext.getCmp('usermng_button').disable(); 
	
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




/**
 * AGGIUNGI UTENTE
 */

function useradd()
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
				emptyText : ' Nome Cognome',
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

	
	var winadd = new Ext.Window
	({
		title : 'Aggiungi utente',
		width : 380,
		height : 240,
		resizable : false,
		items : formadd,
		listeners : 
		{
			beforeclose : function() { Ext.getCmp('add_user').enable(); }
		},
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
						console.debug(hash_pwd);
						
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
								console.debug(response);
								winadd.close();
								grid_user.getStore().loadPage(1);
								Ext.Msg.alert('&nbspMessaggio', '&nbsp '+input.nome.toUpperCase()+' e\' stato aggiunto.');
							}
							
						});
					}else
						Ext.MessageBox.alert('&nbspAttenzione', '&nbspErrore inserimento Password.');
				}else 
					Ext.Msg.alert('&nbspAttenzione', '&nbspRiempire tutti i campi.');
				
				console.debug(nome, pwd, confpwd, ruolo);
				
			}
		}]
	});
	
	winadd.show();
	winadd.center();
	Ext.getCmp('add_user').disable();
	
}


/** 
 * MODIFICA UTENTE
 **/

function mod_user()
{
	var selection = grid_user.getView().getSelectionModel().getSelection()[0];
	
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
	
	var winmod = new Ext.Window
	({
		title : 'Modifica utente',
		width : 380,
		height : 240,
		resizable : false,
		items : fmod,
		listeners : 
		{
			beforeclose : function() { Ext.getCmp('mod_user').enable(); }
		},
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

				var nome_mod = Ext.JSON.encode(input.nome);
				var pwd_mod = Ext.JSON.encode(input.pwd);
				var confpwd_mod = Ext.JSON.encode(input.confpwd);
				var ruolo_mod = Ext.JSON.encode(input.ruolo);
				
				if(input.nome != "" && input.ruolo != null && input.pwd != "" && input.confpwd != "")
				{	
					if(pwd_mod == confpwd_mod)
					{
						var hash_pwd_mod = SHA1(pwd_mod);
						//console.debug(hash_pwd);
						
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
								winmod.close();
								grid_user.getStore().loadPage(1);
								Ext.Msg.alert('&nbspMessaggio', '&nbsp Modifica effettuata.');
							}
							
						});
					}else
						Ext.MessageBox.alert('&nbspAttenzione', '&nbspErrore inserimento Password.');
				}else 
					Ext.Msg.alert('&nbspAttenzione', '&nbspRiempire tutti i campi.');
			}
		}]
	});
	
	winmod.show();
	winmod.center();
	Ext.getCmp('mod_user').disable();
}

/** 
 * ELIMINA UTENTE
 */
function del_user()
{
	var selection = grid_user.getView().getSelectionModel().getSelection()[0];
	
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
	        			grid_user.getStore().loadPage(1);
	        			Ext.Msg.alert('Messaggio', '&nbsp '+nome_utente.toUpperCase()+' e\' stato rimosso.');
	        		}
	        	});
	        }
	 };
}


/** 
 * GESTIONE RUOLO-PERMESSI
 */
function mngruolo()
{	
	
	var tabs_ruoli = Ext.createWidget('tabpanel', 
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
				title : records[i].data.ruolo,
				closable : false,
				items : Ext.create('Ext.grid.Panel', 
				{
			        store: store_permits,
					layout : 'fit',
					columnLines: true,
			        columns: 
			        [
						{
							text: '<center>Attivo</center>', 
							width: 50,
							dataIndex: 'permesso_id',
							renderer: function(value, meta, record)
						    {
						        return '<center><input type="checkbox" name="chackbox">'
						    }
						},
			            {text: 'Permessi', flex: 0.5, dataIndex: 'nome'},
			            {text: 'Descrizione', flex: 1, dataIndex: 'descrizione'}
			        ]
			    })
			});
		}
		tabs_ruoli.setActiveTab(0);
	});
	
	
	var winruolo = new Ext.Window
	({
		title : 'Gestione Ruolo-Permessi',
		width : 550,
		height : 450,
		resizable : true,
		items : 
		[{
			xtype : 'toolbar',
			dock : 'top',
			items : 
			[{
				id: 'add_ruolo',
				text : 'Aggiungi Ruolo',
				icon : 'img/add_icon2.png',
				scale : 'medium',
				handler : addRuolo
			},
			{
				id : 'del_ruolo',
				text : 'Elimina ruolo',
				icon : 'img/del.png',
				scale : 'medium',
				margin : '0 7',
				handler : function()
				{
					var ruolo = tabs_ruoli.activeTab.title;
					
					Ext.Msg.show
					({
					     title :'Conferma',
					     height : '300 px',
					     msg : 'Sei sicuro di voler eliminare il ruolo '+ruolo.toUpperCase()+' dal sistema?',
					     buttons : Ext.MessageBox.YESNO,
					     fn : function(btn) 
					     		{
						    		if(btn == 'yes')
							        {
						    			console.debug("elimina ruolo");
//								        	Ext.Ajax.request
//								        	({
//								        		url : 'http://' + constants.ip + constants.root + constants.servlet,
//								        		params:
//								        		{
//								        				task: 'delRuolo',
//								        				ruolo : ruolo
//								        		},
//								        		success : function(response)
//								        		{
//	//							        			console.debug(response);
//								        			store_ruolo.loadPage(1);
//								        			Ext.Msg.alert('Messaggio', '&nbsp '+nome_utente.toUpperCase()+' e\' stato rimosso.');
//								        		}
//								        	});
							        }
					     		},
					     icon: Ext.Msg.QUESTION
					});		
				}
			}]
		}, tabs_ruoli],
		
		buttons : 
		[{
			text : 'Salva',
			icon : 'img/ok.png',
			scale : 'medium',
			margin : '3'
			//handler : function()
		},
		{
			text : 'Annulla',
			icon : 'img/del.png',
			scale : 'medium',
			margin : '3'
			//handler : function()
		}]
	});
	
	winruolo.show();
	winruolo.center();	
}


function addRuolo()
{
	
	var formadd = new Ext.form.Panel
	({
		id : 'formadd',
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

	
	var wAddruolo = new Ext.Window
	({
		title : 'Aggiungi Ruolo',
		width : 380,
		height : 135,
		resizable : false,
		items : formadd,
		listeners : 
		{
			beforeclose : function() { Ext.getCmp('add_ruolo').enable(); }
		},
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
				
				store_ruolo.load(function(records, operation, success) 
				{
					var i, b = true;
					for (i=0; i<records.length; i++)
					{
						if(input.nome.toLowerCase() == records[i].data.ruolo)
						{
							b = false;
							Ext.Msg.alert('Messaggio', '&nbsp Impossibile aggiungere '+input.nome.toUpperCase()+' perche\' esiste gia\'.');
						}
					}
					if(b)
						add(nome);
					else
						console.debug('reinserisci');
				});
			}
		}]
	});
		
	wAddruolo.show();
	wAddruolo.center();
	Ext.getCmp('add_ruolo').disable();
	
	function add(nome)
	{
		if(nome != "")
		{	
//			

		}else
			Ext.MessageBox.alert('&nbspAttenzione', '&nbspInserire Nome Ruolo.');
		
		console.debug("aggiungi "+nome+" al database");
	}

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