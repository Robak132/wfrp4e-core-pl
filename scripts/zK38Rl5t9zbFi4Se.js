if (args.opposedTest.result.hitloc.value == this.item.system.location.key && args.totalWoundLoss > 0)
{
    args.actor.addCondition("bleeding", 1);
    this.script.notification("Otrzymano Stan Krwawienia")
}