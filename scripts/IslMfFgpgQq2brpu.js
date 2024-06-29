if (this.actor.hasCondition("broken"))
{
    this.actor.removeCondition("broken")
    this.script.scriptNotification(`Nie może otrzymać Paniki`);
}