function checkAuth(page) {
	//controllo se il browser supporta la funzione indexOf, altrimenti la creo
	if (!Array.prototype.indexOf)
	{
	  Array.prototype.indexOf = function(elt /*, from*/)
	  {
	    var len = this.length >>> 0;

	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;

	    for (; from < len; from++)
	    {
	      if (from in this &&
	          this[from] === elt)
	        return from;
	    }
	    return -1;
	  };
	}

	// permessi pagina mappa
	if (page === 'map') {
		// ricerca utb su albero
		if (permessi.indexOf('1') < 0) {
			Ext.getCmp('searchUtbPanelButton').disable();
		}
		// chiudi albero
		if (permessi.indexOf('2') < 0) {
			Ext.getCmp('collapseTree').disable();
		}
		// accesso censimenti
		if (permessi.indexOf('3') < 0) {
			Ext.getCmp('databaseButton').disable();
		}
		// deseleziona tutto
		if (permessi.indexOf('4') < 0) {
			Ext.getCmp('deselect_button').disable();
		}
	}
	// permessi pagina risultati
	if (page === 'grid') {
		// filtri, ricerca anagrafiche e bottone annullamento
		if (permessi.indexOf('9') < 0 && permessi.indexOf('10') < 0) {
			Ext.getCmp('filterButton').disable();
			Ext.getCmp('searchButton').disable();
			Ext.getCmp('undoButton').disable();
		}
		else {
			// filtri
			if (permessi.indexOf('9') < 0) {
				Ext.getCmp('filterButton').disable();
			}
			// ricerca anagrafica
			if (permessi.indexOf('10') < 0) {
				Ext.getCmp('searchButton').disable();
			}
		}
		// aggregazione pv
		if (permessi.indexOf('11') < 0) {
			Ext.getCmp('PvAnalysisButton').disable();
		}
		// aggregazione marche
		if (permessi.indexOf('12') < 0) {
			Ext.getCmp('brandsAnalysisButton').disable();
		}
		// aggregazione parametri
		if (permessi.indexOf('13') < 0) {
			Ext.getCmp('ParAnalysisButton').disable();
		}
		// aggregazione parametri azienda
		if (permessi.indexOf('14') < 0) {
			Ext.getCmp('ParAzAnalysisButton').disable();
		}
		// aggregazione marche azienda
		if (permessi.indexOf('15') < 0) {
			Ext.getCmp('brandsAnalysisAzButton').disable();
		}
		// esportazione lista anagrafiche
		if (permessi.indexOf('16') < 0) {
			Ext.getCmp('excelButton').disable();
		}
	}
	
	//pagina aggregazione mar
	if (page === 'statPv') {
		// esportazione lista anagrafiche
		if (permessi.indexOf('17') < 0) {
			Ext.getCmp('expStatPvBtn').disable();
		}
	}
	
	if (page === 'statMar') {
		// esportazione lista anagrafiche
		if (permessi.indexOf('18') < 0) {
			Ext.getCmp('expStatMarBtn').disable();
		}
	}
	
	if (page === 'statPar') {
		// esportazione lista anagrafiche
		if (permessi.indexOf('19') < 0) {
			Ext.getCmp('expStatParBtn').disable();
		}
	}
	
	if (page === 'statMarAz') {
		if (permessi.indexOf('20') < 0) {
			Ext.getCmp('expStatMarAzBtn').disable();
		}
	}
	
	if (page === 'statParAz') {
		if (permessi.indexOf('21') < 0) {
			Ext.getCmp('expStatParAzBtn').disable();
		}
	}
	
}
	
