// Dependencies
var fs = require('fs-extra'),
	pkginfo = require('pkginfo')(module),
	npm = require('npm');

function getVersionInfo(versionStr) {
	var raw = versionStr.split('.'),
		data = {};
	
	data.version = versionStr;
	data.major = raw[0];
	data.minor = raw[1];
	data.patch = raw[2];
		
	return data;
}

function getLatestVersion(callback) {
	npm.load(function (err) {
		if (err) { return false; }
		npm.commands.install(["smgr"], function (err, data) {
			if (err) { return false; } 
			console.info("success download");
			var cwd = process.cwd(),
				temp_dir = cwd + "/node_modules/",
				updateSrc = temp_dir + "/smgr/",
				appDataDir = cwd + "/data/";
				
			fs.copy(updateSrc, appDataDir, function (err) {
				if (err) {
					return false;
				} else {
					console.log("success copy!");
					fs.remove(temp_dir, function (err) {
						if (err) {
							return false;
						} else {
							console.log("success delete!");
							callback();
						}
					});						
				}
			});
		
		});
	});
}

function update(callback, requestManual) {
	npm.load(function (err) {
		if (err) { throw err; }
		npm.commands.show(["smgr"], function (err, data) {
			if (err) { return false; } 
			// command succeeded, and data might have some info
			var ltstVersion = getVersionInfo(Object.keys(data)[0]),
				currVersion = getVersionInfo(module.exports.version),
				
				isUpToDate = ltstVersion.version === currVersion.version,
				// for backward compatibility so silent update not for major version release
				canSilentAutoUpdate = (ltstVersion.major === currVersion.major);
				
			if (isUpToDate) {
				return false;
			}
			
			if (canSilentAutoUpdate) {
				getLatestVersion(callback);
				
			} else {
				// do something
				requestManual();
			}
			
			
		});
	});
}


module.exports.update = update;