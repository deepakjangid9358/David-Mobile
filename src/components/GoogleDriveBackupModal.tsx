import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  ExternalLink,
  RefreshCw,
  LogOut,
  X,
  FileJson,
  Database,
  ShieldCheck,
  Zap,
  Clock,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { StockItem, SaleTransaction, ShopProfile } from '../types';
import {
  googleSignIn,
  logout,
  getAccessToken,
  initAuth,
  backupToGoogleDrive,
  listGoogleDriveBackups,
  downloadBackupFromGoogleDrive,
  deleteBackupFromGoogleDrive,
  getAutoBackupSetting,
  setAutoBackupSetting,
  getLastSyncTime,
  DriveBackupFile,
  AppBackupPayload,
} from '../utils/googleDrive';

interface GoogleDriveBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: StockItem[];
  sales: SaleTransaction[];
  shopProfile: ShopProfile;
  onRestoreData: (
    restoredItems: StockItem[],
    restoredSales: SaleTransaction[],
    restoredProfile?: ShopProfile
  ) => void;
  lang: 'en' | 'hi';
  onAutoBackupToggled?: (enabled: boolean) => void;
}

export const GoogleDriveBackupModal: React.FC<GoogleDriveBackupModalProps> = ({
  isOpen,
  onClose,
  items,
  sales,
  shopProfile,
  onRestoreData,
  lang,
  onAutoBackupToggled,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [backups, setBackups] = useState<DriveBackupFile[]>([]);
  const [isAutoBackup, setIsAutoBackup] = useState<boolean>(getAutoBackupSetting());
  const [lastSyncTime, setLastSyncTimeState] = useState<string | null>(getLastSyncTime());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // When signed in and modal opened, load backups & refresh sync state
  useEffect(() => {
    if (isOpen) {
      setIsAutoBackup(getAutoBackupSetting());
      setLastSyncTimeState(getLastSyncTime());
      if (token) {
        fetchBackups(token);
      }
    }
  }, [isOpen, token]);

  const fetchBackups = async (accessToken: string) => {
    setIsLoadingBackups(true);
    setStatusMessage(null);
    try {
      const files = await listGoogleDriveBackups(accessToken);
      setBackups(files);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Could not load backups from Google Drive',
      });
    } finally {
      setIsLoadingBackups(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        await fetchBackups(res.accessToken);
        setStatusMessage({
          type: 'success',
          text: `Signed in as ${res.user.email}. Ready for Google Drive sync!`,
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Google Sign-In was cancelled or failed.',
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleToggleAutoBackup = async () => {
    const nextValue = !isAutoBackup;
    if (nextValue && !token) {
      // If not signed in yet, trigger sign in first
      try {
        setIsAuthenticating(true);
        setStatusMessage(null);
        const res = await googleSignIn();
        if (res) {
          setUser(res.user);
          setToken(res.accessToken);
          setAutoBackupSetting(true);
          setIsAutoBackup(true);
          if (onAutoBackupToggled) onAutoBackupToggled(true);
          setStatusMessage({
            type: 'success',
            text:
              lang === 'hi'
                ? 'गूगल साइन-इन सफल! ऑटो-बैकअप सक्षम हो गया है (हर बदलाव पर ऑटो-सिंक होगा)।'
                : 'Google Sign-In successful! Auto-Backup is now active.',
          });
          await fetchBackups(res.accessToken);
        }
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: err.message || 'Google Sign-In required to enable Auto-Backup.',
        });
      } finally {
        setIsAuthenticating(false);
      }
      return;
    }

    setAutoBackupSetting(nextValue);
    setIsAutoBackup(nextValue);
    if (onAutoBackupToggled) onAutoBackupToggled(nextValue);

    setStatusMessage({
      type: 'success',
      text: nextValue
        ? lang === 'hi'
          ? 'ऑटो-बैकअप सक्रिय किया गया। हर नए आइटम या बिक्री पर डेटा गूगल ड्राइव में अपने आप सुरक्षित होगा।'
          : 'Auto-Backup enabled! Stock updates and new bills will sync to Google Drive automatically.'
        : lang === 'hi'
          ? 'ऑटो-बैकअप बंद कर दिया गया।'
          : 'Auto-Backup disabled.',
    });
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setBackups([]);
    setStatusMessage({
      type: 'success',
      text: 'Signed out successfully.',
    });
  };

  const handleCreateBackup = async () => {
    if (!token) {
      await handleSignIn();
      return;
    }

    setIsBackingUp(true);
    setStatusMessage(null);
    try {
      const payload: AppBackupPayload = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        shopProfile,
        items,
        sales,
      };

      const newBackup = await backupToGoogleDrive(payload, token);
      setStatusMessage({
        type: 'success',
        text: `Backup successfully saved to your Google Drive! (${items.length} items, ${sales.length} bills saved)`,
      });
      await fetchBackups(token);
    } catch (err: any) {
      console.error(err);
      // If token expired, prompt re-signin
      if (err.message?.includes('401') || err.message?.includes('auth')) {
        setStatusMessage({
          type: 'error',
          text: 'Google Drive session expired. Please sign in again.',
        });
        setUser(null);
        setToken(null);
      } else {
        setStatusMessage({
          type: 'error',
          text: err.message || 'Failed to upload backup to Google Drive.',
        });
      }
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreBackup = async (file: DriveBackupFile) => {
    if (!token) return;

    const confirmed = window.confirm(
      `Restore backup "${file.name}"?\n\nThis will load all stock items and sales transactions from this backup file into your application. Current data will be replaced.`
    );
    if (!confirmed) return;

    setIsRestoring(true);
    setStatusMessage(null);
    try {
      const backupData = await downloadBackupFromGoogleDrive(file.id, token);
      onRestoreData(backupData.items, backupData.sales || [], backupData.shopProfile);
      setStatusMessage({
        type: 'success',
        text: `Data successfully restored from Google Drive! Loaded ${backupData.items.length} stock items.`,
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to restore backup from Google Drive.',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteBackup = async (file: DriveBackupFile) => {
    if (!token) return;
    const confirmed = window.confirm(
      `Delete backup file "${file.name}" from your Google Drive permanently?`
    );
    if (!confirmed) return;

    try {
      await deleteBackupFromGoogleDrive(file.id, token);
      setBackups((prev) => prev.filter((b) => b.id !== file.id));
      setStatusMessage({
        type: 'success',
        text: 'Backup deleted from Google Drive.',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to delete backup file.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {lang === 'hi' ? 'गूगल ड्राइव बैकअप और सिंक' : 'Google Drive Cloud Backup'}
              </h3>
              <p className="text-xs text-blue-200/80">
                {lang === 'hi'
                  ? 'अपने स्टॉक और बिल रिकॉर्ड को सुरक्षित रूप से क्लाउड पर रखें'
                  : 'Safely backup and restore your inventory & sales in Google Drive'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">{statusMessage.text}</div>
            </div>
          )}

          {/* Account Status Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {user ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google Account'}
                    className="h-10 w-10 rounded-full border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    {user.email?.[0].toUpperCase() || 'G'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{user.displayName || 'Google User'}</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <Cloud className="h-4 w-4 text-slate-400" />
                <span>Connect your Google account to backup directly to your personal Drive</span>
              </div>
            )}

            {user ? (
              <button
                onClick={handleSignOut}
                className="text-xs text-slate-600 hover:text-rose-600 flex items-center gap-1 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 transition shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                id="btn-google-drive-login"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="gsi-material-button inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition active:scale-95 shrink-0"
              >
                {isAuthenticating ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" />
                ) : (
                  <div className="gsi-material-button-icon mr-2">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="h-4 w-4"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                  </div>
                )}
                <span>Sign in with Google</span>
              </button>
            )}
          </div>

          {/* Auto-Backup Toggle Setting Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-4.5 border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl transition ${
                    isAutoBackup
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold tracking-tight">
                      {lang === 'hi' ? 'ऑटो-बैकअप (Auto-Sync on Changes)' : 'Auto-Backup on Change'}
                    </h4>
                    {isAutoBackup ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
                        DISABLED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {lang === 'hi'
                      ? 'हर बार जब आप नया आइटम जोड़ेंगे, स्टॉक बदलेंगे या बिल बनाएंगे, तो डेटा अपने आप गूगल ड्राइव में बैकअप हो जाएगा।'
                      : 'Automatically syncs your catalog, stock updates, and sales bills directly to Google Drive every time you add an item or make a sale.'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                id="btn-toggle-gdrive-autobackup"
                type="button"
                role="switch"
                aria-checked={isAutoBackup}
                onClick={handleToggleAutoBackup}
                disabled={isAuthenticating}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isAutoBackup ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                title={isAutoBackup ? 'Turn off Auto-Backup' : 'Turn on Auto-Backup'}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAutoBackup ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {lastSyncTime && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                <Clock className="h-3.5 w-3.5 text-blue-400" />
                <span>
                  {lang === 'hi' ? 'अंतिम क्लाउड सिंक:' : 'Last Cloud Sync:'}{' '}
                  {new Date(lastSyncTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  ({new Date(lastSyncTime).toLocaleDateString()})
                </span>
              </div>
            )}
          </div>

          {/* Action Trigger Card: Create New Backup */}
          <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <Database className="h-4 w-4 text-blue-600" />
                <span>
                  Current Shop Data: <strong>{items.length} Stock Models</strong>,{' '}
                  <strong>{sales.length} Bills</strong>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Uploads a fresh snapshot of your catalog, rates, and customer bills to Google Drive.
              </p>
            </div>

            <button
              id="btn-trigger-gdrive-backup"
              onClick={handleCreateBackup}
              disabled={isBackingUp || isAuthenticating}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition flex items-center justify-center gap-2 active:scale-95 shrink-0"
            >
              {isBackingUp ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <CloudUpload className="h-4 w-4" />
              )}
              <span>{isBackingUp ? 'Saving to Drive...' : 'Backup to Google Drive'}</span>
            </button>
          </div>

          {/* Backup History on Google Drive */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileJson className="h-4 w-4 text-slate-500" />
                <span>Backups on your Google Drive</span>
              </h4>

              {token && (
                <button
                  onClick={() => fetchBackups(token)}
                  disabled={isLoadingBackups}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingBackups ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              )}
            </div>

            {!token ? (
              <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                <Cloud className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">Sign in to view existing backups</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Once connected, all your past snapshots will appear here.
                </p>
              </div>
            ) : isLoadingBackups ? (
              <div className="text-center py-8 text-slate-500 text-xs flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span>Checking Google Drive files...</span>
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                <p className="font-bold text-slate-700">No previous backups found in Google Drive</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Click &ldquo;Backup to Google Drive&rdquo; above to create your first cloud snapshot.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {backups.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-white border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                        <FileJson className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{file.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(file.createdTime).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Restore Button */}
                      <button
                        onClick={() => handleRestoreBackup(file)}
                        disabled={isRestoring}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                        title="Restore this backup into the app"
                      >
                        <CloudDownload className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Restore</span>
                      </button>

                      {/* Open in Drive Link */}
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Open file in Google Drive"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteBackup(file)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete this backup from Drive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px] text-slate-400">
            Encrypted with Google OAuth2 security
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
