import leave1 from "../../../../assets/leave1.png";
import leave2 from "../../../../assets/leave2.png";
import leave3 from "../../../../assets/leave3.png";
import leave4 from "../../../../assets/leave4.png";

type QuartetLeavesProps = {
    positionLeave1: string //
    positionLeave2: string // It's about absolute position (top, left, right, bottom)
    positionLeave3: string //
    positionLeave4: string //
}

export default function QuartetLeaves({positionLeave1, positionLeave2, positionLeave3, positionLeave4}: QuartetLeavesProps) {
    return (
        <>
            <img
                src={leave1}
                alt=""
                className={`hidden ${positionLeave1} lg:block absolute w-56 h-auto pointer-events-none z-0`}
            />
            <img
                src={leave2}
                alt=""
                className={`hidden ${positionLeave2} lg:block absolute w-40 h-auto pointer-events-none z-0`}
            />
            <img
                src={leave3}
                alt=""
                className={`hidden ${positionLeave3} lg:block absolute  w-40 h-auto pointer-events-none z-0`}
            />
            <img
                src={leave4}
                alt=""
                className={`hidden ${positionLeave4} lg:block absolute  w-40 h-auto pointer-events-none z-0`}
            />
        </>
    );
}