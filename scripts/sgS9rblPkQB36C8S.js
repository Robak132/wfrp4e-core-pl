if (this.item.name.includes("(")) {
  let trade = this.item.parenthesesText;
  if (trade !== "Dowolny") {
    return this.item.updateSource({"system.tests.value": this.item.system.tests.value.replace("Dowolne", trade)});
  }
}

let index = game.packs.filter(i => i.metadata.type == "Item").
  reduce((acc, pack) => acc.concat(pack.index.contents), []).
  filter(i => i.type == "skill" && i.name !== `${game.i18n.localize("NAME.Trade")} ()` &&
    i.name.includes(game.i18n.localize("NAME.Trade"))).
  sort((a, b) => a.name.localeCompare(b.name)).
  map(i => {
    i.id = i._id;
    return i;
  });

let choice = await ItemDialog.create(index, 1, "Wybierz Rzemiosło");
let text;
if (!choice[0]) {
  let custom = await ValueDialog.create("Wpisz własne Rzemiosło", "Własne Rzemiosło");
  text = custom || "";
} else {
  text = game.wfrp4e.utility.extractParenthesesText(choice[0].name);
}

let newTalentName = this.item.name.replace("(Dowolny)", "").trim() + ` (${text})`;
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
  "system.tests.value": this.item.system.tests.value.replace("Dowolne", text),
});