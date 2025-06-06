let filters = [
    {
        property : "type",
        value : "skill"
    },
    {
        property : "name",
        value : /Melee/gm,
        regex: true
    }
]

let items = await ItemDialog.createFromFilters(filters, 2, { text : "Wybierz dwie umiejętności, by dodać +20" })
items = items.map(i => i.toObject())
items.forEach(i => i.system.advances.value = 20)

this.actor.createEmbeddedDocuments("Item", items);