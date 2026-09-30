export const DEBUG = new URLSearchParams(location.search).has('debug');

export const GAME_PHYSICS = {
  gravity: -13.5,
  punchPower: 5.8,
  launchMultiplier: 1.25,
  angularMultiplier: 1.8,
  maxLinearSpeed: 18,
  settleSpeed: 0.22,
  settleDelay: 2.2
} as const;

export const COLORS = {
  sky: 0x8ed6ff,
  fog: 0xcceeff,
  floor: 0xf1dca7,
  pink: 0xf48eae,
  darkPink: 0x9c405f,
  glove: 0xe74751,
  gloveDark: 0x8e2832
} as const;
