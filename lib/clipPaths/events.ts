import { K } from "./constants";

/** Top image clip: rounded rect with top-left badge notch. */
export function generateEventTopClip(
  W: number, H: number,
  notchW: number, notchH: number,
  R = 16,
): string {
  return [
    `M ${W} ${H - R}`,
    `C ${W} ${H - R * K} ${W - R * K} ${H} ${W - R} ${H}`,
    `H ${R}`,
    `C ${R * K} ${H} 0 ${H - R * K} 0 ${H - R}`,
    `V ${notchH + R}`,
    `C 0 ${notchH + R * K} ${R * K} ${notchH} ${R} ${notchH}`,
    `H ${notchW - R}`,
    `C ${notchW - R * K} ${notchH} ${notchW} ${notchH - R * K} ${notchW} ${notchH - R}`,
    `V ${R}`,
    `C ${notchW} ${R * K} ${notchW + R * K} 0 ${notchW + R} 0`,
    `H ${W - R}`,
    `C ${W - R * K} 0 ${W} ${R * K} ${W} ${R}`,
    `V ${H - R}`,
    `Z`,
  ].join(" ");
}

/**
 * Bottom card clip: rounded rect with smooth three-segment bezier notch at
 * the bottom-right corner for the arrow button.
 * Proportional constants extracted from clip-bottom.svg (W=400, H=283).
 */
export function generateEventBottomClip(
  W: number, H: number,
  notchW: number, notchH: number,
  R = 16,
): string {
  return [
    `M ${W} ${H - notchH}`,
    `C ${W} ${H - notchH * 0.868} ${W - notchW * 0.190} ${H - notchH * 0.776} ${W - notchW * 0.322} ${H - notchH * 0.776}`,
    `C ${W - notchW * 0.573} ${H - notchH * 0.776} ${W - notchW * 0.776} ${H - notchH * 0.573} ${W - notchW * 0.776} ${H - notchH * 0.322}`,
    `C ${W - notchW * 0.776} ${H - notchH * 0.190} ${W - notchW * 0.868} ${H} ${W - notchW} ${H}`,
    `H ${R}`,
    `C ${R * K} ${H} 0 ${H - R * K} 0 ${H - R}`,
    `V ${R}`,
    `C 0 ${R * K} ${R * K} 0 ${R} 0`,
    `H ${W - R}`,
    `C ${W - R * K} 0 ${W} ${R * K} ${W} ${R}`,
    `V ${H - notchH}`,
    `Z`,
  ].join(" ");
}
