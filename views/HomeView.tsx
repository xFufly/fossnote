export interface Metadata {
	title: string;
	description: string;
	creator: string;
	publisher: string;
}

export interface SessionParams {
	h: string | number;
	d: boolean;
	sCrA: boolean;
	sCoA: boolean;
	poll: boolean;
}

interface HomeProps {
	metadata: Metadata;
	sessionParams: SessionParams;
}

export function HomeView({ metadata, sessionParams }: HomeProps) {
	const startArgs = JSON.stringify(sessionParams);

	return (
		<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<base target="_blank" />
				<link rel="schema.DC" href="http://purl.org/dc/elements/1.1/" />
				<title>{metadata.title}</title>
				<meta name="DC.title" content={metadata.title} />
				<meta name="description" content={metadata.description} />
				<meta name="DC.description" content={metadata.description} />
				<meta name="DC.creator" content={metadata.creator} />
				<meta name="DC.publisher" content={metadata.publisher} />
				<meta name="robots" content="index" />

				<link rel="apple-touch-icon" sizes="180x180" href="./images/apple-touch-icon.png" />
				<link rel="icon" type="image/png" href="./images/favicon-32x32.png" sizes="32x32" />
				<link rel="icon" type="image/png" href="./images/favicon-16x16.png" sizes="16x16" />
				<link rel="manifest" href="./images/manifest.json" />
				<link rel="mask-icon" href="./images/favicon.svg" color="#22874b" />
				<meta name="apple-mobile-web-app-title" content="FOSSNOTE" />
				<meta name="msapplication-config" content="./images/browserconfig.xml" />
				<meta name="application-name" content="FOSSNOTE" />
				<meta name="msapplication-TileColor" content="#22874b" />
				<meta name="msapplication-TileImage" content="./images/mstile-144x144.png" />
				<meta name="theme-color" content="#22874b" />

				<link rel="stylesheet" type="text/css" href="./home/css/commun.css" />
				<script type="text/javascript" src="./home/commun_ext.js"></script>
				<script type="text/javascript" src="./home/traductions.js"></script>
				<script type="text/javascript" src="./home/imagesconnexion.js"></script>
				<script type="text/javascript" src="./home/commun.js"></script>
				<script
					type="text/javascript"
					dangerouslySetInnerHTML={{
						__html: `
							require('deferLoadingScript.js').add('jspdf', ['./home/commun_jspdf.js']);
							require('deferLoadingScript.js').add('pep_poly', ['./home/commun_pep_poly.js']);
						`,
					}}
				/>
				<script
					type="text/javascript"
					dangerouslySetInnerHTML={{
						__html: `
							function messageErreur(e) {
								$.get("erreur/" + e).fail(function() {});
								alert("Erreur sur le chargement de la page. Veuillez vider le cache de votre navigateur.");
							}
						`,
					}}
				/>
			</head>

			<script dangerouslySetInnerHTML={{ __html: `window.__SESSION__ = ${JSON.stringify(sessionParams)};` }} />
			<body id="id_body" class="EspaceIndex" onload="try { Start(window.__SESSION__) } catch (e) { messageErreur(e) }">
				<noscript style="position: absolute; top: 100px" class="Texte12 Gras Espace">
					Java script non activé. Veuillez le réactiver.
				</noscript>
				<div id="div" data-role="page" class="NePasImprimer" style="height:100%"></div>
				<a
					href="https://www.index-education.com/redirect.php?distrib=FR"
					target="_blank"
					style="display:none"
				>
					FOSSNOTE - Gestion de vie scolaire
				</a>
			</body>
		</html>
	);
}