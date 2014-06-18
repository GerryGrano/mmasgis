var tree, selected, map, toolbar, regioni, province, comuni, cap, select, selectionControl, dragpan, labels, panel, r, myfeature, selectFeature;
var scenario, zone, panelZA, scenarioAp, zoneSel, answ;
var url = "http://" + constants.ip + "geoserver/mmasgis/wms";
var opacity = 1;
//array contente [NOME_TERRITORIO,LAYER,FID_GEOSERVER,ZONA_ID,COLORE]
var myDataScenario = [];
//array per la popolazione dello store di box
var myDataBox = [];
//array del tipo {zona_id,nome;colore...id_agente?}
var ZonaSelezionata = [];
var ZonaFrammentata = [];
// Titolo del box territori selezionati
var TitoloBox = null;
//flag per ottimizzare la deselezione
var deseleziona_tutto = 0;
console.log(zona_id);
var prova = Ext.JSON.decode(territori_sele);
console.log(prova);
console.log(admin_azienda);





// oggetto colore da aggiungere alla feature prima di visualizzarla nella mappa
var stileColore = {
    strokeColor: '#ffffff',
    //fillColor: '#' + ZonaSelezionata[2],
    fillColor: '#3FF87F',
    fillOpacity: 0.65,
    strokeWidth: 0.7,
    cursor: 'crosshair'
};

var stileColoreTemp = "#3FF87F";

var myData = [];
var f;

Ext.BLANK_IMAGE_URL = './extjs/resources/themes/images/default/tree/s.gif';

/**
 * APPLICATION MAIN ENTRY POINT
 */
Ext.onReady(function () {

    Ext.QuickTips.init();

    /**
     * PANEL CONTENITORE DI ALBERO E GRID, LAYOUT VBOX PER DISPOSIZIONE VERTICALE
     */
    var rightPanel = new Ext.Panel({
        layout: {
            type: 'vbox'
        },
        //layout : 'column',
        region: 'west',
        width: 250,
        //resizable: true,
        // height: 650,
        // collapsible: true,
        items: [tree, selected]

    });

    /**
     * PANEL ZONE ANALYSIS, LAYOUT VBOX PER DISPOSIZIONE VERTICALE
     */
    var leftPanel = new Ext.Panel({
        id: 'zone_analysis_panel',
        layout: {
            type: 'vbox'
        },
        //layout : 'column',
        region: 'east',
        width: 250,
        //resizable: true,
        // height: 650,
        // collapsible: true,
        // items : [scenario, zone],
        hidden: true
    });

    /**
     * PANEL CONTENITORE "PADRE": CONTIENE MAPPA, PANEL DESTRO (SINISTRO) CON ALBERO E GRID E PANEL SINISTRO (DESTRO) PER ZONE ANALYSIS
     */
    var viewport = new Ext.Viewport({
        title: 'MMASGIS',
        id: 'simplestbl',
        layout: 'border',
        listeners: {
            afterrender: function (component, eOpts) {
                checkAuth('map');
            }
        },
        renderTo: Ext.getBody(),
        items: [{
                id : 'mapDiv',
                region: 'center',
                layout: 'fit',
                frame: true,
                border: false,
                html: '<div id="map" class="smallmap" ></div>'
            }, {
                region: 'north',
                tbar: toolbar,
                layout: 'fit',
                frame: true,
                border: false
            },
            rightPanel
        ]
    });

    var panZoom = new OpenLayers.Control.PanZoom();

    panZoom.onButtonClick = function (evt) {

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
            proj = new OpenLayers.Projection("EPSG:4326");
            point = new OpenLayers.LonLat(12, 42);
            map.setCenter(point.transform(proj, map.getProjectionObject()), 6);
            break;
        }
    };

    // MAPPA
    map = new OpenLayers.Map('map', {
        div: "map",
        projection: "EPSG:900913",
        displayProjection: "EPSG:4326",
        controls: [panZoom, new OpenLayers.Control.Navigation()]
    });

    map.addControl(new OpenLayers.Control.LayerSwitcher());

    gmap_hybrid = new OpenLayers.Layer.Google("Google Hybrid", {
        type: google.maps.MapTypeId.HYBRID,
        numZoomLevels: 20
    });

    gmap_terrain = new OpenLayers.Layer.Google("Google Terrain", {
        type: google.maps.MapTypeId.TERRAIN,
        numZoomLevels: 20
    });

    gmap_streets = new OpenLayers.Layer.Google("Google Streets", {
        numZoomLevels: 20
    });

    // LAYER REGIONI
    regioni = new OpenLayers.Layer.WMS("regioni", url, {
        layers: 'mmasgis:reg2011_g',
        transparent: "true",
        format: 'image/png'
    }, {
        opacity: opacity,
        isBaseLayer: false
    });

    // LAYER PROVINCE
    province = new OpenLayers.Layer.WMS("province", url, {
        layers: 'mmasgis:prov2011_g',
        transparent: "true",
        format: 'image/png'
    }, {
        opacity: 0.5,
        isBaseLayer: false
    });

    // LAYER COMUNI
    comuni = new OpenLayers.Layer.WMS("comuni", url, {
        layers: 'mmasgis:com2011_g',
        transparent: "true",
        format: 'image/png'
    }, {
        opacity: 0.5,
        isBaseLayer: false
    });

    // LAYER CAP
    cap = new OpenLayers.Layer.WMS("CAP", url, {
        layers: 'mmasgis:CapCR2006',
        transparent: "true",
        format: 'image/png'
    }, {
        opacity: 0.3,
        isBaseLayer: false
    });

    // LAYER VETTORIALE IN OVERLAY PER LA SELEZIONE E86F38
    var mySelStyleProp = {
        strokeColor: '#ffffff',
        fillColor: '#3FF87F',
        // fillColor : '#3FF87F',
        fillOpacity: 0.2,
        strokeWidth: 0.7,
        cursor: 'crosshair'

    };
    select = new OpenLayers.Layer.Vector("Selezioni", {
        // styleMap:
        // new
        // OpenLayers.Style(mySelStyleProp,OpenLayers.Feature.Vector.style["select"]),
        styleMap: new OpenLayers.Style(mySelStyleProp, OpenLayers.Feature.Vector.style["temporary"])

    });

    // AGGIUNGO LAYER ALLA MAPPA
    map.addLayers([gmap_streets, gmap_hybrid, gmap_terrain, regioni, province, comuni, cap, select]);

    // CONTROLLO PER PAN E DRAG SULLA MAPPA
    dragpan = new OpenLayers.Control.DragPan();
    map.addControl(dragpan);

    // Gestorie delle selzioni
    selectionControl = new OpenLayers.Control.GetFeature({
        protocol: OpenLayers.Protocol.WFS.fromWMSLayer(regioni),
        box: true,
        toggle: true,
        clickout: false,

        // multipleKey: "shiftKey",
        toggleKey: "ctrlKey"
    });

    // REGISTRO EVENTI PER SELEZIONARE CON CLICK IN E DESELEZIONARE CON
    // CLICK OUT
    //GESTIONE FRAMMENTAZIONE
    selectionControl.events.register("featureselected", this, featureselectedFunction);


    selectionControl.events.register("featureunselected", this, function (e) {

    	//rimuove il territorio dalla struttura "ITALIA"
    	removeToTree(e.feature);
    	//rimuovi feature solo dalla mappa
    	select.removeFeatures([e.feature]);
    	/**ottimizzaione:
    	 *se ho cliccato il pulsante "deselect all"
    	 *non ce bisogno di rimuovere la singola feture
    	 **/
    	if (deseleziona_tutto == 0)
    		removeFeaturesFromGrid(e.feature.fid);


    	//Soluzione BUG IE11
    	if ((navigator.userAgent).indexOf("Trident/7.0")> -1 && (navigator.userAgent).indexOf("like Gecko")> -1){
    		selectButtonClicked();
    		if (selectionControl.protocol.featureType=="reg2011_g")
    			showRegioni();
    		if (selectionControl.protocol.featureType=="prov2011_g")
    			showProvince();
    		if (selectionControl.protocol.featureType=="com2011_g")
    			showComuni();
    		if (selectionControl.protocol.featureType=="CapCR2006")
    			showCap();
    	}

    });

    map.addControl(selectionControl);
    selectionControl.activate();
    proj = new OpenLayers.Projection("EPSG:4326");
    point = new OpenLayers.LonLat(12, 42);
    map.setCenter(point.transform(proj, map.getProjectionObject()), 6);
    Ext.getCmp('select_button').toggle(true);
    Ext.getCmp('reg_button').toggle(true);
}); // eo function onReady



