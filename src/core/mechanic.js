export class EffectState {
  // Subclasses must override this getter
  get isEffectActive() {
    return false;
  }

  // Subclasses may override this method to return the effect value
  effect() {
    return undefined;
  }

  effectOrDefault(fallback) {
    return this.isEffectActive ? this.effect() : fallback;
  }

  timesEffect(base) {
    return this.isEffectActive ? base.times(this.effect()) : base;
  }

  addEffect(base) {
    return this.isEffectActive ? base.add(this.effect()) : base;
  }

  subEffect(base) {
    return this.isEffectActive ? base.sub(this.effect()) : base;
  }

  divEffect(base) {
    return this.isEffectActive ? base.div(this.effect()) : base;
  }

  powEffect(base) {
    return this.isEffectActive ? base.pow(this.effect()) : base;
  }
  
  maxEffect(base) {
    return this.isEffectActive ? base.max(this.effect()) : base;
  }
  
  minEffect(base) {
    return this.isEffectActive ? base.min(this.effect()) : base;
  }
}

// Batch helpers — sugar for the common "chain several states" pattern.
export function timesEffectsOf(base, ...states) {
  return states.reduce((v, s) => s.timesEffect(v), base);
}
export function addEffectsOf(base, ...states) {
  return states.reduce((v, s) => s.addEffect(v), base);
}
export function powEffectsOf(base, ...states) {
  return states.reduce((v, s) => s.powEffect(v), base);
}
export function subEffectsOf(base, ...states) {
  return states.reduce((v, s) => s.subEffect(v), base);
}
export function divEffectsOf(base, ...states) {
  return states.reduce((v, s) => s.divEffect(v), base);
}
export function maxEffectsOf(base, ...states) {
  return states.reduce((v, s) => s.maxEffect(v), base);
}
export function minEffectsOf(base, ...states) {
  return states.reduce((v, s) => s.minEffect(v), base);
}