//*** Nienawiść (Grupa)
let group
let item = await fromUuid("Compendium.wfrp4e-core.items.Item.5hH73j2NgPdsLCZN");
let data = item.toObject();

if (this.item.name.includes("("))
{
	group = this.item.parenthesesText
}

else 
{
	group = await ValueDialog.create("Wybierz grupę dażoną nienawiścią", "Obiekt Nienawiści")

	this.item.updateSource({name : this.item.name + ` (${group})`});
	this.effect.updateSource({name : this.effect.name + ` (${group})`});
}


data.name = data.name.replace("x", group);
await this.actor.createEmbeddedDocuments("Item", [data], {fromEffect: this.effect.id});