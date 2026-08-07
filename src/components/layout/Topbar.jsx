import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Topbar({ title, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, languages } = useLanguage();

  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>
      <h1 className="topbar__title">{title}</h1>
      <div className="topbar__actions">
        <select
          className="topbar__lang-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Language"
          title="Language"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.code.toUpperCase()}
            </option>
          ))}
        </select>
        <button
          className="topbar__theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
