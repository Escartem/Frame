const fs = require("fs-extra")
const os = require("os")
const path = require("path")

const LoggerScript = require("../js/logger")
const logger = LoggerScript("%c[ConfigManager]", "color: #a02D2a; font-weight: bold")

const appDir = process.env.CONFIG_DIRECT_PATH || require("electron").remote.app.getPath("userData")
const configPath = path.join(appDir, "update-logs.json")

logger.log("Recherche de la configuration")
logger.log("Emplacement : " + configPath)

const LOGS = {
	hasSeen: {
        "2.5.0": false,
        "2.5.1": false
	}
}

let config = null

exports.save = function() {
	fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "UTF-8")
	//logger.log("La configuration a été sauvegardée")
}

exports.load = function() {
	let doLoad = true

	if(!fs.existsSync(configPath)){
		fs.ensureDirSync(path.join(configPath, ".."))
		doLoad = false
		config = LOGS
		exports.save()
	}
	if(doLoad){
        let doValidate = false
        try {
            config = JSON.parse(fs.readFileSync(configPath, "UTF-8"))
            doValidate = true
        } catch (err){
            logger.error(err)
            logger.log("Configuration file contains malformed JSON or is corrupt.")
            logger.log("Generating a new configuration file.")
            fs.ensureDirSync(path.join(configPath, ".."))
            config = LOGS
            exports.save()
        }
        if(doValidate){
            config = validateKeySet(LOGS, config)
            exports.save()
        }
    }
    logger.log("La configuration a été chargée")
}

function validateKeySet(srcObj, destObj){
    if(srcObj == null){
        srcObj = {}
    }
    const validationBlacklist = ["authenticationDatabase"]
    const keys = Object.keys(srcObj)
    for(let i=0; i<keys.length; i++){
        if(typeof destObj[keys[i]] === "undefined"){
            destObj[keys[i]] = srcObj[keys[i]]
        } else if(typeof srcObj[keys[i]] === "object" && srcObj[keys[i]] != null && !(srcObj[keys[i]] instanceof Array) && validationBlacklist.indexOf(keys[i]) === -1){
            destObj[keys[i]] = validateKeySet(srcObj[keys[i]], destObj[keys[i]])
        }
    }
    return destObj
}

exports.getSeenVersions = function(version) {
	try {
		return config.hasSeen[version]
	} catch (err) {
		logger.error(err)
	}
}

exports.setSeenVersions = function(version, value) {
	try {
		config.hasSeen[version] = value
		logger.log("La valeur \"hasSeen\" pour la version " + version + " a été définie sur " + value)
	} catch (err) {
		logger.error(err)
	}
}