import config from "../config/general.json";

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

interface TeacherProps {
    metadata: Metadata;
    sessionParams: SessionParams;
    nonce?: string;
}

export function TeacherView({ metadata, sessionParams, nonce }: TeacherProps) {
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

                <link rel="stylesheet" type="text/css" href="./professeur/css/professeur.css" />
                <script src="./professeur/professeur_ext.js"></script>
                <script src="./professeur/traductions.js"></script>
                <script src="./professeur/imagesconnexion.js"></script>
                <script src="./professeur/professeur.js"></script>

                <script
                    nonce={nonce}
                    dangerouslySetInnerHTML={{
                        __html: 
						`
						(function(){
                            const {deferLoadingScript} = require('deferLoadingScript.js');

                            deferLoadingScript.add('jspdf', ['./professeur/professeur_jspdf.js']);
							deferLoadingScript.add('pep_poly', ['./professeur/professeur_pep_poly.js']);
							deferLoadingScript.add('tiny', ['./professeur/professeur_tiny.js']);
							deferLoadingScript.add('fenetrerecupmdp', ['./professeur/professeur_fenetrerecupmdp.js']);
							deferLoadingScript.add('defer', ['./professeur/professeur_defer.js']);
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

                {config.showBackButtonOnLogin && (
                    <>
                        <style>{`
                            #fossnote-back-btn {
                                position: fixed;
                                top: 60px;
                                left: 15px;
                                padding: 8px 16px;
                                background: rgba(0,0,0,0.5);
                                color: white;
                                text-decoration: none;
                                border-radius: 4px;
                                z-index: 999999;
                                font-family: sans-serif;
                                font-size: 14px;
                                transition: opacity 0.3s;
                                display: none;
                            }
                            #fossnote-back-btn:hover {
                                background: rgba(0,0,0,0.8);
                            }
                        `}</style>
                        <a href="/fossnote/" id="fossnote-back-btn" target="_self">Retour</a>
                        <script dangerouslySetInnerHTML={{ __html: `
                            (function() {
                                var btn = document.getElementById('fossnote-back-btn');
                                if (!btn) return;
                                
                                function checkLoginScreen() {
                                    var hasPassword = document.querySelector('input[type="password"]');
                                    var hasLoginBtn = Array.from(document.querySelectorAll('button, div')).some(el => el.textContent && el.textContent.trim().toLowerCase() === 'se connecter');
                                    
                                    if (hasPassword || hasLoginBtn) {
                                        btn.style.display = 'block';
                                    } else {
                                        btn.style.display = 'none';
                                    }
                                }

                                var observer = new MutationObserver(checkLoginScreen);
                                observer.observe(document.body, { childList: true, subtree: true });
                                
                                setTimeout(checkLoginScreen, 500);
                            })();
                        `}} />
                    </>
                )}
            </body>
        </html>
    );
}