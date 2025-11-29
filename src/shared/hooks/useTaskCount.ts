import {useEffect, useState} from "react";
import {getCountTask} from "@/services/repos/getPlants.ts";

export default function useCountTask(username: string | undefined) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        getCountTask(username)
            .then((count) => setCount(count))
    }, [username]);

    return { count };
}