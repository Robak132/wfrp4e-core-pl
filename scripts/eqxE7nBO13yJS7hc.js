//*** Przypalenie
let roll = (await new Roll("1d10").roll())
roll.toMessage({flavor: "Uleczono", speaker : {alias : this.actor.name}})

this.actor.modifyWounds(roll.total)

this.actor.hasCondition("bleeding")?.delete();