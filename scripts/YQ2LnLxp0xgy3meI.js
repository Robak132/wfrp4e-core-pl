if (args.test.preData.options?.corruption && args.test.failed) {
  args.test?.result?.other.push("Otrzymano +1 Punkt Zepsucia pochodzący z " + this.effect.name)
}