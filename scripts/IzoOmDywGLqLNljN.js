let currentArtisticSkill = this.actor.getFlag("wfrp4e", "currentArtisticSkill");
if (currentArtisticSkill !== null) {
  let currentCareer = this.actor.system.currentCareer;
  let existingSkill = this.actor.itemTypes.skill.find(i => i.name === currentArtisticSkill);

  if (!currentCareer) {
    return;
  }

  let inCurrentCareer = currentCareer.system.skills.includes(currentArtisticSkill);
  if (existingSkill && inCurrentCareer && currentArtisticSkill != null) {
    existingSkill.system.advances.costModifier = -5;
  } else {
    currentCareer.system.skills.push(currentArtisticSkill);
  }
}