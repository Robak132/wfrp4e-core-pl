
                            let fatigued = this.actor.hasCondition("fatigued")
                            if (!fatigued)
                            {
                                this.actor.addCondition("fatigued")
                                ui.notifications.notify(this.actor.name + "Otrzymano zmęczenie, które nie może zostać usunięte, dopóki objaw Apatia nie zostanie uleczony.")
                            }