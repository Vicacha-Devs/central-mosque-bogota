import { describe, expect, it, vi } from "vitest";

import { POST } from "../../pages/api/submissions";

vi.mock("@services/strapi", () => ({
  fetchStrapiData: vi.fn().mockResolvedValue({ data: { id: 1 } }),
}));

function buildJsonRequest(payload: Record<string, unknown>): Request {
  return new Request("http://localhost:4321/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

type TSubmissionResponse = {
  ok?: boolean;
  referenceCode?: string;
  status?: string;
};

describe("POST /api/submissions BFF endpoint", () => {
  it("should reject submissions when the honeypot field is filled", async () => {
    const res = await POST({
      request: buildJsonRequest({
        formType: "contact",
        website: "https://spam.example",
        fullName: "Bot",
        email: "bot@example.com",
        message: "Spam",
      }),
    } as never);

    expect(res.status).toBe(400);
    const json = (await res.json()) as TSubmissionResponse;
    expect(json.ok).toBe(false);
  });

  it("should accept course enrollment submissions when payload is valid", async () => {
    const res = await POST({
      request: buildJsonRequest({
        formType: "contact",
        subject: "education",
        locale: "es",
        fullName: "Amina Gómez",
        email: "amina@example.org",
        phone: "+57 300 000 0000",
        message: "[Academy: Árabe Nivel 1] (in-person) Deseo inscribirme",
      }),
    } as never);

    expect(res.status).toBe(200);
    const json = (await res.json()) as TSubmissionResponse;
    expect(json.ok).toBe(true);
    expect(json.referenceCode).toMatch(/^INB-\d{8}-[A-Z0-9]+$/);
  });

  it("should accept newsletter subscriptions when topics are provided", async () => {
    const res = await POST({
      request: buildJsonRequest({
        formType: "newsletter",
        email: "community@example.org",
        phone: "+57 310 123 4567",
        locale: "es",
        topics: ["announcements", "ramadan_eid"],
        sourceFormSlug: "community-broadcast-channels",
      }),
    } as never);

    expect(res.status).toBe(200);
    const json = (await res.json()) as TSubmissionResponse;
    expect(json.ok).toBe(true);
    expect(json.status).toBe("pending");
  });

  it("should accept service desk applications when submitted", async () => {
    const { fetchStrapiData } = await import("@services/strapi");
    const mockFetch = vi.mocked(fetchStrapiData);
    mockFetch.mockClear();

    const res = await POST({
      request: buildJsonRequest({
        formType: "service_desk",
        serviceType: "nikah",
        applicantName: "Yusuf & Sara",
        applicantEmail: "yusuf@example.org",
        applicantPhone: "+57 300 111 2233",
        preferredDate: "2026-11-15",
        details: "Solicitud de ceremonia matrimonial",
        locale: "es",
      }),
    } as never);

    expect(res.status).toBe(200);
    const json = (await res.json()) as TSubmissionResponse;
    expect(json.ok).toBe(true);
    expect(json.referenceCode).toMatch(/^INB-\d{8}-[A-Z0-9]+$/);
    expect(mockFetch).toHaveBeenCalledWith(
      "certificates/apply",
      {},
      expect.objectContaining({ method: "POST" })
    );
  });

  it("should route visit bookings through bookings/reserve when requested", async () => {
    const { fetchStrapiData } = await import("@services/strapi");
    const mockFetch = vi.mocked(fetchStrapiData);
    mockFetch.mockClear();

    const res = await POST({
      request: buildJsonRequest({
        formType: "visit",
        visitorName: "Prof. Carlos Méndez",
        organizationOrSchool: "Universidad Nacional de Colombia",
        email: "cmendez@unal.edu.co",
        phone: "+57 315 222 3344",
        preferredDate: "2026-11-20",
        preferredTimeSlot: "morning",
        groupSize: 28,
        notes: "Visita académica de Historia de las Religiones",
        locale: "es",
      }),
    } as never);

    expect(res.status).toBe(200);
    const json = (await res.json()) as TSubmissionResponse;
    expect(json.ok).toBe(true);
    expect(json.referenceCode).toMatch(/^BKG-\d{8}-[A-Z0-9]+$/);
    expect(mockFetch).toHaveBeenCalledWith(
      "bookings/reserve",
      {},
      expect.objectContaining({ method: "POST" })
    );
  });

  it("should route donation pledges through donations/pledges when submitted", async () => {
    const { fetchStrapiData } = await import("@services/strapi");
    const mockFetch = vi.mocked(fetchStrapiData);
    mockFetch.mockClear();

    const res = await POST({
      request: buildJsonRequest({
        formType: "donation",
        donorName: "Tariq Al-Mansoor",
        donorEmail: "tariq@example.org",
        donorPhone: "+57 300 555 6677",
        documentType: "CC",
        documentNumber: "1020304050",
        amount: 185000,
        currency: "COP",
        donationType: "utility_bills",
        campaignSlug: "factura-energia-enel-octubre",
        campaignKind: "utility_invoice",
        coversRemainingBalance: true,
        paymentMethodUsed: "nequi",
        transactionReference: "NEQ-998877",
        requestsTaxCertificate: true,
        locale: "es",
      }),
    } as never);

    expect(res.status).toBe(200);
    const json = (await res.json()) as TSubmissionResponse;
    expect(json.ok).toBe(true);
    expect(json.referenceCode).toMatch(/^INV-\d{8}-[A-Z0-9]+$/);
    expect(mockFetch).toHaveBeenCalledWith(
      "donations/pledges",
      {},
      expect.objectContaining({ method: "POST" })
    );
  });

  it("should handle validation failures, upstream reference overrides, and offline fallbacks when Strapi errors", async () => {
    const { fetchStrapiData } = await import("@services/strapi");
    const mockFetch = vi.mocked(fetchStrapiData);

    const badJsonRes = await POST({
      request: new Request("http://localhost:4321/api/submissions", {
        method: "POST",
        body: "{bad-json",
      }),
    } as never);
    expect(badJsonRes.status).toBe(500);

    const badTypeRes = await POST({
      request: buildJsonRequest({ type: "unknown", locale: "invalid" }),
    } as never);
    expect(badTypeRes.status).toBe(400);

    const badContact = await POST({
      request: buildJsonRequest({ formType: "contact", fullName: "" }),
    } as never);
    expect(badContact.status).toBe(400);

    mockFetch.mockRejectedValueOnce(new Error("Offline"));
    const offlineContact = await POST({
      request: buildJsonRequest({
        formType: "contact",
        subject: "invalid-subject",
        fullName: "Ali",
        email: "ali@example.com",
        message: "Test",
      }),
    } as never);
    expect(offlineContact.status).toBe(200);

    const badVisit = await POST({
      request: buildJsonRequest({ formType: "visit", visitorName: "" }),
    } as never);
    expect(badVisit.status).toBe(400);

    mockFetch.mockResolvedValueOnce({
      data: { referenceCode: "BKG-UPSTREAM-1" },
    });
    const upstreamVisit = await POST({
      request: buildJsonRequest({
        formType: "visit",
        visitorName: "Sara",
        email: "sara@example.com",
        phone: "123",
        preferredDate: "2026-12-01",
        preferredTimeSlot: "invalid",
        groupSize: "not-a-num",
      }),
    } as never);
    expect(((await upstreamVisit.json()) as TSubmissionResponse).referenceCode).toBe("BKG-UPSTREAM-1");

    mockFetch.mockRejectedValueOnce(new Error("Reserve failed"));
    const fallbackVisit = await POST({
      request: buildJsonRequest({
        formType: "visit",
        visitorName: "Sara",
        email: "sara@example.com",
        phone: "123",
        preferredDate: "2026-12-01",
      }),
    } as never);
    expect(fallbackVisit.status).toBe(200);

    const badDonation = await POST({
      request: buildJsonRequest({ formType: "donation", donorName: "" }),
    } as never);
    expect(badDonation.status).toBe(400);

    mockFetch.mockResolvedValueOnce({ referenceCode: "DON-UPSTREAM-1" });
    const upstreamDon = await POST({
      request: buildJsonRequest({
        formType: "donation",
        donorName: "Omar",
        donorEmail: "omar@example.com",
        documentType: "INVALID",
        amount: 50000,
        currency: "INVALID",
        donationType: "INVALID",
        paymentMethodUsed: "INVALID",
        campaignKind: "INVALID",
        coversRemainingBalance: "on",
        requestsTaxCertificate: "true",
      }),
    } as never);
    expect(((await upstreamDon.json()) as TSubmissionResponse).referenceCode).toBe("DON-UPSTREAM-1");

    mockFetch.mockRejectedValueOnce(new Error("Pledge failed"));
    const fallbackDon = await POST({
      request: buildJsonRequest({
        formType: "donation",
        donorName: "Omar",
        donorEmail: "omar@example.com",
        amount: 50000,
        donationType: "utility_bills",
      }),
    } as never);
    expect(fallbackDon.status).toBe(200);

    const badService = await POST({
      request: buildJsonRequest({
        formType: "service_desk",
        applicantName: "",
      }),
    } as never);
    expect(badService.status).toBe(400);

    mockFetch
      .mockResolvedValueOnce({ data: { serialNumber: "CERT-99" } })
      .mockRejectedValueOnce(new Error("Inbox offline"));
    const certService = await POST({
      request: buildJsonRequest({
        formType: "service_desk",
        serviceType: "invalid-service",
        applicantName: "Zayd",
        applicantEmail: "zayd@example.com",
        details: "Need certificate",
      }),
    } as never);
    expect(((await certService.json()) as TSubmissionResponse).referenceCode).toBe("CERT-99");

    mockFetch
      .mockRejectedValueOnce(new Error("Cert offline"))
      .mockResolvedValueOnce({ ok: true });
    const janazahService = await POST({
      request: buildJsonRequest({
        formType: "service_desk",
        serviceType: "janazah",
        applicantName: "Zayd",
        applicantEmail: "zayd@example.com",
        details: "Janazah request",
      }),
    } as never);
    expect(janazahService.status).toBe(200);

    const badNewsletter = await POST({
      request: buildJsonRequest({ formType: "newsletter", email: "bad" }),
    } as never);
    expect(badNewsletter.status).toBe(400);

    mockFetch.mockRejectedValueOnce(new Error("Subscriber offline"));
    const fallbackNewsletter = await POST({
      request: buildJsonRequest({
        formType: "newsletter",
        email: "sub@example.com",
        fullName: "Sub",
      }),
    } as never);
    expect(fallbackNewsletter.status).toBe(200);
  });
});
