let advantage = this.actor.system.status.advantage.value;
if (advantage > 0)
{
    await this.actor.setAdvantage(0);
    this.script.scriptNotification("Zmniejszono Przewagę")
}
else 
{
    return this.script.scriptNotification("Niewystarczająca Przewaga!", "error")
}

let test = await this.actor.setupTrait(this.item, {fields : {slBonus : advantage}})
await test.roll();