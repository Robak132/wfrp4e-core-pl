let test = await this.actor.setupSkill(game.i18n.localize("NAME.Athletics"), {fields : {difficulty : "difficult"}, skipTargets: true, appendTitle :  " - Poruszanie się"})
test.roll();