import { Helmet } from 'react-helmet-async';

interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

interface LegalPageLayoutProps {
  title: string;
  description: string;
  updatedOn: string;
  sections: LegalSection[];
}

export function LegalPageLayout({ title, description, updatedOn, sections }: LegalPageLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{title} | Somaherence</title>
        <meta name="description" content={description} />
      </Helmet>

      <main className="page-main">
        <div className="container policy-prose">
          <header className="page-header">
            <p className="eyebrow">Legal</p>
            <h1>{title}</h1>
            <p>Last updated: {updatedOn}</p>
          </header>

          {sections.map((section) => (
            <section key={section.heading} className="page-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
