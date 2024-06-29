
                            let fatigued = this.actor.hasCondition("fatigued")
                            if (!fatigued)
                            {
                                this.actor.addCondition("fatigued")
                              ui.notifications.notify(this.actor.name + ": dodano Stan Zmęczenia, który nie może zostać usunięty dopóki nie usunie się Gorączki.")
                            }
