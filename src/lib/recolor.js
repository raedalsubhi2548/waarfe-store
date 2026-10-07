// Turns the old store's green artwork into the Raed palette: greens become navy,
// cream and gold become cool silver-white. Works on raw RGB(A) pixel buffers.
export function recolor(d, channels = 4) {
  for (let i = 0; i < d.length; i += channels) {
    const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, c = mx - mn
    if (c < 0.02) continue
    let h = mx === r ? ((g - b) / c) % 6 : mx === g ? (b - r) / c + 2 : (r - g) / c + 4
    h = (h * 60 + 360) % 360
    const s = c / (1 - Math.abs(2 * l - 1) || 1)
    let nh, ns
    if (h >= 95 && h <= 200) { nh = 216; ns = Math.min(1, s * 0.62) } // greens -> navy #1b2b44 family
    else if (h >= 25 && h < 95) { nh = 214; ns = s * 0.18 } // cream / gold -> silver white
    else continue
    const C = (1 - Math.abs(2 * l - 1)) * ns, X = C * (1 - Math.abs(((nh / 60) % 2) - 1)), m = l - C / 2
    // nh is always in 180..240, so the sector is (0, X, C)
    d[i] = Math.round(m * 255); d[i + 1] = Math.round((X + m) * 255); d[i + 2] = Math.round((C + m) * 255)
  }
  return d
}
