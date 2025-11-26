import HeadInjector from "@/components/HeadInjector";
import ComingSoonForm from "@/components/ComingSoonForm";
import fs from "fs";
import path from "path";

const baseHeadHtml = fs.readFileSync(
  path.join(process.cwd(), "public/data/home-head.html"),
  "utf8"
);

const homeBodyHtml = fs.readFileSync(
  path.join(process.cwd(), "public/data/home-body.html"),
  "utf8"
);

const SECTION_MARKER = '<section class="game game__play">';
const headerHtml = homeBodyHtml.includes(SECTION_MARKER)
  ? homeBodyHtml.split(SECTION_MARKER)[0]
  : "";
const footerStart = homeBodyHtml.indexOf("<footer");
const footerHtml = footerStart !== -1 ? homeBodyHtml.slice(footerStart) : "";

const comingSoonHeadHtml = baseHeadHtml.replace(
  "<title>Survival Race</title>",
  "<title>Car Games Unblocked | Coming Soon</title>"
);

export const metadata = {
  title: "Car Games Unblocked | Coming Soon",
  description:
    "Stay up to date on the next batch of unblocked car games by leaving your email for early notifications.",
};

type ComingSoonPageProps = {
  searchParams?: {
    game?: string;
  };
};

function resolveGameName(searchParams?: { game?: string }) {
  const candidate = searchParams?.game ?? "";
  return candidate.trim() || "this game";
}

export default function ComingSoonPage({ searchParams }: ComingSoonPageProps) {
  const gameName = resolveGameName(searchParams);

  return (
    <>
      <HeadInjector headHtml={comingSoonHeadHtml} />
      {headerHtml && (
        <div dangerouslySetInnerHTML={{ __html: headerHtml }} suppressHydrationWarning />
      )}
      <section className="game game__play coming-shell">
        <div className="container">
          <main className="coming-main">
            <section className="coming-card" id="coming-soon">
              <p className="coming-eyebrow">Under construction</p>
              <h1>The next version of our site is still loading.</h1>
              <p className="coming-lede">
                You tried to open <span className="coming-game-name">{gameName}</span> but the entire Car Games Unblocked
                experience is getting reworked.  Drop your email and we will notify you as soon as new sections go live.
              </p>
              <p className="coming-note">
                Thanks for your patience—whether you clicked a game tile, About Us, Contact, or any other link, you are
                seeing this page because the upcoming content is still under development.
              </p>
              <div id="notify" className="coming-form-wrapper">
                <ComingSoonForm gameName={gameName} />
              </div>
              <div className="coming-actions">
                <a className="coming-btn" href="/">
                  Back to homepage
                </a>
              </div>
            </section>
            <section className="coming-list">
              <h2>What happens next?</h2>
              <ul>
                <li>We finish the dedicated experience for {gameName}.</li>
                <li>You receive an email as soon as it is playable.</li>
                <li>You get first access to new cars, tracks, and exclusive tips.</li>
              </ul>
            </section>
          </main>
        </div>
      </section>
      {footerHtml && (
        <div dangerouslySetInnerHTML={{ __html: footerHtml }} suppressHydrationWarning />
      )}
    </>
  );
}
