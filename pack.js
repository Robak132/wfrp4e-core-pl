const fs = require('fs')

fs.writeFileSync("load-scripts-pl.js", `Hooks.on("init", () => {\n    mergeObject(game.wfrp4e.config.effectScripts, {`)
fs.readdirSync("scripts").forEach(file => {
    if (file.endsWith(".js")) {
        let script = fs.readFileSync(`scripts/${file}`, 'utf8')
        let name = file.split(".")[0]
        fs.appendFileSync("load-scripts-pl.js", `\n    "${name}": ${JSON.stringify(script)},`)
    }
})
fs.appendFileSync("load-scripts-pl.js", "\n});\n})")
