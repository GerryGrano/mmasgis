/**
 * STORE PER LE ZONE
 */
//contatore per il nome zona
var numZ = 1;
//array per lo store zone
var myDataZone = [];
//??
var row;
var myWinNew;
var myWinMod;
var winAssegna;
var selezione = '';
var colore = 'CCCCCC';






/**
 * STORE DELLE ZONE
 */

var store_zone_selected = Ext.create('Ext.data.ArrayStore', {
	// autoLoad: true,
	// autoSync: true,
	fields: [{
		name: 'color'
	}, {
		name: 'zona'
	}, {
		name: 'fid'
	}, {
		name: 'agente'
	}, {
		name: 'space'
	}],
	data: myDataZone,
	listeners: {
		datachanged: function () {
			//quando cambiano i dati nel box zone
			//se �� non ce nessuna zona non fai nulla
			if (this.getCount() < 1)
				return;

			//se tot > 0 abilita selezione mappa
			if (this.getCount() > 0) {
				enablesZAcomponent();
			}

			//seleziona ultima zona caricata
			zone.getSelectionModel().select(store_zone_selected.getAt(store_zone_selected.getCount()-1));

		},
		remove: function () {
			if (this.getCount() < 1)
				disableZAcomponent();

		}
	}
});


/**
 * GRID PANEL PER LE ZONE
 */

zone = Ext.create('Ext.grid.Panel', {
	id: 'zoneSel',
	title: 'Zone definite: ',
	store: store_zone_selected,
	viewConfig: {
		deferEmptyText: false
	},
	emptyText: 'Nessuna zona definita',
	width: 250,
	flex: 1,
	dockedItems: [{
		xtype: 'toolbar',
		id: 'tlzone',
		items: [{
			xtype: 'button',
			icon: 'img/add16x16.png',
			id: 'newZone',
			handler: newZone
		}, {
			xtype: 'button',
			icon: 'img/open_small.png',
			id: 'openZone',
			handler: openZone
		}, {
			xtype: 'button',
			icon: 'img/save16x16.png',
			id: 'saveZone',
			handler: saveZone
		}, {
			xtype: 'button',
			icon: 'img/modify_small.png',
			id: 'modifyZone',

			handler: function (grid, rowIndex, colIndex) {
				var selectedRecord = Ext.getCmp('zoneSel').getSelectionModel().getSelection()[0];
				if (Ext.getCmp('zoneSel').getStore().getCount() > 0) {
					if (selectedRecord == null) {
						Ext.Msg.show({
							title: 'Operazione fallita',
							msg: "Devi selezionare la zona da modificare.",
							buttons: Ext.Msg.OK,
							buttonText: {
								ok: 'ok'
							},
							icon: Ext.Msg.QUESTION
						});
					} else {
						modificaZone(selectedRecord);
					}
				} else {
					Ext.Msg.show({
						title: 'Operazione fallita',
						msg: "Non sono state definite zone in questo scenario.",
						buttons: Ext.Msg.OK,
						buttonText: {
							ok: 'ok'
						},
						icon: Ext.Msg.QUESTION
					});
				}
			}
		}, {
			xtype: 'button',
			icon: 'img/search_small.png',
			id: 'searchZone',
			handler: search
		}, {
			xtype: 'tbfill'
		}, {
			xtype: 'button',
			icon: 'img/ass_small.png',
			id: 'assZone',
			handler: function (grid, rowIndex, colIndex) {
				var selectedRecord = Ext.getCmp('zoneSel').getSelectionModel().getSelection()[0];
				if (Ext.getCmp('zoneSel').getStore().getCount() > 0) {
					if (selectedRecord == null) {
						Ext.Msg.show({
							title: 'Operazione fallita',
							msg: "Devi selezionare la zona da modificare.",
							buttons: Ext.Msg.OK,
							buttonText: {
								ok: 'ok'
							},
							icon: Ext.Msg.QUESTION
						});

					} else {
						assegnaAgente(selectedRecord.data.agente, selectedRecord.data.zona);
					}
				} else {
					Ext.Msg.show({
						title: 'Operazione fallita',
						msg: "Non sono state definite zone in questo scenario.",
						buttons: Ext.Msg.OK,
						buttonText: {
							ok: 'ok'
						},
						icon: Ext.Msg.QUESTION
					});
				}
			}
		}]

	}],
	columns: {
		items: [{
			width: 22,
			dataIndex: 'color',
			renderer: function (colore, meta) {
				//colore = selColore;
				meta.style = "background-color:" + colore + ";color:" + colore + ";";
				return colore;
			}
		}, {
			text: 'Zona',
			flex: 1,
			dataIndex: 'zona'
		}, {
			text: 'Agente',
			flex: 0.6,
			dataIndex: 'agente'
		}, {
			xtype : 'actioncolumn',
			width : 35,
			items : [{
				icon : 'img/del2.png', // Use a URL in the icon config
				tooltip : 'Elimina questa zona',
				handler: function(grid, rowIndex, colIndex) {
					//elimino zona da grid, myDataZone
					//e territori da myDataScenario e sulla mappa
					var rec = grid.getStore().getAt(rowIndex);
					console.log(rec);
					myDataZone.splice(rowIndex, 1);
					grid.getStore().removeAt(rowIndex);
					unselectFeaturesByZone(rec.data.zona);
				}
			}]
		}]
	},
	listeners: {
		//all'evento seleziona zona x, carica in box i territori di x
		select: function (th, record, index, eOpts) {
			var selection = zone.getView().getSelectionModel().getSelection()[0];
			ZonaSelezionata = new Array(selection.data.fid, selection.data.zona, selection.data.color);
			stileColore = {
					strokeColor: '#ffffff',
					fillColor: '#' + ZonaSelezionata[2],
					// fillColor : '#3FF87F',
					fillOpacity: 0.65,
					strokeWidth: 0.7,
					cursor: 'crosshair'
			};


			myDataBox = [];
			LoadZonaInBox(ZonaSelezionata[1]);
		}
	}

});

