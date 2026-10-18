const PATCH_MARK = Symbol.for("wfrp4e-core-pl.effectDurationLocalization");

function isPolishWfrp() {
  return globalThis.game?.system?.id === "wfrp4e" && game.i18n?.lang === "pl";
}

function localizedLower(key) {
  return game.i18n.has(key) ? game.i18n.localize(key).toLowerCase() : null;
}

function fixRoundUnit(effect, item) {
  const text = item?.duration?.value;
  if (typeof text !== "string" || effect?.duration?.units !== "seconds" || !effect.duration.value) return;
  const lower = text.toLowerCase();
  const seconds = localizedLower("Seconds");
  if (seconds && lower.includes(seconds)) return;
  const rounds = ["Round", "Rounds"].map(localizedLower).filter(Boolean);
  if (rounds.some(word => lower.includes(word))) effect.duration.units = "rounds";
}

export function installEffectDurationLocalization() {
  const EffectClass = CONFIG.ActiveEffect?.documentClass;
  const proto = EffectClass?.prototype;
  if (!proto || typeof proto.convertToApplied !== "function" || Object.hasOwn(proto, PATCH_MARK)) return false;
  const original = proto.convertToApplied;
  proto.convertToApplied = function(test, ...args) {
    const effect = original.call(this, test, ...args);
    if (isPolishWfrp()) fixRoundUnit(effect, test?.item);
    return effect;
  };
  Object.defineProperty(proto, PATCH_MARK, {value: true});
  return true;
}

if (globalThis.Hooks) {
  Hooks.once("init", () => queueMicrotask(installEffectDurationLocalization));
  Hooks.once("ready", installEffectDurationLocalization);
}
