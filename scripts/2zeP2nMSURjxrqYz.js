let wounds = this.actor.system.status.wounds
if (wounds.value == 0)
  return this.script.scriptNotification("Efekt nie wywołuje skutku przy żywotności równej 0", "error")

this.script.scriptNotification(`Uleczono ${this.actor.characteristics.t.bonus} Żywotności`)
await this.actor.modifyWounds(this.actor.characteristics.t.bonus)