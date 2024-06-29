let index = game.packs.filter(i => i.metadata.type == "Item").
  reduce((acc, pack) => acc.concat(pack.index.contents), []).
  filter(i => i.type == "skill" && i.name !== `${game.i18n.localize("NAME.Art")} ()` && i.name.includes(`${game.i18n.localize("NAME.Art")} (`)).
  sort((a, b) => a.name.localeCompare(b.name)).
  map(i => {
    i.id = i._id;
    return i;
  });

let choice = await ItemDialog.create(index, 1, "Wybierz Sztukę");
let spec;
if (!choice[0]) {
  let custom = await ValueDialog.create("Wpisz własną Sztukę", "Własna Sztuka");
  spec = custom || "";
} else {
  spec = game.wfrp4e.utility.extractParenthesesText(choice[0].name);
}
spec = `${game.i18n.localize("NAME.Art")} (${spec})`

await this.actor.setFlag("wfrp4e", "currentArtisticSkill", spec);