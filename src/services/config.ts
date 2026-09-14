export interface EspaceConfig {
    nom: string;
    theme: number;
    avecChoixConnexion: boolean;
    avecRecuperationInfosConnexion: boolean;
}

export function getEspaceConfig(espaceId: string): EspaceConfig {
    const configs: Record < string, Partial < EspaceConfig >> = {
        "16": {
            nom: "Espace Direction",
            theme: 8
        },
        "3": {
            nom: "Espace Élèves",
            theme: 8,
            avecRecuperationInfosConnexion: true
        },
        "1": {
            nom: "Espace Professeurs",
            theme: 6,
            avecChoixConnexion: true
        },
        "13": {
            nom: "Espace Vie scolaire",
            theme: 8
        },
        "2": {
            nom: "Espace Parents",
            theme: 8,
            avecRecuperationInfosConnexion: true
        },
        "25": {
            nom: "Espace Accompagnants",
            theme: 8
        }
    };

    const defaultConf: EspaceConfig = {
        nom: "Espace Inconnu",
        theme: 8,
        avecChoixConnexion: false,
        avecRecuperationInfosConnexion: false
    };

    return {
        ...defaultConf,
        ...(configs[espaceId] || {})
    };
}

export interface PronotePeriode {
    L: string;
    N: string;
    G: number;
    periodeNotation: number;
    dateDebut: {
        _T: number;V: string
    };
    dateFin: {
        _T: number;V: string
    };
}

export function formatPeriodes(periodesMetadata: Record < string, {
    name: string;from: string;to: string
} > ): PronotePeriode[] {
    return Object.entries(periodesMetadata).map(([key, value]) => ({
        L: value.name,
        N: "0001",
        G: 1,
        periodeNotation: parseInt(key.slice(1), 10) - 1,
        dateDebut: {
            _T: 7,
            V: value.from
        },
        dateFin: {
            _T: 7,
            V: value.to
        }
    }));
}

export function getFormattedServerDate(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}