import { resolve } from "node:path";
import { handleHomeView } from "./routes/home";
import { handleAppelFonction } from "./routes/appelfonction";
import { handleAppelDeconnexion } from "./routes/appeldeconnnexion";
import { handleAppelPolling } from "./routes/appelpolling";

import { handleStudentView } from "./routes/student";
import { handleTeacherView } from "./routes/teacher";

const PUBLIC_DIR = resolve("./public");

const server = Bun.serve({
    port: 3000,
    routes: {
        "/fossnote/": handleHomeView,
        "/fossnote/eleve.html": handleStudentView,
        "/fossnote/professeur.html": handleTeacherView,
        "/fossnote/appelfonction/:espace_id/:session_id/:numero_ordre" : {
            POST: handleAppelFonction
        },
        "/fossnote/appelpolling/:espace_id/:session_id/:numero_ordre": {
            POST: handleAppelPolling
        },
        "/fossnote/appeldeconnexion/:no/:ns" : {
            POST: handleAppelDeconnexion
        }
    },
    async fetch(req) {
        const url = new URL(req.url);

        const cleanPath = url.pathname;
        const filePath = `${PUBLIC_DIR}${cleanPath}`;
        const file = Bun.file(filePath);

        if (await file.exists()) {
            return new Response(file);
        }

        return new Response("Not Found", { status: 404 });
    }
});

console.log(`Server running at ${server.url}`);