/**
 * FUNZIONE PER CREARE NUOVE ZONE
 */
function newZone() {

	//color Picker
	var cp = new Ext.Panel({
		title: 'Scegli il colore',
		flex: 50,
		region: 'center',
		items: [
		        new Ext.picker.Color({
		        	region: 'center',
		        	listeners: {
		        		select: function (picker, selColor) {
		        			colore = selColor;
		        		}
		        	} // initial selected color
		        })
		        ]

	});

	//Disabilita toolbar panello zone
	Ext.getCmp('tlzone').disable();

	//Pannello per personalizzazione della Zona
	var newZone = new Ext.form.Panel({
		region: 'west',
		id: 'newZona',
		frame: true,
		//width : 370,
		defaultType: 'textfield',
		flex: 50,
		title: 'Inserisci Nome Zona',
		layout: 'fit',
		padding: '33 20 33 20',
		items: [{
			fieldLabel: 'Zona',
			name: 'nome',
			value: ' Nome Zona',
			labelWidth: 60,
			width: 250,
			layout: 'fit'
		}]
	});

	// Finestra a cui si appoggia il pannello
	var myWinNew = new Ext.Window({
		id: 'myWinNew',
		title: 'Nuova Zona',
		//height : 190,
		width: 600,
		layout: 'hbox',
		items: [newZone, cp],
		listeners: {
			beforeclose: function () {
				Ext.getCmp('tlzone').enable();
			}
		},
		buttons: [{
			text: 'conferma',
			handler: function () {
				var valore = Ext.getCmp('newZona').getForm().findField("nome").getValue();
				var gridval = Ext.getCmp('zoneSel').getStore();
				var ckz = checkZone(gridval, valore);
				var ckc = checkColor(gridval, colore);

				if (valore == '') {
					elementoVuoto();
				} else {
					if (ckz) {
						if (ckc) {
							var r = {
									color: colore,
									zona: valore,
									fid: "",
									agente: "",
									space: ""
							};
							myDataZone.push(r);
							Ext.getCmp('zoneSel').getStore().loadData(myDataZone, false);
							Ext.getCmp('tlzone').enable();
							Ext.getCmp('myWinNew').close();
						} else {
							inserimentoErrato("Colore");
						}
					} else {
						inserimentoErrato(valore);
					}
				}

			}

		}, {
			text: 'chiudi',
			handler: function () {
				Ext.getCmp('tlzone').enable();
				Ext.getCmp('myWinNew').close();
			}
		}]
	});

	myWinNew.show();
}


