function addPromo() {
	 
	var form = document.getElementById('kubettone');
	    var element1 = document.createElement("input"), 
	    	element2 = document.createElement("input"), 
	    	element3 = document.createElement("input");

	    form.action = 'http://' + constants.ip + constants.root + constants.servlet;
	    form.task.value = 'promoKubettONE';
	    form.censimento.value = dbname;
			
	        if (selectedParValues.length != 0) {
	            filterString = "";
	            for (i in selectedParValues) {
	                filterString = filterString + selectedParValues[i][1] + "," + selectedParValues[i][0] + "|";
	            }		 
	            filterString = filterString.substring(0, (filterString.length - 1));
	            //store.proxy.extraParams.parametri = filterString;
	           
	            element1.setAttribute("type", "hidden");
	            element1.setAttribute("value", filterString);
	            element1.setAttribute("name", "parametri");
	            element1.setAttribute("id","parametri");
	            document.getElementById("kubettone").appendChild(element1);
	        }
	         
	        if (selectedMarValues.length != 0) {
	            filterString = "";
	            for (i in selectedMarValues) {
	                filterString = filterString + selectedMarValues[i][1] + "," + selectedMarValues[i][0] + "|";
	            }		 
	            filterString = filterString.substring(0, (filterString.length - 1));
	            //store.proxy.extraParams.parametri = filterString;
	           
	            element2.setAttribute("type", "hidden");
	            element2.setAttribute("value", filterString);
	            element2.setAttribute("name", "marche");
	            element2.setAttribute("id","marche");
	            document.getElementById("kubettone").appendChild(element2);
	        }
	        
			
	        if (selectedPotValues.length != 0) {
	            filterString = "";
	            for (i in selectedPotValues) {
	                filterString = filterString + selectedPotValues[i][1] + "," + selectedPotValues[i][0] + "|";
	            }		 
	            filterString = filterString.substring(0, (filterString.length - 1));
	            //store.proxy.extraParams.parametri = filterString;
	          
	            element3.setAttribute("type", "hidden");
	            element3.setAttribute("value", filterString);
	            element3.setAttribute("name", "potenziali");
	           element3.setAttribute("id","potenziali");
	            document.getElementById("kubettone").appendChild(element3);
	        }
	        
	       
	   
	    form.reg.value = reg;
	    form.pro.value = pro;
	    form.com.value = com;
	    form.cap.value = cap;
	    
	    form.offerta.value = offerta;
	    form.settore.value = settore;
	    //alert("CheckBox offerta "+offerta);
	    //alert("CheckBox settore "+settore);
	    //form.header.value = getExcelHeader('griglia');
	    form.submit();	
	    
	    
	    if (selectedParValues.length != 0) {
		//document.getElementById("estrazioni").removeChild(element1);
		form.removeChild(document.getElementById("parametri"));
		
		}
		if (selectedMarValues.length != 0) {
		//document.getElementById("estrazioni").removeChild(element2);
		form.removeChild(document.getElementById("marche"));
		
		}
		if (selectedPotValues.length != 0) {
		//document.getElementById("estrazioni").removeChild(element3);
		form.removeChild(document.getElementById("potenziali"));
		
		}
	    	location.href = "http://gis.di.unimi.it/k1-azienda/src/home.php";
	    	//location.href = "http://www.metmi.it/k1_aziende/src/home.php";

}