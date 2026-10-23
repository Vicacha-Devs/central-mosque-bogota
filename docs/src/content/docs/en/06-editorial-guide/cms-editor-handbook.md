---
title: Mosque Staff & Editorial CMS Handbook (Strapi v5)
description: Non-technical guide for Central Mosque of Bogotá staff to manage prayer times, events, spotlights, donations, and community requests in Strapi v5.
---

This guide is written for **Central Mosque of Bogotá administrators and content editors** managing the website through the Strapi v5 Admin Panel (`/admin`).

```mermaid
flowchart LR
  Login["1. Sign in to /admin"] --> SelectLocale["2. Select Locale (ES, EN, AR, TR)"]
  SelectLocale --> Edit["3. Edit Content & Preview"]
  Edit --> Publish["4. Click Publish"]
```

---

## 1. Managing Daily & Jumu'ah Prayer Settings

1. In the left sidebar, open **Content Manager -> Single Types -> Prayer Setting**.
2. Update:
   - **Jumu'ah Khutbah Time** (e.g., `12:15 PM`) and **Jumu'ah Prayer Time** (e.g., `12:45 PM`).
   - **Iqamah Offsets** (`iqamahConfigs`) for Fajr, Dhuhr, Asr, Maghrib, and Isha.
   - **Hijri Adjustment Days** (`-2` to `+2`) when local moon-sighting announcements adjust the start of Ramadan, Eid al-Fitr, or Dhul Hijjah.
3. Click **Save** and **Publish**.

---

## 2. Posting an Urgent Community Alert Banner

When an urgent announcement is needed (e.g., Eid prayer schedule, Ramadan moonsighting, or emergency janazah notice):
1. Open the **Islam Suite** plugin (`@vicacha-devs/strapi-plugin-islam`) or **Global Setting**.
2. Enable the **Urgent Alert Banner**, select the severity (`info`, `important`, `urgent`), and fill in the title, summary, and CTA link for `es`, `en`, `ar`, and `tr`.
3. Visitors will see the banner at the top of the homepage; if you update the alert's `id`, it will reappear even for visitors who dismissed an older banner.

---

## 3. Creating Events & Promoting to the Corner Spotlight Dock

1. Go to **Content Manager -> Collection Types -> Event** and click **Create new entry**.
2. Fill in **Title**, **Category**, **Schedule**, **Location**, and **Body** (using the Tiptap Rich Text Editor).
3. **To promote the event in the floating bottom-corner Spotlight Dock** (used for scholarships like *Türkiye Bursları* / *Diyanet TDV* or major conferences):
   - Toggle `spotlightEnabled` to **True**.
   - Upload a vertical **Poster** image (`poster`).
   - Set `spotlightBadgeText` (e.g., `"Convocatoria Abierta"`), `spotlightPriority` (higher numbers appear first), and `spotlightEndAt` (for the live remaining-days countdown badge).
4. Use the top-right **Locales** dropdown to translate the event into `en`, `ar`, and `tr`, then click **Publish**.

---

## 4. Managing Donations, Zakat & Utility Invoice Sponsorships

1. **Donation Campaigns (`Collection Types -> Donation Campaign`)**:
   - Update `goalAmountCop`, `raisedAmountCop`, and `donorCount` to update the live progress bars on `/[lang]/donate`.
2. **Payment Channels (`Single Types -> Donations Page`)**:
   - Manage Bancolombia, Nequi, and Bre-B transfer details and QR instructions.
3. **Monthly Utility Invoices (`Donations Plugin -> Utility Invoices`)**:
   - Add or mark monthly Mosque utility bills (Electricity, Water, Gas, Internet, Administration) as `pending`, `partially_funded`, or `paid`.
4. **Reviewing Donor Payment Proofs (`Collection Types -> Donation Submission`)**:
   - Verify transfer receipts submitted by donors (`donorName`, `amountCop`, `referenceNumber`) and issue tax/donation certificates via the **Certificates** plugin.

---

## 5. Handling Visitor Bookings & Service Desk Requests

- **Guided Mosque Visits (`Collection Types -> Visit Booking`)**:
  - Review incoming school, university, and individual tour requests (`preferredDate`, `preferredTime`, `groupSize`) and update `status` from `pending` to `confirmed`.
- **Service Desk Requests (`Inbox Plugin` / `Contact Submission`)**:
  - Process community requests for **Khutbah topics**, **Nikah (Matrimony) officiating**, **Janazah (Funeral) support**, **Shahada appointments**, and **Islamic Certificates**.
