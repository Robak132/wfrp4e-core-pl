if (args.test.options.healWounds) {
 if (args.test.result.roll <= game.settings.get("wfrp4e", "automaticSuccess") || args.test.result.roll <= args.test.target) {
   let wounds = this.actor.characteristics.int.bonus + ~~args.test.result.SL
   if (args.test.options.fieldDressing && args.test.result.reversed)
      wounds = this.actor.characteristics.int.bonus + Math.min(1, Number(args.test.result.SL))
	args.test.result.woundsHealed = wounds
	args.test.result.other.push(`<b>${this.actor.name}</b> leczy <b>${wounds}</b> Żywotności pacjenta.`)
   }
   else if (this.actor.characteristics.int.bonus + args.test.result.SL < 0)
      args.test.result.other.push(`Pacjent otrzymuje @UUID[Compendium.wfrp4e-core.items.Item.1hQuVFZt9QnnbWzg]{Uciążliwą Ranę}.`)
}