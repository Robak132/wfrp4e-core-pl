//*** Najemnik
const templateMap = {
    'P2e7Yx98bK3u110a' : "",
    'iuMp3KLaMT2WCmie' : "Xp4r2KUhqfjak8zq", 
    'RBuYcT5tppwcmnC5' : "wYN19h3WVF1yOVq2", 
    'vcGpNwNbhvfzVveQ' : "ac5ClOuaYtzOYyWp", 
    'jmhKZy0w9TzkEK9c' : "IS3LTdTuay6uRHUq", 
    '9Byj6k7SmdTYis2V' : "LjMlx99gBGeRJUQu", 
    'laJwc2l9tzJPgaaJ' : "x5wpMprsObuqMCYg",
}
let template = (await game.wfrp4e.tables.rollTable("hireling-templates", {hideDSN: true})).object;
let physicalQuirk = (await game.wfrp4e.tables.rollTable("physical-quirks", {hideDSN: true})).text;
let workEthic = (await game.wfrp4e.tables.rollTable("work-ethic", {hideDSN: true})).text;
let personalityQuirk = (await game.wfrp4e.tables.rollTable("personality-quirks", {hideDSN: true})).text;


let templateItem = await game.wfrp4e.utility.findItemId(templateMap[template._id]);

let bio = 
`
<p><strong>Szablon</strong>: ${template.text}</p>
<p><strong>Fizyczne dziwactwo</strong>: ${physicalQuirk}</p>
<p><strong>Etyka pracy</strong>: ${workEthic}</p>
<p><strong>Osobowościowe dziwactwa</strong>: ${personalityQuirk}</p>
`

this.script.message(bio, {whisper : ChatMessage.getWhisperRecipients("GM")})

await this.actor.update({"system.details.gmnotes.value" : bio})

if (templateItem)
{
    this.actor.createEmbeddedDocuments("Item", [templateItem.toObject()])
}