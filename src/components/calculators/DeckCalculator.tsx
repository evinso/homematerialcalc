import { useState, useEffect, useRef } from 'react';
import ShareButton from '../ui/ShareButton';
import { useLocalStorage } from '../../lib/useLocalStorage';
import { getUrlParam, setUrlParams } from '../../lib/useUrlParams';

type BoardSize = '5.5' | '3.5' | '7.25'; // actual width in inches

const BOARD_LABELS: Record<BoardSize, string> = {
  '5.5':  '2×6 deck board (5.5" actual)',
  '3.5':  '2×4 deck board (3.5" actual)',
  '7.25': '1×8 board (7.25" actual)',
};

function calcDeck(lengthFt: number, widthFt: number, boardWidthIn: number, spacing = 0.25) {
  const deckArea = lengthFt * widthFt;

  // Boards running the short direction (width)
  const boardWidthFt = (boardWidthIn + spacing) / 12;
  const boardCount = Math.ceil((lengthFt / boardWidthFt) * 1.1); // 10% waste
  const boardLengthFt = Math.ceil(widthFt / 2) * 2; // round up to nearest 2 ft

  // Joists: 16 in on-center across the length
  const joistSpacingFt = 16 / 12;
  const joistCount = Math.ceil(lengthFt / joistSpacingFt) + 1;
  const joistLengthFt = widthFt;

  // Beams: 1 beam per 8 ft of depth (widthFt direction)
  const beamCount = Math.ceil(widthFt / 8) + 1;
  const beamLengthFt = lengthFt;

  // Footings: 1 per beam end + middle supports
  const footingsPerBeam = Math.ceil(beamLengthFt / 8) + 1;
  const totalFootings = beamCount * footingsPerBeam;

  // Concrete: 1 bag (80 lb) per footing
  const concreteBags = totalFootings;

  // Decking board feet
  const boardFeet = Math.ceil(deckArea * 1.1);

  // Screws: ~2 per board per joist crossing
  const screws = boardCount * joistCount * 2;

  return { deckArea, boardCount, boardLengthFt, joistCount, joistLengthFt, beamCount, beamLengthFt, totalFootings, concreteBags, boardFeet, screws };
}

export default function DeckCalculator() {
  const [lengthFt, setLengthFt] = useLocalStorage('deck_l', Number(getUrlParam('l') ?? 16));
  const [widthFt, setWidthFt]   = useLocalStorage('deck_w', Number(getUrlParam('w') ?? 12));
  const [boardSize, setBoardSize] = useLocalStorage<BoardSize>('deck_board', (getUrlParam('b') as BoardSize | null) ?? '5.5');

  const r = calcDeck(lengthFt, widthFt, Number(boardSize));
  const hasInput = lengthFt > 0 && widthFt > 0;

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!hasInput) return;
    setUrlParams({ l: lengthFt, w: widthFt, b: boardSize });
  }, [lengthFt, widthFt, boardSize]);

  return (
    <div className="space-y-6">
      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-4">1. Deck dimensions</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Length (ft)</span>
            <input type="number" min="0" step="1" value={lengthFt}
              onChange={e => setLengthFt(Number(e.target.value))} className="input-field" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Width (ft)</span>
            <input type="number" min="0" step="1" value={widthFt}
              onChange={e => setWidthFt(Number(e.target.value))} className="input-field" />
          </label>
        </div>
        {hasInput && <p className="text-sm text-gray-500 mt-2">Deck area: <strong>{r.deckArea} sq ft</strong></p>}
      </div>

      <div className="calculator-card">
        <h2 className="font-semibold text-gray-900 mb-3">2. Decking board size</h2>
        <select value={boardSize} onChange={e => setBoardSize(e.target.value as BoardSize)} className="input-field">
          {(Object.keys(BOARD_LABELS) as BoardSize[]).map(k => (
            <option key={k} value={k}>{BOARD_LABELS[k]}</option>
          ))}
        </select>
      </div>

      {hasInput && (
        <div className="result-box">
          <div className="flex items-start justify-between mb-3 gap-3">
            <h2 className="font-bold text-brand-800 text-lg">Your Deck Materials List</h2>
            <ShareButton />
          </div>
          <div className="bg-white rounded-lg p-4 space-y-2.5 text-sm text-gray-700 mb-4">
            <p className="font-semibold text-gray-900 mb-3">For a {lengthFt}×{widthFt} ft deck ({r.deckArea} sq ft)</p>

            <div className="border-b pb-2">
              <p className="font-medium text-gray-800 mb-1">🪵 Decking</p>
              <div className="flex justify-between"><span>Deck boards ({BOARD_LABELS[boardSize].split(' (')[0]})</span><span className="font-bold text-brand-700">{r.boardCount} boards</span></div>
              <div className="flex justify-between text-gray-500 text-xs"><span>Board length needed</span><span>{r.boardLengthFt} ft each</span></div>
            </div>

            <div className="border-b pb-2">
              <p className="font-medium text-gray-800 mb-1">🏗️ Framing</p>
              <div className="flex justify-between"><span>Joists (16" OC, 2×8)</span><span className="font-bold text-brand-700">{r.joistCount} joists × {r.joistLengthFt} ft</span></div>
              <div className="flex justify-between"><span>Beams (2×10)</span><span className="font-bold text-brand-700">{r.beamCount} beams × {r.beamLengthFt} ft</span></div>
            </div>

            <div className="border-b pb-2">
              <p className="font-medium text-gray-800 mb-1">🧱 Foundation</p>
              <div className="flex justify-between"><span>Concrete footings</span><span className="font-bold text-brand-700">{r.totalFootings} footings</span></div>
              <div className="flex justify-between"><span>Concrete (80 lb bags)</span><span className="font-bold text-brand-700">{r.concreteBags} bags</span></div>
            </div>

            <div className="flex justify-between">
              <span>Deck screws (est.)</span>
              <span className="font-bold text-brand-700">{r.screws.toLocaleString()} screws</span>
            </div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3 text-xs text-brand-700">
            Includes 10% waste on decking. Check local codes for footing depth and joist span requirements before building.
          </div>
        </div>
      )}
    </div>
  );
}
