// @ts-nocheck
import Barracks from "./Barracks";

export default function ArmoryModal({ armory, onClose, onBuild, onUpgrade }) {
  return (
    <div className="ks-modal-backdrop" onClick={onClose}>
      <div className="ks-modal" onClick={e => e.stopPropagation()}>
        <div className="ks-modal-header">
          <div>
            <p className="ks-eyebrow">Quartel & Arsenal</p>
            <h3>Catapultas, canhões, cavalaria e armas</h3>
          </div>
          <button className="ks-btn ghost" onClick={onClose}>Fechar</button>
        </div>
        <Barracks armory={armory} onBuild={onBuild} onUpgrade={onUpgrade} />
      </div>
    </div>
  );
}
