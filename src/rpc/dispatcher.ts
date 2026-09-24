import type { RpcHandler, RpcContext } from "./types";

// Shared handlers (available to all users)
import { handleParametres } from "./fonctions/parametres";
import { handleIdentification } from "./fonctions/identification";
import { handleAuthentification } from "./fonctions/authentification";
import { handleSaisiePostit } from "./fonctions/postit";
import { handleNewsPage } from "./fonctions/news";

// Student-specific handlers (space 3)
import { handleStudentSettings } from "./fonctions/student/settings";
import { handleStudentHomepage } from "./fonctions/student/homepage";
import { handleStudentGrades } from "./fonctions/student/grades";
import { handleStudentPrivateInfo } from "./fonctions/student/privateInfo";
import { handleStudentHomeworks } from "./fonctions/student/homeworks";
import { handlePageEmploiDuTemps, handlePageEmploiDuTempsDomainePresence, handleFicheCours } from "./fonctions/student/timetable";

// Teacher-specific handlers (space 1)
import { handleTeacherSettings } from "./fonctions/teacher/settings";
import { handleTeacherHomepage } from "./fonctions/teacher/homepage";
import { handleTeacherClasses } from "./fonctions/teacher/classes";
import { handleTeacherPeriodes } from "./fonctions/teacher/periodes";
import { handleTeacherResources } from "./fonctions/teacher/resources";
/*import { handleTeacherServices } from "./fonctions/teacher/services";
import { handleTeacherPageNotes } from "./fonctions/teacher/notes";*/
import { handleTeacherPrivateInfo } from "./fonctions/teacher/privateInfo";

/**
 * TODO
 * Shared
 * 	- SaisieDeconnexion
 *  - ListeMessagerie
 * Student
 * 	- DocumentsATelecharger
 *  - PageReleve
 *  - ForumPedagogique
 *  - PageBulletins
 *  - DernieresEvaluations
 * Teacher
 *  - ListeTravauxRendus
 *  - PreferenceMessagerie
 */

const sharedHandlers: Record<string, RpcHandler> = {
	FonctionParametres: handleParametres,
	Identification: handleIdentification,
	Authentification: handleAuthentification,
	SaisiePenseBete: handleSaisiePostit,
    PageActualites: handleNewsPage
};

const studentHandlers: Record<string, RpcHandler> = {
	ParametresUtilisateur: handleStudentSettings,
	PageAccueil: handleStudentHomepage,
	DernieresNotes: handleStudentGrades,
	PageInfosPerso: handleStudentPrivateInfo,
	PageCahierDeTexte: handleStudentHomeworks,
	PageEmploiDuTemps: handlePageEmploiDuTemps,
	PageEmploiDuTemps_DomainePresence: handlePageEmploiDuTempsDomainePresence,
	FicheCours: handleFicheCours
};

const teacherHandlers: Record<string, RpcHandler> = {
	ParametresUtilisateur: handleTeacherSettings,
	PageAccueil: handleTeacherHomepage,
	
	listeClassesGroupes: handleTeacherClasses,
	ListePeriodes: handleTeacherPeriodes,
	ListeRessources: handleTeacherResources,
	/*ListeServices: handleTeacherServices,
	PageNotes: handleTeacherPageNotes*/
	PageInfosPerso: handleTeacherPrivateInfo
};

export async function dispatchRpc(nom: string, body: any, ctx: RpcContext) {
	// 1. Shared handlers (available to all users)
	if (sharedHandlers[nom]) {
		return await sharedHandlers[nom](body, ctx);
	}

	// 2. Student-specific handlers (space 3)
	if (ctx.espaceId === 3 && studentHandlers[nom]) {
		return await studentHandlers[nom](body, ctx);
	}

	// 3. Teacher-specific handlers (space 1)
	if (ctx.espaceId === 1 && teacherHandlers[nom]) {
		return await teacherHandlers[nom](body, ctx);
	}

	// 4. Handle special cases for Navigation and Presence
	if (nom === "Navigation" || nom === "Presence") {
		return {};
	}

	throw new Error(`Action not found for space ${ctx.espaceId} : ${nom}`);
}