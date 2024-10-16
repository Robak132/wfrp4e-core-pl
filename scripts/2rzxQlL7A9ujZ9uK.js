//*** Tarczownik
if (args.opposedTest.result.winner == "attacker") {
  if (args.opposedTest.defenderTest.weapon && args.opposedTest.defenderTest.item.properties.qualities.shield) {
    ui.notifications.notify(`<b>${this.effect.name}</b>: Otrzymano ${this.item.Advances} Przewagi`)
    this.actor.setAdvantage(this.item.Advances)
  }
}