/**
 * recupera dal db la sigla del nodo
 * @param codice
 * @param tipo
 * @param nome
 * @param fid
 */
function getSigla(codice, tipo, nome, fid) {

    var cdata = '';

    // console.debug(tipo);

    Ext.Ajax.request({
        waitMsg: 'wait...',
        url: 'http://' + constants.ip + constants.root + constants.servlet,
        params: {
            task: 'getSigla',
            layer: tipo,
            fid: codice
        },
        success: function (response) {

            cdata = Ext.JSON.decode(response.responseText);
            // console.debug(cdata.sigla);
        },
        callback: function (opt, success, respon) {

            // console.debug(response.responseText);
            // var cdata = Ext.JSON.decode(response.responseText);
            // console.debug(cdata.sigla);
            var data = new Array(nome, tipo.substring(0, 3), fid, cdata.sigla);
            myData.push(data);
            //console.debug(myData);
            Ext.getCmp('gridSel').getStore().loadData(myData, false);
        }
    });

}

/**
 * INPUT
 * 		nome layer "regione/i"
 * 		codice della tabella tree quindi fid di openlayer -1
 * @param
 */

function fromNomiToFid(paramNome, codice) {

    var nome = paramNome.substring(0, 3);
    var fid = null;

    switch (nome) {

    case "reg":
        fid = "reg2011_g";
        break;
    case "pro":
        fid = "prov2011_g";
        break;
    case "com":
        fid = "com2011_g";
        break;
    case "Cap":
        fid = "CapCR2006";
        break;
    }

    fid = fid.concat("." + (parseInt(codice) + 1));
    return fid;

}

/**
 * INPUT fid "reg2011_g.17" OUTPUT "regioni"
 *
 * @param
 */

function fromFidToNomi(fid) {

    var type = fid.split(".");
    var layer = type[0];

    var output = {
        tipo: "",
        tabella: ""
    };

    switch (layer) {

    case "reg2011_g":
        output.tipo = "regione";
        output.tabella = "regioni";
        break;
    case "prov2011_g":
        output.tipo = "provincia";
        output.tabella = "province";
        break;
    case "com2011_g":
        output.tipo = "comune";
        output.tabella = "comuni";
        break;
    case "CapCR2006":
        output.tipo = "Cap";
        output.tabella = "Cap";
        break;
    }

    return output;

}

