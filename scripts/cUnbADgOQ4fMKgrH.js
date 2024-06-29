let item = await fromUuid("Compendium.wfrp4e-core.items.Item.5hH73j2NgPdsLCZN");
let data = item.toObject();

if (this.item.name.includes("(")) {
	let group = this.item.parenthesesText;
	if (group !== "Dowolna") {
		this.item.updateSource(
			{"system.tests.value": this.item.system.tests.value.replace("Grupa", group)});
		data.name = data.name.replace("x", group);
		await this.actor.createEmbeddedDocuments("Item", [data], {fromEffect: this.effect.id});
		return;
	}
}

let index = game.packs.filter(i => i.metadata.type == "Item").
	reduce((acc, pack) => acc.concat(pack.index.contents), []).
	filter(i => i.type == "talent" && i.name !== "Nienawiść" && i.name.includes("Nienawiść (")).
	sort((a, b) => a.name.localeCompare(b.name)).
	map(i => {
		i.id = i._id;
		return i;
	});

let choice = await ItemDialog.create(index, 1, "Wybierz grupę darzoną nienawiścią");
let text;
if (!choice[0]) {
	let custom = await ValueDialog.create("Wpisz własną grupę darzoną nienawiścią", "Własna Grupa");
	text = custom || "";
} else {
	text = game.wfrp4e.utility.extractParenthesesText(choice[0].name);
}

let newTalentName = this.item.name.replace("(Dowolna)", "").trim() + ` (${text})`;
let careerTalents = this.actor.system.currentCareer.system.talents;
const talentIndex = careerTalents.indexOf(this.item.name);
if (talentIndex !== -1) {
	careerTalents.splice(talentIndex, 1);
	careerTalents.push(newTalentName);
	await this.actor.system.currentCareer.update({
		"system.talents": careerTalents,
	});
}
await this.effect.updateSource({name: newTalentName});
await this.item.updateSource({
	name: newTalentName,
	"system.tests.value": this.item.system.tests.value.replace("Grupa", text)});
data.name = data.name.replace("x", text);
await this.actor.createEmbeddedDocuments("Item", [data], {fromEffect: this.effect.id});