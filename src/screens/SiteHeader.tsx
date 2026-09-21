import { Eyebrow, Rule } from "../components";

export function SiteHeader() {
  return (
    <header className="app-site-header app-no-print">
      <div className="app-site-header__inner">
        <div className="app-site-header__brand">
          <div className="app-wordmark">Tully</div>
          <Eyebrow tone="muted">Proposal Draft Agent</Eyebrow>
        </div>
        <p className="app-site-header__note">
          A first draft for your Tully Travel Designer to perfect.
        </p>
      </div>
      <Rule />
    </header>
  );
}