/**
 * aggiunge feature gia aggiunta alla box nella mappa
 * scope: parametro passato al visualizzaZone(per explorer)
 * @param feature
 */

function addFeaturesToMap(fid) {

    var layer = fid.split(".");

    var request = OpenLayers.Request.GET({
        url: url,
        scope: ZonaSelezionata[2],
        callback: visualizzaZone,
        params: {
            REQUEST: "GetFeature",
            srsName: "EPSG:900913",
            SERVICE: "WFS",
            VERSION: "1.1.0",
            TYPENAME: "mmasgis:" + layer[0],
            featureID: fid
        }
    });


}

/**
 *
 * aggiunge la feature a myDataScenario
 * @param feature
 */

//devo construire un record da aggiungere a myDataScenario e myDataBox(box zona)
function addFeaturesToGrid(feature) {

    var cdata = '';
    //suddivido il fid
    var fid = feature.fid;
    var type = fid.split(".");
    var tipo = null;
    var cod = parseInt(type[1]);

    var tabella = null;
    switch (type[0]) {

    case "reg2011_g":
        tipo = "regioni";
        nome = feature.data.NOME_REG;
        break;
    case "prov2011_g":
        tipo = "province";
        nome = feature.data.NOME_PRO;
        break;
    case "com2011_g":
        tipo = "comuni";
        nome = feature.data.NOME_COM;
        break;
    case "CapCR2006":
        tipo = "Cap";
        nome = feature.data.nome;
        break;
    }


    // 	COLORE | NOME ZONA | NOME_TERRITORIO | SIGLA | TERR_ID(FID) | LAYER | ZONA_ID
    var data = {
        colore: ZonaSelezionata[2],
        nome: ZonaSelezionata[1],
        nome_territorio: nome,
        sigla: "",
        tabella_territorio: tipo,
        tc_territorio_id: "" + cod,
        zona_id: ZonaSelezionata[0]
    };
    myDataBox.push(data);
    myDataScenario.push(data);
    myDataScenario.sort(orderByNomeZona);
    Ext.getCmp('gridSel').getStore().loadData(myDataBox, false);

}


//devo construire un record da aggiungere a myDataScenario e NON a  myDataBox(box zona)
function addFeaturesToGridDisgregata(feature) {

    var cdata = '';
    //suddivido il fid
    var fid = feature.fid;
    var type = fid.split(".");
    var tipo = null;
    var cod = parseInt(type[1]);

    var tabella = null;
    switch (type[0]) {

    case "reg2011_g":
        tipo = "regioni";
        nome = feature.data.NOME_REG;
        break;
    case "prov2011_g":
        tipo = "province";
        nome = feature.data.NOME_PRO;
        break;
    case "com2011_g":
        tipo = "comuni";
        nome = feature.data.NOME_COM;
        break;
    case "CapCR2006":
        tipo = "Cap";
        nome = feature.data.nome;
        break;
    }


    // 	COLORE | NOME ZONA | NOME_TERRITORIO | SIGLA | TERR_ID(FID) | LAYER | ZONA_ID
    var data = {
        colore: ZonaFrammentata[2],
        nome: ZonaFrammentata[1],
        nome_territorio: nome,
        sigla: "",
        tabella_territorio: tipo,
        tc_territorio_id: "" + cod,
        zona_id: ZonaFrammentata[0]
    };
    myDataScenario.push(data);
    myDataScenario.sort(orderByNomeZona);
}


function removeFeaturesFromGrid(featureFid) {

    var fid = featureFid.split(".");
    var layer = fid[0];
    var cod = fid[1];
    var trovato = false;
    var e = null;

    //elimino da scenario
    for (n in myDataScenario) {
        var record = myDataScenario[n];
        if (record.tc_territorio_id == cod && record.tabella_territorio.substring(0, 3) == layer.substring(0, 3)) {
            e = myDataScenario.splice(n, 1);
            //console.log("eliminato dallo scenario: ");
            //console.log(e);
            break;
        }
    }

    //se e = null allore esci dalla funzione
    if (e == null)
        return;

    //se il territorio fa parte della zona selezionata la elimino dal box
    if (e[0].zona_id == ZonaSelezionata[0]) {

        //per ogni elemento della zona
        for (n in myDataBox) {
            var record = myDataBox[n];
            if (record.tc_territorio_id == cod && record.tabella_territorio.substring(0, 3) == layer.substring(0, 3)) {
                e = myDataBox.splice(n, 1);
                //console.log("myDataBox eliminato: ");
                //console.log(e);
                break;
            }
        }
        Ext.getCmp('gridSel').getStore().loadData(myDataBox, false);

    }

}


/**
 * INVIA SELEZIONI AL DATABASE TRAMITE GET
 * @param database
 * @param custom
 */
