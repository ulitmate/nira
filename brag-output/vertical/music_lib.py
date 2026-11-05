"""Small numpy composer for the Nira vertical series. 120 BPM, one chord per bar (2 s), everything on the beat grid.
Usage: python3 -I music_lib.py open|ai   → writes music-<name>.wav (the intro reuses ../work/music.py).
"""
import sys, wave
import numpy as np

SR, BPM = 44100, 120
BEAT = 60 / BPM

def hz(n): return 440.0 * 2 ** ((n - 69) / 12)

def compose(cfg, path):
    dur = cfg["dur"]; N = int(SR * dur); t = np.arange(N) / SR
    rng = np.random.default_rng(cfg.get("seed", 3))
    L = np.zeros(N); R = np.zeros(N)

    def lowpass(x, c):
        X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / (1 + (f / c) ** 4); return np.fft.irfft(X, len(x))
    def highpass(x, c):
        X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / (1 + (c / np.maximum(f, 1)) ** 4); return np.fft.irfft(X, len(x))
    def add(sig, start, gain=1.0, pan=0.0):
        i = int(round(start * SR)); j = min(N, i + len(sig))
        if i >= N or j <= i: return
        s = sig[: j - i] * gain
        L[i:j] += s * (1 - max(0, pan)); R[i:j] += s * (1 + min(0, pan))
    def tone(freq, d, harm=6, bright=0.55, det=0.0):
        tt = np.arange(int(d * SR)) / SR; out = np.zeros_like(tt)
        for n in range(1, harm + 1): out += bright ** (n - 1) / n * np.sin(2 * np.pi * freq * n * (1 + det) * tt + n)
        return out
    def decay(x, k): return x * np.exp(-np.arange(len(x)) / SR * k)

    bars, drop, last = cfg["bars"], cfg["drop"], len(cfg["bars"]) - 1
    quiet = set(cfg.get("breakdown", []))
    # pad
    for b, ch in enumerate(bars):
        d = 2.0 + (2.0 if b == last else 0.35); et = np.arange(int(d * SR)) / SR
        env = np.minimum(1, et / 0.35) * np.minimum(1, np.maximum(0, (d - et) / 0.45))
        if b == last: env *= np.exp(-np.maximum(0, et - 0.5) * 0.9)
        lvl = 0.055 if b * 2 < drop else (0.04 if b in quiet else 0.05)
        for note in ch:
            for det, pan in ((-0.004, -0.5), (0.004, 0.5)):
                add(lowpass(tone(hz(note), d, 8, 0.6, det) * env, 2200), b * 2.0, lvl, pan)
    # arp
    for b, ch in enumerate(bars[:-1]):
        pat = cfg.get("arp", lambda c: [c[0], c[1], c[2], c[1] + 12, c[2], c[1], c[0] + 12, c[2]])(ch)
        for s in range(8):
            p = decay(tone(hz(pat[s] + 12), 0.4, 5, 0.45), 9)
            g = 0.033 if b * 2 < drop else (0.03 if b in quiet else 0.048)
            add(p, b * 2.0 + s * BEAT / 2, g, 0.35 if s % 2 else -0.35)
    # bass
    for b, ch in enumerate(bars):
        if b * 2 < drop: continue
        root = hz(ch[0] - 24 if ch[0] - 24 >= 28 else ch[0] - 12)
        if b in quiet:
            n = tone(root, 2.0, 3, 0.3); add(decay(n * np.minimum(1, np.arange(len(n)) / SR / 0.1), 1.2), b * 2.0, 0.16); continue
        for k in range(4 if b < last else 1):
            d = BEAT if b < last else 2.0; n = tone(root, d, 3, 0.35)
            e = np.minimum(1, np.arange(len(n)) / SR / 0.01) * np.exp(-np.arange(len(n)) / SR * (4 if b < last else 1.4))
            add(n * e, b * 2.0 + k * BEAT, 0.2)
    # drums
    def kick():
        tt = np.arange(int(0.4 * SR)) / SR; f = 45 + 75 * np.exp(-tt * 28)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
    def inr(x, ranges): return any(a <= x < b for a, b in ranges)
    for i in range(int(dur / BEAT)):
        at = i * BEAT
        if inr(at, cfg["drums"]):
            add(kick(), at, 0.42)
            h = highpass(rng.standard_normal(int(0.06 * SR)), 7000); add(decay(h, 70), at + BEAT / 2, 0.05, 0.25)
            if at >= cfg.get("claps_from", 99) and i % 2 == 1:
                c = lowpass(highpass(rng.standard_normal(int(0.25 * SR)), 900), 5000); add(decay(c, 18), at, 0.06, -0.1)
    # riser + crash into the drop
    rs = int(2.0 * SR); rt = np.arange(rs) / SR
    add(lowpass(highpass(rng.standard_normal(rs), 1500) * (rt / 2.0) ** 2.2, 9000), drop - 2.0, 0.07)
    cr = highpass(rng.standard_normal(int(1.6 * SR)), 4000); add(decay(cr, 2.6), drop, 0.045)
    # sfx (all pitched in key)
    for at, kind, note in cfg.get("sfx", []):
        if kind == "pluck": add(decay(tone(hz(note), 0.3, 3, 0.3), 20), at, 0.05)
        elif kind == "bell":
            for n2 in (note, note + 4): add(decay(tone(hz(n2), 0.9, 3, 0.3), 5), at, 0.04)
        elif kind == "pop": add(decay(tone(hz(note), 0.18, 2, 0.2) * np.minimum(1, np.arange(int(0.18 * SR)) / SR / 0.004), 28), at, 0.055)
        elif kind == "whoosh":
            w = int(0.45 * SR); wt = np.arange(w) / SR; add(lowpass(rng.standard_normal(w), 2500) * np.sin(np.pi * wt / 0.45) ** 2, at - 0.25, 0.05)
        elif kind == "impact": add(decay(tone(hz(note), 1.2, 2, 0.2), 3), at, 0.22)
        elif kind == "ticks":
            for k in range(int(note)):
                tk = highpass(rng.standard_normal(int(0.02 * SR)), 5000); add(decay(tk, 200), at + k * BEAT / 4, 0.012, 0.3)
    mix = np.stack([L, R])
    mix *= np.minimum(1, t / 0.08) * np.minimum(1, np.maximum(0, (dur - t) / 1.0))
    mix = np.tanh(mix * 1.6) / np.tanh(1.6); mix *= 0.89 / np.max(np.abs(mix))
    with wave.open(path, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix.T * 32767).astype(np.int16).tobytes())

