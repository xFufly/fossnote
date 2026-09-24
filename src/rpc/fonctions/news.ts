import { db } from "../../db";
import { news, surveyQuestions, surveyPossibleAnswers, surveyUserAnswers } from "../../db/schema";
import { eq, desc } from "drizzle-orm";
import type { RpcContext } from "../types";
import newsTypes from "../../../config/constants/newsTypes.json";

export const getNewsList = async (espaceId: number) => {
    const allNews = await db.query.news.findMany({
        where: (news, { or, eq, isNull }) => or(
            isNull(news.targetUserType),
            eq(news.targetUserType, espaceId)
        ),
        orderBy: [desc(news.createdAt)],
    });

    return allNews.map((n) => {
        const categoryObj = (newsTypes as any[]).find(c => c.L === n.category) || newsTypes[3];
        
        // Format dates
        const startDate = n.startDate ? n.startDate.split("-").reverse().join("/") : "01/01/2020";
        const endDate = n.endDate ? n.endDate.split("-").reverse().join("/") : "31/12/2099";
        
        // Basic formatting for creation date
        const d = new Date(n.createdAt);
        const dateCreation = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

        return {
            L: n.title,
            N: `65#${n.id}`,
            reponseAnonyme: false,
            estInformation: n.isInformation,
            estSondage: n.isSurvey,
            nature: {
                _T: 24,
                V: {
                    L: categoryObj?.L,
                    N: categoryObj?.N,
                },
            },
            lue: false, // Could track read status in a separate table later
            dateDebut: { _T: 7, V: startDate },
            dateFin: { _T: 7, V: endDate },
            estProlonge: false, // Fake it
            dateCreation: { _T: 7, V: dateCreation },
            auteur: n.author || "Administration",
            estAuteur: false,
            elmauteur: {
                _T: 24,
                V: {
                    L: n.author || "Administration",
                    N: "106#admin",
                    G: 34,
                },
            },
            prenom: n.author ? n.author.split(' ')[0] : "Admin",
            public: {
                _T: 24,
                V: {
                    L: n.targetUserType === 1 ? "Professeurs" : n.targetUserType === 3 ? "Elèves" : "Tout le monde",
                    N: "46#public",
                    G: n.targetUserType ?? 4,
                },
            },
            genrePublic: n.targetUserType ?? 4,
            estPublic: true,
            estPartage: false,
            informationListeContenu: {
                avecPJ: n.hasAttachments,
                aToutRepondu: false,
                avecCommandeVisuResultat: n.isSurvey,
            },
        };
    });
};

export const handleNewsPage = async (body: any, ctx: RpcContext) => {
    const data = body?.donneesSec?.donnees || body?.dataSec?.data;
    const genre = data?.genreRequeteActualite;

    if (genre === 0) {
        // Return list of news
        const listeActualites = await getNewsList(ctx.espaceId);

        return {
            listeNatures: {
                _T: 24,
                V: newsTypes,
            },
            listeModesAff: [
                {
                    G: 0,
                    listeActualites: {
                        _T: 24,
                        V: listeActualites,
                    },
                },
            ],
            genreRequeteActualite: 0,
        };
    } else if (genre === 1) {
        // Return details for a specific news item
        const actualiteN = data?.actualite?.N;
        if (!actualiteN) {
            return { genreRequeteActualite: 1 };
        }

        const newsId = parseInt(actualiteN.split('#')[1], 10);
        if (Number.isNaN(newsId)) {
            return { genreRequeteActualite: 1 };
        }

        const newsItem = await db.query.news.findFirst({
            where: eq(news.id, newsId),
        });

        if (!newsItem) {
            return { genreRequeteActualite: 1 };
        }

        // Fetch survey questions if any
        let questionsV: any[] = [];
        if (newsItem.isSurvey) {
            const dbQuestions = await db.query.surveyQuestions.findMany({
                where: eq(surveyQuestions.newsId, newsId),
                orderBy: (q, { asc }) => [asc(q.rank)],
                with: {
                    possibleAnswers: {
                        orderBy: (a, { asc }) => [asc(a.rank)],
                    },
                },
            });

            questionsV = dbQuestions.map((q) => {
                const choices = q.possibleAnswers.map((a) => ({
                    L: a.text,
                    N: `66#${a.id}`,
                    rang: a.rank,
                    ...(a.isFreeText ? { estReponseLibre: true } : {}),
                }));

                const htmlText = `<div style="font-family: arial,helvetica,sans-serif; font-size: 13px;">${q.text}</div>`;

                return {
                    L: q.title || `Question ${q.rank}`,
                    N: `67#${q.id}`,
                    P: 1,
                    rang: q.rank,
                    genreReponse: q.responseType,
                    titre: q.title || "",
                    texte: {
                        _T: 21,
                        V: htmlText,
                    },
                    tailleReponse: q.responseSize,
                    avecMaximum: q.hasMaximum,
                    nombreReponsesMax: q.maxAnswers,
                    listePiecesJointes: {
                        _T: 24,
                        V: [],
                    },
                    listeChoix: {
                        _T: 24,
                        V: choices,
                    },
                    reponse: {
                        _T: 24,
                        V: {
                            N: "0",
                            valeurReponse: {
                                _T: 26,
                                V: "[]",
                            },
                            avecReponse: false,
                            estReponseAttendue: true,
                        },
                    },
                };
            });
        } else if (newsItem.isInformation) {
            // For simple information, PRONOTE expects it as a fake "question" with genreReponse = 0
            questionsV.push({
                L: "Question 1",
                N: `67#info_${newsId}`,
                P: 1,
                rang: 1,
                genreReponse: 0,
                titre: "",
                texte: {
                    _T: 21,
                    V: `<div style="font-family: arial,helvetica,sans-serif; font-size: 13px;">${newsItem.content}</div>`,
                },
                tailleReponse: 200,
                avecMaximum: false,
                nombreReponsesMax: 0,
                listePiecesJointes: {
                    _T: 24,
                    V: [],
                },
                listeChoix: {
                    _T: 24,
                    V: [],
                },
                reponse: {
                    _T: 24,
                    V: {
                        N: "0",
                        avecReponse: false,
                        estReponseAttendue: true,
                    },
                },
            });
        }

        return {
            detailsActualite: {
                listeQuestions: {
                    _T: 24,
                    V: questionsV,
                },
            },
            genreRequeteActualite: 1,
        };
    }

    return {};
};