let spells = await game.wfrp4e.utility.findAll("spell", "Ładowanie Zaklęć")

let text = (await game.wfrp4e.tables.rollTable("random-caster", {hideDSN: true})).result

lore = Array.from(text.matchAll(/{(.+?)}/gm))[0][1]

if (text == "Wybór GMa")
{
    return this.script.scriptNotification(text)
}

if (spellsWithLore.length > 0)
{
    let spellsWithLore = spells.filter(i => game.wfrp4e.config.magicLores[i.system.lore.value] == lore)
    let selectedSpell = spellsWithLore[Math.floor(CONFIG.Dice.randomUniform() * spellsWithLore.length)]
    this.script.scriptNotification(selectedSpell.name);
    this.actor.createEmbeddedDocuments("Item", [selectedSpell])
}
else
{
    ui.notifications.notify(`Nie udało się odnaleźć zaklęcia w Tradycji ${lore}. Spróbuj ponownie.`)
}