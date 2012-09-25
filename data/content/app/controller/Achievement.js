Ext.define("SMgr.controller.Achievement", {
	extend: "Ext.app.Controller",
	
	uses: ["Ext.window.MessageBox", "Ext.util.Format", "Ext.Date", "Ext.Ajax"],
	
	stores: ["ElementsTree", "ProgressHistory"],
	
	refs: [{
		ref: "treeEditor",
		selector: "register treeEditor"
	}, {
		ref: "register",
		selector: "register"
	}, {
		ref: "elmsBackBtn",
		selector: "register treeEditor button#elmsBack"
	}],
		
	init: function () {
		this.control({
			"viewport register elementsList" : {
				itemdblclick: this.changeToTreeEditor
			},
						
			"viewport register treeEditor": {
				edit: this.onItemEdit,
				beforeedit: this.prepareEditing
			},
			
			"treeEditor button#elmsBack": {
				click: this.backToElms
			},
			
			"treeEditor button#saveBtn" : {
				click: this.saveTree
			},
			
			"treeEditor button#resetBtn" : {
				click: this.resetTree
			}
		});
	},
	
	
	changeToTreeEditor: function (grid, elementRecord) {
		this.cardLayout.next();
		
		this.getElementTree(elementRecord);
				
		var newTitle = elementRecord.get("name");
		this.getTreeEditor().setTitle(newTitle);	
	},
	
	prepareEditing: function (editor, obj) {
		var node = obj.record,
			dejaDone = node.get("done"),
			someChildDone = node.hasChildNodes() && node.get("spentTime") > 0,
			depth = node.getDepth(),
			msgs = ["L' élément que vous Voulez Editer, a été Déja Enregistré avant.<br/><br/>Voulez Vous Continuer la Modification ?",
							"L' élément que vous Voulez Editer, a des Contenus dèja Fait !<br/><br/>Si Vous Continuer, les données de ces contenus seront changés par ceux de cette Nouvelle Enregistrement .<br/>Prenez en Compte Le Temps Total Investie pour le metre à jour !"],
			msg,
			handler;

		 // semestre ou un element pour une révision waw mais non pas possible so reject	
		if (depth < 1) {
			msg = "Aww ! Vous Avez Révisé tout un Element en un Seul Coup.<br/><br/>Seulement une Révision par Paragraph, Section ou Chapitre est Accepté !";
			this.showWarning(msg);
			return false;
		} else {
			if (dejaDone || someChildDone) {
				// ask user if he want seriously update data
				msg =  msgs[someChildDone ? 1 : 0];
				
				handler = function (buttonId) {
					if (buttonId !== "yes") {
						editor.cancelEdit();
					}
				};
			
				this.askUserPermission(msg, handler, this);	
			}
			
		}
		
	},
	
	onItemEdit: function (editor, obj) {
		var node = obj.record,
			oldValues = obj.originalValues,
			newValues = obj.newValues,
			
			isDone = newValues.done,
			spentTime = newValues.spentTime,
			change = newValues.spentTime - oldValues.spentTime,
			
			justSpentTimeModified = isDone && oldValues.done, // already done
			nothingChanged = (isDone === oldValues.done) && (spentTime === oldValues.spentTime),
			stillNotDone = isDone === false && oldValues.done === false,
			
			sign = isDone ? 1 : -1, // annulation or activation
			spentTimeDelta = justSpentTimeModified ? change : spentTime,
			spentTimeVariation = spentTimeDelta * sign,
			
			progressVariation =  !justSpentTimeModified ? 100 * sign : 0, // cuz the child progress is either 100 on done or 0 so - 100
			
			newParentTime = 0,
			newParentProgress = 0,
			
			quota = 0,
			
			// if it's a newly checked bu there children have participae in his parent progress and now his responsible of his child
			childrenWereDone = (isDone && (oldValues.done === false)) && node.get("progress") !== 0,
			
			oldProgressVariation = childrenWereDone ? node.get("progress") : 0;

			
		// when no changes don't do anything
		if (nothingChanged) {
			return false;	
		}
		
		
		if (stillNotDone) {
			if (change !== 0) {
				this.showWarning("Vous devez cochez 'Avez Vous Terminer cette Paragraphe' en colonne Statut Pour Que Votre Modification sera Valide");
				node.set("spentTime", 0);
			}
			return false;	
		}
		
		if (!justSpentTimeModified) {
			node.set("progress", isDone ? 100 : 0);
			node.set("spentTime", isDone ? spentTime : 0);
		}
		
		this.globalSpentTime = parseFloat(window.localStorage.getItem("globalSpentTime"));
		
		if (isNaN(this.globalSpentTime)) {
			this.globalSpentTime = 0;
		}
		this.globalSpentTime += spentTimeVariation; // now the node change after for children to supp
		
		
		// if the node has children now it's responsible for everything, they will inherits done value and share the parent spentTime
		// so we substract children spentTime from globalSpentTime
		if (!node.isLeaf()) {
			this.processChildrenCheck(node);
		}
		
		// now make changes on parent
		// iterate up to parent
		do {
			quota = node.get("quota") / 100;
			progressVariation *= quota;
			oldProgressVariation *= quota;
			
			node = node.parentNode;

			newParentTime = node.get("spentTime") + spentTimeVariation;
			newParentProgress = (node.get("progress") - oldProgressVariation) + progressVariation;
			// your child give his participation
			node.set({
				"progress": Math.round(newParentProgress * 100) / 100,
				"done": newParentProgress >= 100,
				"spentTime": newParentTime
			});
			
		} while (!node.isRoot()); // at depth 0 we have element
		
		
		this.elmNode = node;
	},
	

	onLaunch: function () {
		this.cardLayout = this.getRegister().getLayout();
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
		
	backToElms: function () {
		this.cardLayout.prev();
	},
	
	
	_copyData: function (original) {
		var newNode = {},
			data = original.data;
		
		Ext.apply(newNode, original.raw);
		newNode.expanded = original.isExpanded(); 
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
	
	
	_checkMe: function (child, value, parentSpentTime, scope) {
		var timePart,
			quota = child.get("quota") / 100;
		
		child.set("done", value);
		// soustraire spentTime
		scope.globalSpentTime -= child.get("spentTime");
		
		if (value) {
			timePart = Math.round(parentSpentTime * quota * 100) / 100;
			
			child.set("spentTime", timePart);
			child.set("progress", 100);
		} else {
			child.set("spentTime", 0);
			child.set("progress", 0);
		}
		
		
		child.eachChild(function (child2) {
			scope._checkMe(child2, value, timePart, scope);
		});
	},
	
	processChildrenCheck: function (originNode) {
		var me = this,
			spentTime = originNode.get("spentTime"),// child share the spent time of parent
			isDone = originNode.get("done"); // inherit the done value
		
		originNode.eachChild(function (child) {
			me._checkMe(child, isDone, spentTime, me);
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
	
	syncProgressHistory: function (elm_code, newProgress, callback, scope, args) {
		// only 1 enregistrement per day
		var histStore = this.getProgressHistoryStore(),
			dateFormat = "Y-m-d",
			today = Ext.util.Format.date(new Date(), dateFormat),
			todayRecord = histStore.findRecord("dateStr", today),
			
			lastHistItem, 
			lastDate, 
			newHistItem,
			
			msg,
			handler;
			
		// not null so is found	
		if (!Ext.isEmpty(todayRecord)) {
			// update
			todayRecord.set(elm_code, newProgress);
			todayRecord.save({
				success: function () {
					Ext.callback(callback, scope, args);	
				},
				
				failure: function () {
					this.showWarning("Nous N' avons Pas Pu Enregistrer les Changements !<br/>Veuillez SVP Réessayez en Cliquant sur \"Enregistrer les Changements \" une Autre Fois", true);
				},
				
				
				scope: this
			});
			
		} else { 
			// add a new one
			lastHistItem = histStore.last();
			lastDate = Ext.Date.parse(lastHistItem.get("dateStr"), dateFormat);
			newHistItem = Ext.apply({}, lastHistItem.data);
				
			delete newHistItem._id;
				
			// we have to update just for this element
			newHistItem[elm_code] = newProgress;
			newHistItem.date = today;
			newHistItem.Ref = parseFloat(window.localStorage.getItem('elapsedTimePercent'));
									
			// erreur dans la date c'est comme on recule dans le temps
			if (lastDate > new Date()) {
				msg = "Erreur dans la Date, La dernière Révision été faite à une Date Postèrieure qui se Trouve Après la Date d' Aujourd'hui" +
					"<br/>" +			
					"Il se Peut Que Votre Date n'est Pas Bien Réglée (Retourné Arrière), ou La Date de la Dérnière révision a été Avancé !" +
					"<br/>" + 							
					"On vous Recommende d' Aller au \"Menu Donnée\" et Restaurer Vos Données à Une Période Avant La Dérnière Révision " +
					"Ou de Vous Assurez que La Date de Votre PC est Bien réglée." +
					"<br/>" +
					"Vous Pouvez Continuer Si Vous Voulez Mais Vous Perdiez La Fiabilité de Vos Données !";
				
				handler = function (buttonId) {
					
					if (buttonId !== "yes") {
						return false;
					}
						
					histStore.add(newHistItem);
					histStore.sync({
						success: function () {
							Ext.callback(callback, scope, args);	
						},
						
						failure: function () {
							var msg = "Nous N' avons Pas Pu Enregistrer les Changements !<br/>Veuillez SVP Réessayez en Cliquant sur" +
										"\"Enregistrer les Changements \" une Autre Fois";
							
							this.showWarning(msg, true);
						},
						
						scope: this
							
					});	
					
				};
					
				this.askUserPermission(msg, handler, this);
				
			} else {
				
				histStore.add(newHistItem);
				histStore.sync({
					success: function () {
						Ext.callback(callback, scope, args);	
					},
					failure: function () {
						this.showWarning("Nous N' avons Pas Pu Enregistrer les Changements !<br/>Veuillez SVP Réessayez en Cliquant sur \"Enregistrer les Changements \" une Autre Fois", true);
					},
					
					scope: this
					
				});	
				
			}
			
			
		}
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
		if (Ext.isEmpty(this.elmNode)) {
			return false;
		}
		
		var elm = this.elmNode,
			elmCode = elm.get("code"),
			elmProgress = elm.get("progress"),
			elmSpentTime = elm.get("spentTime"),
			nbHours = elmSpentTime / 60,
			rendement,
			elmTimeInvestPart,
			elmNewData,
			
			onHistSuccess;
			
			
		nbHours = Math.round(nbHours * 100) / 100;
			
		rendement = (elmProgress === 0 || nbHours === 0) ? 0 : elmProgress / nbHours;
		elmTimeInvestPart = elmSpentTime / this.globalSpentTime;
			
		elmTimeInvestPart *= 100; // 0.5 -> 50 %
		
		// to OPTIMIZE BY JUST CHANGING THE CHANGED
		// override old
		elmNewData = {
			progress: elmProgress,
			done: elm.get("done"),
			spentTime: elmSpentTime,
			rendement: Math.round(rendement * 100) / 100,
			timeInvestPart: Math.round(elmTimeInvestPart * 100) / 100,
			
			children: this.getElmChildrenNewData(elm)
		};
				
		// reset
		window.localStorage.removeItem("globalSpentTime");
		// now we can update it
		window.localStorage.setItem("globalSpentTime", this.globalSpentTime);
		
		// now history but if it false so we don't need to complete
		onHistSuccess = function (elmCode, elmNewData) {
			this.application.fireEvent("achievementChanged", elmCode, elmNewData);
		};
		
		this.syncProgressHistory(elmCode, elmProgress, onHistSuccess, this, [elmCode, elmNewData]);
		
		

	}
	
});