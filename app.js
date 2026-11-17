// Flynn's Flag Morph & Country Size Explorer - Application Logic (All 197 World Countries)
(function () {
  const COUNTRIES = window.COUNTRIES_DATA || [];

  // =========================================================================
  // 1. WEB AUDIO & VOICE NARRATION HELPER
  // =========================================================================
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, duration = 0.14, type = "sine", delay = 0, gainVal = 0.12) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const startTime = audioCtx.currentTime + delay;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {}
  }

  function playSuccessSound() {
    playTone(523.25, 0.12, "triangle", 0);
    playTone(659.25, 0.12, "triangle", 0.1);
    playTone(783.99, 0.16, "triangle", 0.2);
    playTone(1046.5, 0.3, "triangle", 0.3);
  }

  function playWrongSound() {
    playTone(260, 0.18, "sawtooth", 0, 0.08);
    playTone(195, 0.25, "sawtooth", 0.15, 0.08);
  }

  function playMorphWhoosh() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  function speakText(text) {
    if (!soundEnabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.02;
      utter.pitch = 1.05;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  // =========================================================================
  // 2. COLOR & GEOMETRY INTERPOLATION UTILITIES
  // =========================================================================
  function hexToRgb(hex) {
    const clean = (hex || "#ffffff").replace("#", "");
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function rgbToHex(r, g, b) {
    const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
    return (
      "#" +
      [clamp(r), clamp(g), clamp(b)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpColor(hexA, hexB, t) {
    const [r1, g1, b1] = hexToRgb(hexA);
    const [r2, g2, b2] = hexToRgb(hexB);
    return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // =========================================================================
  // 3. PARAMETRIC VECTOR FLAG SIGNATURE COMPILER & MORPHER
  //    Coordinates are in 150 x 100 viewBox (3:2 standard flag ratio)
  // =========================================================================
  const BAND_COUNT = 13;
  const sigCache = new Map();

  function rectPoints(x, y, w, h) {
    return [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h]
    ];
  }

  function compileFlagSignature(country) {
    if (sigCache.has(country.id)) return sigCache.get(country.id);

    const layers = country.morphLayers || [];
    const bands = [];
    const baseColor = (country.colors && country.colors[0]) || "#0055a4";

    const stripesH = layers.find((l) => l.type === "stripes-h");
    const seychelles = layers.find((l) => l.type === "seychelles-rays");
    const rects = layers.filter((l) => l.type === "rect");

    const verticalRects = rects.filter((r) => r.h === 100 && r.w < 99);
    const horizontalRects = rects.filter((r) => r.w === 100 && r.h < 99);

    if (seychelles) {
      const cols = seychelles.colors || ["#003F87", "#FCD856", "#D62828", "#FFFFFF", "#007A3D"];
      const rayPolys = [
        [[0, 100], [0, 0], [50, 0], [0, 100]],
        [[0, 100], [50, 0], [105, 0], [0, 100]],
        [[0, 100], [105, 0], [150, 0], [150, 34]],
        [[0, 100], [150, 34], [150, 68], [0, 100]],
        [[0, 100], [150, 68], [150, 100], [0, 100]]
      ];
      for (let i = 0; i < BAND_COUNT; i++) {
        const idx = Math.min(rayPolys.length - 1, Math.floor((i * rayPolys.length) / BAND_COUNT));
        bands.push({ points: rayPolys[idx], color: cols[idx % cols.length] });
      }
    } else if (stripesH) {
      const count = stripesH.count || 13;
      for (let i = 0; i < BAND_COUNT; i++) {
        const stripeIdx = Math.min(count - 1, Math.floor((i * count) / BAND_COUNT));
        const y0 = (stripeIdx * 100) / count;
        const y1 = ((stripeIdx + 1) * 100) / count + 0.4;
        const col = stripeIdx % 2 === 0 ? stripesH.color1 : stripesH.color2;
        bands.push({ points: rectPoints(0, y0, 150, y1 - y0), color: col });
      }
    } else if (verticalRects.length >= 2 && horizontalRects.length === 0) {
      for (let i = 0; i < BAND_COUNT; i++) {
        const rIdx = Math.min(
          verticalRects.length - 1,
          Math.floor((i * verticalRects.length) / BAND_COUNT)
        );
        const r = verticalRects[rIdx];
        const x0 = r.x * 1.5;
        const w = r.w * 1.5 + 0.5;
        bands.push({ points: rectPoints(x0, 0, w, 100), color: r.color });
      }
    } else if (horizontalRects.length >= 2) {
      for (let i = 0; i < BAND_COUNT; i++) {
        const rIdx = Math.min(
          horizontalRects.length - 1,
          Math.floor((i * horizontalRects.length) / BAND_COUNT)
        );
        const r = horizontalRects[rIdx];
        bands.push({ points: rectPoints(0, r.y, 150, r.h + 0.5), color: r.color });
      }
    } else {
      for (let i = 0; i < BAND_COUNT; i++) {
        const y0 = (i * 100) / BAND_COUNT;
        const h = 100 / BAND_COUNT + 0.5;
        bands.push({ points: rectPoints(0, y0, 150, h), color: baseColor });
      }
    }

    // Secondary geometric overlays (cantons, triangles, diagonals, crosses, saltires, diamonds, pennants)
    const overlays = [];
    layers.forEach((l) => {
      if (l.type === "rect" && (l.w < 90 || l.h < 90)) {
        // Skip rects already used as main vertical/horizontal bands unless it's a canton or hoist bar on horizontal bands
        const isMainVert = verticalRects.includes(l) && horizontalRects.length === 0;
        const isMainHoriz = horizontalRects.includes(l);
        if (!isMainVert && !isMainHoriz) {
          overlays.push({
            kind: "poly",
            points: rectPoints(l.x * 1.5, l.y, l.w * 1.5, l.h),
            color: l.color
          });
        }
      } else if (l.type === "hoist-triangle") {
        overlays.push({
          kind: "poly",
          points: [
            [0, 0],
            [68, 50],
            [0, 100],
            [0, 50]
          ],
          color: l.color
        });
      } else if (l.type === "diag-band") {
        if (l.color2) {
          overlays.push({
            kind: "poly",
            points: [
              [0, 76],
              [118, 0],
              [150, 0],
              [150, 24],
              [32, 100],
              [0, 100]
            ],
            color: l.color2
          });
        }
        overlays.push({
          kind: "poly",
          points: [
            [0, 84],
            [128, 0],
            [150, 0],
            [150, 16],
            [22, 100],
            [0, 100]
          ],
          color: l.color1
        });
      } else if (l.type === "split-diag-poly") {
        overlays.push({
          kind: "poly",
          points: [
            [0, 100],
            [150, 0],
            [150, 100],
            [75, 100]
          ],
          color: l.color
        });
      } else if (l.type === "serrated") {
        const zig = [[36, 0]];
        for (let z = 0; z < 9; z++) {
          zig.push([50, z * 11.1 + 5.5]);
          zig.push([36, (z + 1) * 11.1]);
        }
        zig.push([0, 100], [0, 0]);
        overlays.push({
          kind: "poly",
          points: zig,
          color: l.color
        });
      } else if (l.type === "nepal-pennant") {
        overlays.push({
          kind: "poly",
          points: [
            [12, 4],
            [96, 48],
            [36, 48],
            [102, 96],
            [12, 96]
          ],
          color: l.color2
        });
        overlays.push({
          kind: "poly",
          points: [
            [16, 10],
            [84, 45],
            [28, 45],
            [90, 92],
            [16, 92]
          ],
          color: l.color1
        });
      } else if (l.type === "diamond") {
        const cx = l.x * 1.5;
        const cy = l.y;
        const hw = (l.w * 1.5) / 2;
        const hh = l.h / 2;
        overlays.push({
          kind: "poly",
          points: [
            [cx, cy - hh],
            [cx + hw, cy],
            [cx, cy + hh],
            [cx - hw, cy]
          ],
          color: l.color
        });
      } else if (l.type === "cross") {
        const cx = l.x * 1.5;
        const cy = l.y;
        const th = l.thickness;
        overlays.push({
          kind: "poly",
          points: rectPoints(0, cy - th / 2, 150, th),
          color: l.color
        });
        overlays.push({
          kind: "poly",
          points: rectPoints(cx - th / 2, 0, th, 100),
          color: l.color
        });
      } else if (l.type === "uk-saltire") {
        overlays.push({
          kind: "poly",
          points: [
            [0, 0],
            [22, 0],
            [150, 86],
            [150, 100],
            [128, 100],
            [0, 14]
          ],
          color: l.color1
        });
        overlays.push({
          kind: "poly",
          points: [
            [150, 0],
            [150, 14],
            [22, 100],
            [0, 100],
            [0, 86],
            [128, 0]
          ],
          color: l.color1
        });
        overlays.push({
          kind: "poly",
          points: [
            [0, 0],
            [11, 0],
            [150, 92],
            [150, 100],
            [139, 100],
            [0, 8]
          ],
          color: l.color2
        });
        overlays.push({
          kind: "poly",
          points: [
            [150, 0],
            [150, 8],
            [11, 100],
            [0, 100],
            [0, 92],
            [139, 0]
          ],
          color: l.color2
        });
      } else if (l.type === "jamaica-saltire") {
        overlays.push({
          kind: "poly",
          points: [
            [0, 12],
            [62, 50],
            [0, 88],
            [0, 50]
          ],
          color: l.color1
        });
        overlays.push({
          kind: "poly",
          points: [
            [150, 12],
            [150, 88],
            [88, 50],
            [150, 50]
          ],
          color: l.color1
        });
        overlays.push({
          kind: "poly",
          points: [
            [0, 0],
            [22, 0],
            [150, 86],
            [150, 100],
            [128, 100],
            [0, 14]
          ],
          color: l.color2
        });
        overlays.push({
          kind: "poly",
          points: [
            [150, 0],
            [150, 14],
            [22, 100],
            [0, 100],
            [0, 86],
            [128, 0]
          ],
          color: l.color2
        });
      } else if (l.type === "y-pall") {
        overlays.push({
          kind: "poly",
          points: [
            [0, 0],
            [25, 0],
            [78, 38],
            [150, 38],
            [150, 62],
            [78, 62],
            [25, 100],
            [0, 100],
            [48, 50]
          ],
          color: l.color
        });
        overlays.push({
          kind: "poly",
          points: [
            [0, 18],
            [38, 50],
            [0, 82],
            [0, 50]
          ],
          color: "#000000"
        });
      }
    });

    const emblems = layers
      .filter((l) => l.type === "emblem")
      .map((e) => ({
        shape: e.shape,
        x: e.x * 1.5,
        y: e.y,
        r: e.r,
        color: e.color
      }));

    const compiled = { bands, overlays, emblems };
    sigCache.set(country.id, compiled);
    return compiled;
  }

  function normalizePolygon(pts, targetLen = 8) {
    const res = [];
    for (let i = 0; i < targetLen; i++) {
      const idx = Math.min(pts.length - 1, Math.floor((i * pts.length) / targetLen));
      res.push(pts[idx]);
    }
    return res;
  }

  function renderEmblemInnerSVG(emblem, scale = 1, opacity = 1, rotDeg = 0) {
    if (!emblem || opacity <= 0.01) return "";
    const { shape, x, y, r, color } = emblem;
    const rad = r * scale;
    if (rad <= 0.2) return "";

    let inner = "";
    if (shape === "circle") {
      inner = `<circle cx="0" cy="0" r="${rad}" fill="${color}" />`;
    } else if (shape === "sun") {
      let rays = "";
      for (let i = 0; i < 16; i++) {
        const ang = (i * 360) / 16;
        rays += `<polygon points="-1.8,0 1.8,0 0,-${rad * 1.38}" fill="${color}" transform="rotate(${ang})" />`;
      }
      inner = `${rays}<circle cx="0" cy="0" r="${rad * 0.68}" fill="${color}" stroke="#d97706" stroke-width="1"/>`;
    } else if (shape === "wheel") {
      let spokes = "";
      for (let i = 0; i < 12; i++) {
        const ang = i * 15;
        spokes += `<line x1="0" y1="-${rad * 0.9}" x2="0" y2="${rad * 0.9}" stroke="${color}" stroke-width="1.3" transform="rotate(${ang})" />`;
      }
      inner = `<circle cx="0" cy="0" r="${rad * 0.92}" fill="none" stroke="${color}" stroke-width="2.2"/>${spokes}<circle cx="0" cy="0" r="${rad * 0.22}" fill="${color}"/>`;
    } else if (shape === "star") {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = ((i * 36 - 90) * Math.PI) / 180;
        const rr = i % 2 === 0 ? rad : rad * 0.4;
        pts.push(`${(Math.cos(a) * rr).toFixed(2)},${(Math.sin(a) * rr).toFixed(2)}`);
      }
      inner = `<polygon points="${pts.join(" ")}" fill="${color}" />`;
    } else if (shape === "stars-grid") {
      let stars = "";
      for (let row = -1; row <= 1; row++) {
        for (let col = -1.5; col <= 1.5; col += 1) {
          const sx = col * (rad * 0.62);
          const sy = row * (rad * 0.5);
          stars += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(rad * 0.14).toFixed(1)}" fill="${color}" />`;
        }
      }
      inner = stars;
    } else if (shape === "maple") {
      const s = rad / 20;
      inner = `<g transform="scale(${s})">
        <path d="M 0,-20 L 4,-11 L 11,-13 L 8,-3 L 18,-5 L 15,0 L 20,4 L 9,9 L 11,14 L 2,12 L 2,21 L -2,21 L -2,12 L -11,14 L -9,9 L -20,4 L -15,0 L -18,-5 L -8,-3 L -11,-13 L -4,-11 Z" fill="${color}" />
      </g>`;
    } else if (shape === "globe") {
      inner = `<circle cx="0" cy="0" r="${rad}" fill="${color}" />
        <path d="M -${rad * 0.95},-${rad * 0.18} Q 0,-${rad * 0.45} ${rad * 0.95},${rad * 0.22}" fill="none" stroke="#FFFFFF" stroke-width="${rad * 0.22}" stroke-linecap="round"/>
        <circle cx="-${rad * 0.3}" cy="${rad * 0.3}" r="${rad * 0.08}" fill="#FFFFFF"/>
        <circle cx="${rad * 0.2}" cy="${rad * 0.35}" r="${rad * 0.08}" fill="#FFFFFF"/>
        <circle cx="0" cy="${rad * 0.5}" r="${rad * 0.08}" fill="#FFFFFF"/>`;
    } else if (shape === "swiss-cross") {
      const arm = rad * 0.95;
      const th = rad * 0.56;
      inner = `<rect x="-${arm}" y="-${th / 2}" width="${arm * 2}" height="${th}" fill="${color}" rx="1"/>
               <rect x="-${th / 2}" y="-${arm}" width="${th}" height="${arm * 2}" fill="${color}" rx="1"/>`;
    } else if (shape === "crescent-star") {
      inner = `<circle cx="-${rad * 0.15}" cy="0" r="${rad * 0.85}" fill="${color}" />
               <circle cx="${rad * 0.1}" cy="0" r="${rad * 0.66}" fill="#0f172a" fill-opacity="0.7" />
               <circle cx="${rad * 0.55}" cy="0" r="${rad * 0.25}" fill="${color}" />`;
    } else if (shape === "taegeuk") {
      inner = `<circle cx="0" cy="0" r="${rad}" fill="#CD2E3A" />
               <path d="M -${rad},0 A ${rad},${rad} 0 0,0 ${rad},0 A ${rad / 2},${rad / 2} 0 0,1 0,0 A ${rad / 2},${rad / 2} 0 0,0 -${rad},0 Z" fill="#0047A0" />`;
    } else if (shape === "southern-cross") {
      const d = rad * 0.65;
      inner = `<circle cx="0" cy="-${d}" r="${rad * 0.18}" fill="${color}" stroke="#fff" stroke-width="0.8"/>
               <circle cx="0" cy="${d}" r="${rad * 0.2}" fill="${color}" stroke="#fff" stroke-width="0.8"/>
               <circle cx="-${d * 0.75}" cy="-${d * 0.1}" r="${rad * 0.18}" fill="${color}" stroke="#fff" stroke-width="0.8"/>
               <circle cx="${d * 0.7}" cy="-${d * 0.2}" r="${rad * 0.16}" fill="${color}" stroke="#fff" stroke-width="0.8"/>`;
    } else if (shape === "trident") {
      inner = `<path d="M 0,-${rad} L 0,${rad} M -${rad * 0.6},-${rad * 0.8} L -${rad * 0.6},${rad * 0.2} L ${rad * 0.6},${rad * 0.2} L ${rad * 0.6},-${rad * 0.8}" fill="none" stroke="${color}" stroke-width="${rad * 0.22}" stroke-linecap="round"/>`;
    } else if (shape === "triangle-emblem") {
      inner = `<polygon points="0,-${rad} ${rad * 0.85},${rad * 0.75} -${rad * 0.85},${rad * 0.75}" fill="#000000" stroke="#FFFFFF" stroke-width="2"/>
               <polygon points="0,-${rad * 0.35} ${rad * 0.78},${rad * 0.75} -${rad * 0.78},${rad * 0.75}" fill="${color}" />`;
    } else if (shape === "diamond-gems" || shape === "diamond") {
      inner = `<polygon points="0,-${rad} ${rad * 0.75},0 0,${rad} -${rad * 0.75},0" fill="${color}" stroke="#FFFFFF" stroke-width="1"/>`;
    } else if (shape === "shield") {
      inner = `<path d="M -${rad * 0.7},-${rad * 0.8} L ${rad * 0.7},-${rad * 0.8} L ${rad * 0.7},${rad * 0.1} Q 0,${rad} -${rad * 0.7},${rad * 0.1} Z" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>`;
    } else {
      inner = `<circle cx="0" cy="0" r="${rad}" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
               <circle cx="0" cy="0" r="${rad * 0.55}" fill="#fbbf24" />`;
    }

    return `<g transform="translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${rotDeg.toFixed(1)})" opacity="${opacity.toFixed(2)}">${inner}</g>`;
  }

  // Render an interpolated SVG string between Country A and Country B at progress t in [0, 1]
  function renderMorphedFlagSVG(countryA, countryB, rawT, styleMode = "shape") {
    const t = Math.max(0, Math.min(1, rawT));
    const smoothT = easeInOutCubic(t);
    const sigA = compileFlagSignature(countryA);
    const sigB = compileFlagSignature(countryB);

    let svgBody = "";

    // 1. Interpolate the 13 canonical polygon bands
    for (let i = 0; i < BAND_COUNT; i++) {
      let localT = smoothT;
      if (styleMode === "wave") {
        const offset = (i / BAND_COUNT) * 0.28;
        localT = easeInOutCubic(Math.max(0, Math.min(1, (t - offset * 0.5) / (1 - offset * 0.5))));
      } else if (styleMode === "tiles") {
        const offset = ((i % 4) / 4) * 0.3;
        localT = easeInOutCubic(Math.max(0, Math.min(1, (t - offset * 0.4) / (1 - offset * 0.4))));
      }

      const bA = sigA.bands[i];
      const bB = sigB.bands[i];
      const col = lerpColor(bA.color, bB.color, localT);

      const waveRipple =
        styleMode === "wave"
          ? Math.sin(t * Math.PI) * Math.sin((i / BAND_COUNT) * Math.PI * 2 + t * 6) * 5.5
          : 0;

      const pts = bA.points.map((ptA, idx) => {
        const ptB = bB.points[idx];
        const x = lerp(ptA[0], ptB[0], localT) + waveRipple;
        const y = lerp(ptA[1], ptB[1], localT) + waveRipple * 0.5;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      });

      svgBody += `<polygon points="${pts.join(" ")}" fill="${col}" stroke="${col}" stroke-width="0.4" />`;
    }

    // 2. Interpolate secondary overlays
    const maxOverlays = Math.max(sigA.overlays.length, sigB.overlays.length);
    for (let i = 0; i < maxOverlays; i++) {
      const ovA = sigA.overlays[i];
      const ovB = sigB.overlays[i];

      if (ovA && ovB) {
        const ptsA = normalizePolygon(ovA.points, 8);
        const ptsB = normalizePolygon(ovB.points, 8);
        const col = lerpColor(ovA.color, ovB.color, smoothT);
        const pts = ptsA.map((pA, k) => {
          const pB = ptsB[k];
          return `${lerp(pA[0], pB[0], smoothT).toFixed(2)},${lerp(pA[1], pB[1], smoothT).toFixed(2)}`;
        });
        svgBody += `<polygon points="${pts.join(" ")}" fill="${col}" />`;
      } else if (ovA && !ovB) {
        const ptsA = normalizePolygon(ovA.points, 8);
        const scale = 1 - smoothT;
        const pts = ptsA.map((p) => {
          const x = 75 + (p[0] - 75) * scale;
          const y = 50 + (p[1] - 50) * scale;
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        });
        svgBody += `<polygon points="${pts.join(" ")}" fill="${ovA.color}" opacity="${(1 - smoothT).toFixed(2)}" />`;
      } else if (!ovA && ovB) {
        const ptsB = normalizePolygon(ovB.points, 8);
        const scale = smoothT;
        const pts = ptsB.map((p) => {
          const x = 75 + (p[0] - 75) * scale;
          const y = 50 + (p[1] - 50) * scale;
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        });
        svgBody += `<polygon points="${pts.join(" ")}" fill="${ovB.color}" opacity="${smoothT.toFixed(2)}" />`;
      }
    }

    // 3. Interpolate Emblems
    const maxEmblems = Math.max(sigA.emblems.length, sigB.emblems.length);
    for (let i = 0; i < maxEmblems; i++) {
      const emA = sigA.emblems[i];
      const emB = sigB.emblems[i];
      if (emA && emB) {
        const x = lerp(emA.x, emB.x, smoothT);
        const y = lerp(emA.y, emB.y, smoothT);
        const r = lerp(emA.r, emB.r, smoothT);
        const col = lerpColor(emA.color, emB.color, smoothT);
        const rotA = smoothT * 90;
        const rotB = (1 - smoothT) * -90;
        svgBody += renderEmblemInnerSVG({ ...emA, x, y, r, color: col }, 1, 1 - smoothT, rotA);
        svgBody += renderEmblemInnerSVG({ ...emB, x, y, r, color: col }, 1, smoothT, rotB);
      } else if (emA && !emB) {
        svgBody += renderEmblemInnerSVG(emA, 1 - smoothT * 0.7, 1 - smoothT, smoothT * 60);
      } else if (!emA && emB) {
        svgBody += renderEmblemInnerSVG(emB, 0.3 + smoothT * 0.7, smoothT, (1 - smoothT) * -60);
      }
    }

    return `<svg viewBox="0 0 150 100" preserveAspectRatio="none" class="flag-svg-stage">${svgBody}</svg>`;
  }

  // =========================================================================
  // 4. QUIZ & GUESSING GAME CONTROLLER
  // =========================================================================
  let quizMode = "morph-target";
  let quizScore = 0;
  let quizStreak = 0;
  let quizStartCountry = COUNTRIES[0];
  let quizTargetCountry = COUNTRIES[1];
  let quizOptions = [];
  let quizAnswered = false;
  let quizProgress = 0;
  let quizAnimFrame = null;
  let quizPaused = false;

  const quizStageContainer = document.getElementById("quiz-flag-stage");
  const quizSlider = document.getElementById("quiz-morph-slider");
  const quizPercentLabel = document.getElementById("quiz-morph-percent");
  const quizFromPill = document.getElementById("quiz-from-pill");
  const quizToPill = document.getElementById("quiz-to-pill");
  const quizPromptTitle = document.getElementById("quiz-prompt-title");
  const quizHintBox = document.getElementById("quiz-hint-box");
  const quizOptionsGrid = document.getElementById("quiz-options-grid");
  const quizFeedbackText = document.getElementById("quiz-feedback-text");
  const quizScoreEl = document.getElementById("quiz-score-val");
  const quizStreakEl = document.getElementById("quiz-streak-val");

  function pickRandomCountries(count, excludeIds = []) {
    const pool = COUNTRIES.filter((c) => !excludeIds.includes(c.id));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  function updateQuizStageVisual() {
    if (!quizStageContainer) return;
    quizStageContainer.innerHTML =
      renderMorphedFlagSVG(quizStartCountry, quizTargetCountry, quizProgress, "shape") +
      `<div class="flag-sheen"></div>`;
    if (quizSlider) quizSlider.value = Math.round(quizProgress * 100);
    if (quizPercentLabel) quizPercentLabel.textContent = `${Math.round(quizProgress * 100)}% Morphed`;
  }

  function startNewQuizRound() {
    if (quizAnimFrame) cancelAnimationFrame(quizAnimFrame);
    quizAnswered = false;
    quizPaused = false;

    const [startC, targetC] = pickRandomCountries(2);
    quizStartCountry = startC;
    quizTargetCountry = targetC;

    quizFromPill.textContent = `Start: ${quizStartCountry.name}`;
    quizToPill.className = "country-pill mystery";

    if (quizMode === "morph-target") {
      quizToPill.textContent = "Target: ??? Mystery Flag";
      quizPromptTitle.textContent = `Which country's flag is ${quizStartCountry.name} morphing into?`;
      quizHintBox.textContent = `Continent Clue: ${quizTargetCountry.continent} (Capital: ${quizTargetCountry.capital}) — Watch the shapes & colors morph!`;
      const distractors = pickRandomCountries(3, [quizStartCountry.id, quizTargetCountry.id]);
      quizOptions = [quizTargetCountry, ...distractors].sort(() => Math.random() - 0.5);
      quizProgress = 0;
      animateQuizMorph(0, 1, 5200);
    } else if (quizMode === "halfway-blend") {
      quizToPill.textContent = "50% Hybrid Blend!";
      quizPromptTitle.textContent = `${quizStartCountry.name} is blended 50/50 with which country?`;
      quizHintBox.textContent = `Clue: ${quizTargetCountry.funFact}`;
      const distractors = pickRandomCountries(3, [quizStartCountry.id, quizTargetCountry.id]);
      quizOptions = [quizTargetCountry, ...distractors].sort(() => Math.random() - 0.5);
      quizProgress = 0.5;
      updateQuizStageVisual();
    } else if (quizMode === "size-showdown") {
      quizToPill.className = "country-pill revealed";
      quizToPill.textContent = `vs. ${quizTargetCountry.name}`;
      quizPromptTitle.textContent = `Size Showdown: Which country has the LARGER land area?`;
      quizHintBox.textContent = `Compare ${quizStartCountry.name} (${quizStartCountry.continent}) and ${quizTargetCountry.name} (${quizTargetCountry.continent})!`;
      quizOptions = [quizStartCountry, quizTargetCountry];
      quizProgress = 0;
      animateQuizMorph(0, 1, 3500);
    }

    quizFeedbackText.textContent = "Pick an answer below! Guessing early earns bonus points.";
    renderQuizOptions();
    playMorphWhoosh();
  }

  function animateQuizMorph(fromVal, toVal, durationMs) {
    if (quizAnimFrame) cancelAnimationFrame(quizAnimFrame);
    const startTime = performance.now();

    function step(now) {
      if (quizPaused) return;
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / durationMs);
      quizProgress = lerp(fromVal, toVal, ratio);
      updateQuizStageVisual();
      if (ratio < 1) {
        quizAnimFrame = requestAnimationFrame(step);
      }
    }
    quizAnimFrame = requestAnimationFrame(step);
  }

  function renderQuizOptions() {
    quizOptionsGrid.innerHTML = "";
    quizOptions.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option-btn";
      btn.dataset.id = opt.id;
      btn.innerHTML = `
        <div class="option-mini-preview">${renderMorphedFlagSVG(opt, opt, 1)}</div>
        <span>${opt.name}</span>
      `;
      btn.addEventListener("click", () => handleQuizGuess(opt, btn));
      quizOptionsGrid.appendChild(btn);
    });
  }

  function handleQuizGuess(chosenCountry, btnEl) {
    if (quizAnswered) return;
    quizAnswered = true;
    if (quizAnimFrame) cancelAnimationFrame(quizAnimFrame);

    let correctCountry = quizTargetCountry;
    if (quizMode === "size-showdown") {
      correctCountry =
        quizStartCountry.areaKm2 >= quizTargetCountry.areaKm2
          ? quizStartCountry
          : quizTargetCountry;
    }

    const isCorrect = chosenCountry.id === correctCountry.id;

    quizProgress = 1;
    updateQuizStageVisual();
    quizToPill.className = "country-pill revealed";
    quizToPill.textContent = `Target: ${quizTargetCountry.name}`;

    Array.from(quizOptionsGrid.children).forEach((b) => {
      b.disabled = true;
      if (b.dataset.id === correctCountry.id) {
        b.classList.add("correct");
      } else if (b === btnEl && !isCorrect) {
        b.classList.add("wrong");
      }
    });

    if (isCorrect) {
      quizStreak += 1;
      const bonus = quizStreak >= 3 ? 150 : 100;
      quizScore += bonus;
      playSuccessSound();
      if (quizMode === "size-showdown") {
        const bigger = correctCountry;
        const smaller =
          bigger.id === quizStartCountry.id ? quizTargetCountry : quizStartCountry;
        const ratio = (bigger.areaKm2 / smaller.areaKm2).toFixed(1);
        const msg = `Awesome! ${bigger.name} is ${ratio}x bigger than ${smaller.name}!`;
        quizFeedbackText.innerHTML = `<strong style="color:var(--accent-green)">★ Correct! (+${bonus})</strong> ${msg}`;
        speakText(msg);
      } else {
        quizFeedbackText.innerHTML = `<strong style="color:var(--accent-green)">★ Correct! (+${bonus})</strong> ${correctCountry.funFact}`;
        speakText(correctCountry.name);
      }
    } else {
      quizStreak = 0;
      playWrongSound();
      const msg = `Not quite! The answer is ${correctCountry.name}.`;
      quizFeedbackText.innerHTML = `<strong style="color:var(--accent-red)">Almost!</strong> It was <strong>${correctCountry.name}</strong> — drag the slider to inspect the morph!`;
      speakText(msg);
    }

    quizScoreEl.textContent = quizScore;
    quizStreakEl.textContent = quizStreak;
  }

  if (quizSlider) {
    quizSlider.addEventListener("input", (e) => {
      quizPaused = true;
      if (quizAnimFrame) cancelAnimationFrame(quizAnimFrame);
      quizProgress = parseFloat(e.target.value) / 100;
      updateQuizStageVisual();
    });
  }

  document.getElementById("quiz-next-btn")?.addEventListener("click", startNewQuizRound);
  document.getElementById("quiz-replay-btn")?.addEventListener("click", () => {
    quizPaused = false;
    animateQuizMorph(0, 1, 3200);
    playMorphWhoosh();
  });

  document.querySelectorAll(".mode-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".mode-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      quizMode = pill.dataset.mode;
      startNewQuizRound();
    });
  });

  // =========================================================================
  // 5. INTERACTIVE FLAG MORPH LAB (FREE-PLAY EXPLORER FOR ALL 197 FLAGS)
  // =========================================================================
  const sortedByName = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
  let labCountryA = COUNTRIES.find((c) => c.id === "us") || COUNTRIES[0];
  let labCountryB = COUNTRIES.find((c) => c.id === "br") || COUNTRIES[1];
  let labProgress = 0;
  let labStyle = "shape";
  let labAnimFrame = null;
  let labAutoTourTimer = null;
  let activeContinentFilter = "all";
  let searchQuery = "";

  const labStage = document.getElementById("lab-flag-stage");
  const labSelectA = document.getElementById("lab-select-a");
  const labSelectB = document.getElementById("lab-select-b");
  const labSlider = document.getElementById("lab-morph-slider");
  const labPercent = document.getElementById("lab-morph-percent");
  const labFactCard = document.getElementById("lab-country-info");
  const labGalleryGrid = document.getElementById("lab-gallery-grid");
  const galleryCountLabel = document.getElementById("gallery-count-label");
  const labSearchInput = document.getElementById("lab-search-input");

  function populateSelects(selectEl, selectedId) {
    if (!selectEl) return;
    selectEl.innerHTML = sortedByName
      .map(
        (c) =>
          `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${c.name} (${c.continent})</option>`
      )
      .join("");
  }

  function updateLabVisual() {
    if (!labStage) return;
    labStage.innerHTML =
      renderMorphedFlagSVG(labCountryA, labCountryB, labProgress, labStyle) +
      `<div class="flag-sheen"></div>`;
    if (labSlider) labSlider.value = Math.round(labProgress * 100);
    if (labPercent) labPercent.textContent = `${Math.round(labProgress * 100)}%`;

    const activeC = labProgress < 0.5 ? labCountryA : labCountryB;
    if (labFactCard) {
      labFactCard.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:1.3rem; font-weight:800; color:var(--accent-primary);">${activeC.name}</span>
          <span class="country-pill">${activeC.continent}</span>
        </div>
        <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:10px;">
          <strong>Capital:</strong> ${activeC.capital} &nbsp;|&nbsp;
          <strong>Population:</strong> ${activeC.population} &nbsp;|&nbsp;
          <strong>Area:</strong> ${activeC.areaKm2.toLocaleString()} km²
        </p>
        <div class="quiz-hint-box">${activeC.funFact}</div>
      `;
    }

    document.querySelectorAll(".flag-card-item").forEach((card) => {
      card.classList.toggle("selected-a", card.dataset.id === labCountryA.id);
      card.classList.toggle("selected-b", card.dataset.id === labCountryB.id);
    });
  }

  function triggerLabMorph(fromVal = 0, toVal = 1, duration = 1800) {
    if (labAnimFrame) cancelAnimationFrame(labAnimFrame);
    const start = performance.now();
    playMorphWhoosh();

    function frame(now) {
      const ratio = Math.min(1, (now - start) / duration);
      labProgress = lerp(fromVal, toVal, ratio);
      updateLabVisual();
      if (ratio < 1) {
        labAnimFrame = requestAnimationFrame(frame);
      }
    }
    labAnimFrame = requestAnimationFrame(frame);
  }

  function renderGalleryCards() {
    if (!labGalleryGrid) return;
    const q = searchQuery.trim().toLowerCase();
    const filtered = sortedByName.filter((c) => {
      const matchesContinent =
        activeContinentFilter === "all" || c.continent.includes(activeContinentFilter);
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q);
      return matchesContinent && matchesSearch;
    });

    if (galleryCountLabel) galleryCountLabel.textContent = filtered.length;

    labGalleryGrid.innerHTML = "";
    filtered.forEach((c) => {
      const card = document.createElement("div");
      card.className = "flag-card-item";
      if (c.id === labCountryA.id) card.classList.add("selected-a");
      if (c.id === labCountryB.id) card.classList.add("selected-b");
      card.dataset.id = c.id;
      card.innerHTML = `
        <div class="flag-thumb">${renderMorphedFlagSVG(c, c, 1)}</div>
        <div class="flag-card-name" title="${c.name}">${c.name}</div>
      `;
      card.addEventListener("click", () => {
        if (labProgress > 0.5) {
          labCountryA = labCountryB;
        }
        labCountryB = c;
        populateSelects(labSelectA, labCountryA.id);
        populateSelects(labSelectB, labCountryB.id);
        triggerLabMorph(0, 1, 1600);
        speakText(c.name);
      });
      labGalleryGrid.appendChild(card);
    });
  }

  function initLab() {
    populateSelects(labSelectA, labCountryA.id);
    populateSelects(labSelectB, labCountryB.id);

    labSelectA?.addEventListener("change", (e) => {
      labCountryA = COUNTRIES.find((c) => c.id === e.target.value) || COUNTRIES[0];
      triggerLabMorph(1, 0, 1400);
    });

    labSelectB?.addEventListener("change", (e) => {
      labCountryB = COUNTRIES.find((c) => c.id === e.target.value) || COUNTRIES[1];
      triggerLabMorph(0, 1, 1400);
    });

    labSlider?.addEventListener("input", (e) => {
      if (labAnimFrame) cancelAnimationFrame(labAnimFrame);
      labProgress = parseFloat(e.target.value) / 100;
      updateLabVisual();
    });

    document.getElementById("lab-play-btn")?.addEventListener("click", () => {
      const target = labProgress > 0.5 ? 0 : 1;
      triggerLabMorph(labProgress, target, 1800);
      const destC = target === 1 ? labCountryB : labCountryA;
      speakText(`${destC.name}. ${destC.funFact}`);
    });

    document.getElementById("lab-swap-btn")?.addEventListener("click", () => {
      const temp = labCountryA;
      labCountryA = labCountryB;
      labCountryB = temp;
      populateSelects(labSelectA, labCountryA.id);
      populateSelects(labSelectB, labCountryB.id);
      triggerLabMorph(0, 1, 1600);
    });

    document.getElementById("lab-random-btn")?.addEventListener("click", () => {
      const [c1, c2] = pickRandomCountries(2);
      labCountryA = c1;
      labCountryB = c2;
      populateSelects(labSelectA, labCountryA.id);
      populateSelects(labSelectB, labCountryB.id);
      triggerLabMorph(0, 1, 1800);
      speakText(`Morphing ${labCountryA.name} into ${labCountryB.name}`);
    });

    const autoTourBtn = document.getElementById("lab-autotour-btn");
    autoTourBtn?.addEventListener("click", () => {
      if (labAutoTourTimer) {
        clearInterval(labAutoTourTimer);
        labAutoTourTimer = null;
        autoTourBtn.textContent = "▶ Auto-Morph Tour";
      } else {
        autoTourBtn.textContent = "⏹ Stop Auto-Tour";
        const advanceTour = () => {
          labCountryA = labCountryB;
          const [nextC] = pickRandomCountries(1, [labCountryA.id]);
          labCountryB = nextC;
          populateSelects(labSelectA, labCountryA.id);
          populateSelects(labSelectB, labCountryB.id);
          triggerLabMorph(0, 1, 2000);
          speakText(labCountryB.name);
        };
        advanceTour();
        labAutoTourTimer = setInterval(advanceTour, 3400);
      }
    });

    document.querySelectorAll(".style-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".style-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        labStyle = chip.dataset.style;
        triggerLabMorph(0, 1, 1800);
      });
    });

    document.querySelectorAll(".continent-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".continent-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        activeContinentFilter = pill.dataset.continent;
        renderGalleryCards();
      });
    });

    labSearchInput?.addEventListener("input", (e) => {
      searchQuery = e.target.value || "";
      renderGalleryCards();
    });

    renderGalleryCards();
    updateLabVisual();
  }

  // =========================================================================
  // 6. TRUE-SCALE COUNTRY SIZE COMPARISON MODULE
  // =========================================================================
  let sizeCountryA = COUNTRIES.find((c) => c.id === "us") || COUNTRIES[0];
  let sizeCountryB = COUNTRIES.find((c) => c.id === "jp") || COUNTRIES[1];
  let sizeOverlayMode = false;

  const sizeSelectA = document.getElementById("size-select-a");
  const sizeSelectB = document.getElementById("size-select-b");
  const sizeStageSvg = document.getElementById("size-compare-svg");
  const sizeRatioCallout = document.getElementById("size-ratio-callout");
  const sizeFitsGrid = document.getElementById("size-fits-grid");
  const sizeLadderContainer = document.getElementById("size-ladder-bars");

  function renderSizeComparison() {
    if (!sizeStageSvg) return;

    const maxArea = Math.max(sizeCountryA.areaKm2, sizeCountryB.areaKm2);
    const scaleA = Math.sqrt(sizeCountryA.areaKm2 / maxArea);
    const scaleB = Math.sqrt(sizeCountryB.areaKm2 / maxArea);

    const maxRadiusPx = 155;
    const sizePxA = Math.max(12, scaleA * maxRadiusPx);
    const sizePxB = Math.max(12, scaleB * maxRadiusPx);

    const cxA = sizeOverlayMode ? 320 : 190;
    const cyA = 200;
    const cxB = sizeOverlayMode ? 320 : 460;
    const cyB = 200;

    sizeStageSvg.innerHTML = `
      <defs>
        <filter id="glowA" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#38bdf8" flood-opacity="0.45"/>
        </filter>
        <filter id="glowB" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#fbbf24" flood-opacity="0.5"/>
        </filter>
      </defs>

      <!-- Country A Silhouette -->
      <g transform="translate(${cxA - sizePxA}, ${cyA - sizePxA}) scale(${(sizePxA * 2) / 100})" filter="url(#glowA)">
        <path d="${sizeCountryA.outlinePath}" fill="rgba(56, 189, 248, 0.42)" stroke="#38bdf8" stroke-width="${2.2 / ((sizePxA * 2) / 100)}" stroke-linejoin="round"/>
      </g>
      <text x="${cxA}" y="${sizeOverlayMode ? 42 : 380}" text-anchor="middle" fill="#7dd3fc" font-weight="800" font-size="16">
        ${sizeCountryA.name}: ${sizeCountryA.areaKm2.toLocaleString()} km²
      </text>

      <!-- Country B Silhouette -->
      <g transform="translate(${cxB - sizePxB}, ${cyB - sizePxB}) scale(${(sizePxB * 2) / 100})" filter="url(#glowB)">
        <path d="${sizeCountryB.outlinePath}" fill="rgba(251, 191, 36, 0.52)" stroke="#fbbf24" stroke-width="${2.2 / ((sizePxB * 2) / 100)}" stroke-linejoin="round"/>
      </g>
      <text x="${cxB}" y="${sizeOverlayMode ? 68 : 380}" text-anchor="middle" fill="#fde68a" font-weight="800" font-size="16">
        ${sizeCountryB.name}: ${sizeCountryB.areaKm2.toLocaleString()} km²
      </text>
    `;

    const bigger = sizeCountryA.areaKm2 >= sizeCountryB.areaKm2 ? sizeCountryA : sizeCountryB;
    const smaller = bigger.id === sizeCountryA.id ? sizeCountryB : sizeCountryA;
    const ratio = bigger.areaKm2 / smaller.areaKm2;
    const formattedRatio = ratio >= 10 ? Math.round(ratio).toLocaleString() : ratio.toFixed(1);

    if (sizeRatioCallout) {
      sizeRatioCallout.innerHTML = `
        <div class="ratio-big-number">${formattedRatio}× Bigger!</div>
        <p style="margin-top:6px; font-size:1.02rem; font-weight:700;">
          You could fit <span style="color:var(--accent-amber)">${formattedRatio} ${smaller.name}s</span> inside <span style="color:var(--accent-primary)">${bigger.name}</span>!
        </p>
        <p style="margin-top:6px; font-size:0.86rem; color:var(--text-muted);">
          ${bigger.name}: ${bigger.areaKm2.toLocaleString()} km² &nbsp;vs.&nbsp; ${smaller.name}: ${smaller.areaKm2.toLocaleString()} km²
        </p>
      `;
    }

    if (sizeFitsGrid) {
      const countToShow = Math.min(120, Math.max(1, Math.round(ratio)));
      let itemsHtml = "";
      const miniSvg = renderMorphedFlagSVG(smaller, smaller, 1);
      for (let i = 0; i < countToShow; i++) {
        itemsHtml += `<div class="mini-fit-item" title="${smaller.name} #${i + 1}">${miniSvg}</div>`;
      }
      if (ratio > 120) {
        itemsHtml += `<div style="padding:4px 8px; font-size:0.8rem; font-weight:700; color:var(--accent-amber);">+${Math.round(ratio - 120).toLocaleString()} more!</div>`;
      }
      sizeFitsGrid.innerHTML = itemsHtml;
    }
  }

  function initSizeCompare() {
    populateSelects(sizeSelectA, sizeCountryA.id);
    populateSelects(sizeSelectB, sizeCountryB.id);

    sizeSelectA?.addEventListener("change", (e) => {
      sizeCountryA = COUNTRIES.find((c) => c.id === e.target.value) || COUNTRIES[0];
      renderSizeComparison();
    });

    sizeSelectB?.addEventListener("change", (e) => {
      sizeCountryB = COUNTRIES.find((c) => c.id === e.target.value) || COUNTRIES[1];
      renderSizeComparison();
    });

    const overlayBtn = document.getElementById("size-overlay-toggle");
    overlayBtn?.addEventListener("click", () => {
      sizeOverlayMode = !sizeOverlayMode;
      overlayBtn.textContent = sizeOverlayMode
        ? "⇄ Switch to Side-by-Side View"
        : "重ね Overlay Shapes on Top of Each Other";
      renderSizeComparison();
    });

    document.getElementById("size-speak-btn")?.addEventListener("click", () => {
      const bigger = sizeCountryA.areaKm2 >= sizeCountryB.areaKm2 ? sizeCountryA : sizeCountryB;
      const smaller = bigger.id === sizeCountryA.id ? sizeCountryB : sizeCountryA;
      const ratio = (bigger.areaKm2 / smaller.areaKm2).toFixed(1);
      speakText(`${bigger.name} is ${ratio} times bigger than ${smaller.name}!`);
    });

    if (sizeLadderContainer) {
      const sorted = [...COUNTRIES].sort((a, b) => b.areaKm2 - a.areaKm2);
      const largestArea = sorted[0].areaKm2;
      sizeLadderContainer.innerHTML = sorted
        .map((c, idx) => {
          const pct = Math.max(1.5, (c.areaKm2 / largestArea) * 100);
          return `
            <div class="ladder-row" data-id="${c.id}" title="Click to compare ${c.name}">
              <div style="font-weight:700; font-size:0.88rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">#${idx + 1} ${c.name}</div>
              <div class="ladder-bar-track">
                <div class="ladder-bar-fill" style="width:${pct.toFixed(2)}%"></div>
              </div>
              <div style="text-align:right; font-size:0.8rem; color:var(--text-muted); font-weight:700;">
                ${c.areaKm2.toLocaleString()} km²
              </div>
            </div>
          `;
        })
        .join("");

      sizeLadderContainer.querySelectorAll(".ladder-row").forEach((row) => {
        row.addEventListener("click", () => {
          const clicked = COUNTRIES.find((c) => c.id === row.dataset.id);
          if (clicked) {
            sizeCountryB = clicked;
            populateSelects(sizeSelectB, sizeCountryB.id);
            renderSizeComparison();
            speakText(`Comparing ${sizeCountryA.name} and ${sizeCountryB.name}`);
          }
        });
      });
    }

    renderSizeComparison();
  }

  // =========================================================================
  // 7. TOP-LEVEL NAVIGATION & SOUND CONTROLS
  // =========================================================================
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.dataset.tab;
      document.getElementById(targetId)?.classList.add("active");
    });
  });

  const soundBtn = document.getElementById("toggle-sound-btn");
  soundBtn?.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
    if (!soundEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  });

  startNewQuizRound();
  initLab();
  initSizeCompare();
})();
