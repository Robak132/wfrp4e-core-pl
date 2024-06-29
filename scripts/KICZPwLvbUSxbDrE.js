let table = game.wfrp4e.tables.findTable("mutatemental");
if (!table)
{
	ui.notifications.error("Nie znaleziono tablicy z kluczem: mutatemental")
}
let result = (await table.roll()).results[0];
let uuid = `Compendium.${result.documentCollection}.${result.documentId}`
let item = await fromUuid(uuid);

if (item)
{
    this.script.scriptNotification(`${item.name} added`)
    this.actor.createEmbeddedDocuments("Item", [item])
}
else 
{
    ui.notifications.error("Obiekt nie może zostać znaleziony: " + uuid)
}