let bleeding = this.actor.hasCondition("bleeding")
if (bleeding)
{
   this.script.scriptNotification(`Usunięto ${bleeding.conditionValue} Stanów Krwawienia`)
   bleeding.delete();  
}
else 
{
   this.script.scriptNotification(`Brak Stanów Krwawienia`)
}