export interface Metadata {
    title: string;
    description: string;
    creator?: string;
    publisher?: string;
    city: string;
}

export interface SessionParams {
    h: string | number;
    d: boolean;
    sCrA?: boolean;
    sCoA?: boolean;
    poll?: boolean;
    a: number;
}

interface StudentProps {
    metadata: Metadata;
    sessionParams: SessionParams;
    nonce?: string;
}

export function StudentView({ metadata, sessionParams, nonce }: StudentProps) {
    const serializedParams = JSON.stringify(sessionParams);

    return (
        <html lang="fr">
            <head>
                <base target="_blank" />
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="geo.placename" content={metadata.city} />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />

                <link rel="apple-touch-icon" sizes="180x180" href="./images/apple-touch-icon.png" />
                <link rel="icon" type="image/png" href="./images/favicon-32x32.png" sizes="32x32" />
                <link rel="icon" type="image/png" href="./images/favicon-16x16.png" sizes="16x16" />
                <link rel="manifest" href="./images/manifest.json" />
                <link rel="mask-icon" href="./images/favicon.svg" color="#22874b" />
                <meta name="apple-mobile-web-app-title" content="FOSSNOTE" />
                <meta name="application-name" content="FOSSNOTE" />
                <meta name="theme-color" content="#22874b" />

                <link rel="stylesheet" type="text/css" href="./eleve/css/eleve.css" />
                <script src="./eleve/eleve_ext.js"></script>
                <script src="./eleve/traductions.js"></script>
                <script src="./eleve/imagesconnexion.js"></script>
                <script src="./eleve/eleve.js"></script>

                <script
                    nonce={nonce}
                    dangerouslySetInnerHTML={{
                        __html: 
						`
						(function(){
							const deferLoadingScript = require('deferLoadingScript.js');

							deferLoadingScript.add('pep_poly', ['./eleve/eleve_pep_poly.js']);
							deferLoadingScript.add('jspdf', ['./eleve/eleve_jspdf.js']);
							deferLoadingScript.add('tiny', ['./eleve/eleve_tiny.js']);
							deferLoadingScript.add('fenetrerecupmdp', ['./eleve/eleve_fenetrerecupmdp.js']);
							deferLoadingScript.add('defer', ['./eleve/eleve_defer.js']);
						}());
						`,
                    }}
                />

                <script
                    nonce={nonce}
                    dangerouslySetInnerHTML={{
                        __html: 
						`(function(){
							IE.identLogClientleger = "LogClientLeger";
							IE.msgTitreErreurPage = "Erreur sur le chargement de la page";
							IE.msgMessageErreurPage = "Ce navigateur n'est plus supporté";
							window.addEventListener("load", () => {
								try {
									Start(${serializedParams});
								} catch (e) {
									if (typeof IE.sendLogFailStart === "function") {
										IE.sendLogFailStart(${JSON.stringify(sessionParams.h)}, e);
									} else {
										console.error("Erreur Start:", e);
									}
								}
							});
						}());`,
                    }}
                />
            </head>

            <body id="id_body" class="EspaceIndex">
                <noscript>
                    Java script non activé.{"\n"}
                    Veuillez le réactiver.
                </noscript>
                <div id="div" data-role="page"></div>
                <a
                    href="https://swie.index-education.com/redirect.php?distrib=FR"
                    target="_blank"
                    style={{ display: "none" }}
                >
                    FOSSNOTE gestion de vie scolaire, notes, compétences, absences/retards/dispenses, incidents/punitions/sanctions, stages...
                </a>
            </body>
        </html>
    );
}