# Chords as MIDI triads (root position, around middle C)
A, E, Fsm, D = [57, 61, 64], [52, 56, 59], [54, 57, 61], [50, 54, 57]
Am, F, C, G = [57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]

CONFIGS = {
    # Why open source: A major I–V–vi–IV, drop on the reveal (4.0), outro 19–22
    "open": dict(dur=22.0, bars=[A, E, Fsm, D, A, E, Fsm, D, A, E, D], drop=4.0, drums=[(4.0, 19.0)], claps_from=7.0,
                 sfx=[(4.5, "bell", 81), (11.75, "pluck", 76), (12.25, "pluck", 78), (12.75, "pluck", 81), (13.25, "pluck", 85),
                      (15.5, "ticks", 12), (19.0, "impact", 33)], seed=11),
    # Ask Nira: A minor vi–IV–I–V, quieter build, drums from 7.0, message pops
    "ai": dict(dur=22.0, bars=[Am, F, C, G, Am, F, C, G, Am, F, C], drop=7.0, drums=[(7.0, 19.0)], claps_from=12.0,
               sfx=[(4.5, "bell", 76), (8.0, "pop", 76), (8.75, "pop", 81), (10.25, "pop", 76), (10.75, "pop", 81),
                    (12.5, "pop", 72), (13.25, "pop", 76), (18.25, "pluck", 81), (19.0, "impact", 33)], seed=23,
               arp=lambda c: [c[0], c[2], c[1] + 12, c[2], c[0] + 12, c[2], c[1] + 12, c[2]]),
}

if __name__ == "__main__":
    name = sys.argv[1]
    compose(CONFIGS[name], f"music-{name}.wav"); print("wrote", f"music-{name}.wav")
