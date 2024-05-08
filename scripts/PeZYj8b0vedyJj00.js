// This script needs to be separate because equipTransfer is off on the other effect, and thus won't execute when added to an actor

let mainEffect = this.item.effects.contents[0];
if (mainEffect.name.includes("(Wiedza)"))
{
    let choice = await ItemDialog.create(ItemDialog.objectToArray(game.wfrp4e.config.magicLores, this.item.img), 1, "Wybierz dziedzinę wiedzy");
    if (choice.length)
    {
        mainEffect.update({name : mainEffect.name.replace("Wiedza", choice[0].name)})
        this.item.update({name : this.item.name += ` (${choice[0].name})`})
    }
}

this.effect.delete();