const fs = require('fs')

let fileContent = fs.readFileSync(`report.txt`, 'utf-8').split('\r\n')

fs.readdirSync('scripts').forEach(file => {
  if (!fileContent.includes(file.split(".js")[0])) {
    fs.unlinkSync(`scripts/${file}`);
  }
})