function showFeatures(database, custom) {
    var f = document.getElementById('showFeatures'); 
    r = 0;

    for (feature in myDataBox){
    	r++;
    	var type = myDataBox[feature].tabella_territorio;
    	var id = myDataBox[feature].tc_territorio_id;
    	
    	if (type.substring(0,3).toLowerCase() == "reg") {
    		f.reg.value = f.reg.value + id + ",";
    	}
    	if (type.substring(0,3).toLowerCase() == "pro") {
    		f.pro.value = f.pro.value + id + ",";
    	}
    	if (type.substring(0,3).toLowerCase() == "com") {
    		f.com.value = f.com.value + id + ",";
    	}
    	if (type.substring(0,3).toLowerCase() == "cap") {
    		f.cap.value = f.cap.value + id + ",";
    	}
 	
    }
    
    if (r > 0) {
        f.reg.value = f.reg.value.substring(0, f.reg.value.length - 1);
        f.pro.value = f.pro.value.substring(0, f.pro.value.length - 1);
        f.com.value = f.com.value.substring(0, f.com.value.length - 1);
        f.cap.value = f.cap.value.substring(0, f.cap.value.length - 1);

        f.custom.value = custom;
        f.dbname.value = database;
        //f.customer.value = customer;
        f.id_offerta.value = id_offerta;
        f.id_vetrina.value = id_vetrina;
        if (id_offerta == "" && id_vetrina == "") {
            win = window.open('', 'new_tab');

            f.submit();
            win.focus();
        } else {
            f.submit();
        }

        f.reg.value = "";
        f.pro.value = "";
        f.com.value = "";
        f.cap.value = "";

    } else {
        alert('nessun elemento selezionato');
    }

};


/**
 * DESELEZIONA Zona dalla mappe e ricarica box
 */
function unselectFeaturesByZone(NomeZona) {
	console.log("unselectFeaturesByZone");
	console.log(NomeZona);

    var fid;
    //scorro tutto lo scenario
    var i;
    for (i = 0; i < myDataScenario.length && myDataScenario[i]["nome"] <= NomeZona; i++) {
        if (myDataScenario[i]["nome"] == NomeZona) {
            //construisco fid ed elimino dalla mappa
            fid = fromNomiToFid(myDataScenario[i].tabella_territorio, myDataScenario[i].tc_territorio_id - 1);
            unselectSingleFeature(fid);
            //perche ho appena eliminato un elemento dall'array
            //e quindi la i seleziona il prossimo se no la decremento
            i--;
        }
    }

}


/**
 * Inserisce la feature nel Tree Italia
 **/
function addToTree(feature) {
    var fid_code = feature.fid;
    tipo = fid_code.substring(0, 3);

    switch (tipo) {
    case "reg":
        var param = {
            cod_reg: feature.data.COD_REG,
            nome: feature.data.NOME_REG,
            presente: "true",
            fid: fid_code
        };
        return italia.addRegioneByKeyValue(feature.data.COD_REG, param);
        break;
    case "pro":
        var param = {
            cod_reg: feature.data.COD_REG,
            cod_pro: feature.data.COD_PRO,
            nome: feature.data.NOME_PRO,
            presente: "true",
            fid: fid_code
        };
        return italia.addProvinciaByKeyValue(feature.data.COD_PRO, param);
        break;
    case "com":
        var param = {
            cod_reg: feature.data.COD_REG,
            cod_pro: feature.data.COD_PRO,
            cod_com: feature.data.PRO_COM,
            nome: feature.data.NOME_COM,
            presente: "true",
            fid: fid_code
        };
        return italia.addComuneByKeyValue(feature.data.PRO_COM, param);
        break;
    case "Cap":
        var param = {
            cod_reg: feature.data.COD_REG,
            cod_pro: feature.data.COD_PRO,
            cod_com: feature.data.PRO_COM,
            cod_cap: feature.data.nome,
            nome: feature.data.nome1,
            fid: fid_code
        };
        return italia.addCapByKeyValue(feature.data.nome, param);
        break;
    }
}


// /**
// * Rimuove la feature nel Tree Italia
// **/
function removeToTree(feature) {
    var fid = feature.fid;
    tipo = fid.substring(0, 3);
    switch (tipo) {
    case "reg":
        italia.removeRegioneByKey(feature.data.COD_REG);
        break;
    case "pro":
        italia.removeProvinciaByKeyRegioneKeyProvincia(feature.data.COD_REG, feature.data.COD_PRO);
        break;
    case "com":
        italia.removeComuneByKeyRegioneKeyProvinciaKeyComune(feature.data.COD_REG, feature.data.COD_PRO, feature.data.PRO_COM);
        break;
    case "Cap":
        italia.removeCapByKeyRegioneKeyProvinciaKeyComuneKeyCap(feature.data.COD_REG, feature.data.COD_PRO, feature.data.PRO_COM, feature.data.nome);
        break;
    }
}




//controlla che la feature sia sia figlia o padre di una gia presente
//esemopio PROVINCIA DI MILANO figlia di LOMBARDIA

