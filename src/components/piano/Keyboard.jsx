import { useEffect, useRef, useState } from 'react';
import { ViewInsideButton } from '../xray/PhotoXRay';
import XRay from '../xray/XRay';
import { KEY_TOP, PIANO_H, PIANO_W, PianoExterior, PianoInterior, pianoKeys } from '../xray/layers/PianoAction';

function playNote(ctx, midi) {
  const f = 440 * 2 ** ((midi - 69) / 12);
  const t = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.setValueAtTime(0, t);
  out.gain.linearRampToValueAtTime(0.22, t + 0.006);
  out.gain.exponentialRampToValueAtTime(0.0008, t + 1.8);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(f * 7, t);
  lp.frequency.exponentialRampToValueAtTime(f * 1.6, t + 1.2);
  [1, 2, 3, 4].forEach((h, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 0 ? 'triangle' : 'sine';
    osc.frequency.value = f * h * (1 + i * 0.0007);
    const g = ctx.createGain();
    g.gain.value = [1, 0.4, 0.16, 0.07][i];
    osc.connect(g).connect(lp);
    osc.start(t);
    osc.stop(t + 1.9);
  });
  lp.connect(out).connect(ctx.destination);
}

export default function Keyboard() {
  const [pressed, setPressed] = useState(() => new Set());
  const [sound, setSound] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const ctxRef = useRef(null);
  const timers = useRef(new Map());
  const buttons = useRef([]);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach(clearTimeout);
      ctxRef.current?.close();
    };
  }, []);

  const toggleSound = () => {
    if (!sound && !ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) ctxRef.current = new Ctx();
    }
    ctxRef.current?.resume?.();
    setSound((s) => !s);
  };

  const press = (midi) => {
    if (sound && ctxRef.current) playNote(ctxRef.current, midi);
    setPressed((prev) => new Set(prev).add(midi));
    clearTimeout(timers.current.get(midi));
    timers.current.set(
      midi,
      setTimeout(() => {
        setPressed((prev) => {
          const next = new Set(prev);
          next.delete(midi);
          return next;
        });
      }, 280),
    );
  };

  const onKeyDown = (event, i) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (event.key === 'Home' || event.key === 'End' || delta) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? pianoKeys.length - 1 : Math.min(pianoKeys.length - 1, Math.max(0, i + delta));
      setFocusIndex(next);
      buttons.current[next]?.focus();
    }
  };

  const ordered = [...pianoKeys.map((k, i) => ({ ...k, i })).filter((k) => k.type === 'white'), ...pianoKeys.map((k, i) => ({ ...k, i })).filter((k) => k.type === 'black')];

  const exterior = (
    <div className="relative h-full w-full">
      <PianoExterior pressed={pressed} />
      <div role="group" aria-label="Piano keys, C4 to B5. Use left and right arrow keys to move between keys." className="absolute inset-0">
        {ordered.map((k) => (
          <button
            key={k.midi}
            ref={(el) => {
              buttons.current[k.i] = el;
            }}
            type="button"
            tabIndex={k.i === focusIndex ? 0 : -1}
            aria-label={k.name}
            onPointerDown={(e) => {
              if (e.button === 0) press(k.midi);
            }}
            onClick={(e) => {
              if (e.detail === 0) press(k.midi);
            }}
            onFocus={() => setFocusIndex(k.i)}
            onKeyDown={(e) => onKeyDown(e, k.i)}
            className="absolute focus-visible:outline-offset-[-3px]"
            style={{
              left: `${(k.x / PIANO_W) * 100}%`,
              width: `${(k.w / PIANO_W) * 100}%`,
              top: `${(KEY_TOP / PIANO_H) * 100}%`,
              height: `${((k.type === 'white' ? PIANO_H - KEY_TOP : 118) / PIANO_H) * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <figure>
      <div id="piano-xray" className="corners">
        <XRay ratio={`${PIANO_W} / ${PIANO_H}`} exterior={exterior} interior={<PianoInterior pressed={pressed} />} revealed={revealed} lens={170} readout="ACTION" />
      </div>
      <figcaption className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono-sm max-w-lg leading-relaxed text-ash">
          <span className="text-ice">Press a key with the lid lifted to watch its hammer and damper.</span> Sound stays off until you turn it on. Illustrative mechanism, not to scale.
        </p>
        <div className="flex flex-wrap gap-2">
          <ViewInsideButton pressed={revealed} onToggle={() => setRevealed((v) => !v)} controls="piano-xray" />
          <button
            type="button"
            aria-pressed={sound}
            onClick={toggleSound}
            className={`mono inline-flex min-h-11 items-center gap-2 border px-3 transition-colors ${sound ? 'border-ice bg-ice/15 text-ice-bright' : 'border-line-strong text-bone-dim hover:border-ice'}`}
          >
            <span aria-hidden="true">{sound ? '◉' : '○'}</span>
            Sound<span aria-hidden="true">{sound ? ' on' : ' off'}</span>
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
