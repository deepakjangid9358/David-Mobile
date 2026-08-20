import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import { StockItem, SaleTransaction, ShopProfile } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Workspace Drive scope for file backup
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Auth state observer
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token might need re-fetching on next interaction
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive access token');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveBackupFile {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
}

export interface AppBackupPayload {
  version: string;
  exportedAt: string;
  shopProfile: ShopProfile;
  items: StockItem[];
  sales: SaleTransaction[];
}

/**
 * Uploads full inventory, sales, and profile data to Google Drive as a JSON file.
 */
export async function backupToGoogleDrive(
  payload: AppBackupPayload,
  accessToken: string
): Promise<DriveBackupFile> {
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const cleanShopName = (payload.shopProfile.shopName || 'David_Mobile').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${cleanShopName}_Backup_${dateStr}.json`;

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: `David Mobile inventory stock (${payload.items.length} items) and sales records backup`,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(payload, null, 2) +
    closeDelim;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,createdTime,webViewLink,size',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: body,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload backup to Google Drive: ${errText}`);
  }

  return await res.json();
}

/**
 * Lists previously created backups from Google Drive.
 */
export async function listGoogleDriveBackups(accessToken: string): Promise<DriveBackupFile[]> {
  const query = "trashed = false and mimeType = 'application/json' and (name contains 'Backup' or name contains 'David_Mobile')";
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,createdTime,modifiedTime,size,webViewLink)&orderBy=createdTime desc&pageSize=20`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to list Google Drive backups: ${errText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Reads and parses backup content from Google Drive by fileId.
 */
export async function downloadBackupFromGoogleDrive(
  fileId: string,
  accessToken: string
): Promise<AppBackupPayload> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to download backup file: ${errText}`);
  }

  const data = await res.json();
  if (!data.items || !Array.isArray(data.items)) {
    throw new Error('Invalid backup file format. Expected "items" array.');
  }

  return data;
}

/**
 * Deletes a backup file from Google Drive.
 */
export async function deleteBackupFromGoogleDrive(
  fileId: string,
  accessToken: string
): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok && res.status !== 404) {
    const errText = await res.text();
    throw new Error(`Failed to delete backup file: ${errText}`);
  }
}

const AUTO_BACKUP_STORAGE_KEY = 'mobileshop_gdrive_auto_backup_enabled';
const LAST_SYNC_STORAGE_KEY = 'mobileshop_gdrive_last_sync_time';

export function getAutoBackupSetting(): boolean {
  try {
    return localStorage.getItem(AUTO_BACKUP_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAutoBackupSetting(enabled: boolean): void {
  try {
    localStorage.setItem(AUTO_BACKUP_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    console.error('Error saving auto backup setting:', e);
  }
}

export function getLastSyncTime(): string | null {
  try {
    return localStorage.getItem(LAST_SYNC_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setLastSyncTime(isoDate: string): void {
  try {
    localStorage.setItem(LAST_SYNC_STORAGE_KEY, isoDate);
  } catch (e) {
    console.error('Error saving last sync time:', e);
  }
}

let autoSyncTimeout: any = null;

export async function triggerAutoBackupIfEnabled(
  payload: AppBackupPayload,
  onSyncStatus?: (status: 'syncing' | 'synced' | 'error' | 'idle', msg?: string) => void
): Promise<boolean> {
  const isEnabled = getAutoBackupSetting();
  if (!isEnabled) return false;

  const token = await getAccessToken();
  if (!token) {
    if (onSyncStatus) onSyncStatus('idle', 'Sign in with Google to enable automatic background backup');
    return false;
  }

  if (autoSyncTimeout) {
    clearTimeout(autoSyncTimeout);
  }

  return new Promise((resolve) => {
    if (onSyncStatus) onSyncStatus('syncing', 'Auto-saving to Google Drive...');
    autoSyncTimeout = setTimeout(async () => {
      try {
        await backupToGoogleDrive(payload, token);
        const now = new Date().toISOString();
        setLastSyncTime(now);
        if (onSyncStatus) {
          onSyncStatus(
            'synced',
            `Auto-backed up to Drive at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          );
        }
        resolve(true);
      } catch (err: any) {
        console.error('Auto backup failed:', err);
        if (onSyncStatus) onSyncStatus('error', 'Auto-sync failed: check connection');
        resolve(false);
      }
    }, 1200);
  });
}
