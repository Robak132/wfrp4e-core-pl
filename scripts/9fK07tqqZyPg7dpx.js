let test = await this.actor.setupSkill(game.i18n.localize("NAME.Endurance"), {skipTargets: true, appendTitle :  ` - ${this.effect.name}`, fields : {difficulty: "veasy"}})
await test.roll();
if (test.failed)
{
      this.script.notification("Otrzymano <strong>Ropiejącą Ranę</strong>")
      let item = await fromUuid("Compendium.wfrp4e-core.items.kKccDTGzWzSXCBOb")
      this.actor.createEmbeddedDocuments("Item", [item.toObject()])
}
else 
{
    this.script.notification("Uniknięto <strong>Ropiejącej Rany</strong>")
}