//tree ITALIA SONO TROPPO TOP
var italia = {
    regioni: new Ext.util.HashMap(),
    getRegioni: function () {
        return this.regioni;
    },
    getRegioneByKey: function (key) {
        return this.regioni.get(key);
    },
    addRegioneByKeyValue: function (keyReg, value) {
        //controllo se esiste
        var regione_temp = this.getRegioneByKey(keyReg);

        //se non essite la inserisco
        if (regione_temp == null) {
            regione = {
                cod_reg: keyReg,
                presente: value.presente,
                fid: value.fid,
                nome: value.nome,
                province: new Ext.util.HashMap()
                //getFigli : function(this){return this.province.}
            };
            this.regioni.add(keyReg, regione);
            //aggiunta
            return 0;
        }
        //gia presente ritorna province sottostanti per rimuoverle
        if (regione_temp.presente == "false")
            return regione_temp;
        //impossibile selezionare regione g���� presente
    },
    removeRegioneByKey: function (key) {

        var temp = this.getRegioneByKey(key);
        //se la regione non esiste
        if (temp == null)
            return;
        //se la regione ha 0 province setta come non presente
        if (temp.province.length > 0) {
            return;
        }
        //la regione non ha province la posso rimuovere
        this.regioni.removeAtKey(key)
        //return this.regioni.removeAtKey(key);
    },
    getProvinceByKeyRegione: function (key) {
        //key �� l'indice della regione
        if (this.getRegioneByKey(key) == null)
            return null;
        return this.getRegioneByKey(key).province;
    },
    getProvinciaByKeyRegioneKeyProvincia: function (keyReg, KeyPro) {
        var regione = this.getRegioneByKey(keyReg);
        if (regione != null) {
            return regione.province.get(KeyPro);
        }
        return null;
    },
    addProvinciaByKeyValue: function (keyPro, value) {

        var regione_temp = this.getRegioneByKey(value.cod_reg);
        if (regione_temp == null) {
            //se regione non presente aggiungi gerarchia senza problemi
            var param_reg = {
                cod_reg: value.cod_reg,
                nome: "",
                presente: "false",
                fid: ""
            };
            this.addRegioneByKeyValue(value.cod_reg, param_reg);
            regione_temp = this.getRegioneByKey(value.cod_reg);

        }
        //regione presente
        if (regione_temp.presente == "true")
            return regione_temp.fid;

        //presente ma non selezionata
        //aggiungo provincia
        var provincia_temp = this.getProvinciaByKeyRegioneKeyProvincia(value.cod_reg, value.cod_pro);
        if (provincia_temp != null && provincia_temp.presente == "false")
            return provincia_temp;



        var provincia = {
            cod_reg: value.cod_reg,
            cod_pro: value.cod_pro,
            presente: value.presente,
            fid: value.fid,
            nome: value.nome,
            comuni: new Ext.util.HashMap()
        };
        this.getProvinceByKeyRegione(value.cod_reg).add(keyPro, provincia);
        return 0; //padre esiste ma non selezionato..fratelli selezionati, quindi posso aggiungere
    },
    removeProvinciaByKeyRegioneKeyProvincia: function (keyReg, KeyPr) {

        var tempRegione = this.getRegioneByKey(keyReg);
        //se la regione non esiste
        if (tempRegione == null)
            return -1;

        var tempProvincia = this.getProvinciaByKeyRegioneKeyProvincia(keyReg, KeyPr);

        //se la provincia non esiste
        if (tempProvincia == null)
            return -1;


        //se numero comuni della provincia > 0 setta presente = false

        if (tempProvincia.comuni.length > 0) {
            return 0;
        }
        //provincia non ha comuni posso eliminarla
        tempRegione.province.removeAtKey(KeyPr);


        //rimuovi regione
        this.removeRegioneByKey(keyReg);

        return 1;
    },
    getComuniByKeyRegioneKeyProvicia: function (keyReg, KeyPro) {
        //keyReg  indice della regione
        //KeyPro indice provincia
        if (this.getProvinciaByKeyRegioneKeyProvincia(keyReg, KeyPro) == null)
            return null;
        return this.getProvinciaByKeyRegioneKeyProvincia(keyReg, KeyPro).comuni;
    },
    getComuneByKeyRegioneKeyProviciaKeyComune: function (keyReg, KeyPro, KeyCom) {
        //keyReg  indice della regione
        //KeyPro indice provincia
        //KeyCom indice provincia

        var comuni = this.getComuniByKeyRegioneKeyProvicia(keyReg, KeyPro);
        if (comuni == null)
            return null;
        return comuni.get(KeyCom);

    },
    addComuneByKeyValue: function (keyCom, value) {

        var regione_temp = this.getRegioneByKey(value.cod_reg);
        if (regione_temp == null) {
            //se regione non presente aggiungi gerarchia senza problemi
            var param_reg = {
                cod_reg: value.cod_reg,
                nome: "",
                presente: "false",
                fid: ""
            };
            this.addRegioneByKeyValue(value.cod_reg, param_reg);
            regione_temp = this.getRegioneByKey(value.cod_reg);
        }
        //regione presente
        if (regione_temp.presente == "true")
            return regione_temp.fid;

        var provincia_temp = this.getProvinciaByKeyRegioneKeyProvincia(value.cod_reg, value.cod_pro);
        if (provincia_temp == null) {
            //se provincia non presente aggiungi gerarchia senza problemi
            var param_pro = {
                cod_pro: value.cod_pro,
                cod_reg: value.cod_reg,
                nome: "",
                presente: "false",
                fid: ""
            };
            this.addProvinciaByKeyValue(value.cod_pro, param_pro);
            provincia_temp = this.getProvinciaByKeyRegioneKeyProvincia(value.cod_reg, value.cod_pro);
        }
        //provincia presente
        if (provincia_temp.presente == "true")
            return provincia_temp.fid;

        //controllo che non ci siano caps sotto di lui
        var comune_temp = this.getComuneByKeyRegioneKeyProviciaKeyComune(value.cod_reg, value.cod_pro, value.cod_com);
        if (comune_temp != null && comune_temp.presente == "false")
            return comune_temp;

        var param_com = {
            cod_reg: value.cod_reg,
            cod_pro: value.cod_pro,
            cod_com: value.cod_com,
            presente: value.presente,
            fid: value.fid,
            nome: value.nome,
            caps: new Ext.util.HashMap()
        };
        this.getComuniByKeyRegioneKeyProvicia(value.cod_reg, value.cod_pro).add(value.cod_com, param_com);
        return 0; //aggiunta tutto ok
    },
    removeComuneByKeyRegioneKeyProvinciaKeyComune: function (keyReg, keyPro, keyCom) {


        var tempProvincia = this.getProvinciaByKeyRegioneKeyProvincia(keyReg, keyPro);
        //se la provincia non esiste
        if (tempProvincia == null)
            return -1;


        var tempComune = this.getComuneByKeyRegioneKeyProviciaKeyComune(keyReg, keyPro, keyCom);
        //se numero comuni della provincia > 0 setta presente = false
        if (tempComune == null)
            return -1;

        if (tempComune.caps.length > 0) {
            return 0;
        }
        //comune non ha caps posso eliminarla
        tempProvincia.comuni.removeAtKey(keyCom);

        //rimuovo provincia
        this.removeProvinciaByKeyRegioneKeyProvincia(keyReg, keyPro);
        return 1;
    },
    getCapsByKeyRegioneKeyProviciaKeyComune: function (keyReg, KeyPro, keyCom) {
        //keyReg  indice della regione
        //KeyPro indice provincia
        //KeyCom indice comune
        if (this.getComuneByKeyRegioneKeyProviciaKeyComune(keyReg, KeyPro, keyCom) == null)
            return null;
        return this.getComuneByKeyRegioneKeyProviciaKeyComune(keyReg, KeyPro, keyCom).caps;
    },
    getCapByKeyRegioneKeyProviciaKeyComuneKeyCap: function (keyReg, KeyPro, keyCom, KeyCap) {
        //ritorna il comune o null
        comune = this.getComuneByKeyRegioneKeyProviciaKeyComune(keyReg, KeyPro, keyCom);
        if (comune != null) {
            return comune.caps.get(KeyCap);
        }
        return null;
    },
    addCapByKeyValue: function (KeyCap, value) {

        var regione_temp = this.getRegioneByKey(value.cod_reg);

        if (regione_temp == null) {
            //se regione non presente aggiungi gerarchia senza problemi
            var param_reg = {
                cod_reg: value.cod_reg,
                nome: "",
                presente: "false",
                fid: ""
            };
            this.addRegioneByKeyValue(value.cod_reg, param_reg);
            regione_temp = this.getRegioneByKey(value.cod_reg);
        }
        //regione presente
        if (regione_temp.presente == "true")
            return regione_temp.fid;

        var provincia_temp = this.getProvinciaByKeyRegioneKeyProvincia(value.cod_reg, value.cod_pro);
        if (provincia_temp == null) {
            //se provincia non presente aggiungi gerarchia senza problemi
            var param_pro = {
                cod_pro: value.cod_pro,
                cod_reg: value.cod_reg,
                nome: "",
                presente: "false",
                fid: ""
            };
            this.addProvinciaByKeyValue(value.cod_pro, param_pro);
            provincia_temp = this.getProvinciaByKeyRegioneKeyProvincia(value.cod_reg, value.cod_pro);
        }
        //provincia presente
        if (provincia_temp.presente == "true")
            return provincia_temp.fid;

        var comune_temp = this.getComuneByKeyRegioneKeyProviciaKeyComune(value.cod_reg, value.cod_pro, value.cod_com);
        if (comune_temp == null) {
            //se comune non presente aggiungi gerarchia senza problemi
            var param_com = {
                cod_com: value.cod_com,
                cod_pro: value.cod_pro,
                cod_reg: value.cod_reg,
                nome: "",
                presente: "false",
                fid: ""
            };
            this.addComuneByKeyValue(value.cod_com, param_com);
            comune_temp = this.getComuneByKeyRegioneKeyProviciaKeyComune(value.cod_reg, value.cod_pro, value.cod_com);
        }
        //comune presente
        if (comune_temp.presente == "true")
            return comune_temp.fid;

        //comune presente quindi posso aggiungere senza problemi
        var param_cap = {
            cod_reg: value.cod_reg,
            cod_pro: value.cod_pro,
            cod_com: value.cod_com,
            cod_cap: KeyCap,
            nome: value.nome,
            fid: value.fid
        };
        this.getCapsByKeyRegioneKeyProviciaKeyComune(value.cod_reg, value.cod_pro, value.cod_com).add(KeyCap, param_cap);
        return 0;
    },
    removeCapByKeyRegioneKeyProvinciaKeyComuneKeyCap: function (keyReg, keyPro, keyCom, keyCap) {


        var tempComune = this.getComuneByKeyRegioneKeyProviciaKeyComune(keyReg, keyPro, keyCom);
        //se il comune non esiste
        if (tempComune == null)
            return -1;


        var tempCap = this.getCapByKeyRegioneKeyProviciaKeyComuneKeyCap(keyReg, keyPro, keyCom, keyCap);
        //se il cap non esiste
        if (tempCap == null)
            return 0;

        //il cap esiste lo eliminiamo
        tempComune.caps.removeAtKey(keyCap);


        //rimuovo comune
        this.removeComuneByKeyRegioneKeyProvinciaKeyComune(keyReg, keyPro, keyCom);
        return 1;
    }

};


