

if (!args.opposedTest.attackerTest.item?.system?.isMelee) 
{
    let choice = await foundry.applications.api.DialogV2.confirm({ window: { title: this.effect.name }, content: `<p><strong>${this.effect.name}</strong>: Czy ten magiczny lub zasięgowy atak pochodzi spoza Kopuły?</p>` })

    if (choice) 
    {
        args.ward = 6;
    }
}
