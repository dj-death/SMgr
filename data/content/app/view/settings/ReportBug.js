Ext.define("SMgr.view.settings.ReportBug", {
	extend: "Ext.form.Panel",
	alias: "widget.reportBugForm",
			
	frame: true,
	
	title: 'Veuillez Remplir SVP Ce Formulaire Pour Nous Signaler un Bug (défaut) ou De Nous Contacter.',
	
	width: 600,
	
	bodyPadding: '5 5 0',
	
	fieldDefaults: {
		labelAlign: 'top',
		msgTarget: 'side'
    },
	
	floating: true,
	draggable: true,
	closable: true,
	
	 // The form will submit an AJAX request to this URL when submitted
    url: '/report_bug',
	
	initComponent: function () {
		this.items = [{
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [{
                xtype: 'container',
                flex: 1,
                layout: 'anchor',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Nom',
                    allowBlank: false,
                    name: 'fname',
                    anchor: '95%'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Niveau Scolaire',
                    name: 'school_level',
                    anchor: '95%'
                }]
            }, {
                xtype: 'container',
                flex: 1,
                layout: 'anchor',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Prénom',
                    allowBlank: false,
                    name: 'lname',
                    anchor: '100%'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Email',
                    allowBlank: false,
                    name: 'email',
                    vtype: 'email',
                    anchor: '100%'
                }]
            }]
        }, {
            xtype: 'htmleditor',
            name: 'msg',
            fieldLabel: 'Message',
            height: 200,
            anchor: '100%'
        }];

        this.buttons = [{
            text: 'Envoyer',
            formBind: true, //only enabled once the form is valid
			disabled: true,
			
			handler: function() {
				var form = this.up('form').getForm();
				if (form.isValid()) {
					form.submit({
						waitTitle: "Envoi En Cours...",
						waitMsg: "Veuillez Attendre SVP !",
						
						
						success: function(form, action) {
						   Ext.Msg.alert('Envoi Réussi', action.result.msg);
						},
						
						failure: function(form, action) {
							
							switch (action.failureType) {
								
								case Ext.form.action.Action.CLIENT_INVALID:
									Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
									break;
								
								case Ext.form.action.Action.CONNECT_FAILURE:
									Ext.Msg.alert('Failure', 'Ajax communication failed');
									break;
								
								case Ext.form.action.Action.SERVER_INVALID:
									Ext.Msg.alert("Echec d' Envoi", action.result.msg);
							}
						}
					});
				}
			}
        }, {
            text: 'Effacer Tout',
            handler: function () {
                this.up('form').getForm().reset();
            }
        }];
		
		this.callParent();	
	}
});