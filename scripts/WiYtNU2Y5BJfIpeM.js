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