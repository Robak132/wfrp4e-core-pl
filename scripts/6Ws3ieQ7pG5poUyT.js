//*** Rzucanie Czarów
if (isNaN(parseInt(this.item.system.specification.value)))
{
    let value = await ValueDialog.create({text : "Podaj Tradycję Magiczną", title : this.effect.name}, "", Object.values(game.wfrp4e.config.magicLores));
    if (value)
    {
     this.item.updateSource({"system.specification.value" : value});
    }
}