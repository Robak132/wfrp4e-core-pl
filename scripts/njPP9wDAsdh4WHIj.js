if (args.totalWoundLoss > 0 && ["trait", "weapon"].includes(args.opposedTest.attackerTest.item?.type))
{
     this.script.message(`<b>Zainfekowany ${args.actor.name}</b> musi zdać <b>Prosty (+40) Test Odporności</b> lub otrzyma @UUID[Compendium.wfrp4e-core.items.kKccDTGzWzSXCBOb]{Ropiejącą Ranę}`, {whisper: ChatMessage.getWhisperRecipients("GM")})
}