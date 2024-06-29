if (this.actor.system.status.advantage.value >= 2)
{
    await this.actor.modifyAdvantage(-2);
    this.script.scriptNotification("Zmniejszono Przewagę")
}
else 
{
    return this.script.scriptNotification("Brak wymaganej Przewagi!", "error")
}

let test = await this.actor.setupTrait(this.item)
await test.roll();