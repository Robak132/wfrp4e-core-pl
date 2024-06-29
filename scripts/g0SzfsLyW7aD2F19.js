if (this.item.name.includes("(")) {
  let etiquette = this.item.parenthesesText;
  if (etiquette !== "Dowolna") {
    return this.item.updateSource(
      {"system.tests.value": this.item.system.tests.value.replace("Grupa Społeczna", etiquette)});
  }
}

let index = game.packs.filter(i => i.metadata.type == "Item").
  reduce((acc, pack) => acc.concat(pack.index.contents), []).
  filter(i => i.type == "talent" && i.name !== `${game.i18n.localize("NAME.Etiquette")}` &&
    i.name.includes(game.i18n.localize("NAME.Etiquette"))).
  sort((a, b) => a.name.localeCompare(b.name)).
  map(i => {
    i.id = i._id;
    return i;
  });

let choice = await ItemDialog.create(index, 1, "Wybierz Grupę dla Etykiety");
let text;
if (!choice[0]) {
  let custom = await ValueDialog.create("Wpisz własną Grupę dla Etykiety", "Własna Grupa");
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
  "system.tests.value": this.item.system.tests.value.replace("Grupa Społeczna", text)});