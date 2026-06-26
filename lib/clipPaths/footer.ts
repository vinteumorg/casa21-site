import { K } from "./constants";

export function topNotchSegment(nl: number, nr: number, nd: number, R: number): string[] {
  return [
    `H ${nl - R}`,
    `C ${nl - R * K} 0 ${nl} ${R * K} ${nl} ${R}`,
    `V ${nd - R}`,
    `C ${nl} ${nd - R * K} ${nl + R * K} ${nd} ${nl + R} ${nd}`,
    `H ${nr - R}`,
    `C ${nr - R * K} ${nd} ${nr} ${nd - R * K} ${nr} ${nd - R}`,
    `V ${R}`,
    `C ${nr} ${R * K} ${nr + R * K} 0 ${nr + R} 0`,
  ];
}

/** Desktop clip — viewBox 1520×557. */
export function generateFooterDesktopClipPath(
  W: number, H: number,
  sl: number, st: number,
  nl: number, nr: number, nd: number,
  R = 24,
): string {
  const sx = (x: number) => (x / 1520) * W;
  const sy = (y: number) => (y / 557) * H;
  return [
    `M ${sx(1408)} ${sy(40)}`,
    `C ${sx(1408)} ${sy(53.25)} ${sx(1418.75)} ${sy(64)} ${sx(1432)} ${sy(64)}`,
    `H ${sx(1496)}`,
    `C ${sx(1509.25)} ${sy(64)} ${sx(1520)} ${sy(74.75)} ${sx(1520)} ${sy(88)}`,
    `V ${st - R}`,
    `C ${W} ${st - R * K} ${W - R * K} ${st} ${W - R} ${st}`,
    `H ${sl + R}`,
    `C ${sl + R * K} ${st} ${sl} ${st + R * K} ${sl} ${st + R}`,
    `V ${H - R}`,
    `C ${sl} ${H - R + R * K} ${sl - R + R * K} ${H} ${sl - R} ${H}`,
    `H ${sx(88)}`,
    `C ${sx(74.75)} ${H} ${sx(64)} ${H - R * K} ${sx(64)} ${H - R}`,
    `V ${sy(469)}`,
    `C ${sx(64)} ${sy(455.75)} ${sx(53.25)} ${sy(445)} ${sx(40)} ${sy(445)}`,
    `H ${sx(24)}`,
    `C ${sx(10.75)} ${sy(445)} 0 ${sy(434.25)} 0 ${sy(421)}`,
    `V ${sy(79.5)}`,
    `C 0 ${sy(70.94)} ${sx(6.94)} ${sy(64)} ${sx(15.5)} ${sy(64)}`,
    `C ${sx(24.06)} ${sy(64)} ${sx(31)} ${sy(57.06)} ${sx(31)} ${sy(48.5)}`,
    `V ${sy(24)}`,
    `C ${sx(31)} ${sy(10.75)} ${sx(41.75)} 0 ${sx(55)} 0`,
    ...topNotchSegment(nl, nr, nd, R),
    `H ${sx(1384)}`,
    `C ${sx(1397.25)} 0 ${sx(1408)} ${sy(10.75)} ${sx(1408)} ${sy(24)}`,
    `V ${sy(40)}`,
    `Z`,
  ].join(" ");
}

/** Ultra-wide clip (≥1800px) — fixed offsets from right/left edges. */
export function generateFooterUltraWideClipPath(
  W: number, H: number,
  sl: number, st: number,
  nl: number, nr: number, nd: number,
  R = 24,
): string {
  const sy = (y: number) => (y / 557) * H;
  return [
    `M ${W - 112} ${sy(40)}`,
    `C ${W - 112} ${sy(53.25)} ${W - 101.25} ${sy(64)} ${W - 88} ${sy(64)}`,
    `H ${W - 24}`,
    `C ${W - 10.75} ${sy(64)} ${W} ${sy(74.75)} ${W} ${sy(88)}`,
    `V ${st - R}`,
    `C ${W} ${st - R * K} ${W - R * K} ${st} ${W - R} ${st}`,
    `H ${sl + R}`,
    `C ${sl + R * K} ${st} ${sl} ${st + R * K} ${sl} ${st + R}`,
    `V ${H - R}`,
    `C ${sl} ${H - R + R * K} ${sl - R + R * K} ${H} ${sl - R} ${H}`,
    `H 88`,
    `C 74.75 ${H} 64 ${H - R * K} 64 ${H - R}`,
    `V ${sy(469)}`,
    `C 64 ${sy(455.75)} 53.25 ${sy(445)} 40 ${sy(445)}`,
    `H 24`,
    `C 10.75 ${sy(445)} 0 ${sy(434.25)} 0 ${sy(421)}`,
    `V ${sy(79.5)}`,
    `C 0 ${sy(70.94)} 6.94 ${sy(64)} 15.5 ${sy(64)}`,
    `C 24.06 ${sy(64)} 31 ${sy(57.06)} 31 ${sy(48.5)}`,
    `V ${sy(24)}`,
    `C 31 ${sy(10.75)} 41.75 0 55 0`,
    ...topNotchSegment(nl, nr, nd, R),
    `H ${W - 136}`,
    `C ${W - 122.75} 0 ${W - 112} ${sy(10.75)} ${W - 112} ${sy(24)}`,
    `V ${sy(40)}`,
    `Z`,
  ].join(" ");
}

