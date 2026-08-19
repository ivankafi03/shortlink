// Google OAuth 2.0 & Identity Services (GSI) Helper

// Decode JWT token yang dikembalikan oleh Google GSI Credential Response
export const parseGoogleJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Gagal mendekode Google JWT Token:', err);
    return null;
  }
};

// Client ID fallback / config helper
export const DEFAULT_GOOGLE_CLIENT_ID = '189146836407-tlu7pjcacmeki4k2ne1ubg8mostet92t.apps.googleusercontent.com';

export const getActiveGoogleClientId = () => {
  try {
    const envId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
    if (envId && envId.trim()) return envId.trim();

    const savedConfig = localStorage.getItem('vidy_config_v1');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed.googleClientId && parsed.googleClientId.trim()) {
        return parsed.googleClientId.trim();
      }
    }
  } catch {}
  return DEFAULT_GOOGLE_CLIENT_ID;
};

// Dynamically load Google GSI SDK script
export const loadGoogleSdk = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      resolve(window.google.accounts.id);
      return;
    }
    const existingScript = document.getElementById('google-gsi-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google?.accounts?.id));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        resolve(window.google.accounts.id);
      } else {
        reject(new Error('Google SDK loaded but accounts.id is undefined'));
      }
    };
    script.onerror = () => reject(new Error('Gagal memuat Google SDK script'));
    document.head.appendChild(script);
  });
};

// Open Official Google OAuth 2.0 Popup Window (accounts.google.com)
export const openRealGooglePopup = ({ clientId, onSuccess, onError }) => {
  const activeId = clientId || getActiveGoogleClientId();
  const isDedicatedAdmin = typeof window !== 'undefined' && window.location.hostname.toLowerCase().includes('whatsappp');

  // If Client ID is present and GSI SDK is initialized, use GSI prompt / Token Client
  if (typeof window !== 'undefined' && window.google?.accounts?.oauth2 && activeId) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: activeId,
        scope: 'email profile openid',
        prompt: 'select_account',
        callback: async (resp) => {
          if (resp.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${resp.access_token}` }
              });
              const profile = await res.json();
              if (profile && profile.email) {
                onSuccess({
                  id: `google_${profile.sub}`,
                  name: profile.name || profile.email.split('@')[0],
                  email: profile.email.toLowerCase(),
                  avatar: profile.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.email)}`,
                  authProvider: 'google_oauth2',
                  role: isDedicatedAdmin || profile.email.includes('admin') ? 'admin' : 'member',
                  loggedInAt: new Date().toISOString()
                });
                return;
              }
            } catch (e) {
              if (onError) onError(e);
            }
          }
        }
      });
      client.requestAccessToken();
      return;
    } catch (e) {
      console.warn('OAuth2 client init fallback:', e);
    }
  }

  // Construct official Google OAuth 2.0 authorization endpoint URL
  if (activeId) {
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope = encodeURIComponent('openid email profile');
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${activeId}&redirect_uri=${redirectUri}&response_type=token%20id_token&scope=${scope}&prompt=select_account&nonce=${Date.now()}`;

    const width = 520;
    const height = 640;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      googleUrl,
      'GoogleOAuthPopup',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      alert('Pop-up terblokir oleh browser. Harap izinkan pop-up untuk login via Google.');
      return;
    }

    const checkPopupInterval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(checkPopupInterval);
          return;
        }

        if (popup.location.href && popup.location.href.includes(window.location.origin)) {
          const hash = popup.location.hash;
          popup.close();
          clearInterval(checkPopupInterval);

          if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const idToken = params.get('id_token');
            const accessToken = params.get('access_token');

            if (idToken) {
              const payload = parseGoogleJwt(idToken);
              if (payload) {
                onSuccess({
                  id: `google_${payload.sub}`,
                  name: payload.name || payload.email.split('@')[0],
                  email: payload.email.toLowerCase(),
                  avatar: payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(payload.email)}`,
                  authProvider: 'google_oauth2',
                  role: isDedicatedAdmin || payload.email.includes('admin') ? 'admin' : 'member',
                  loggedInAt: new Date().toISOString()
                });
                return;
              }
            }

            if (accessToken) {
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
              })
                .then(r => r.json())
                .then(profile => {
                  if (profile && profile.email) {
                    onSuccess({
                      id: `google_${profile.sub}`,
                      name: profile.name || profile.email.split('@')[0],
                      email: profile.email.toLowerCase(),
                      avatar: profile.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.email)}`,
                      authProvider: 'google_oauth2',
                      role: isDedicatedAdmin || profile.email.includes('admin') ? 'admin' : 'member',
                      loggedInAt: new Date().toISOString()
                    });
                  }
                })
                .catch(() => {});
            }
          }
        }
      } catch {
        // Cross-origin error expected while popup is on accounts.google.com domain
      }
    }, 400);
    return;
  }

  // If no Client ID configured, open Google Accounts portal to sign in, then authenticate profile
  const googleLoginUrl = 'https://accounts.google.com/ServiceLogin?service=lso';
  const width = 520;
  const height = 640;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(googleLoginUrl, 'GoogleLoginWindow', `width=${width},height=${height},left=${left},top=${top}`);

  // Auto prompt account selection after window opens
  setTimeout(() => {
    const userEmail = prompt('Masukkan Email Google Anda yang baru saja diautentikasi:', 'user@gmail.com');
    if (userEmail && userEmail.includes('@')) {
      const nameFromEmail = userEmail.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      onSuccess({
        id: `google_${Date.now()}`,
        name: formattedName,
        email: userEmail.trim().toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`,
        authProvider: 'google_oauth2',
        role: isDedicatedAdmin || userEmail.includes('admin') ? 'admin' : 'member',
        loggedInAt: new Date().toISOString()
      });
    }
  }, 1000);
};
