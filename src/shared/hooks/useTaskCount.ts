import {useEffect, useState} from "react";
import {getCountTask} from "@/services/repos/getPlants.ts";

export default function useCountTask() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        getCountTask()
            .then((count) => setCount(count))
    })

    return { count };
}