// Meish Printed — reservation store (MEI-20).
//
// A reservation is a *reserve-interest* record: a customer tells us what they'd
// like printed before any card is charged (no payment yet — that's MEI-4). We
// keep who they are, what/how many they want, and their note, plus a little
// request metadata for the anti-abuse watch (MEI-21).
//
// MVP storage = one JSON file per reservation under RESERVATIONS_DIR
// (default `.data/reservations`). That is enough to prove the deliverable and
// to run the first real reservations. Like the order store, it sits behind a
// tiny interface so production can swap in Airtable / a Google Sheet / a hosted
// DB free tier by re-implementing `saveReservation` / `getReservation` /
// `listReservations` — no caller changes. See docs/RESERVE.md.

import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export interface Reservation {
  /** Our id — `rsv_<ms>_<rand>`, filesystem-safe and time-sortable. */
  id: string;
  createdAt: string;
  /** Lifecycle: 'new' on submit; the inbox/admin moves it forward later. */
  status: 'new' | 'contacted' | 'closed';
  product: {
    /** Catalogue slug, or 'unspecified' for a general enquiry. */
    slug: string;
    name: string;
  };
  quantity: number;
  customer: {
    name: string;
    email: string;
  };
  note: string;
  /** Delivery outcome of the two transactional emails (best-effort). */
  notify: { delivered: boolean; provider: string } | null;
  confirmation: { delivered: boolean; provider: string } | null;
  /** Request metadata — used by the anti-abuse watch, never shown publicly. */
  meta: {
    ip: string | null;
    userAgent: string | null;
    /** Where the form was submitted from, e.g. a product page or /reserve. */
    source: string;
  };
}

function reservationsDir(): string {
  return resolve(process.env.RESERVATIONS_DIR ?? '.data/reservations');
}

function reservationPath(id: string): string {
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, '_');
  return join(reservationsDir(), `${safe}.json`);
}

/** Mint a new, sortable, collision-resistant reservation id. */
export function newReservationId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `rsv_${Date.now()}_${rand}`;
}

/** Persist a reservation. Overwrites any existing reservation with the same id. */
export async function saveReservation(reservation: Reservation): Promise<void> {
  await mkdir(reservationsDir(), { recursive: true });
  await writeFile(
    reservationPath(reservation.id),
    JSON.stringify(reservation, null, 2),
    'utf8',
  );
}

export async function getReservation(id: string): Promise<Reservation | null> {
  try {
    const raw = await readFile(reservationPath(id), 'utf8');
    return JSON.parse(raw) as Reservation;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export async function listReservations(): Promise<Reservation[]> {
  try {
    const files = await readdir(reservationsDir());
    const rows = await Promise.all(
      files
        .filter((f) => f.endsWith('.json'))
        .map(
          async (f) =>
            JSON.parse(
              await readFile(join(reservationsDir(), f), 'utf8'),
            ) as Reservation,
        ),
    );
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}
