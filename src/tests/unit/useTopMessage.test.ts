import useTopMessages from "../../shared/hooks/useTopMessages"
import { renderHook, waitFor } from "@testing-library/react"
import * as repo from "../../services/repos/getTop3Messages.ts"

const fakeMessage = [
    { idMessage: 1, text: "c'est un text", author: "Moi", timestamp: new Date().toISOString(), mediaUrls: [], reactions: [] },
]

describe("useTopMessage()", () => {
    it("retourne les messages", async () => {
        vi.spyOn(repo, "getTop3Messages").mockResolvedValueOnce(fakeMessage)

        const { result } = renderHook(() => useTopMessages())

        expect(result.current.loading).toBe(true)

        await waitFor(() =>{
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.messages).toEqual(fakeMessage)
        expect(result.current.error).toBeNull()
    })

    it("gère une erreur API", async () => {
        vi.spyOn(repo, "getTop3Messages").mockRejectedValueOnce(new Error("Boom"))

        const { result } = renderHook(() => useTopMessages())

        await waitFor(() =>
            expect(result.current.error).not.toBeNull()
        )

        expect(result.current.messages).toEqual([])
    })
})