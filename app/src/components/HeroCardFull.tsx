import type { Hero } from '../GameState.d.ts';

type HeroCardFullProps = {
  hero: Hero;
  isActive?: boolean;
  onSelect?: (key: string) => void;
};

const elementThemes: Record<string, string> = {
  light: "linear-gradient(135deg, #fff7d1, #ffdf8a)",
  fire: "linear-gradient(135deg, #ffd1c0, #ff9b71)",
  ice: "linear-gradient(135deg, #d8f3ff, #b6e4ff)",
  shield: "linear-gradient(135deg, #e2e9f6, #c9d7ef)",
};

export default function HeroCardFull({ hero, isActive, onSelect }: HeroCardFullProps) {
  const theme = elementThemes[hero?.element] || "linear-gradient(135deg, #f7f7f7, #ffffff)";
  const art = hero?.art;
  const fallbackIcon = hero?.icon || "🛡️";
  const fallbackClass = hero?.role || hero?.class || "Herói";
  const activeSkill = hero?.skillActive || hero?.activeSkill?.name || hero?.activeSkill?.desc || hero?.description || "Habilidade especial do herói.";
  const passiveSkill =
    hero?.passive || hero?.passiveSkill || hero?.passiveText || hero?.description || "Passiva que concede bônus permanentes.";

  return (
    <div className="hero-full-card" style={{ background: theme }}>
      <div className="hero-art-wrapper">
        {art ? (
          <img src={art} alt={hero?.name} className="hero-art" />
        ) : (
          <div className="hero-art hero-art-fallback">
            <span className="hero-fallback-icon">{fallbackIcon}</span>
          </div>
        )}
      </div>

      <div className="hero-info">
        <h2>{hero?.name || "Herói"}</h2>
        <p className="hero-class">{fallbackClass}</p>

        <div className="hero-stats">
          <span className="stat-pill">Lv {hero?.level ?? 1}</span>
          <span className="stat-pill gold">XP {hero?.xp ?? 0}</span>
          <span className="stat-pill">Cargas {hero?.charges ?? 0}</span>
        </div>

        <div className="hero-attributes">
          <div className="attr-item">
            <strong>ATK</strong> {hero?.attack ?? hero?.atk ?? 0}
          </div>
          <div className="attr-item">
            <strong>DEF</strong> {hero?.defense ?? hero?.def ?? 0}
          </div>
          <div className="attr-item">
            <strong>SPD</strong> {hero?.speed ?? hero?.spd ?? 0}
          </div>
        </div>

        <div className="hero-skills">
          <div className="skill">
            <strong>Skill ativa:</strong>
            <p>{activeSkill}</p>
          </div>
          <div className="skill">
            <strong>Passiva:</strong>
            <p>{passiveSkill}</p>
          </div>
        </div>

        <button
          className={`hero-action-btn ${isActive ? "selected" : ""}`}
          onClick={() => onSelect?.(hero?.key)}
          disabled={isActive}
        >
          {isActive ? "Selecionado" : "Ativar"}
        </button>
      </div>
    </div>
  );
}
