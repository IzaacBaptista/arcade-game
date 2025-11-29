// @ts-nocheck
import Troops from "./Troops";

export default function TroopsModal({ troops, onClose, onTrain, onUpgrade }) {
  return (
    <div className="ks-modal-backdrop" onClick={onClose}>
      <div className="ks-modal" onClick={e => e.stopPropagation()}>
        <div className="ks-modal-header">
          <div>
            <p className="ks-eyebrow">Quartel</p>
            <h3>Tropas e upgrade</h3>
          </div>
          <button className="ks-btn ghost" onClick={onClose}>Fechar</button>
        </div>
        <Troops troops={troops} onTrain={onTrain} onUpgrade={onUpgrade} />
      </div>
    </div>
  );
}
