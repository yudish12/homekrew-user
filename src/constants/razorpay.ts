import { API_URL } from "./axios-config";

export const RAZORPAY_KEY_ID =
    API_URL === "https://api.homekrew.in"
        ? "rzp_live_RvX112fxdWhno9"
        : "rzp_test_M1Ad7casmGNZTV";

/** Razorpay rejects on cancel; code 2 is typical for user cancellation. */
export function isRazorpayUserCancelled(error: unknown): boolean {
    if (error == null || typeof error !== "object") {
        return false;
    }
    const e = error as { code?: number; description?: string };
    if (e.code === 2) {
        return true;
    }
    const desc = String(e.description ?? "").toLowerCase();
    return desc.includes("cancel");
}