/**
 * OPENZONE (CARICAMENTO ZONA DA FILE )
 * DA IMPLEMENTARE
 */

function openZone() {}

/**
 *
 * FUNZIONE FA I CONTROLLI PER ESPORTARE LA ZONA
 */

function saveZone() {
	var selectedRecord = Ext.getCmp('zoneSel').getSelectionModel().getSelection()[0];

	if (Ext.getCmp('zoneSel').getStore().getCount() > 0) {
		if (selectedRecord == null) {
			Ext.Msg.show({
				title: 'Operazione fallita',
				msg: "Devi selezionare la zona da salvare.",
				buttons: Ext.Msg.OK,
				buttonText: {
					ok: 'ok'
				},
				icon: Ext.Msg.QUESTION
			});

		} else {
			exportTxt(myDataBox, selectedRecord);
		}
	} else {
		Ext.Msg.show({
			title: 'Operazione fallita',
			msg: "Non sono state definite zone in questo scenario.",
			buttons: Ext.Msg.OK,
			buttonText: {
				ok: 'ok'
			},
			icon: Ext.Msg.QUESTION
		});
	}
}



/**
*
* funzione che esporta la zona in un file
*/
function exportScenario(box) {



	var ob1 = JSON.stringify(box);

	var f = document.getElementById('txt');
	f.action = 'http://' + constants.ip + constants.root + constants.servlet;
	f.task.value = 'text';
	f.box.value = ob1;
	f.filename.value = "Scenario";
	f.submit();

}


/**
 *
 * funzione che esporta la zona in un file
 */
function exportTxt(box, row) {


	var nomeAg = row.data.agente;

	var ob1 = JSON.stringify(box);

	var f = document.getElementById('txt');
	f.action = 'http://' + constants.ip + constants.root + constants.servlet;
	f.task.value = 'text';
	f.box.value = ob1;
	f.agente.value = nomeAg;
	f.filename.value = ZonaSelezionata[1];
	f.submit();

}


/**
 *
 * MODIFA PARAMETRI DI ZONA GIA ESISTENTE
 */

