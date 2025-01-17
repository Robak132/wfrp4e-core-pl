let choice1 = [
    {
        type : "skill",
        name : "Broń Zasięgowa (Łuk)",
        diff : {
            system : {
                advances : {
                    value : 10
                }
            }
        }
    },
    {
        type : "weapon",
        name : "Łuk długi",
    },
    {
        type : "ammunition",
        name : "Strzała",
    }
]
let choice2 = [
]

let choice = await Dialog.wait({
    title : "Opcjonalne",
    content : 
    `<p>
    Dodać opcjonalne przedmioty?
    </p>
    <ol>
    <li>Broń Zasięgowa (Łuk) +10 oraz długi łuk z 12 strzałami</li>
    </ol> 
    `,
    buttons : {
        1 : {
            label : "Tak",
            callback : () => {
                return choice1;
            }
        },
        2 : {
            label : "Nie",
            callback : () => {
                return choice2;
            }
        }
    }
})

let updateObj = this.actor.toObject();
let items = []
for (let c of choice)
{
    let existing 
    if (c.type == "skill")
    {
        existing = updateObj.items.find(i => i.name == c.name && i.type == c.type)
        if (existing && c.diff?.system?.advances?.value)
        {
            existing.system.advances.value += c.diff.system.advances.value
        }
    }

    if (!existing)
    {
        let item = await game.wfrp4e.utility.find(c.name, c.type)
        if (item)
        {
            item = item.toObject()
            equip(item);
                items.push(foundry.utils.mergeObject(item, (c.diff || {})))
        }
        else
            ui.notifications.warn(`Could not find ${talent}`, {permanent : true})
    }

}
await this.actor.update(updateObj)
this.actor.createEmbeddedDocuments("Item", items);

function equip(item)
{
    if (item.type == "armour")
        item.system.worn.value = true
    else if (item.type == "weapon")
        item.system.equipped = true
    else if (item.type == "trapping" && item.system.trappingType.value == "clothingAccessories")
        item.system.worn = true
}