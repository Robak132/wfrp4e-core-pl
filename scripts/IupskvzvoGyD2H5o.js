if (this.actor.type === "character") {
    let name = this.item.name
    let god

    // Remove placeholder from name
    name = name.replace(" (Dowolne)", "")

    if (name.includes("(")) {
        // If name already specifies, make sure tests value reflects that
        god = name.split("(")[1].split(")")[0]
    } else {
        // If no specified, provide dialog choice
        god = await ValueDialog.create("Wybierz Bóstwo", "Błogosławieństwo (Boska Tradycja)")
        if (god) name = `${name.split("(")[0].trim()} (${god})`
    }
    if (god) {
        let prayers = await game.wfrp4e.utility.findAll("prayer", "Ładuję błogosławienia...")
        let blessings = prayers.filter(
          p => p.system.god.value.split(",").map(i => i.trim().toLowerCase()).includes(god.toLowerCase()) &&
            p.system.type.value == "blessing")
        if (blessings.length) {
            this.script.scriptNotification("Dodano: " + blessings.map(i => i.name).join(", "))
            await this.actor.createEmbeddedDocuments("Item", blessings, {fromEffect: this.effect.id})
        } else {
            this.script.scriptNotification(`Brak błogosławieństw związanych z ${god}.`)
        }
        this.item.updateSource({name})
        await this.actor.update({"system.details.god.value": god})
    }
}