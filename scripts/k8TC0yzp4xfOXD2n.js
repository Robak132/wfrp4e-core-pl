//*** Odmrożenia
if (args.totalWoundLoss > 0)
{
    let test = await args.actor.setupSkill(game.i18n.localize("NAME.Endurance"), {skipTargets: true, appendTitle :  ` - ${this.effect.name}`});
    await test.roll();
    if (test.failed)
    {
	    args.actor.addCondition("stunned");
    }
	args.actor.hasCondition("bleeding")?.delete()
}