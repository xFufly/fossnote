const teachers = require('../../../../../databases/teachers');
const classes = require('../../../../../databases/classes');
const subjects = require('../../../../../databases/subjects');

const {
    get_metadata,
    getCurrentPeriod
} = require('../../../../../helpers');

const {
    encryptAES
} = require('../../../../../cipher');

async function bind(req, res, currentSession) {
    const {
        session_id
    } = req.params;

    const challengeInfos = JSON.parse(currentSession.challenge);

    const user = await teachers.getTeacher(challengeInfos.username.toLowerCase());

    const numeroOrdre = await encryptAES((currentSession.numeroOrdre + 2).toString(), JSON.parse(currentSession.aes).key, JSON.parse(currentSession.aes).iv);

    const periodes = get_metadata().Periodes;
    const currentPeriod = getCurrentPeriod(periodes);

    const currentClass = req.body.donneesSec.donnees.Ressource.L;
    const currentClassId = req.body.donneesSec.donnees.Ressource.N;
    const services = await classes.getTeachersSubjectsByClassName(currentClass);

    const teachersList = [];
    const subjectsList = [];
    let ordre = 6;

    const transformedServices = await Promise.all(services.map(async (service) => {
        if (!teachersList.hasOwnProperty(service.teacherTeachingThisSubjectInTheClass)) {
          const teacher = await teachers.getTeacher(service.teacherTeachingThisSubjectInTheClass);
          var fullName = teacher.nom + " " + teacher.prenom;
          if (teacher.genre === "F") {
            fullName = "Mme. " + fullName;
          } else if (teacher.genre === "M") {
            fullName = "M. " + fullName;
          }
          teachersList[service.teacherTeachingThisSubjectInTheClass] = {
            fullname: fullName,
            id: teacher.id,
            P: ordre,
          };
          ordre++;
        }

        if (!teachersList.hasOwnProperty(service.subject)) {
            subjectsList[service.subject] = await subjects.getSubjectByName(service.subject).id;
        }
      
        return {
          "L": service.subject,
          "N": "1300" + subjectsList[service.subject],
          "classe": {
            "_T": 24,
            "V": {
              "L": currentClass,
              "N": currentClassId,
            },
          },
          "estSansNote": false,
          "listeProfesseurs": {
            "_T": 24,
            "V": [
              {
                "G": 3,
                "L": teachersList[service.teacherTeachingThisSubjectInTheClass].fullname,
                "N": "1100" + teachersList[service.teacherTeachingThisSubjectInTheClass].id,
                "P": teachersList[service.teacherTeachingThisSubjectInTheClass].P,
              },
            ],
          },
          "matiere": {
            "_T": 24,
            "V": {
              "G": 16,
              "L": service.subject,
              "N": "8200" + subjectsList[service.subject],
            },
          },
        };
      }));

    const response = {
        "nom": "ListeServices",
        "session": parseInt(session_id),
        "numeroOrdre": numeroOrdre,
        "donneesSec": {
            "nom": "ListeServices",
            "donnees": {
                "services": {
                    "_T": 24,
                    "V": transformedServices
                }
            }
        }
    };

    res.json(response);
    return true;
}

module.exports = {
    bind
};