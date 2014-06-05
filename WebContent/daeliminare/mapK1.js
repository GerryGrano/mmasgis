var map, regioni, province, comuni, cap, select, selectionControl, dragpan, labels, panel, r, myfeature, selectFeature;
var url = "http://"+constants.ip+"geoserver/mmasgis/wms";
var opacity = 1;
var myData = [];
var f;
 
Ext.BLANK_IMAGE_URL = './extjs/resources/themes/images/default/tree/s.gif';

Ext.require([
'Ext.tip.QuickTipManager'
]);

// application main entry point
Ext.onReady(function() {
	//Ext.tip.QuickTipManager.init();      
//Ext.tip.QuickTips.init();
    
    			
    //STORE DEL GRID PANEL (features selezionate)
    var store_selected = Ext.create('Ext.data.ArrayStore', {
        //autoLoad: true,
        //autoSync: true,
        fields: [{
            name: 'nome'
        },{
            name: 'layer'
        },{
            name: 'fid'
        },{
            name: 'sigla'
        }],
        data: myData
    });
				
    //STORE DEI CENSIMENTI DISPONIBILI
    var store_censimenti = Ext.create('Ext.data.ArrayStore', {
        autoLoad: true,
        autoSync: true,
        fields: [
        {
            name: 'nome'
        },{
        	name: 'nomePers'
        },{
        	name: 'custom'
        }],
        data: lista_censimenti
    });
				
    //GRID PANEL PER LE FEATURE SELEZIONATE
    var selected = Ext.create('Ext.grid.Panel', {
        id: 'gridSel',
        title: 'Territori selezionati ',
        store: store_selected,
        emptyText:'nessuna feature selezionata',
        columns: [
        {
            text: 'Nome',
            flex: 2,
            dataIndex: 'nome'
        },{
            text: 'Tipo',
            flex: 0.5,
            dataIndex: 'layer'
        },{
            text: 'Sigla',
            flex: 1,
            dataIndex: 'sigla'
        },{
            xtype: 'actioncolumn',
            width: 35,
            items: [{
                icon   : 'img/del2.png',  // Use a URL in the icon config
                tooltip: 'Elimina questa feature',
                handler: function(grid, rowIndex, colIndex) {
                    //alert(myData[rowIndex][2]);
                    unselectSingleFeature(myData[rowIndex][2]);
                }
            }]
        }],
        flex: 1,
        width: 250
    });
				
				
    //STORE DEL TREE PANEL(albero gerarchia istat)
    var store = Ext.create('Ext.data.TreeStore', {
        proxy: {
            type: 'ajax',
            url: 'http://' + constants.ip + constants.root + constants.servlet,
            	reader: {
            		type: 'json'
            	},
            	extraParams: {
            		task: 'getNodes'
            	}
       	},
        root: {
            text: 'Regioni',
            id: '0',
            expanded: true,
            rootVisible: false
        }
					
    });
				
    //TREE PANEL 
    var tree = Ext.create('Ext.tree.Panel', {
        id: 'tree',
        store: store,
        height: 250,
        width: 250,
        resizable: true,
        title: 'Territori',
        listeners: {
            itemclick: function(view,rec,item,index,eventObj) {
                //.debug(rec.raw.text);
                //console.debug(rec.raw.codice);
                getNodes(rec.raw.codice, rec.raw.layer);
            }
        },
        dockedItems: [{
            xtype: 'toolbar',
            items: [
            {
                xtype: 'button',
                text: 'Chiudi tutto',
                icon: 'img/up_small.png',
                handler: function(){
                    var toolbar = this.up('toolbar');
                    toolbar.disable();
                    
                    tree.collapseAll(function() {
                        toolbar.enable();
                    });
                }
            },
            {
                xtype: 'button',
                text: 'Cerca',
                icon: 'img/search_small.png',
                id: 'searchUtbPanelButton',
                handler: function () {
                    var f = new Ext.create('Ext.form.Panel', {
                        id: 'formpanelUTB',
                        width: 300,
                        height: 150,
                        bodyPadding: 10,
                        items: [
                        {
                            xtype: 'fieldcontainer',
                            //fieldLabel : 'Layer',
                            defaultType: 'radiofield',
                            id: 'layerSelector',
                            layout: 'vbox',
                            items: [
                            {
                                boxLabel: 'Province',
                                name: 'layer',
                                inputValue: 'provincia',
                                id: 'radio1',
                                checked: true
                            },
                            {
                                boxLabel: 'Comuni',
                                name: 'layer',
                                inputValue: 'comune',
                                id: 'radio2'
                            },
                            {
                                boxLabel: 'Cap',
                                name: 'layer',
                                inputValue: 'Cap',
                                id: 'radio3'
                            }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            text: 'nome',
                            id: 'fieldCerca',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() === e.ENTER) {
                                        doSearch();
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Cerca',
                            id: 'searchUtbButton',
                            handler: function () {
                                doSearch();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Reset',
                            handler: function () {
                                Ext.getCmp('fieldCerca').setValue("");
                            }
                        }
                        ]
                    });
                    
                    var w = new Ext.Window({
                        id: 'searchUTB',
                        height: 180,
                        width: 300,
                        title: "Cerca UTB",
                        items: [f],
                        listeners: {
                            beforeclose: function (panel, eOpts) {
                                Ext.getCmp('searchUtbPanelButton').enable();
                            }
                        }
                    });

                    w.show();
                    w.center();
                    Ext.getCmp('searchUtbPanelButton').disable();
                }
            } ]
        } ]
    });
				
    //PANEL CONTENITORE DI ALBERO E GRID, LAYOUT VBOX PER DISPOSIZIONE VERTICALE 
    var rightPanel = new Ext.Panel({
    	//layout: 'vbox',
        layout: 'column',
        region: 'west',
        width: 250,
        //height: 650,
        //collapsible: true,
        items: [
        tree,
        selected
        ]
					
    });
				
				
    //PANEL CONTENITORE "PADRE": CONTIENE MAPPA E PANEL DESTRO CON ALBERO E GRID
    var viewport = new Ext.Viewport({
        title:Ext.getDom('page-title').innerHTML,
        id:'simplestbl',
        layout:'border',
        //width:1000,
        //height:650,
        renderTo:Ext.getBody(),
        items:[
        {
            region:'center',
            layout:'fit',
            frame:true,
            border:false,
            html:'<div id="map" class="smallmap" ></div>'
        },
        {
        	region:'north',
            tbar: {
                xtype: 'toolbar',
                height: 60,
                items: [
            			{
            				xtype:'box',
            				autoEl: {tag: 'img', src:'img/logo_mmas.png'},
            				id: 'mmas', 
            			    width : 110,
            			    height : 50,
            			    margin: '0 10 0 0'
            			}, '-',
            			{
            				 html:'<div style="padding:0;margin:0;"  >Censimento</div>',
            			    tooltip: 'Seleziona censimenti',
            			    width : 50,
            			    height : 50,
            			    id: 'databaseButton',
            			    icon: 'img/censimenti.png',
            			    scale: 'medium',
            			    //style:'padding:0 40px 0 40px',
            			    margin: '0 80 0 0 ',
            			    handler: function(){
            			        var f = Ext.create('Ext.grid.Panel',{
            			            id: 'gridCensimenti',
            			            frame: false,
            			            store: store_censimenti,
            			            height: '210',
            			            
            			            bodyPadding: 0,
            			            hideHeaders: true,
            			          
            			            fieldDefaults:{
            			                labelAlign: 'left',
            			                labelWidth: 90,
            			                anchor: '100%'
            			            },
            			            columns: [{
            			                text: 'Nome',
            			                //width: 155,
            			                flex: 1,
            			                dataIndex: 'nome',
            			                hidden: true
            			            },{
            			                text: 'Nome',
            			                //width: 155,
            			                flex: 1,
            			                dataIndex: 'nomePers'
            			            },{
            			                text: 'custom',
            			                //width: 20,
            			                flex: 0,
            			                dataIndex: 'custom',
            			                hidden: true
            			            }],	
            			            listeners:{
            			                itemdblclick: function(dv, record, item, index, e){	//console.log(record);
            			                    //alert('working'+record.data.pv_id);
            			                    //menuContext.showAt(e.xy);
            			                    var selection = f.getView().getSelectionModel().getSelection()[0];
            			                    //console.debug(selection.data.nome);
            			                    window.close();
            			                    showFeatures(selection.data.nome, selection.data.custom);
            			                    
            			                }/*,itemclick: function(view, record, item, index, e, options)
            											{
            												menuContext.showAt(e.xy);
            											}*/
            			
            			            }
            										
            			        });
            			        /*
            			        Ext.EventManager.onWindowResize(function () {
            			
            			            var tmpHeight = Ext.getBody().getViewSize().height - 160;
            			            var height = Ext.getBody().getViewSize().height - 140;
            			
            			            grid.setSize(width, height);
            			
            			        });		*/	
            			        var w = new Ext.Window({
            			        	resizable: false,
            			        	 width: 250,
            			        	 height: 200,
            			        	
            			        	 autoScroll: true,
            			             title:"censimenti disponibili",
            			            items:[f],
            			            dockedItems: [{
            			              xtype:'toolbar',
            			              dock:'bottom',
            			              items: [{xtype: 'tbfill'},
            			                  {
            			                    text: 'Apri',
            			                    tooltip: 'Apri censimento',
            			                    icon: 'img/ok.png',
            			                    scale: 'medium',
            			                    handler: function(){
            			                    	var selection = f.getView().getSelectionModel().getSelection()[0];
            			                        //console.debug(selection.data.nome);
            			                    	
            			                        showFeatures(selection.data.nome, selection.data.custom);
            			                    }
            			               }]
            			            }],
            			            listeners: {
            			                beforeclose: function() {
            			                    Ext.getCmp('databaseButton').enable();
            			                }
            			            }
            			        });
            			        w.show();
            			        w.center();
            			        Ext.getCmp('databaseButton').disable();
            			    }//end database button handler
            						},				{
            							 id: 'sposta_button',
            				                width : 50,
            				                height : 50,
            							    enableToggle: true,
            							    tooltip: 'Sposta',
            							    handler: panButtonClicked,
            							    icon: 'img/arrowHand.png',
            							    scale: 'medium',
            							    style:'margin:0 10px 0 55px'
            							},
            				                {
            				                    id: 'select_button',
            				                    width : 52,
            				                    height : 50,
            				                    enableToggle: true,
            				                    tooltip: 'Seleziona',
            				                    handler: selectButtonClicked,
            				                    icon: 'img/arrowGrey.png',
            				                    scale: 'medium',
            				                    style:'margin:0 0 0 10px'
            				                },{
            				                    id: 'reg_button',
            				                    enableToggle : true,
            				                    width : 58,
            					                height : 50,
            					                icon: 'img/regioni.png',
            					                scale: 'medium',
            				                    handler: showRegioni
            				                },{
            				                    id: 'prov_button',
            				                    enableToggle : true,
            				                    width : 58,
            					                height : 50,
            					                icon: 'img/province.png',
            					                scale: 'medium',
            				                    handler: showProvince
            				                },{
            				                    id: 'com_button',
            				                    enableToggle : true,
            				                    width : 58,
            					                height : 50,
            					                icon: 'img/comuni.png',
            					                scale: 'medium',
            				                    handler: showComuni								
            				                },{
            				                    id: 'cap_button',
            				                    enableToggle : true,
            				                    width : 58,
            					                height : 50,
            					                icon: 'img/cap.png',
            					                scale: 'medium',
            				                    handler: showCap
            				                
            				                },{
            				                	id: 'deselect_button',
            					                tooltip: 'Deseleziona tutto',
            					                width : 50,
            					                height : 50,
            					                handler: unselectFeatures,
            					                icon: 'img/unselectRed.png',
            					                scale: 'medium',
            					                style:'margin:0 0 0 10px'
            				                },{
            				                		xtype: 'tbfill'
            				                },{
            				                	id: 'logout_button',
            				                	tooltip: 'Esci',
            				                	width : 50,
            					                height : 50,
            				                    handler: logout,
            				                    icon: 'img/logout_medium.png',
            				                    scale: 'medium'
            				                }]	
            			            },
            			            layout:'fit',
            			            frame:true,
            			            border:false
            			        },
            			        rightPanel
            			        ]
            			    });

    var panZoom = new OpenLayers.Control.PanZoom();
			
    panZoom.onButtonClick = function(evt) {
        var btn = evt.buttonElement;
        switch (btn.action) {
            case "panup":
                this.map.pan(0, -this.getSlideFactor("h"));
                break;
            case "pandown":
                this.map.pan(0, this.getSlideFactor("h"));
                break;
            case "panleft":
                this.map.pan(-this.getSlideFactor("w"), 0);
                break;
            case "panright":
                this.map.pan(this.getSlideFactor("w"), 0);
                break;
            case "zoomin":
                this.map.zoomIn(); 
                break;
            case "zoomout":
                this.map.zoomOut(); 
                break;
            case "zoomworld":
                //map.setCenter(new OpenLayers.Bounds(65.444336,32.115234,-44.438477,50.580078).getCenterLonLat(), 6);
                proj = new OpenLayers.Projection("EPSG:4326");
                point = new OpenLayers.LonLat(12, 42);
                map.setCenter(point.transform(proj, map.getProjectionObject()), 6);
                break;
        }
    };
			
    //MAPPA
    map = new OpenLayers.Map('map', {
        div: "map",
        projection: "EPSG:900913",
        displayProjection: "EPSG:4326",
        controls: [
        panZoom,
        new OpenLayers.Control.Navigation()
        ]
    });
            
    map.addControl(new OpenLayers.Control.LayerSwitcher());
            
    gmap_hybrid = new OpenLayers.Layer.Google(
        "Google Hybrid", // the default
        {
            type: google.maps.MapTypeId.HYBRID, 
            numZoomLevels: 20
        });
            
    gmap_terrain = new OpenLayers.Layer.Google(
        "Google Terrain", // the default
        {
            type: google.maps.MapTypeId.TERRAIN, 
            numZoomLevels: 20
        });
            
    gmap_streets = new OpenLayers.Layer.Google(
        "Google Streets", // the default
        {
            numZoomLevels: 20
        });
            
    //LAYER REGIONI
    regioni = new OpenLayers.Layer.WMS(
        "regioni",
        url,
        {
            layers: 'mmasgis:reg2011_g', 
            transparent: "true", 
            format: 'image/png'
        },{
            opacity: opacity, 
            isBaseLayer: false
        });
    
    //LAYER PROVINCE
    province = new OpenLayers.Layer.WMS(
        "province",
        url,
        {
            layers: 'mmasgis:prov2011_g', 
            transparent: "true", 
            format: 'image/png'
        },{
            opacity: 0.5, 
            isBaseLayer: false
        });
    
    //LAYER COMUNI
    comuni = new OpenLayers.Layer.WMS(
        "comuni",
        url,
        {
            layers: 'mmasgis:com2011_g', 
            transparent: "true", 
            format: 'image/png'
        },{
            opacity: 0.5, 
            isBaseLayer: false
    });
    
    //LAYER CAP
    cap = new OpenLayers.Layer.WMS(
        "CAP",
        url,
        {
            layers: 'mmasgis:CapCR2006', 
            transparent: "true", 
            format: 'image/png'
        },{
            opacity: 0.3, 
            isBaseLayer: false
     });
    //temporary layer
  /*  var report = function(e) {
        OpenLayers.Console.log(e.type, e.feature.id);
    };
    
    var highlightCtrl = new OpenLayers.Control.SelectFeature(vectors, {
        hover: true,
        highlightOnly: true,
        renderIntent: "temporary",
        eventListeners: {
            beforefeaturehighlighted: report,
            featurehighlighted: report,
            featureunhighlighted: report
        }
    });

    var selectCtrl = new OpenLayers.Control.SelectFeature(vectors,
        {clickout: true}
    );

    map.addControl(highlightCtrl);
    map.addControl(selectCtrl);

    highlightCtrl.activate();
    selectCtrl.activate();*/
    //LAYER VETTORIALE IN OVERLAY PER LA SELEZIONE E86F38
    var mySelStyleProp = {
            strokeColor: '#ffffff',
            fillColor  : '#f2960f',
            //fillColor  : '#3FF87F',
            fillOpacity: 0.2,
            strokeWidth: 0.7,
            cursor: 'crosshair'
               
    };
    select = new OpenLayers.Layer.Vector("Selezioni", {
        //styleMap: 
        //new OpenLayers.Style(mySelStyleProp,OpenLayers.Feature.Vector.style["select"]),
        styleMap: 
        new OpenLayers.Style(mySelStyleProp,OpenLayers.Feature.Vector.style["temporary"])
            
    });

    //AGGIUNGO LAYER ALLA MAPPA
    map.addLayers([gmap_streets, gmap_hybrid,  gmap_terrain, regioni, province, comuni, cap, select]);
 // Define three colors that will be used to style the cluster features
 // depending on the number of features they contain.
 
    

 


    //LAYER MANAGEMENT
					
    //LAYER MANAGEMENT AT DIFFERENT ZOOM LEVELS
			
    /*
			
			map.events.register('zoomend', this, function (event) {
				
				var zLevel = map.getZoom();  
				
        		if( zLevel <= 6 ){	
					map.addLayer(regioni);
					//map.setBaseLayer(regioni);
					selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(regioni);
					//info.layers = [regioni];
					map.removeLayer(province);
					map.removeLayer(comuni);
					map.removeLayer(cap);
        		}

        		if( zLevel > 6 && zLevel <=8 ){
					map.addLayer(province);
					//map.setBaseLayer(province);
					selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(province);
					//info.layers = [province];
					map.removeLayer(comuni);
					map.removeLayer(regioni);
					map.removeLayer(cap);
        		}

				if( zLevel > 8 && zLevel <=11){
					map.addLayer(comuni);
					//map.setBaseLayer(comuni);
					selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(comuni);
					//info.layers = [comuni];
					map.removeLayer(regioni);
					map.removeLayer(province);
					map.removeLayer(cap);
					
        		}

				if( zLevel > 9 ){
					map.addLayer(cap);
					//map.setBaseLayer(cap);
					selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(cap);
					//info.layers = [cap];
					map.removeLayer(regioni);
					map.removeLayer(province);	
					map.removeLayer(comuni);			
				}
				
		
			});
			 
			*/
			
    //CONTROLLO PER PAN E DRAG SULLA MAPPA
    dragpan = new OpenLayers.Control.DragPan();
    map.addControl(dragpan);

    //
    selectionControl = new OpenLayers.Control.GetFeature({
        protocol: OpenLayers.Protocol.WFS.fromWMSLayer(regioni),
        box: true,
        toggle: true,
        //multipleKey: "shiftKey",
        toggleKey: "ctrlKey"
    });
            
    //REGISTRO EVENTI PER SELEZIONARE CON CLICK IN E DESELEZIONARE CON CLICK OUT
    selectionControl.events.register("featureselected", this, function(e) {
        select.addFeatures([e.feature]);
        addFeaturesToGrid(e.feature);                
    });
    selectionControl.events.register("featureunselected", this, function(e) {
        removeFeaturesFromGrid(e.feature.fid);
        select.removeFeatures([e.feature]);
    //console.debug(e.feature);
                
    });
            
    map.addControl(selectionControl);
    selectionControl.activate();
            
    //CENTRO LA MAPPA
    //map.setCenter(new OpenLayers.Bounds(65.444336,32.115234,-44.438477,50.580078).getCenterLonLat(), 6);
    proj = new OpenLayers.Projection("EPSG:4326");
    point = new OpenLayers.LonLat(12, 42);
    map.setCenter(point.transform(proj, map.getProjectionObject()), 6);
    Ext.getCmp('select_button').toggle(true);
    Ext.getCmp('reg_button').toggle(true);
}); // eo function onReady


//ricerca sull'albero
function doSearch() {
    var layer = null;
										    		
    if (Ext.getCmp('radio1').getValue())
        layer = Ext.getCmp('radio1').inputValue;
    if (Ext.getCmp('radio2').getValue())
        layer = Ext.getCmp('radio2').inputValue;
    if (Ext.getCmp('radio3').getValue())
        layer = Ext.getCmp('radio3').inputValue;
									    			
    if(Ext.getCmp('fieldCerca').getValue()!="") {
        getFid(layer, Ext.getCmp('fieldCerca').getValue());
        Ext.getCmp('tree').getView().focus();
    }
    else {
        Ext.Msg.alert('Attenzione', 'Riempire la casella di testo!');
    }
}


//trova sequenza di fid corrispondenti alla gerarchia dei nodi dell'albero
function getFid(layer, nome) {
					
    var cdata = null;
					
    Ext.Ajax.request({
        waitMsg: 'wait...',
        url: 'http://' + constants.ip + constants.root + constants.servlet,
        params: {
            layer: layer,
            nome: nome,
            task: 'getFid'
        },
        success: function(response){
							
        },
        callback: function(opt,success,respon) {
							
            cdata = Ext.JSON.decode(respon.responseText);							
            //var treepanel = Ext.getCmp('tree');
            //console.debug(cdata[0]);
            if (cdata[0]=="empty") {
                alert("nessun risultato");
            }
            else {
                var idx = cdata.length-1;
		
                //trovo primo nodo
                var n1 = Ext.getCmp('tree').getRootNode().findChild("id",cdata[idx], true);
                //console.debug(n1);
								
                idx--;
								
                //chiamo funzione ricorsiva che trova ed espande gli altri e seleziona l'ultimo sull'albero
                surfTree(n1, cdata, idx);	
            }
        }
    });
					
}
				
		
//scorre la gerarchia di fid, espande i nodi ed evidenzia sull'albero l'ultimo(ovvero quello cercato)
function surfTree(node, cdata, idx) {
								
								
    //espando il nodo passato come parametro
    node.expand(false, function() {
        //quando ha caricato i figli, cerco il nodo successivo contenuto nell'array cdata
        var n2 = node.findChild("id", cdata[idx], true);
									
        idx--;
        //procedo con il prossimo nodo se ce ne sono
        if(idx>-1)	
            surfTree(n2, cdata, idx);
        //altrimenti se l'array ?? stato scorso tutto, evidenzio l'ultimo nodo trovato
        else {
            setTimeout(function() {
                Ext.getCmp('tree').getSelectionModel().select(n2)
                }, 1000);
        //Ext.getCmp('tree').getSelectionModel().select(n2);
										
        }
    });
}
		
		
//recupera dal db la sigla del nodo
function getSigla(codice, tipo, nome, fid) {
    var cdata = '';
			
    //console.debug(tipo);
			
    Ext.Ajax.request({
        waitMsg: 'wait...',
        url: 'http://' + constants.ip + constants.root + constants.servlet,
        params: {
            task: 'getSigla',
            layer: tipo,
            fid: codice
        },
        success: function(response){
            cdata = Ext.JSON.decode(response.responseText);
        //console.debug(cdata.sigla);
        },
        callback: function(opt,success,respon) {
            //console.debug(response.responseText);
            //var cdata = Ext.JSON.decode(response.responseText);
            //console.debug(cdata.sigla);
            var data = new Array(nome, tipo.substring(0,3), fid, cdata.sigla);
            myData.push(data);
            //console.debug(myData);
            Ext.getCmp('gridSel').getStore().loadData(myData, false);
        }
    });
			
}
		
		
//
function getNodes(codice, layer) {
						
						
    //SELEZIONE FEATURE
    var cod = parseInt(codice)+1;
    var fid = null;
    var type = null;
						
    //console.debug(codice);
						
    switch(layer) {
        case "regione":
            fid = "reg2011_g."+cod;
            type="reg2011_g";
            break;
        case "provincia":
            fid = "prov2011_g."+cod;
            type="prov2011_g";
            break;
        case "comune":
            fid = "com2011_g."+cod;
            type="com2011_g";
            break;
        case "Cap":
            fid = "CapCR2006."+cod;
            type="CapCR2006";
            break;
    }
						
    //console.debug("richiedo codice: "+ fid);
						
    var request = OpenLayers.Request.GET({
        url: url,
        callback: handler,
        params: {
            REQUEST: "GetFeature",
            srsName: "EPSG:900913",
            SERVICE: "WFS",
            VERSION: "1.1.0",
            TYPENAME: "mmasgis:"+type,
            featureID: fid
        }   
    });
						
}
	
//aggiunge feature all'elenco di quelle selezionate
function addFeaturesToGrid(feature) {
			
			
    var nome = null;
    var fid = feature.fid;
    var type = fid.split(".");
			
    switch(type[0]) {
				
        case "reg2011_g":
            tipo = "regione";
            nome = feature.data.NOME_REG;
            sigla = getSigla(parseInt(type[1])-1,tipo,nome,fid);
            break;
        case "prov2011_g":
            tipo = "provincia";
            nome = feature.data.NOME_PRO;
            sigla = getSigla(parseInt(type[1])-1,tipo,nome,fid);
            break;
        case "com2011_g":
            tipo = "comune";
            nome = feature.data.NOME_COM;
            sigla = getSigla(parseInt(type[1])+1,tipo,nome,fid);
            break;
        case "CapCR2006":
            tipo = "Cap";
            nome = feature.data.nome;
            sigla = getSigla(parseInt(type[1])-1,tipo,nome,fid);
            break;
    }
			
			
}
		
		
/*
		function getSigla(codice, tipo, nome, fid) {
			var cdata = '';
			
			Ext.Ajax.request({
				waitMsg: 'wait...',
				url: 'get-nodes.jsp',
				params: {
					task: 'sigla',
					layer: tipo,
					fid: codice
				},
				success: function(response){
						cdata = Ext.JSON.decode(response.responseText);
						//console.debug(cdata.sigla);
				},
				callback: function(opt,success,respon) {
					//console.debug(response.responseText);
					//var cdata = Ext.JSON.decode(response.responseText);
					//console.debug(cdata.sigla);
					var data = new Array(nome, tipo.substring(0,3), fid, cdata.sigla);
					myData.push(data);
					//console.debug(myData);
					Ext.getCmp('gridSel').getStore().loadData(myData, false);
				}
			})
			
			
		}
		
		*/
		
//rimuove dall'elenco la feature passata come argomento, altrimenti rimuove tutto 
function removeFeaturesFromGrid(featureFid) {
			
    if (featureFid == null) {
        myData =[];
    }
    else {
        //scorro array e tolgo quella giusta
        for(n in myData) {
            var s = myData[n];
            if(s[2] == featureFid) {
                var e = myData.splice(n,1);
            //console.debug("rimosso elemento: " + e);
            }
        }
    }
    Ext.getCmp('gridSel').getStore().loadData(myData, false);
			
}
		
		
		
		
//funzioni
function showRegioni(){
    selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(regioni);
    Ext.getCmp('reg_button').toggle(true);
    Ext.getCmp('prov_button').toggle(false);
    Ext.getCmp('com_button').toggle(false);
    Ext.getCmp('cap_button').toggle(false);
}
		
function showProvince(){
    selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(province);
    Ext.getCmp('prov_button').toggle(true);
    Ext.getCmp('reg_button').toggle(false);
    Ext.getCmp('com_button').toggle(false);
    Ext.getCmp('cap_button').toggle(false);
}
		
function showComuni(){
    selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(comuni);
    Ext.getCmp('com_button').toggle(true);
    Ext.getCmp('prov_button').toggle(false);
    Ext.getCmp('reg_button').toggle(false);
    Ext.getCmp('cap_button').toggle(false);
}
		
function showCap(){
    selectionControl.protocol = OpenLayers.Protocol.WFS.fromWMSLayer(cap);
    Ext.getCmp('cap_button').toggle(true);
    Ext.getCmp('prov_button').toggle(false);
    Ext.getCmp('com_button').toggle(false);
    Ext.getCmp('reg_button').toggle(false);
}
		
		
function handler(request) {

    var gml = new OpenLayers.Format.GML.v3();
    gml.extractAttributes = true;
    var features = gml.read(request.responseText);
			
    //console.debug(select.features);
			
    if(contains(select.features, features[0]) == false){
        select.addFeatures(features[0]);
        addFeaturesToGrid(features[0]);
    }
    if(hash_contains(selectionControl.features, features[0]) == false){
        selectionControl.features[features[0].fid] = features[0];
    }
}
	    
function contains(a, feature) {	
    for(var i = 0; i < a.length; i++) {
        if (a[i].fid == feature.fid) {
            return true;
        }
    }
    return false;
}
		
function hash_contains(a, feature) {
    for(i in a) {
        if (i == feature.fid) {
            return true;
        }
    }
    return false;
}
	    
//DESELEZIONA TUTTO
function unselectFeatures() {
    selectionControl.unselectAll();
    myData =[];
    Ext.getCmp('gridSel').getStore().loadData(myData, false);
}
		
function unselectSingleFeature(fid) {
    var feature = selectionControl.features[fid];
    selectionControl.unselect(feature);
}
        
//ATTIVA FUNZIONI DI DRAG E PAN SULLA MAPPA
function panButtonClicked() {
    Ext.getCmp('sposta_button').toggle(true);
    Ext.getCmp('select_button').toggle(false);
    dragpan.activate(); 
    selectionControl.deactivate(); 
};
		
//ATTIVA SELEZIONE SULLA MAPPA
function selectButtonClicked() {
    Ext.getCmp('sposta_button').toggle(false);
    Ext.getCmp('select_button').toggle(true);
    selectionControl.activate(); 
    dragpan.deactivate(); 
};
		
function logout() {
    if (confirm('Vuoi veramente effettuare il logout?'))
        window.location.href = "MmasgisServlet?task=logout";
};	
		
//INVIA SELEZIONI AL DATABASE TRAMITE GET
function showFeatures(database){
	
    var f = document.getElementById('showFeatures');
    r=0;
			
    for(feature in selectionControl.features) {
        r++;
        feature_id = selectionControl.features[feature].fid;
        fid = feature_id.split(".");
				
        if(fid[0] == "reg2011_g") {
            f.reg.value = f.reg.value + selectionControl.features[feature].attributes['COD_REG'] + ",";
        } else if (fid[0] == "prov2011_g") {
            f.pro.value = f.pro.value + selectionControl.features[feature].attributes['COD_PRO'] + ",";
        } else if (fid[0] == "com2011_g") {
            f.com.value = f.com.value + selectionControl.features[feature].attributes['PRO_COM'] + ",";
        } else if (fid[0] == "CapCR2006") {
            f.cap.value = f.cap.value + selectionControl.features[feature].attributes['nome'] + ",";
        }
    }
			
    if(r>0) {
        f.reg.value = f.reg.value.substring(0, f.reg.value.length-1);
        f.pro.value = f.pro.value.substring(0, f.pro.value.length-1);
        f.com.value = f.com.value.substring(0, f.com.value.length-1);
        f.cap.value = f.cap.value.substring(0, f.cap.value.length-1);
				
        //console.debug(f.reg.value);
        //console.debug(f.pro.value);
        //console.debug(f.com.value);
        //console.debug(f.cap.value);
		f.custom.value = custom;		
        f.dbname.value = database;
        //win = window.open('','new_tab');
        //console.log("window opened!");
        f.submit();
        windows.focus();
        
        f.reg.value = "";
        f.pro.value = "";
        f.com.value = "";
        f.cap.value = "";
        
    }
    else {
        alert('nessun elemento selezionato');
    }
			
			
			
			
			
			
/*
			parameters = "";
			r=0;
			for(feature in selectionControl.features){
				r++;
				feature_id = selectionControl.features[feature].fid;
				fid = feature_id.split(".");
				if(fid[0] == "prov2011_g"){
					parameters = parameters + "province," + selectionControl.features[feature].attributes['COD_PRO'].replace(/\'/g, "`");
				}else if(fid[0] == "reg2011_g"){
					parameters = parameters + "regione," + selectionControl.features[feature].attributes['COD_REG'].replace(/\'/g, "`");
				}else if(fid[0] == "com2011_g"){
					parameters = parameters + "comune," + selectionControl.features[feature].attributes['PRO_COM'].replace(/\'/g, "`");
				}else if(fid[0] == "CapCR2006"){
					parameters = parameters + "cap," + selectionControl.features[feature].attributes['nome'].replace(/\'/g, "`");
				}
				parameters = parameters + "|";

				
			}
			if (r>0) {
				//rimuovo ultimo pipe |
				parameters = parameters.substring(0, parameters.length-1);
				//console.debug(parameters);
				var f = document.getElementById('showFeatures');
				f.selections.value = parameters;
				f.dbname.value = database;
				window.open('','new_tab');
				//console.log("window opened!");
				f.submit();

				//window.open(selectionString);
				//window.location.href = selectionString;	
			}
			else {
				alert('nessun elemento selezionato');
			}
			
			*/
			
};

 
// eof

