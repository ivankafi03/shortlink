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
  return '';
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

// Trigger Official Google OAuth 2.0 Popup Flow
export const triggerGoogleAuth = ({ clientId, onSuccess, onError, onPromptForm }) => {
  const activeId = clientId || getActiveGoogleClientId();

  if (typeof window !== 'undefined' && window.google?.accounts?.id && activeId) {
    try {
      window.google.accounts.id.initialize({
        client_id: activeId,
        callback: (response) => {
          const payload = parseGoogleJwt(response.credential);
          if (payload) {
            onSuccess({
              id: `google_${payload.sub}`,
              name: payload.name || payload.email.split('@')[0],
              email: payload.email.toLowerCase(),
              avatar: payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(payload.email)}`,
              authProvider: 'google_oauth2',
              role: payload.email.includes('admin') ? 'admin' : 'member',
              loggedInAt: new Date().toISOString()
            });
          }
        }
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap popup is dismissed or blocked, trigger Google OAuth popup window
          const popupUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${activeId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=token%20id_token&scope=openid%20email%20profile`;
          const popup = window.open(popupUrl, 'GoogleAuthPopup', 'width=500,height=600,left=300,top=150');
          if (!popup) {
            if (onPromptForm) onPromptForm();
          }
        }
      });
      return;
    } catch (e) {
      console.warn('Google GSI prompt warning:', e);
    }
  }

  // Fallback if no Client ID or SDK blocked
  if (onPromptForm) {
    onPromptForm();
  }
};
