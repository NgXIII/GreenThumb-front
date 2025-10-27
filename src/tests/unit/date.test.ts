import {describe} from "vitest";
import {formatDateFr, formatTimeAgo} from "../../shared/utils/date.ts";


describe("formatDateFr", () => {
    it("retourne une date FR formatée", () => {
        expect(formatDateFr("2025-10-05")).toMatch(/2025/)
    })

    it("retourner une erreur avec un input invalide", () => {
        expect(() => formatDateFr("nope")).toThrow()
    })
})

describe("formatTimeAgo", () => {
    it("formate un temps passé", () => {
        const past = new Date(Date.now() - 2 * 60 * 1000)
        expect(formatTimeAgo(past.toISOString())).toMatch(/il y a/)
    })
})