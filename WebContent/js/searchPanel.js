var comune;
var codiceMMAS;
var ragioneSociale;
var searchArray = [];

//{"field":"comune", "value":"nerviano", "option":"1"},
	//{"field":"nome1", "value":"auchan", "option":"1"}
function showSearch(){
	
	var search = {
		xtype: 'container',
		layout: 'anchor',
		//margin: '0 0 10',
		items: [{
            xtype: 'textfield',
            name: 'comune',
            fieldLabel: 'Comune'
        },{
            xtype: 'radiogroup',
            fieldLabel: 'Metodo',
            cls: 'x-check-group-alt',
            items: [
                {boxLabel: 'Parola esatta', name: 'option1', inputValue: false, checked: true},
                {boxLabel: 'Contiene', name: 'option1', inputValue: true}
            ]
        },{
	        xtype: 'component',
	        height: 20
        },{
            xtype: 'textfield',
            name: 'nome1',
            fieldLabel: 'Ragione Sociale'
        },{
            xtype: 'radiogroup',
            fieldLabel: 'Metodo',
            cls: 'x-check-group-alt',
            items: [
                {boxLabel: 'Parola esatta', name: 'option2', inputValue: false, checked: true},
                {boxLabel: 'Contiene', name: 'option2', inputValue: true}
            ]
        },{
	        xtype: 'component',
	        height: 20
        },{
            xtype: 'textfield',
            name: 'codice',
            fieldLabel: 'Codice MMAS'
        },{
            xtype: 'radiogroup',
            fieldLabel: 'Metodo',
            cls: 'x-check-group-alt',
            items: [
                {boxLabel: 'Parola esatta', name: 'option3', inputValue: false, checked: true},
                {boxLabel: 'Contiene', name: 'option3', inputValue: true}
            ]
        }
        ]
	};

	
	var fp = Ext.create('Ext.FormPanel', {
        //title: 'Check/Radio Groups Example',
        frame: true,
        fieldDefaults: {
            labelWidth: 140
        },
        width: 350,
        //renderTo: document.body,
        //bodyPadding: 10,
        items: [
            search
        ],
        buttons: [{
            text: 'Cerca',
            handler: function(){
               if(fp.getForm().isValid()){
               
               		values = fp.getForm().getFieldValues();
               		
               		if(values.comune != "") {
	               		value = values.comune;
	               		option = values.option1;
	               		searchArray.push({"field" : "comune", "value" : value, "option" : option});
	               		//console.output(value);
               		}
               		
               		if(values.nome1 != "") {
               			value = values.nome1;
               			option = values.option2;
	               		searchArray.push({"field" : "nome1", "value" : value, "option" : option});
               		}
               		
               		if(values.codice != "") {
               			value = values.codice;
               			option = values.option3;
	               		searchArray.push({"field" : "codice", "value" : value, "option" : option});
               		}
               		
               		//console.debug(searchArray);
               		
               		grid.getStore().proxy.extraParams.search = Ext.JSON.encode(searchArray);
               		searchArray = [];
               		grid.getStore().loadPage(1);
               		
                }
            }
        },{
            text: 'Reset',
            handler: function(){
                fp.getForm().reset();
            }
        }]
    });
	

var mainWindow = new Ext.Window({
	height: 300, width: 355,
	title: 'Cerca',
	draggable: true,
	closable: true,
	resizable: false,
	id: 'searchWindow',
	layout: 'fit',
	items: [fp],
	listeners: {
		beforeclose: function (panel, eOpts) {
			Ext.getCmp('searchButton').enable();
		}
	}

});

	mainWindow.show();
	mainWindow.center();
	
};