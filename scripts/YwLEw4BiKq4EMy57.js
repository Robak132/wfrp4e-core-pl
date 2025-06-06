let i_gain = (await new Roll("2d10").roll()).total
let fel_gain = 0
if (args.actor.characteristics.fel.value <= 0)
{
   fel_gain += (await new Roll("2d10").roll()).total
}

let msg = `<b>${this.actor.prototypeToken.name}</b>: otrzymano ${i_gain} Inteligencji`

if (fel_gain)
   msg += ` oraz ${fel_gain} Ogłady`


let newInt = i_gain + args.actor.characteristics.int.modifier
let newFel = fel_gain + args.actor.characteristics.fel.modifier

args.actor.update({"system.characteristics.int.modifier" : newInt, "system.characteristics.fel.modifier" : newFel})

this.script.message(msg)