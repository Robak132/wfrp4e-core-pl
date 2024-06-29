let skill = `Sztuka (${this.item.parenthesesText})`
let currentCareer = this.actor.system.currentCareer;
let existingSkill = this.actor.itemTypes.skill.find(i => i.name == skill);

if (!currentCareer) return


let inCurrentCareer = currentCareer.system.skills.includes(skill);
let artisticAdded = this.actor.getFlag("wfrp4e", "artisticAdded") || {};
if (existingSkill && inCurrentCareer && !artisticAdded[existingSkill.name])
{
  existingSkill.system.advances.costModifier = -5;
}
else
{
  artisticAdded[skill] = true;
  currentCareer.system.skills.push(skill);
  setProperty(this.actor, "flags.wfrp4e.artisticAdded", artisticAdded)
}