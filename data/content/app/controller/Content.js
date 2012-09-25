Ext.define("SMgr.controller.Content", {
	extend: "Ext.app.Controller",
	
	requires: ["Ext.menu.Menu", "Ext.menu.Separator"],
	uses: ["Ext.window.MessageBox", "Ext.Ajax"],
	
	stores: ["Elements", "ElementsTree"],
	
	models: ["Element"],
	
	refs: [{
		ref: "addItem",
		selector: "#addItem"
	}, {
		ref: "delItem",
		selector: "#delItem"
	}, {
		ref: "delItemChildren",
		selector: "#delItemChildren"
	}, {
		ref: "elmsEditor",
		selector: "elementsEditor"	
	}, {
		ref: "subjectsEditor",
		selector: "settings subjectsEditor"	
	}, {
		ref: "contentTree",
		selector: "subjectsEditor contentTree"	
	}],
	
	statics: {
		ITEMS: [
			"CHAPITRE",
			"SECTION",
			"PARAGRAPHE"
		],
		
		PARAGRAPHE : {
			leaf: true,
			iconCls: 'name'
		},
		
		SECTION: {
			iconCls: 'name-folder',
			expanded: true
		},
		
		CHAPITRE: {
			iconCls: 'name-folder',
			expanded: true
		}
	},
	
	init: function () {
		this.control({
			"contentTree button#elmsEditorBack": {
				click: this.backToElmsEditor
			},
			
			"viewport contentTree": {
				itemcontextmenu: this.showContextMenu
			},
			
			"#addItem": {
				click: this.processAdd
			},
			
			"#delItem": {
				click: this.processDelete
			},
			
			"#delItemChildren": {
				click: this.processDelete
			},
			
			"elementsEditor": {
				edit: this.onElementEdit,
				elmDelete: this.onElementDelete,
				elmContentEdit: this.onElmContentEdit
			},
			
			"#addElement": {
				click: this.addElement	
			},
			
			"contentTree button#saveBtn" : {
				click: this.saveTree
			},
			
			"contentTree button#resetBtn" : {
				click: this.resetTree
			}
		});
		
		this.contextMenu = Ext.create('Ext.menu.Menu', {
			id: "addCxtMenu",
			width: 180,
			margin: '0 0 10 0',
			plain: true,
			floating: true,
			items: [{
				itemId: "addItem"
			}, {
				xtype: 'menuseparator'	
			}, {
				itemId: "delItem"
			}, {
				itemId: "delItemChildren"
			}]
		});
		
	},
	
	backToElmsEditor: function () {
		this.cardLayout.prev();
	},
	
	onLaunch: function () {
		this.cardLayout = this.getSubjectsEditor().getLayout();
	},
	
    onElementEdit: function (editor, obj) {
		this.getElementsStore().sync({
			failure: function () {
				var msg = "Nous N' avons Pas Pu Enregistrer les Changements !" +
						"<br/>" +
						"Veuillez SVP Réessayez en Cliquant sur \"Enregistrer les Changements \" une Autre Fois";
				
				this.showWarning(msg, true);
			},
			
			scope: this
		});
    },

    onElementDelete: function (evtData) {
		var msg = "Voulez Vous Supprimer Cet Element de Façon Finale ?",
			handler = function (buttonId) {
				if (buttonId !== "yes") {
					return false;
				}
				var editor = this.getElmsEditor(),
					rowEditor = editor.rowEditor,
					elmsStore = this.getElementsStore(),
					sm = editor.getSelectionModel();
					
				rowEditor.cancelEdit();
				elmsStore.remove(evtData.record);
				elmsStore.sync({
					failure: function () {
						this.showWarning("Nous N' avons Pas Pu Enregistrer les Changements !<br/>Veuillez SVP Réessayez en Cliquant sur \"Enregistrer les Changements \" une Autre Fois", true);
					},
					
					scope: this	
					
				});
				
				if (elmsStore.getCount() > 0) {
					sm.select(0);
				}
			};
		
		this.askUserPermission(msg, handler, this);
    },

    onElmContentEdit: function (evtData) {
		var elmRecord = evtData.record,
			newTitle = elmRecord.get("name");
			
		this.getElementTree(elmRecord);
		this.getContentTree().setTitle(newTitle);
		
		this.cardLayout.next();
    },
	
	getElementTree: function (elmRecord) {
		if (this.curElmID === elmRecord.get("_id")) { // already getted so why re do it
			return false;
		}
		
		this.curElmID = elmRecord.get("_id");
		
		this._fetchElmData(this.curElmID);
	},
	
	_fetchElmData: function (id) {
		// as we found that sometimes the elm record lose their children so better get it from 0
		Ext.Ajax.request({
			url: '/elements/' + id,
			method: "GET",
			
			success: function (response) {
				// process server response here
				var resObj = JSON.parse(response.responseText),
					root = resObj.data,
					elm = Ext.isArray(root) ? root[0] : root;
					
				if (Ext.isEmpty(elm)) {
					return false;
				}
				
				elm.expanded = true;
				
				this.updateTree(elm);
			},
			
			scope: this
		});
	},
	
	updateTree: function (rawRoot) {
		var elmsTree = this.getElementsTreeStore();
		elmsTree.setRootNode(rawRoot);
	},


    addElement: function () {
		var rowEditor = this.getElmsEditor().rowEditor,
			// Create a model instance
			newElement = this.getElementModel().create({
				name: "Nouveau Element",
				code: "NewElm",
				module: "Module"
			});
		
		rowEditor.cancelEdit();
		
		this.getElementsStore().insert(0, newElement);
		rowEditor.startEdit(0, 0);
    },
	
	
	
	processAdd: function () {
		var record = this.currentRecord,
			depth = record.getDepth(),
			
			statics = this.statics(),
			kind = statics.ITEMS[depth],
			itemCfg = statics[kind],
			node;
		
		if (record.isLeaf()) {
			return false;	
		}
		
		node = record.createNode(itemCfg);
		node.set("name", kind);
		record.appendChild(node);
		
		record.expand();
	},
	
	processDelete: function (btn) {
		var record = this.currentRecord,
			msg = "Continuer la Suppression ?",
			handler = function (buttonId) {
				if (buttonId !== "yes") {
					return false;
				}
				var delJustChildren = btn.getItemId() === "delItemChildren";
				
				if (delJustChildren) {
					record.removeAll();
					
				} else {
					record.remove();
				}
			};
			
		this.askUserPermission(msg, handler);
	},
	
	showContextMenu: function (view, record, item, index, event) {
		event.stopEvent();
		
		var depth = record.getDepth(),
			statics = this.statics(),
			kind = statics.ITEMS[depth],
			cM = this.contextMenu;
		
		this.currentRecord = record;
		
		this.getAddItem().setText("Ajouter " + kind);
		
		this.getDelItem().setText("Supprimer \"" + record.get("name") + "\"");
		this.getDelItemChildren().setText("Supprimer Les Sous Eléments du \"" + record.get("name") + "\"");
		
		this.getDelItem().setVisible(!record.isRoot());
		this.getAddItem().setVisible(!record.isLeaf());
		this.getDelItemChildren().setVisible(!record.isLeaf());
		
		cM.showAt(event.getXY());
	},
	
	resetTree: function () {
		var msg = "Voulez Vous Vraiment Annuler Les Changements Non Enregistrés et Initialiser à 0 ?",
			handler = function (buttonId) {
				if (buttonId === "yes") {
					this._fetchElmData(this.curElmID);
				}
			};
			
		this.askUserPermission(msg, handler, this);
	},
	
	saveTree: function () {
		var msg = "Voulez Vous Enregistrer Ces Changements ?",
			handler = function (buttonId) {
				if (buttonId === "yes") {
					this._save();
				}
			};
			
		this.askUserPermission(msg, handler, this);
	},
	
	_save: function () {
		var treeStore = this.getElementsTreeStore(),
			root = treeStore.getRootNode(),
			children = this.getElmChildrenNewData(root),
			
			elmsStore = this.getElementsStore(),
			elm;
		
		elm = elmsStore.findRecord("code", root.raw.code);
		
		elm.set("children", children);
		
		elm.save({
			success: function () {
				console.log(elm.get("name"), 'updated');
			}
		});
	},
	
	_copyData: function (original) {
		var newNode = {},
			data = original.data;
		
		Ext.apply(newNode, original.raw);
		newNode.quota = data.quota;
		newNode.name = data.name;
		newNode.progress = data.progress;
		newNode.spentTime = data.spentTime;
		newNode.done = data.done;
		
		return newNode;
	},
	
	
	getElmChildrenNewData: function (elmNode) {
		var chapter = null,
			section = null,
			pg = null,
			elmChildren = [],
			me = this;
			
		elmNode.eachChild(function (chapterNode) {
			chapter = me._copyData(chapterNode);	 
			chapter.children = [];
			
			
			chapterNode.eachChild(function (sectionNode) {
				section = me._copyData(sectionNode);	
				section.children = [];
				
				sectionNode.eachChild(function (pgNode) {
					pg = me._copyData(pgNode);	
						
					section.children.push(pg);
			
				});
				
				chapter.children.push(section);
			});
			
			elmChildren.push(chapter);
		});

		return elmChildren;
	},
	
	
	
	askUserPermission: function (msg, handler, scope, args, appendArgs) {
		Ext.Msg.show({
			title: 'Avertissement',
			msg: msg, 
			width: 400,
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			fn: Ext.bind(handler, scope, args, appendArgs)
		});	
	},
	
	showWarning: function (msg, isError) {
		Ext.Msg.show({
			title: isError ? 'Erreur' : 'Avertissement',
			msg: msg, 
			width: 400,
			buttons: Ext.Msg.OK,
			icon: isError ? Ext.MessageBox.ERROR : Ext.MessageBox.WARNING
		});	
	}
	
});
	