let location = this.item.system.location.key;

if (location)
{
    let dropped = this.item.system.weaponsAtLocation;

    if (dropped.length)
    {
        this.script.notification(`Upuszczono ${dropped.map(i => i.name).join(", ")}!`)
        for(let weapon of dropped)
        {
            await weapon.system.toggleEquip();
        }
    }
}

let roll = await new Roll("max(1, 1d10 - @system.characteristics.t.bonus)", this.actor).roll()

roll.toMessage(this.script.getChatData({flavor : `${this.effect.name} (Czas Trwania)`}));

this.effect.updateSource({"duration.rounds" : roll.total})