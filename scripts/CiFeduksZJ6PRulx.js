//*** Woltyżerka
return args.skill?.name == `${game.i18n.localize("NAME.Ride")} (${game.i18n.localize("SPEC.Horse")})` || (args.options.dodge && this.actor.isMounted);