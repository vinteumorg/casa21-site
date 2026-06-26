import { K } from "./constants";

/** Desktop: rounded rect + top pill notch + bottom-left step. */
export function generateHeroClipPath(
  W: number, H: number,
  pl: number, pr: number, ph: number,
  R = 24,
): string {
  const bx1 = W * (230 / 1568);
  const bx2 = W * (206 / 1568);
  const by3 = H * (848 / 884);
  const by2 = H * (824 / 884);
  const q = 1 - K;
  return [
    `M ${W} ${H - R}`,
    `C ${W} ${H - R * K} ${W - R * K} ${H} ${W - R} ${H}`,
    `H ${bx1 + R}`,
    `C ${bx1 + R * K} ${H} ${bx1} ${H - R * K} ${bx1} ${H - R}`,
    `V ${by3}`,
    `C ${bx1} ${by2 + R * K} ${bx2 + R * q} ${by2} ${bx2} ${by2}`,
    `H ${R}`,
    `C ${R * K} ${by2} 0 ${by2 - R * K} 0 ${by2 - R}`,
    `V ${R}`,
    `C 0 ${R * K} ${R * K} 0 ${R} 0`,
    `H ${pl - R}`,
    `C ${pl - R * K} 0 ${pl} ${R * K} ${pl} ${R}`,
    `V ${ph - R}`,
    `C ${pl} ${ph - R * K} ${pl + R * K} ${ph} ${pl + R} ${ph}`,
    `H ${pr - R}`,
    `C ${pr - R * K} ${ph} ${pr} ${ph - R * K} ${pr} ${ph - R}`,
    `V ${R}`,
    `C ${pr} ${R * K} ${pr + R * K} 0 ${pr + R} 0`,
    `H ${W - R}`,
    `C ${W - R * K} 0 ${W} ${R * K} ${W} ${R}`,
    `V ${H - R}`,
    `Z`,
  ].join(" ");
}

/** Mobile/tablet: same bottom-left step, plain top edge (no notch). */
export function generateHeroMobileClipPath(W: number, H: number, R = 20): string {
  const bx1 = W * (230 / 1568);
  const bx2 = W * (206 / 1568);
  const by3 = H * (848 / 884);
  const by2 = H * (824 / 884);
  const q = 1 - K;
  return [
    `M ${W} ${H - R}`,
    `C ${W} ${H - R * K} ${W - R * K} ${H} ${W - R} ${H}`,
    `H ${bx1 + R}`,
    `C ${bx1 + R * K} ${H} ${bx1} ${H - R * K} ${bx1} ${H - R}`,
    `V ${by3}`,
    `C ${bx1} ${by2 + R * K} ${bx2 + R * q} ${by2} ${bx2} ${by2}`,
    `H ${R}`,
    `C ${R * K} ${by2} 0 ${by2 - R * K} 0 ${by2 - R}`,
    `V ${R}`,
    `C 0 ${R * K} ${R * K} 0 ${R} 0`,
    `H ${W - R}`,
    `C ${W - R * K} 0 ${W} ${R * K} ${W} ${R}`,
    `V ${H - R}`,
    `Z`,
  ].join(" ");
}
