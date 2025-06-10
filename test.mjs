let EFFECT = {
  name: `${this.effect.name}: Powstrzymane`,
  img: this.effect.img,
  system: {
    transferData: {},
    scriptData: [
      {
        label: "Skrócenie Dystansu",
        trigger: "prePrepareItem",
        script: `
              if (args.item.type == "weapon" && args.item.isEquipped)
              {
                let weaponLength = args.item.reachNum
                if (weaponLength > 3)
                {
                  let improv = foundry.utils.duplicate(game.wfrp4e.config.systemItems.improv)
                  improv.system.twohanded.value = args.item.twohanded.value
                  improv.system.offhand.value = args.item.offhand.value
                  improv.name = args.item.name + " (" + game.i18n.localize("EFFECT.Infighting") + ")"
                  foundry.utils.mergeObject(args.item.system, improv.system, {overwrite : true})
                  args.item.system.qualities = improv.system.qualities
                  args.item.system.flaws = improv.system.flaws
                  args.item.name = improv.name
                  args.item.system.infighting = true;
                }
              }
							`
      }
    ]
  }
}

let test = await this.actor.setupSkill(game.i18n.localize("NAME.Cool"), {appendTitle: ` - ${this.effect.name}`, fields : {difficulty : "challenging"}})
await test.roll();
console.log(this)
console.log(args)
if (!test.failed) {
  this.actor.createEmbeddedDocuments("ActiveEffect", [EFFECT], {fromEffect: this.item.id});
}