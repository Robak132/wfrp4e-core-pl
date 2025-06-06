if (args.applyAP && args.modifiers.ap.metal) 
{
    args.modifiers.ap.ignored += args.modifiers.ap.metal
    args.modifiers.ap.details.push("<strong>" + this.effect.name + "</strong>: Zignorowano metalowy pancerz (" + args.modifiers.ap.metal + ")");
    args.modifiers.ap.metal = 0
}