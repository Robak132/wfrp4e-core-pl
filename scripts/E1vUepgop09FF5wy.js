if (this.actor.system.status.advantage.value == 0)
{
    return this.script.notification("Niewystarczająca liczba Punktów Przewagi!", "error")
}

let hatred = await fromUuid("Compendium.wfrp4e-core.items.Item.aE3pyW20Orvdjzj0")
let frenzy = await fromUuid("Compendium.wfrp4e-core.items.Item.yRhhOlt18COq4e1q");

if (this.actor.system.status.advantage.value >= 3)
{
    this.script.notification(`Dodano: ${frenzy.name}`)
    this.actor.setAdvantage(0)
    this.actor.createEmbeddedDocuments("Item", [frenzy])
}
else if (this.actor.system.status.advantage.value >= 1)
{
    let data = hatred.toObject();
    data.system.specification.value = "Przeciwnicy w walce wręcz"
    this.script.notification(`Dodano: ${hatred.name}`)
    this.actor.setAdvantage(0)
    this.actor.createEmbeddedDocuments("Item", [data])
}
