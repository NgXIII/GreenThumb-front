import {describe} from "vitest";
import {useUser} from "../../shared/hooks/useUser.ts";
import {renderHook, waitFor} from "@testing-library/react";
import * as repo from "../../services/repos/getUserCount.ts"

describe("useUserCount", () => {
    it("retourne le userCount", async () => {
        vi.spyOn(repo, "getUserCount").mockResolvedValueOnce(12)

        const { result } = renderHook(() => useUser())

        expect(result.current.loading).toBe(true)

        await waitFor(() =>
            expect(result.current.loading).toBe(false)
        )

        expect(result.current.userCount).toBe(12)
        expect(result.current.error).toBeNull()
    })

    it("gère une erreur api", async () => {
        vi.spyOn(repo, "getUserCount").mockRejectedValueOnce(new Error("Boom"))

        const { result } = renderHook(() => useUser())

        await waitFor(() =>{
            expect(result.current.error).not.toBeNull
        })

        expect(result.current.userCount).toBeNull()
    })
})