let language = args.data.name.match(/\(([^)]+)\)/)?.[1]
if (!language) {
  language = "Reikspiel";
}
let skill = await game.wfrp4e.utility.findItem(`Język (${language})`, "skill")
skill = foundry.utils.deepClone(skill)
if (!skill) {
  ui.notifications.error(`Nie znaleziono umiejętności 'Język (${language})'`);
}
skill = skill.toObject();
skill.system.advances.value = 10;
skill.system.advances.force = true;
this.actor.createEmbeddedDocuments("Item", [skill], {fromEffect : this.effect.id})
