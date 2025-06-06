
                            let fatigued = this.actor.hasCondition("fatigued")
                            if (!fatigued)
                            {
                                this.actor.addCondition("fatigued")
                                ui.notifications.notify(this.actor.name + ": dodano Zmęczenie, dopóki objaw Apatia nie zostanie uleczony.")
                            }