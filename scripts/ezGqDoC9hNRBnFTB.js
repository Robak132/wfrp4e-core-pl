//*** Weteran wielu przygód
let choices = await Promise.all([warhammer.utility.findItemId("1zaqojk0Oq1m8vYv"), warhammer.utility.findItemId("zIuarD5mB0EF0ji0")])
let items = await game.wfrp4e.apps.ItemDialog.create(choices, 1, "Wybierz broń")
items = items.map(i => i.toObject())

items.forEach(i => equip(i))

this.actor.createEmbeddedDocuments("Item", items);

function equip(item)
{
    if (item.type == "armour")
        item.data.worn.value = true
    else if (item.type == "weapon")
        item.data.equipped = true
    else if (item.type == "trapping" && item.data.trappingType.value == "clothingAccessories")
        item.data.worn = true
}