// IMPLEMENTAZIONE DELLA AGGREGAZIONE DEI SOTTO TERRITORIO
function EliminaSottoTerritori(btn) {
    //this[0]{map territori da elimanare}
    //this[1]{e.feature territorio da aggiungere}
    if (btn == "no" || btn == "cancel")
        return;
    //cliccato si
    //elimino tutti i territori

    //se object ha province... fai tutti e 3 i cicli di cancellazione
    if (this[0].province != null) {
        //per ogni provincia
        for (i in this[0].province.map) {

            var comuni = this[0].province.map[i].comuni;
            for (j in comuni.map) {
                var caps = comuni.map[j].caps;
                for (z in caps.map) {
                    var f3 = getFeature(select.features, caps.map[z].fid);
                    removeToTree(f3);
                    //select.removeFeatures([f3]);
                    unselectSingleFeature(f3.fid);
                    removeFeaturesFromGrid(f3.fid);
                }
                if (comuni.map[j] != null) {
                    var f2 = getFeature(select.features, comuni.map[j].fid);
                    removeToTree(f2);
                    //select.removeFeatures([f2]);
                    unselectSingleFeature(f2.fid);
                    removeFeaturesFromGrid(f2.fid);
                }
            }
            if (this[0].province.map[i] != null) {
                var f1 = getFeature(select.features, this[0].province.map[i].fid);
                removeToTree(f1);
                //select.removeFeatures([f1]);
                unselectSingleFeature(f1.fid);
                removeFeaturesFromGrid(f1.fid);
            }

        }
    }

    if (this[0].comuni != null) {
        //per ogni comune

        var comuni = this[0].comuni;
        for (j in comuni.map) {
            var caps = comuni.map[j].caps;
            for (z in caps.map) {
                var f3 = getFeature(select.features, caps.map[z].fid);
                removeToTree(f3);
                //select.removeFeatures([f3]);
                unselectSingleFeature(f3.fid);
                removeFeaturesFromGrid(f3.fid);
            }
            if (comuni.map[j] != null) {
                var f2 = getFeature(select.features, comuni.map[j].fid);
                removeToTree(f2);
                //select.removeFeatures([f2]);
                unselectSingleFeature(f2.fid);
                removeFeaturesFromGrid(f2.fid);
            }
        }

    }

    if (this[0].caps != null) {
        //per ogni caps
        var caps = this[0].caps;
        for (z in caps.map) {
            var f3 = getFeature(select.features, caps.map[z].fid);
            removeToTree(f3);
            //select.removeFeatures([f3]);
            unselectSingleFeature(f3.fid);
            removeFeaturesFromGrid(f3.fid);
        }
    }

    this[1].style = stileColore;
    //carico quello selezionato

    addToTree(this[1]);
    if (contains(select.features, this[1]) == false) {
        select.addFeatures(this[1]);
        addFeaturesToGrid(this[1]);
    }
    if (contains(selectionControl.features, this[1]) == false) {
        selectionControl.features[this[1].fid] = this[1];
    }

};


