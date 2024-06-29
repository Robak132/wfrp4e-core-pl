if (this.actor.system.status.advantage.value >= 3)
{
    this.actor.modifyAdvantage(-3);
    this.script.scriptNotification("Odjęto Przewagę")
}
else 
{
    return this.script.scriptNotification("Niewystarczająca Przewaga!", "error")
}

let test = await this.actor.setupTrait(this.item)
await test.roll();