function modificaZone(row) {

	colore = row.data.color;
	var riga = row;
	Ext.getCmp('tlzone').disable();

	// Il picker colorato
	var cp = new Ext.Panel({
		title: 'Scegli il colore',
		flex: 50,
		autoScroll: true,
		layout: 'fit',
		region: 'center',
		items: [
		        new Ext.picker.Color({
		        	region: 'center',
		        	colors: [
		        	         '000000', '000033', '000066', '000099', '0000CC', '0000FF',
		        	         '003300', '003333', '003366', '003399', '0033CC', '0033FF',
		        	         '006600', '006633', '006666', '006699', '0066CC', '0066FF',
		        	         '009900', '009933', '009966', '009999', '0099CC', '0099FF',
		        	         '00CC00', '00CC33', '00CC66', '00CC99', '00CCCC', '00CCFF',
		        	         '00FF00', '00FF33', '00FF66', '00FF99', '00FFCC', '00FFFF',
		        	         '330000', '330033', '330066', '330099', '3300CC', '3300FF',
		        	         '333300', '333333', '333366', '333399', '3333CC', '3333FF',
		        	         '336600', '336633', '336666', '336699', '3366CC', '3366FF',
		        	         '339900', '339933', '339966', '339999', '3399CC', '3399FF',
		        	         '33CC00', '33CC33', '33CC66', '33CC99', '33CCCC', '33CCFF',
		        	         '33FF00', '33FF33', '33FF66', '33FF99', '33FFCC', '33FFFF',
		        	         '660000', '660033', '660066', '660099', '6600CC', '6600FF',
		        	         '663300', '663333', '663366', '663399', '6633CC', '6633FF',
		        	         '666600', '666633', '666666', '666699', '6666CC', '6666FF',
		        	         '669900', '669933', '669966', '669999', '6699CC', '6699FF',
		        	         '66CC00', '66CC33', '66CC66', '66CC99', '66CCCC', '66CCFF',
		        	         '66FF00', '66FF33', '66FF66', '66FF99', '66FFCC', '66FFFF',
		        	         '990000', '990033', '990066', '990099', '9900CC', '9900FF',
		        	         '993300', '993333', '993366', '993399', '9933CC', '9933FF',
		        	         '996600', '996633', '996666', '996699', '9966CC', '9966FF',
		        	         '999900', '999933', '999966', '999999', '9999CC', '9999FF',
		        	         '99CC00', '99CC33', '99CC66', '99CC99', '99CCCC', '99CCFF',
		        	         '99FF00', '99FF33', '99FF66', '99FF99', '99FFCC', '99FFFF',
		        	         'CC0000', 'CC0033', 'CC0066', 'CC0099', 'CC00CC', 'CC00FF',
		        	         'CC3300', 'CC3333', 'CC3366', 'CC3399', 'CC33CC', 'CC33FF',
		        	         'CC6600', 'CC6633', 'CC6666', 'CC6699', 'CC66CC', 'CC66FF',
		        	         'CC9900', 'CC9933', 'CC9966', 'CC9999', 'CC99CC', 'CC99FF',
		        	         'CCCC00', 'CCCC33', 'CCCC66', 'CCCC99', 'CCCCCC', 'CCCCFF',
		        	         'CCFF00', 'CCFF33', 'CCFF66', 'CCFF99', 'CCFFCC', 'CCFFFF',
		        	         'FF0000', 'FF0033', 'FF0066', 'FF0099', 'FF00CC', 'FF00FF',
		        	         'FF3300', 'FF3333', 'FF3366', 'FF3399', 'FF33CC', 'FF33FF',
		        	         'FF6600', 'FF6633', 'FF6666', 'FF6699', 'FF66CC', 'FF66FF',
		        	         'FF9900', 'FF9933', 'FF9966', 'FF9999', 'FF99CC', 'FF99FF',
		        	         'FFCC00', 'FFCC33', 'FFCC66', 'FFCC99', 'FFCCCC', 'FFCCFF',
		        	         'FFFF00', 'FFFF33', 'FFFF66', 'FFFF99', 'FFFFCC', 'FFFFFF',
		        	         ],

		        	         listeners: {
		        	        	 select: function (picker, selColor) {
		        	        		 colore = selColor;
		        	        	 }
		        	         }
		        })
		        ]

	});

	//PANNELLO A CUI SI APPOGGIANO I VARI CAMPI (NOME, COLORE....)
	var modZone = new Ext.form.Panel({
		region: 'west',
		id: 'modZone',
		frame: true,
		padding: '33 20 33 20',
		//width : 370,
		defaultType: 'textfield',
		flex: 50,
		layout: 'fit',
		title: 'Inserisci Nome Zona',
		items: [{
			fieldLabel: 'Zona',
			layout: 'fit',
			name: 'nome',
			value: riga.data.zona.toString(),
			labelWidth: 60,
			width: 250
		}]
	});

	//FINESTRA CON I BOTTONI (CONFERMA RESET...)

	var myWinMod = new Ext.Window({
		id: 'myWinMod',
		title: 'Modifica Zona',
		//height : 190,
		width: 600,
		layout: 'hbox',
		items: [modZone, cp],
		listeners: {
			beforeclose: function () {
				Ext.getCmp('tlzone').enable();
			}
		},
		buttons: [{
			text: 'conferma',
			handler: function () {
				var valore = Ext.getCmp('modZone').getForm().findField("nome").getValue();
				var gridval = Ext.getCmp('zoneSel').getStore();
				var ckz = checkZone(gridval, valore);
				var ckc = checkColor(gridval, colore);

				if (valore == '') {
					elementoVuoto();
				} else {
					if (ckz | (valore == row.data.zona)) {
						if (ckc | (colore == row.data.color)) {
							for (var x = 0; x < myDataZone.length; x++) {
								if (myDataZone[x].zona == row.data.zona) {
									myDataZone[x].color = colore;
									myDataZone[x].zona = valore;
									Ext.getCmp('zoneSel').getStore().loadData(myDataZone, false);
									break;
								}
							}
						} else {
							inserimentoErrato("colore");
						}
					} else {
						inserimentoErrato(valore);
					}

					Ext.getCmp('tlzone').enable();
					Ext.getCmp('myWinMod').close();
				}
			}
		}],
		text: 'chiudi',
		handler: function () {
			Ext.getCmp('tlzone').enable();
			Ext.getCmp('myWinMod').close();
		}
	});

	myWinMod.show();
};