// IMPLEMENTAZIONE DELLA FRAMMENTAZIONE DEL TERRITORIO PASSATO IN this[0]
function Disgrega(btn) {
    //this[0]{stringa territorio da disgregare}
    //this[1]{e.feature territorio da aggiungere}
    if (btn == "no" || btn == "cancel")
        return;
    //cliccato si

    //tolgo this[0] ottenfo cod e layer


    var feat = getFeature(select.features, this[0]);
    var cod = feat.fid.split(".");
    var layer = cod[0];
    cod = cod[1];

    //se trovi corrispondenza...construisci ZonaFrammentata
    for (n in myDataScenario) {
        if (myDataScenario[n].tc_territorio_id == cod && myDataScenario[n].tabella_territorio.substring(0, 3) == layer.substring(0, 3)) {
            //array del tipo {zona_id,nome;colore...id_agente?}
            ZonaFrammentata = new Array(myDataScenario[n].zona_id, myDataScenario[n].nome, myDataScenario[n].colore);
            break;
        }
    }

    //rimuovo da italia il territorio e dalla mappa e dal box
    removeToTree(feat);
    select.removeFeatures([feat]);
    removeFeaturesFromGrid(feat.fid);
    //ottengo e aggiungo oggetto con tutti quelli aggiungere
    getChildren(feat.fid, this[1]);

};


