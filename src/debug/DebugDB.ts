export type { EventType, DebugEvent } from "./DebugTypes";
import type { DebugEvent } from "./DebugTypes";
import { DB_NAME, DB_VERSION, STORE_NAME } from "./DebugTypes";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function dbAddEvent(event: DebugEvent): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).add(event);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbGetAllEvents(): Promise<DebugEvent[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).index("timestamp").getAll();
    request.onsuccess = () => resolve(request.result as DebugEvent[]);
    request.onerror = () => reject(request.error);
  });
}

export async function dbClearEvents(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Elimina eventos más antiguos que `maxAgeDays` días
 * y recorta el total a `maxRecords` registros más recientes.
 */
export async function dbPurgeOldEvents(
  maxAgeDays = 3,
  maxRecords = 2000,
): Promise<void> {
  const db = await openDB();
  const cutoff = new Date(
    Date.now() - maxAgeDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  // 1. Borrar por antigüedad usando el índice de timestamp
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const index = tx.objectStore(STORE_NAME).index("timestamp");
    const range = IDBKeyRange.upperBound(cutoff, true);
    const request = index.openCursor(range);
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  // 2. Si aún hay más de maxRecords, borrar los más antiguos
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const index = tx.objectStore(STORE_NAME).index("timestamp");
    const countReq = index.count();
    countReq.onsuccess = () => {
      const total = countReq.result;
      if (total <= maxRecords) {
        resolve();
        return;
      }
      const toDelete = total - maxRecords;
      let deleted = 0;
      const cursorReq = index.openCursor(); // orden ascendente (más antiguos primero)
      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result;
        if (cursor && deleted < toDelete) {
          cursor.delete();
          deleted++;
          cursor.continue();
        }
      };
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
