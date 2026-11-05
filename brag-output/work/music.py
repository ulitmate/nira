"""Original soundtrack for the Nira intro video (numpy only).
120 BPM, D major, one chord per bar (2 s). Every event sits on the beat grid counted from t = 0.
Scene cuts: 4.0 (drop), 8.0, 10.5 (sheet whoosh), 11.95 (tap), 14.0, 18.0 (breakdown), 21.0, 24.0 (end).
"""
import wave
import numpy as np

SR, DUR, BPM = 44100, 24.0, 120
BEAT = 60 / BPM
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)

def hz(note):  # MIDI → Hz
    return 440.0 * 2 ** ((note - 69) / 12)

def lowpass(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)          # gentle 4th-order-ish rolloff
    return np.fft.irfft(X, len(x))

def highpass(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (cutoff / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR); j = min(N, i + len(sig))
    if i >= N: return
    s = sig[: j - i] * gain
    L[i:j] += s * (1 - max(0, pan)); R[i:j] += s * (1 + min(0, pan))

def tone(freq, dur, harmonics=6, bright=0.55, detune=0.0):
    tt = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(tt)
    for n in range(1, harmonics + 1):
        out += (bright ** (n - 1)) / n * np.sin(2 * np.pi * freq * n * (1 + detune) * tt + n)
    return out

# Chords per bar (MIDI): D, A, Bm, G, D, A, Bm, G, D, A, G, D
D, A, Bm, G = [62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]
BARS = [D, A, Bm, G, D, A, Bm, G, D, A, G, D]
ROOTS = {tuple(D): 38, tuple(A): 33, tuple(Bm): 35, tuple(G): 31}

# ---- Pad (whole piece, swells into the drop, thins under "Free.") ----
for b, ch in enumerate(BARS):
    start, dur = b * 2.0, 2.0 + (2.0 if b == 11 else 0.35)
    env_t = np.arange(int(dur * SR)) / SR
    env = np.minimum(1, env_t / 0.35) * np.minimum(1, np.maximum(0, (dur - env_t) / 0.45))
    if b == 11: env *= np.exp(-np.maximum(0, env_t - 0.5) * 0.9)
    level = 0.055 if b < 2 else (0.04 if b == 9 else 0.05)
    for k, note in enumerate(ch):
        for det, pan in ((-0.004, -0.5), (0.004, 0.5)):
            add(lowpass(tone(hz(note), dur, 8, 0.6, det) * env, 2200), start, level, pan)

# ---- Arp: 8th-note plucks through the chord, an octave up ----
for b, ch in enumerate(BARS[:11]):
    pattern = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1], ch[0] + 12, ch[2]]
    for s in range(8):
        at = b * 2.0 + s * BEAT / 2
        if b == 11: break
        p = tone(hz(pattern[s] + 12), 0.4, 5, 0.45)
        p *= np.exp(-np.arange(len(p)) / SR * 9)
        gain = 0.035 if b < 2 else (0.05 if b != 9 else 0.03)
        add(p, at, gain, pan=0.35 if s % 2 else -0.35)

# ---- Bass: root on every beat after the drop, sustained in the breakdown ----
for b, ch in enumerate(BARS):
    if b < 2: continue
    root = hz(ROOTS[tuple(ch)])
    if b == 9:  # breakdown: one long soft note
        n = tone(root, 2.0, 3, 0.3) * np.minimum(1, np.arange(int(2.0 * SR)) / SR / 0.1) * np.exp(-np.arange(int(2.0 * SR)) / SR * 1.2)
        add(n, b * 2.0, 0.16); continue
    beats = 4 if b < 11 else 1
    for k in range(beats):
        d = BEAT if b < 11 else 2.0
        n = tone(root, d, 3, 0.35)
        e = np.minimum(1, np.arange(len(n)) / SR / 0.01) * np.exp(-np.arange(len(n)) / SR * (4 if b < 11 else 1.4))
        add(n * e, b * 2.0 + k * BEAT, 0.2)

# ---- Kick (beats 4.0–18.0 and 20.0–22.0, last hit on 22.0) ----
def kick():
    d = 0.4; tt = np.arange(int(d * SR)) / SR
    f = 45 + 75 * np.exp(-tt * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
for i in range(int(DUR / BEAT)):
    at = i * BEAT
    if 4.0 <= at < 18.0 or 20.0 <= at <= 22.0:
        add(kick(), at, 0.42)

# ---- Hats (offbeat 8ths) and a soft clap on 2 and 4 from 8.0 ----
def hat():
    n = highpass(rng.standard_normal(int(0.06 * SR)), 7000)
    return n * np.exp(-np.arange(len(n)) / SR * 70)
def clap():
    n = lowpass(highpass(rng.standard_normal(int(0.25 * SR)), 900), 5000)
    return n * np.exp(-np.arange(len(n)) / SR * 18)
for i in range(int(DUR / BEAT)):
    at = i * BEAT
    if 4.0 <= at < 18.0 or 20.0 <= at < 22.0:
        add(hat(), at + BEAT / 2, 0.05, pan=0.25)
    if 8.0 <= at < 18.0 and i % 2 == 1:
        add(clap(), at, 0.06, pan=-0.1)

# ---- Riser into the drop (2.0 → 4.0) and a soft crash on 4.0 ----
rs = int(2.0 * SR); rt = np.arange(rs) / SR
riser = highpass(rng.standard_normal(rs), 1500) * (rt / 2.0) ** 2.2
add(lowpass(riser, 9000), 2.0, 0.07)
crash = highpass(rng.standard_normal(int(1.6 * SR)), 4000)
add(crash * np.exp(-np.arange(len(crash)) / SR * 2.6), 4.0, 0.045)

# ---- SFX, all in key and on the grid ----
# brand dot lands (4.5): D6 + F#6 bell
for note in (86, 90):
    s = tone(hz(note), 0.9, 3, 0.3); add(s * np.exp(-np.arange(len(s)) / SR * 5), 4.5, 0.04)
# sheet whoosh (10.5): filtered noise swell
w = int(0.45 * SR); wt = np.arange(w) / SR
add(lowpass(rng.standard_normal(w), 2500) * np.sin(np.pi * wt / 0.45) ** 2, 10.25, 0.05)
# chip tap (11.95 ≈ on the 16th grid at 12.0 - 0.05): short A5 pluck
s = tone(hz(81), 0.25, 3, 0.3); add(s * np.exp(-np.arange(len(s)) / SR * 22), 11.95, 0.05)
# typing ticks under the API card (15.0–16.9), 16th notes, very soft
for k in range(int(1.9 / (BEAT / 4))):
    tk = highpass(rng.standard_normal(int(0.02 * SR)), 5000)
    add(tk * np.exp(-np.arange(len(tk)) / SR * 200), 15.0 + k * BEAT / 4, 0.012, pan=0.3)
# "Free." impact (18.0): low D + air
s = tone(hz(38), 1.2, 2, 0.2); add(s * np.exp(-np.arange(len(s)) / SR * 3), 18.0, 0.22)

# ---- Master: gentle glue, fade in/out, normalize ----
mix = np.stack([L, R])
mix *= np.minimum(1, t / 0.08) * np.minimum(1, np.maximum(0, (DUR - t) / 1.0))
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
mix *= 0.89 / np.max(np.abs(mix))
pcm = (mix.T * 32767).astype(np.int16)
with wave.open("music.wav", "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(pcm.tobytes())
print("music.wav", DUR, "s")
