const R_OUTER = 24;
const R_TN = 18.8223;
const R_BN = 13.571;
const K = 0.4477;
const q = 1 - K;

export function generateCBClipPath(W: number, H: number): string {
  const scale = W / 1280;
  const r_tn = R_TN * scale;
  const r_bn = R_BN * scale;

  const tnlx1 = W * (109.178 / 1280);
  const tnlx2 = W * (128 / 1280);
  const tnlx3 = W * (146.822 / 1280);
  const tnrx1 = W * (448.378 / 1280);
  const tnrx2 = W * (467.2 / 1280);
  const tnrx3 = W * (486.022 / 1280);

  const bnlx3 = W * (730.429 / 1280);
  const bnlx2 = W * (744 / 1280);
  const bnlx1 = W * (757.571 / 1280);
  const bnrx1 = W * (1138.43 / 1280);
  const bnrx2 = W * (1152 / 1280);
  const bnrx3 = W * (1165.57 / 1280);

  const tny1 = r_tn;
  const tny2 = r_tn * 2;
  const bny1 = H - r_bn;
  const bny2 = H - r_bn * 2;

  return [
    `M ${tnlx2} ${tny1}`,
    `C ${tnlx2} ${tny1 + r_tn * q} ${tnlx3 - r_tn * q} ${tny2} ${tnlx3} ${tny2}`,
    `H ${tnrx1}`,
    `C ${tnrx1 + r_tn * q} ${tny2} ${tnrx2} ${tny1 + r_tn * q} ${tnrx2} ${tny1}`,
    `C ${tnrx2} ${tny1 - r_tn * q} ${tnrx3 - r_tn * q} 0 ${tnrx3} 0`,
    `H ${W - R_OUTER}`,
    `C ${W - R_OUTER * K} 0 ${W} ${R_OUTER * K} ${W} ${R_OUTER}`,
    `V ${H - R_OUTER}`,
    `C ${W} ${H - R_OUTER * K} ${W - R_OUTER * K} ${H} ${W - R_OUTER} ${H}`,
    `H ${bnrx3}`,
    `C ${bnrx3 - r_bn * q} ${H} ${bnrx2} ${H - r_bn * K} ${bnrx2} ${bny1}`,
    `C ${bnrx2} ${bny1 - r_bn * q} ${bnrx1 + r_bn * q} ${bny2} ${bnrx1} ${bny2}`,
    `H ${bnlx1}`,
    `C ${bnlx1 - r_bn * q} ${bny2} ${bnlx2} ${bny1 - r_bn * q} ${bnlx2} ${bny1}`,
    `C ${bnlx2} ${H - r_bn * K} ${bnlx3 + r_bn * q} ${H} ${bnlx3} ${H}`,
    `H ${R_OUTER}`,
    `C ${R_OUTER * K} ${H} 0 ${H - R_OUTER * K} 0 ${H - R_OUTER}`,
    `V ${R_OUTER}`,
    `C 0 ${R_OUTER * K} ${R_OUTER * K} 0 ${R_OUTER} 0`,
    `H ${tnlx1}`,
    `C ${tnlx1 + r_tn * q} 0 ${tnlx2} ${tny1 - r_tn * q} ${tnlx2} ${tny1}`,
    `Z`,
  ].join(" ");
}