/**
 *
 * FUNZIONE RICERCA AGENTI E ZONE
 * DA IMPLEMENTARE
 *
 */

function search() {}

/**
 *
 * DOVREBBE ASSEGNARE LA ZONA PASSATA COME PARAMETRO, AGLI AGENTI DISPONIBILI
 *
 * DISPONIBILI : AGENTI DELLA PROPRIA AZIENDA E AGENTI CREATI DA ME (PERCHE I CAPO AREA NON POSSO VEDERE AGENTI DI ALTRI)
 **/

//ERRORE
//FUNZIONA DA CONTROLLARE CON LUCREZIA

function assegnaAgente(ag, zn) {



	var agente = ag;
	var zona = zn;
	var cdata = [];

	var agenti_store = Ext.create('Ext.data.Store', {
		fields: ['nome_utente'],
		data: cdata
	});

	var assAg = new Ext.create('Ext.form.ComboBox', {
		id: 'comboAg',
		fieldLabel: 'Scegli Agente',
		store: agenti_store,
		queryMode: 'local',
		height: 50,
		labelWidth: 130,
		editable: false,
		value: agente.toString(),
		displayField: 'nome_utente',
		valueField: 'nome_utente'
	});

	Ext.Ajax.request({
		waitMsg: 'wait...',
		url: 'http://' + constants.ip + constants.root + constants.servlet,
		params: {
			task: 'getAgenti'
		},
		success: function (response) {
			cdata = Ext.JSON.decode(response.responseText);
			Ext.getCmp('comboAg').getStore().loadData(cdata, false);
		}
	});

	var winAssegna = new Ext.Window({
		id: 'winAssegna',
		title: 'Assegnamento zona ad Agente',
		//height : 190,
		width: 320,
		layout: 'fit',
		items: [assAg],
		buttons: [{
			text: 'conferma',
			handler: function () {
				for (var x = 0; x < myDataZone.length; x++) {
					if (myDataZone[x].zona == zona) {
						myDataZone[x].agente = Ext.getCmp('comboAg').value;
						Ext.getCmp('zoneSel').getStore().loadData(myDataZone, false);
						break;
					}
				}
				Ext.getCmp('winAssegna').close();
			}
		}],
		text: 'chiudi',
		handler: function () {
			Ext.getCmp('winAssegna').close();
		}

	});

	winAssegna.show();
};


