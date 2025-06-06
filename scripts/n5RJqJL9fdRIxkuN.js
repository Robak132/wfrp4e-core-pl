if (this.actor.system.status.advantage.value > 0)
{
    await this.actor.modifyAdvantage(-1);
    this.script.notification("Zmniejszono Przewagę")
}
else 
{
    return this.script.notification("Niewystarczająca Przewaga!", "error")
}

let test = await this.actor.setupTrait(this.item)
await test.roll();