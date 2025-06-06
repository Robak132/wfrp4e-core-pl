let fatigue = this.actor.hasCondition("fatigued")
if (fatigue)
{
   this.script.notification("Usunięto Stan Zmęczenia, efekt zdezaktywowany.")
   this.effect.update({disabled : true})
   await this.actor.removeCondition("fatigued")
}