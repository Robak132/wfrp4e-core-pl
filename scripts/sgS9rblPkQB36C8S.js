if (this.item.name.includes("("))
{
	let trade = this.item.parenthesesText;
	if (trade?.toLowerCase() != "dowolne")
	    return this.item.updateSource({"system.tests.value" : this.item.system.tests.value.replace("Dowolne", trade)})
}

let index = game.packs
.filter(i => i.metadata.type == "Item")
.reduce((acc, pack) => acc.concat(pack.index.contents), [])
.filter(i => i.type == "skill" && i.name.includes(game.i18n.localize("NAME.Trade")))
.map(i => {
	i.id = i._id
	return i
})

let choice = await ItemDialog.create(index, 1, {text : "Wybierz Rzemiosło lub przejdź dalej i wpisz je ręcznie.", title : this.effect.name})
let text;
if (!choice[0])
{
    let custom = await ValueDialog.create({text : "Wpisz niestandardowe Rzemiosło", title : "Niestandardowe Rzemiosło"});
    text = custom || ""
}
else 
{
    text = game.wfrp4e.utility.extractParenthesesText(choice[0].name)
}

await this.item.updateSource({name : this.item.name.replace("(Dowolne Rzemiosło)", "").replace("(Dowolne Rzemiosło)", "").trim() + ` (${text})`, "system.tests.value" : this.item.system.tests.value.replace("Dowolne", text)});