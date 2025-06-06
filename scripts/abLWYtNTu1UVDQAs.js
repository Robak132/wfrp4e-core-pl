if (args.opposedTest.result.hitloc.value == this.effect.flags.wfrp4e.location) // e.g. 'head', rLeg, 'lArm'
{
     this.message(`Otrzymano Stan @Condition[Oślepienie] ponieważ trafiono w: <strong>${this.item.name}</strong>`);
     this.actor.addCondition("blinded");
}