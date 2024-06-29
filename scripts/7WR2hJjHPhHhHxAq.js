let poisoned = args.actor.hasCondition("poisoned")
if (poisoned)
{
   this.script.scriptNotification(`Usunięto ${poisoned.conditionValue} Stanów Zatrucia`)
   poisoned.delete();  
}
else
  this.script.scriptNotification(`Brak Stanów Zatrucia`)