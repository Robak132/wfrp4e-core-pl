let item = this.effect.getCreatedItems()?.[0];
ChatMessage.create({content : "<em>Gracja ponad stylem</em>", speaker : ChatMessage.getSpeaker({token: this.actor.getActiveTokens()[0]?.document, actor: this.actor})}, {chatBubble : true})

let choice = await ItemDialog.create(ItemDialog.objectToArray({
    "nobles" : "Szlachta",
    "guilders" : "Gildie",
    "servants" : "Słudzy"
}), 1, "Wybierz grupę społeczną")

let n = choice[0]?.name

if (!n)
{
    return;
}

if (item)
{
    item.update({
        name : item.name.split("(")[0] + ` (${n})`, 
        "system.tests.value" : item.system.tests.value.split("(")[0] + ` (${n}`
    })
}
else 
{
    item = await fromUuid("Compendium.wfrp4e-core.items.Item.sYbgpSnRqSZWgwFP");
    let data = item.toObject();
    data.name += ` (${n})`
    this.actor.createEmbeddedDocuments("Item", [data], {fromEffect: this.effect.id})
}