/** Mobile clip — viewBox 398×987. */
export function generateFooterMobileClipPath(
  W: number, H: number,
  sl: number, st: number,
  nl: number, nr: number, nd: number,
  R = 24,
): string {
  const sx = (x: number) => (x / 398) * W;
  const sy = (y: number) => (y / 987) * H;
  return [
    `M ${sx(334)} ${sy(10.5)}`,
    `C ${sx(334)} ${sy(16.3)} ${sx(338.7)} ${sy(21)} ${sx(344.5)} ${sy(21)}`,
    `H ${sx(374)}`,
    `C ${sx(387.25)} ${sy(21)} ${W} ${sy(31.76)} ${W} ${sy(45)}`,
    `V ${st - R}`,
    `C ${W} ${st - R * K} ${W - R * K} ${st} ${W - R} ${st}`,
    `H ${sl + R}`,
    `C ${sl + R * K} ${st} ${sl} ${st + R * K} ${sl} ${st + R}`,
    `V ${H - R}`,
    `C ${sl} ${H - R + R * K} ${sl - R + R * K} ${H} ${sl - R} ${H}`,
    `H ${R}`,
    `C ${R * K} ${H} 0 ${H - R * K} 0 ${H - R}`,
    `V ${sy(28.5)}`,
    `C 0 ${sy(24.4)} ${sx(3.36)} ${sy(21)} ${sx(7.5)} ${sy(21)}`,
    `C ${sx(11.6)} ${sy(21)} ${sx(15)} ${sy(17.66)} ${sx(15)} ${sy(13.5)}`,
    `V ${sy(10.5)}`,
    `C ${sx(15)} ${sy(4.7)} ${sx(19.7)} 0 ${sx(25.5)} 0`,
    ...topNotchSegment(nl, nr, nd, R),
    `H ${sx(323.5)}`,
    `C ${sx(329.3)} 0 ${sx(334)} ${sy(4.7)} ${sx(334)} ${sy(10.5)}`,
    `Z`,
  ].join(" ");
}

/** Tablet clip (600–969px) — fixed offsets from edges. */
export function generateFooterTabletClipPath(
  W: number, H: number,
  sl: number, st: number,
  nl: number, nr: number, nd: number,
  R = 24,
): string {
  const sy = (y: number) => (y / 987) * H;
  return [
    `M ${W - 64} ${sy(10.5)}`,
    `C ${W - 64} ${sy(16.3)} ${W - 59.3} ${sy(21)} ${W - 53.5} ${sy(21)}`,
    `H ${W - 24}`,
    `C ${W - 10.75} ${sy(21)} ${W} ${sy(31.76)} ${W} ${sy(45)}`,
    `V ${st - R}`,
    `C ${W} ${st - R * K} ${W - R * K} ${st} ${W - R} ${st}`,
    `H ${sl + R}`,
    `C ${sl + R * K} ${st} ${sl} ${st + R * K} ${sl} ${st + R}`,
    `V ${H - R}`,
    `C ${sl} ${H - R + R * K} ${sl - R + R * K} ${H} ${sl - R} ${H}`,
    `H ${R}`,
    `C ${R * K} ${H} 0 ${H - R * K} 0 ${H - R}`,
    `V ${sy(28.5)}`,
    `C 0 ${sy(24.4)} 3.36 ${sy(21)} 7.5 ${sy(21)}`,
    `C 11.6 ${sy(21)} 15 ${sy(17.66)} 15 ${sy(13.5)}`,
    `V ${sy(10.5)}`,
    `C 15 ${sy(4.7)} 19.7 0 25.5 0`,
    ...topNotchSegment(nl, nr, nd, R),
    `H ${W - 74.5}`,
    `C ${W - 68.7} 0 ${W - 64} ${sy(4.7)} ${W - 64} ${sy(10.5)}`,
    `Z`,
  ].join(" ");
}
