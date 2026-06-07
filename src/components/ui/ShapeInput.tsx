import { useState } from 'react';
import { feetInchesToFt } from '../../lib/engine/geometry';
import type { ShapeInput as EngineShape } from '../../lib/engine/geometry';
import FtInInput from './FtInInput';

type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'irregular';

interface SubArea {
  id: number;
  type: 'rectangle' | 'circle' | 'triangle';
  l: [number, number]; // [feet, inches]
  w: [number, number];
  r: [number, number];
  b: [number, number];
  h: [number, number];
}

interface Props {
  onChange: (shape: EngineShape) => void;
  initLFt?: number;
  initWFt?: number;
}

let nextId = 1;

function subAreaToEngine(s: SubArea): EngineShape {
  if (s.type === 'rectangle') {
    return { type: 'rectangle', lengthFt: feetInchesToFt(...s.l), widthFt: feetInchesToFt(...s.w) };
  }
  if (s.type === 'circle') {
    return { type: 'circle', radiusFt: feetInchesToFt(...s.r) };
  }
  return { type: 'triangle', baseFt: feetInchesToFt(...s.b), heightFt: feetInchesToFt(...s.h) };
}

function emptySubArea(): SubArea {
  return { id: nextId++, type: 'rectangle', l: [0,0], w: [0,0], r: [0,0], b: [0,0], h: [0,0] };
}