/**
 * FUNZIONE che avvisa l'utente della form incompleta
 *
 */
function elementoVuoto() {
	Ext.Msg.show({
		title: 'Inserimento nullo',
		msg: "Non hai inserito l'elemento nella form",
		buttons: Ext.Msg.OK,
		buttonText: {
			ok: 'ok'
		},
		icon: Ext.Msg.QUESTION
	});
}

/**
 * FUNZIONE CHE AVVISA L'ERRORE DELL'UTENTE
 *
 */
function inserimentoErrato(str) {
	Ext.Msg.show({
		title: 'Inserimento errato',
		msg: "L'elemento '" + str + "' &#232 gi&#224 presente in memoria",
		buttons: Ext.Msg.OK,
		buttonText: {
			ok: 'ok'
		},
		icon: Ext.Msg.QUESTION
	});
}


/**
 *
 * CONTROLLA CHE NON ESISTA UNA ZONA CON LO STESSO NOME
 */
function checkZone(gridval, valore) {

	for (var x = 0; x < gridval.count(); x++) {
		if (gridval.getAt(x).data.zona == valore) {
			return false;
		}
	}
	return true;
}


/**
 * Controllo colori zona presenti nel grid zone
 *
 * @param gridval
 */
function checkColor(gridval, colore) {

	for (var x = 0; x < gridval.count(); x++) {
		if (gridval.getAt(x).data.color == colore) {
			return false;
		}
	}
	return true;
}




/**
 * funzione che carica nel box la zona passata come parametro
 *
 *
 * @param nome_zona UNIVOCO
 */

function LoadZonaInBox(NomeZona) {


	//ordino lo scenario
	//posso farlo quando lo inserisco senza farlo qui?
	//myDataScenario.sort(orderByNomeZona);

	//imposto titolo sul box
	Ext.getCmp('gridSel').setTitle(ZonaSelezionata[1]);
	myDataBox = [];
	Ext.getCmp('gridSel').getStore().loadData(myDataBox, false);
	//scorro tutto lo scenario e copio nell'array del box solo quei terroritori con la zona desiderata

	var i;


	for (i = 0; i < myDataScenario.length && myDataScenario[i]["nome"] <= NomeZona; i++) {
		if (myDataScenario[i]["nome"] == NomeZona) {
			myDataBox.push(myDataScenario[i]);
		}
	}

	//carico il box
	Ext.getCmp('gridSel').getStore().loadData(myDataBox, false);
}

/**
 * funzione che carica nel box le zone dello scenario
 *
 *
 * @param numero scenario
 */

function LoadZoneInZA(scenario){

	//Ext.getCmp('zoneSel').setLoading(true,true);
	Ext.Ajax.request({
		waitMsg : 'wait...',
		url : 'http://' + constants.ip + constants.root + constants.servlet,
		params : {
			task : 'getZone',
			scenario : scenario
		},
		callback: function(opt,success, response) {
			var query  = Ext.JSON.decode(response.responseText);
			for(var x = 0; x <query.length; x++) {
				var r = {
						color: query[x].colore.toString(),
						zona: query[x].nome,
						fid: query[x].zona_id,
						agente: query[x].nome_utente,
						space: ""
				};
				myDataZone.push(r);

			}
			//carica dati nella zona (verra selzionata ultima caricata)
			Ext.getCmp('zoneSel').getStore().loadData(myDataZone, false);

			//carico paramentri zona da selezionare
			var zona_temp = myDataZone[myDataZone.length-1];
			ZonaSelezionata=new Array(zona_temp.fid,zona_temp.zona,zona_temp.color);
			//seleziono zona
			zone.getSelectionModel().select(store_zone_selected.getAt(store_zone_selected.getCount()-1));
			//carico zona
			//LoadZonaInBox(ZonaSelezionata[1]);

			addZone();
		}
	});
}
