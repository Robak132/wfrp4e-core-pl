let sourceItem = this.effect.sourceItem;

if (sourceItem)
{
	this.actor.applyEffect({effectUuids : [sourceItem.effects.contents[1].uuid]})
	this.script.notification("Zastosowano skutki uboczne Rozkoszy Ranalda");
}