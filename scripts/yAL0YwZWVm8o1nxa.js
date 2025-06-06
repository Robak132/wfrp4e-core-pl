if (this.actor.hasCondition("dead") && !this.actor.gardenOfCorpses)
{
    this.script.message("[[3d10]] @UUID[Compendium.wfrp4e-core.actors.T79RqnDOAQLn3I1s]{zombie} powstają z martwych.", {whisper : ChatMessage.getWhisperRecipients("GM")})
    this.actor.gardenOfCorpses = true;
    // local storage is sufficient to prevent multiple messages
}