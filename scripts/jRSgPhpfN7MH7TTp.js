if (args.totalWoundLoss > 0)
{
    let test = await this.actor.setupSkill(game.i18n.localize("NAME.Endurance"), {skipTargets: true, appendTitle :  ` - ${this.effect.name}`, context: { failure: "Otrzymano 1 Stan Zatrucia", success: "Uchroniono przed otrzymaniem Stanu Zatrucia" } })
    await test.roll();
    if (test.failed)
    {   
        args.actor.addCondition("poisoned");
        if (args.actor.system.status.wounds.value - args.totalWoundLoss <= 0)
        {
            args.actor.addCondition("unconscious")
        }
    }
}

    // else
    //     this.actor.setupCharacteristic("t", { context: { failure: "1 @Condition[Poisoned] Condition Gained", success: "Resisted @Condition[Poisoned] Condition" } }).then(testCallback)
