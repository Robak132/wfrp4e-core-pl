//*** Starsza Pilotka
if (args.test.options.pilot && args.test.result.reversed)
{
	args.test.data.result.SL = "+" + Math.min(1, Number(args.test.data.result.SL))
	args.test.result.other.push(`<b>${this.effect.name}</b>: PS ograniczone do 1`)
}