//DOPO LA FRAMMENTAZIONE I FIGLI DELLA REGIONE DISGREGATA
//ritorna fid degli elementi da caricare
function getChildren(fid, requestFid) {
    //fid territorio di grosso da rompere
    //requestFid la feature richiedendente
	


    var layerReq = (fromFidToNomi(requestFid.fid)).tipo;
    var codReq = requestFid.fid.split(".");
    codReq = parseInt(codReq[1]) - 1;
    
    var layerDest = fromFidToNomi(fid).tipo;
    var codDest = fid.split(".");
    codDest = parseInt(codDest[1]) - 1;
    
    console.log();
    
    console.log("Territorio figlio");
    console.log(requestFid);
    console.log(layerReq);
    console.log(codReq);
    console.log("Territorio padre");
    console.log(fid);
    console.log(layerDest);
    console.log(codDest)



//    Console.log("Territorio PADRE");
//    Console.log(fid);
//    Console.log("Territorio figlio");
//    Console.log(requestFid);

    //ottengo nome layer da frammentare
   

    var cdata;

    Ext.Ajax.request({
        waitMsg: 'wait...',
        url: 'http://' + constants.ip + constants.root + constants.servlet,
        params: {
            task: 'getFigli',
            cod: codDest,
            layer: layerDest,
            codChiamante: codReq,
            layerChiamante: layerReq
        },
        callback: function (opt, success, response) {
            cdata = Ext.JSON.decode(response.responseText);
        	console.log("INIZIO CICLO FIGLI");
            for (i in cdata) {
            	
            	if (cdata[i].layer==null)
            		break;
            	console.log(cdata[i].layer);
            	console.log(cdata[i].codice);
            	
                fid = fromNomiToFid(cdata[i].layer, cdata[i].codice);
                var type = fid.split(".");

                var request = OpenLayers.Request.GET({
                    url: url,
                    scope: ZonaFrammentata[2],
                    callback: visualizzaZoneDisgregati,
                    params: {
                        REQUEST: "GetFeature",
                        srsName: "EPSG:900913",
                        SERVICE: "WFS",
                        VERSION: "1.1.0",
                        TYPENAME: "mmasgis:" + type[0],
                        featureID: fid
                    }
                });

            }
        	console.log("FINE CICLO FIGLI");


            //aggiunta della fid request
            requestFid.style = {
                strokeColor: '#ffffff',
                fillColor: '#' + ZonaSelezionata[2],
                // fillColor : '#3FF87F',
                fillOpacity: 0.65,
                strokeWidth: 0.7,
                cursor: 'crosshair'
            };
            addToTree(requestFid);

            //aggiungo feature alla zona nuovo
            addFeaturesToGrid(requestFid);
            //aggiungi alla mappa
            if (contains(select.features, requestFid) == false) {
                //aggiungi feature al layer select
                select.addFeatures(requestFid);
            }

            //aggiungi il controllo
            if (hash_contains(selectionControl.features, requestFid) == false) {
                selectionControl.features[requestFid.fid] = requestFid;
            }

            //carica la zona nel box con la feature originale gia aggiunta
            LoadZonaInBox(ZonaSelezionata[1]);

        }
    });


}




// GESTORE DELL EVENTO FEATURE SELECTED
function featureselectedFunction(e) {
	
    //controlla che la feature sia sia figlia di qualcuno o padre di qualcuno...
    var temp = addToTree(e.feature);

    //se temp==0 inserimento senza problemi
    if (temp == 0) {
        e.feature.style = stileColore;
        // aggiungi alla mappa

        if (contains(select.features, e.feature) == false) {
            select.addFeatures([e.feature]);
            addFeaturesToGrid(e.feature);
        }
        if (contains(selectionControl.features, e.feature) == false) {
            selectionControl.features[e.feature.fid] = e.feature;
        }
    }

    //se temp stringa, il FID del Territorio padre da disgregare
    if (typeof (temp) == "string") {
        var parametro = [temp, e.feature];
        Ext.Msg.show({
            title: 'Attenzione',
            height: '300 px',
            msg: 'Sovrapposizione di territori, vuoi frammentare?',
            buttons: Ext.MessageBox.YESNO,
            scope: parametro,
            fn: Disgrega,
            icon: Ext.Msg.QUESTION
        });
    }

    //se temp oggetto, elenco feature da eliminare
    if (typeof (temp) == "object") {
        var parametro = [temp, e.feature];
        Ext.Msg.show({
            title: 'Territori gi�� presenti nella selezione',
            height: '300 px',
            msg: 'Vuoi renderli parte di questa zona?',
            buttons: Ext.MessageBox.YESNO,
            scope: parametro,
            fn: EliminaSottoTerritori,
            icon: Ext.Msg.QUESTION
        });
    }

    
    
    //Soluzione BUG IE11
    if ((navigator.userAgent).indexOf("Trident/7.0")> -1 && (navigator.userAgent).indexOf("like Gecko")> -1){
    	selectButtonClicked();
    	if (selectionControl.protocol.featureType=="reg2011_g")
    		showRegioni();
    	if (selectionControl.protocol.featureType=="prov2011_g")
    		showProvince();
    	if (selectionControl.protocol.featureType=="com2011_g")
    		showComuni();
    	if (selectionControl.protocol.featureType=="CapCR2006")
    		showCap();
    }
    
}



/******************************/


/**
 * Abilita blocchi della ZA
 */
function enablesZAcomponent() {

    Ext.getCmp('mapDiv').enable();
    Ext.getCmp('tree').enable();
    Ext.getCmp('gridSel').enable();
    Ext.getCmp('databaseButton').enable();
    Ext.getCmp('sposta_button').enable();
    Ext.getCmp('select_button').enable();
    Ext.getCmp('reg_button').enable();
    Ext.getCmp('prov_button').enable();
    Ext.getCmp('com_button').enable();
    Ext.getCmp('cap_button').enable();
    Ext.getCmp('deselect_button').enable();
    Ext.getCmp('usermng_button').enable();
}

/**
 * Disabilita blocchi della ZA
 */
function disableZAcomponent() {
    Ext.getCmp('mapDiv').disable();
    Ext.getCmp('tree').disable();
    Ext.getCmp('gridSel').disable();
    Ext.getCmp('databaseButton').disable();
    Ext.getCmp('sposta_button').disable();
    Ext.getCmp('select_button').disable();
    Ext.getCmp('reg_button').disable();
    Ext.getCmp('prov_button').disable();
    Ext.getCmp('com_button').disable();
    Ext.getCmp('cap_button').disable();
    Ext.getCmp('deselect_button').disable();
    Ext.getCmp('usermng_button').disable();
}

//EOF
