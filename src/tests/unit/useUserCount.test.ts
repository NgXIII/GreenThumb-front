import {describe} from "vitest";
import {useUserCount} from "../../shared/hooks/useUserCount.ts";
import {renderHook, waitFor} from "@testing-library/react";
import * as repo from "../../services/repos/getUserCount.ts"

describe("useUserCount", () => {
    it("retourne le userCount", async () => {
        vi.spyOn(repo, "getUserCount").mockResolvedValueOnce(12)

        const { result } = renderHook(() => useUserCount())

        expect(result.current.loading).toBe(true)

        await waitFor(() =>
            expect(result.current.loading).toBe(false)
        )

        expect(result.current.userCount).toBe(12)
        expect(result.current.error).toBeNull()
    })

    it("gère une erreur api", async () => {
        vi.spyOn(repo, "getUserCount").mockRejectedValueOnce(new Error("Boom"))

        const { result } = renderHook(() => useUserCount())

        await waitFor(() =>{
            expect(result.current.error).not.toBeNull
        })

        expect(result.current.userCount).toBeNull()
    })
})