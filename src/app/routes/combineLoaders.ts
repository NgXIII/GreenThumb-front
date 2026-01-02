import type {LoaderFunctionArgs} from "react-router-dom";

type Loader = (args: LoaderFunctionArgs) => Promise<Response | null>;
export const combineLoaders = (... loaders: Loader[]) => {
    return async (args: LoaderFunctionArgs) => {
        for (const loader of loaders) {
            const result = await loader(args);

            if (result) {
                return result;
            }
        }

        return null;
    };
};