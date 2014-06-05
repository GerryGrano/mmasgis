
Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';
    
Ext.onReady(function() {
    var win = new Ext.Window({
		title: 'richieste'
		,renderTo:Ext.getBody()
		,width:420
		,height:240
		,border:false
		,draggable: false
		,closable: false
		,layout:'fit'
		,items:[{
			// form as the only item in window
			xtype:'form'
			,labelWidth:60
			,frame:true
			,items:[{
				// textfield
				fieldLabel:'La tua email'
				,xtype:'textfield'
				,anchor:'-18'
			},{
				// textfield
				fieldLabel:'Oggetto'
				,xtype:'textfield'
				,anchor:'-18'
			},{
				// bottom textarea
				fieldLabel:'Richiesta'
				,xtype:'textarea'
				,anchor:'-18 -80'
			},{
				xtype : 'button',
				id : 'request_button',
				text : 'Invia richiesta',
				width : 80,
				x: 200,
				formBind : true,
				handler: function(){
					user_mail = win.items.items[0].items.items[0].lastValue;
					subject = win.items.items[0].items.items[1].lastValue;
					body = win.items.items[0].items.items[2].lastValue;
					var f = document.getElementById('mail');
					f.subject.value = subject;
					f.user_mail.value = user_mail;
					f.body.vaule = body;
					f.submit();
				}
			}]
		}]
    });
    win.show();
     
    }); 
