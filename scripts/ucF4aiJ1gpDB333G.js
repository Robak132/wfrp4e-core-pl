if (args.test.options.catfall && (args.test.result.roll <= game.settings.get("wfrp4e", "automaticSuccess") || args.test.result.roll <= args.test.target) && !args.test.result.catfall)
{
   args.test.result.other.push(`<b>${this.effect.name}</b>: wysokość upadku zmiejszona o ${Number(args.test.result.SL) + 1} m`)
   args.test.result.catfall = true; // Prevent duplicate messages
}