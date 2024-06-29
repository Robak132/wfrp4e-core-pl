let test = await args.actor.setupSkill(game.i18n.localize("NAME.Cool"), {skipTargets: true, appendTitle :  " - " + this.effect.name, context: { failure: "Zyskano Stan Paniki", success: "Odparto Stan Paniki" } })

 await test.roll();

 if (!test.succeeded)
 {
    args.actor.addCondition("broken");
 }