export default function ShapeInput({ onChange, initLFt = 0, initWFt = 0 }: Props) {
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');
  const [l, setL] = useState<[number,number]>([initLFt, 0]);
  const [w, setW] = useState<[number,number]>([initWFt, 0]);
  const [r, setR] = useState<[number,number]>([0,0]);
  const [b, setB] = useState<[number,number]>([0,0]);
  const [h, setH] = useState<[number,number]>([0,0]);
  const [subs, setSubs] = useState<SubArea[]>([emptySubArea()]);

  function emit(type: ShapeType, overrides?: Partial<{l:[number,number],w:[number,number],r:[number,number],b:[number,number],h:[number,number],subs:SubArea[]}>) {
    const _l = overrides?.l ?? l;
    const _w = overrides?.w ?? w;
    const _r = overrides?.r ?? r;
    const _b = overrides?.b ?? b;
    const _h = overrides?.h ?? h;
    const _subs = overrides?.subs ?? subs;

    let shape: EngineShape;
    if (type === 'rectangle') shape = { type: 'rectangle', lengthFt: feetInchesToFt(..._l), widthFt: feetInchesToFt(..._w) };
    else if (type === 'circle') shape = { type: 'circle', radiusFt: feetInchesToFt(..._r) };
    else if (type === 'triangle') shape = { type: 'triangle', baseFt: feetInchesToFt(..._b), heightFt: feetInchesToFt(..._h) };
    else shape = { type: 'irregular', shapes: _subs.map(subAreaToEngine) };
    onChange(shape);
  }

  function updateSub(id: number, patch: Partial<SubArea>) {
    const updated = subs.map(s => s.id === id ? { ...s, ...patch } : s);
    setSubs(updated);
    emit('irregular', { subs: updated });
  }

  const tabs: { type: ShapeType; label: string }[] = [
    { type: 'rectangle', label: 'Rectangle' },
    { type: 'circle',    label: 'Circle' },
    { type: 'triangle',  label: 'Triangle' },
    { type: 'irregular', label: 'Irregular' },
  ];

  return (
    <div>
      {/* Shape tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        {tabs.map(t => (
          <button
            key={t.type}
            onClick={() => { setShapeType(t.type); emit(t.type); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              shapeType === t.type
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Rectangle */}
      {shapeType === 'rectangle' && (
        <div className="grid grid-cols-2 gap-4">
          <FtInInput label="Length" feet={l[0]} inches={l[1]}
            onFeetChange={v => { const n:[number,number]=[v,l[1]]; setL(n); emit('rectangle',{l:n}); }}
            onInchesChange={v => { const n:[number,number]=[l[0],v]; setL(n); emit('rectangle',{l:n}); }} />
          <FtInInput label="Width" feet={w[0]} inches={w[1]}
            onFeetChange={v => { const n:[number,number]=[v,w[1]]; setW(n); emit('rectangle',{w:n}); }}
            onInchesChange={v => { const n:[number,number]=[w[0],v]; setW(n); emit('rectangle',{w:n}); }} />
        </div>
      )}

      {/* Circle */}
      {shapeType === 'circle' && (
        <div className="max-w-xs">
          <FtInInput label="Radius" feet={r[0]} inches={r[1]}
            onFeetChange={v => { const n:[number,number]=[v,r[1]]; setR(n); emit('circle',{r:n}); }}
            onInchesChange={v => { const n:[number,number]=[r[0],v]; setR(n); emit('circle',{r:n}); }} />
          <p className="text-xs text-gray-500 mt-1">Half the diameter of your circle area.</p>
        </div>
      )}

      {/* Triangle */}
      {shapeType === 'triangle' && (
        <div className="grid grid-cols-2 gap-4">
          <FtInInput label="Base" feet={b[0]} inches={b[1]}
            onFeetChange={v => { const n:[number,number]=[v,b[1]]; setB(n); emit('triangle',{b:n}); }}
            onInchesChange={v => { const n:[number,number]=[b[0],v]; setB(n); emit('triangle',{b:n}); }} />
          <FtInInput label="Height" feet={h[0]} inches={h[1]}
            onFeetChange={v => { const n:[number,number]=[v,h[1]]; setH(n); emit('triangle',{h:n}); }}
            onInchesChange={v => { const n:[number,number]=[h[0],v]; setH(n); emit('triangle',{h:n}); }} />
        </div>
      )}

      {/* Irregular */}
      {shapeType === 'irregular' && (
        <div className="space-y-4">
          {subs.map((s, idx) => (
            <div key={s.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Area {idx + 1}</span>
                {subs.length > 1 && (
                  <button
                    onClick={() => { const updated = subs.filter(x => x.id !== s.id); setSubs(updated); emit('irregular',{subs:updated}); }}
                    className="text-xs text-red-500 hover:text-red-700"
                  >Remove</button>
                )}
              </div>
              {/* mini shape tabs for each sub-area */}
              <div className="flex gap-1 mb-3 bg-gray-50 p-1 rounded">
                {(['rectangle','circle','triangle'] as const).map(t => (
                  <button key={t} onClick={() => updateSub(s.id, { type: t })}
                    className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${s.type === t ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'}`}>
                    {t.charAt(0).toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>
              {s.type === 'rectangle' && (
                <div className="grid grid-cols-2 gap-3">
                  <FtInInput label="Length" feet={s.l[0]} inches={s.l[1]}
                    onFeetChange={v => updateSub(s.id, { l: [v, s.l[1]] })}
                    onInchesChange={v => updateSub(s.id, { l: [s.l[0], v] })} />
                  <FtInInput label="Width" feet={s.w[0]} inches={s.w[1]}
                    onFeetChange={v => updateSub(s.id, { w: [v, s.w[1]] })}
                    onInchesChange={v => updateSub(s.id, { w: [s.w[0], v] })} />
                </div>
              )}
              {s.type === 'circle' && (
                <FtInInput label="Radius" feet={s.r[0]} inches={s.r[1]}
                  onFeetChange={v => updateSub(s.id, { r: [v, s.r[1]] })}
                  onInchesChange={v => updateSub(s.id, { r: [s.r[0], v] })} />
              )}
              {s.type === 'triangle' && (
                <div className="grid grid-cols-2 gap-3">
                  <FtInInput label="Base" feet={s.b[0]} inches={s.b[1]}
                    onFeetChange={v => updateSub(s.id, { b: [v, s.b[1]] })}
                    onInchesChange={v => updateSub(s.id, { b: [s.b[0], v] })} />
                  <FtInInput label="Height" feet={s.h[0]} inches={s.h[1]}
                    onFeetChange={v => updateSub(s.id, { h: [v, s.h[1]] })}
                    onInchesChange={v => updateSub(s.id, { h: [s.h[0], v] })} />
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => { const updated = [...subs, emptySubArea()]; setSubs(updated); emit('irregular',{subs:updated}); }}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
          >
            + Add another area
          </button>
        </div>
      )}
    </div>
  );
}
