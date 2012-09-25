var fs = require('fs-extra'),
	execFile = require('child_process').execFile,
	usertoDo = "Veuillez Réessayer Une Autre Fois !", // for msg
	
	// our 3rd party tools
	mongoDumpPath = "mongodb/bin/mongodump.exe",
	mongoRestorePath = "mongodb/bin/mongorestore.exe",
	zipPath = "7zip/7za.exe",
	
	dumpsDir = "./db",
	dbName = "smgr";

function createNewDumpPath() {
	var nowTimeStamp = +(new Date()), // timestamp
		newDumpPath =  dumpsDir + "/" + nowTimeStamp;
		
	return newDumpPath;
}

function exportData(filePath, callback) {
	var newDumpPath =  createNewDumpPath(), // this will be a sauvegarde point and also as a temp dir that will be compressed in 1 file SMgr data
		
		mongoDumpArgs = ["--host", "localhost", "--db", dbName, "--forceTableScan", "--out", newDumpPath],
		compressorArgs = ["a", filePath + ".SMgr", newDumpPath + "/smgr"];
		
	// first make a dump of our db --all collections	
	execFile(mongoDumpPath, mongoDumpArgs, function (error, stdout, stderr) {
		
		if (error !== null) {
			callback && callback("L' Exportation des Données a Echoué ! ");
			return false;
		}
		
		// now we have a dir that contains our dump files for every collection , let compress it using 7zip
		execFile(zipPath, compressorArgs, function (error, stdout, stderr) {
			
			if (error !== null) {
				var msg = "L' Exportation des Données a Réussi. Cependant L' Enregistrement du Fichier Exporté a Echoué !" + 
							"Peut Etre Que La Destination du Fichier Nécessite un Accès Administrateur " + 
							"(Chemin C: système, dossier Windows) ou Bien Le Disque Dur est Plein!";
							
				callback(msg);
				
				return false;
			}
			
			// everything good now			
			callback && callback("L' Exportation des Données et L' Enregistrement du Fichier ont Réussi !");
			
		});// end compressor callback
			
	});	// end mongoDump callback
}



function importData(filePath, callback) {
	var mongoRestoreArgs = ["--host", "localhost", "--db", dbName, "--journal", "--drop", "--keepIndexVersion", "./smgr"],
		decompressorArgs = ["x", filePath];
	
	// first let decompress the SMgr file in a temp dir
	execFile(zipPath, decompressorArgs, function (error, stdout, stderr) {
		
		if (error !== null) {
			callback && callback("Un Erreur s' est Produit Lors Du Lecture du Fichier");
			return false;
		}
		
		// now as we have a dir contained dump files , let restore from it		
		execFile(mongoRestorePath, mongoRestoreArgs, function (error, stdout, stderr) {
					
			if (error !== null) {
				callback && callback("L' Importation des Données à Echoué ! Veuillez Reéssayer une Autre Fois");
				return false;
			}
					
			// know as restoring success removing the temp dir for extract cuz if keep it we couldn't extract again
			fs.remove("smgr", function (err) {
				if (err) {
					return false;
				} else {
					callback && callback("L' Application va Rédemmarer, Pour Enregistrer les Nouveaux Changements !", true); // true to reload
				}
			});	
					
		}); // end mongoRestore callback
		
	}); // end Decompressor callback
		
}


function dump(callback) {
	var newDumpPath = createNewDumpPath(), // this will be a sauvegarde point and also as a temp dir that will be compressed in 1 file SMgr data
		
		mongoDumpArgs = ["--host", "localhost", "--db", dbName, "--forceTableScan", "--out", newDumpPath];
		
	// first make a dump of our db --all collections	
	execFile(mongoDumpPath, mongoDumpArgs, function (error, stdout, stderr) {
		
		if (error !== null) {
			return false;
		}
		
		callback && callback();
	});
}

function restoreTo(timeStamp, callback) {
	var dumpPath = dumpsDir + "/" + timeStamp + "/smgr",
		mongoRestoreArgs = ["--host", "localhost", "--db", dbName, "--journal", "--drop", "--keepIndexVersion", dumpPath];
	
	execFile(mongoRestorePath, mongoRestoreArgs, function (error, stdout, stderr) {
			
		if (error !== null) {
			callback("La Restauration a Echoué ! Veuillez Essayer De Restaurer A Nouveau !");
			return false;
		}
		
		callback && callback("La Restauration a Réussi ! L' Application va Rédemmarer, Pour Enregistrer les Nouveaux Changements !", true); // true to reload
	
	});
}
	
function restoreData(timeStamp, callback) {
	// create a sauvegarde and after restore
	dump(restoreTo(timeStamp, callback));
}


module.exports.restoreData = restoreData;
module.exports.importData = importData;
module.exports.exportData = exportData;
module.exports.dump = dump;