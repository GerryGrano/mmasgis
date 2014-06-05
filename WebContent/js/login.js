Ext.onReady(function(){
	

	var login = Ext.create('Ext.form.Panel', {
        //url:'save-form.php',
        frame:true,
        header: false,
        title: 'Login',
        id: 'login_form',
        bodyStyle:'padding:5px 5px',
        width: 270,
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 90
        },
        defaultType: 'textfield',
        defaults: {
            //anchor: '80%'
        },
        items: [{
            fieldLabel: 'Username',
            name: 'login_user',
            allowBlank:false,
            listeners: {
				specialkey: function(field, e){
					if (e.getKey() == e.ENTER) {
						doLogin();
						}
	            }
			}
        },{
	        fieldLabel: 'Password',
	        name: 'login_password',
	        allowBlank: false,
	        inputType: 'password',
	        listeners: {
				specialkey: function(field, e){
					if (e.getKey() == e.ENTER) {
						doLogin();
	                }
				}
		}
        }],
        buttons: [{
            text: 'Log In',
            formBind: true,
            handler: function() {
				doLogin();
			}
		}]
	});

	var mainWindow = new Ext.Window({
		height: 160, width: 290,
		title: 'MMASGIS Beta Login',
		draggable: false,
		closable: false,
		resizable: false,
		id: 'loginWindow',
		layout: 'fit',
		items: [login]	
	});

	function doLogin() {
		if(login.getForm().isValid()) {
			f = document.getElementById("login");
			fields = login.getForm().getFieldValues();
			f.user.value = fields.login_user;
			f.password.value = fields.login_password;
			//console.debug(f.username.value);
			//console.debug(f.password.value);
			f.submit();
		}
	}

	mainWindow.show();

});