args.actor.setupSkill("Unik", { fields: { difficulty: "average" } }).then(async test => {
      await test.roll();
      if (test.failed) {
        await args.actor.addCondition("bleeding")
        await args.actor.addCondition("entangled")
      }
    })