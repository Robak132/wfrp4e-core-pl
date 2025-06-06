const chanties = await warhammer.utility.findAllItems('wfrp4e-soc.chanty', "Ładowanie szant", true);
let choice = await ItemDialog.create(chanties, 1, {text : "Wybierz szantę", title : this.effect.name});
if (choice.length) 
{
  this.actor.addEffectItems(choice.map(i => i.uuid), this.effect)
}