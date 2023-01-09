import { Locale } from "../locale";
import { CreateFilterFunc, FilterFunc } from "./index.types";

export function createFilter({ locale, required }: { locale: Locale, required?: boolean }, callback: CreateFilterFunc): FilterFunc {
    return async function (message, args, _, results) {
        if(required && !args.length) throw new Error(locale.interaction.needArguments);
        const data = await callback(message, args, locale, results);

        if (data) return { data, required };
        return { data, required };
    }
}