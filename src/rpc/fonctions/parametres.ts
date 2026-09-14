import metadata from "../../../config/metadata.json";
import acquisitionsData from "../../../config/constants/acquisitions.json";
import fontsData from "../../../config/constants/fonts.json";
import holidaysData from "../../../config/constants/holidays.json";
import timeSlotsData from "../../../config/constants/timeSlots.json";

import { PronoteCrypto } from "../../crypto/cipher";

import {
	getDateToday,
	getCurrentSchoolYear,
	getFirstSchoolYear,
	getLastMondayOfAugust,
	getFirstWeekdayOfSeptember,
} from "../../helpers/date";
import { handleParametresHome } from "./parametresHome";

export const handleParametres = async (body: any, ctx: any) => {
    if (ctx.espaceId === 0) return handleParametresHome(body, ctx);
};