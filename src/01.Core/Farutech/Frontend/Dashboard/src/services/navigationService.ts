import { debug } from '@/services/navigationDebugger';

export interface NavigationOptions {
  url: string;
  sessionData?: any;
  openInNewTab?: boolean;
  method?: 'GET' | 'POST';
  onBeforeNavigate?: () => void;
}

export const navigateToInstance = async (options: NavigationOptions) => {
  const { 
    url, 
    sessionData, 
    openInNewTab, 
    method = 'POST',
    onBeforeNavigate 
  } = options;

  debug.log('navigation_start', {
    url,
    hasSessionData: !!sessionData,
    method,
    openInNewTab
  });

  onBeforeNavigate?.();

  // Determinar si es una URL externa (app tenant) o interna (dashboard)
  const isExternalApp = url.includes('.app.') || 
                       (url.startsWith('http') && !url.includes(window.location.hostname));
  
  debug.log('url_analysis', {
    url,
    isExternalApp,
    currentHost: window.location.hostname,
    urlHost: new URL(url).hostname
  });

  if (!isExternalApp) {
    console.warn('⚠️ URL no parece ser de aplicación tenant, redirigiendo internamente');
    performRedirect(url, openInNewTab);
    return;
  }

  // Para apps externas, usar método especificado
  if (method === 'POST') {
    await transferSessionByPost(url, sessionData, openInNewTab);
  } else {
    await transferSessionByGet(url, sessionData, openInNewTab);
  }
};

const transferSessionByPost = async (url: string, sessionData: any, openInNewTab?: boolean) => {
  try {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.style.display = 'none';

    if (openInNewTab) form.target = '_blank';

    const sessionInput = document.createElement('input');
    sessionInput.type = 'hidden';
    sessionInput.name = 'farutech_session';
    sessionInput.value = btoa(JSON.stringify(sessionData));
    form.appendChild(sessionInput);

    const tsInput = document.createElement('input');
    tsInput.type = 'hidden';
    tsInput.name = 'ts';
    tsInput.value = Date.now().toString();
    form.appendChild(tsInput);

    const signatureInput = document.createElement('input');
    signatureInput.type = 'hidden';
    signatureInput.name = 'sig';
    signatureInput.value = await generateSignature(sessionData);
    form.appendChild(signatureInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (e) {
    console.error('transferSessionByPost error', e);
    await transferSessionByGet(url, sessionData, openInNewTab);
  }
};

const transferSessionByGet = async (url: string, sessionData: any, openInNewTab?: boolean) => {
  let targetUrl = url;

  if (import.meta.env.DEV || url.includes('localhost')) {
    const urlObj = new URL(targetUrl);
    urlObj.searchParams.set('session', btoa(JSON.stringify(sessionData)));
    targetUrl = urlObj.toString();
  } else if (canUseSharedCookie()) {
    setSecureSessionCookie(sessionData);
  } else {
    sessionStorage.setItem('farutech_temp_session', JSON.stringify(sessionData));
  }

  performRedirect(targetUrl, openInNewTab);
};

const setSecureSessionCookie = (sessionData: any) => {
  const root = getRootDomain();
  const payload = encodeURIComponent(JSON.stringify(sessionData));
  // 5 minutes TTL
  document.cookie = `farutech_session=${payload}; path=/; domain=.${root}; Secure; SameSite=None; Max-Age=300`;
};

const generateSignature = async (data: any): Promise<string> => {
  try {
    const secret = (import.meta.env.VITE_SESSION_SECRET as string) || 'dev-secret';
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const msg = encoder.encode(JSON.stringify(data) + Date.now().toString());
    const sig = await crypto.subtle.sign('HMAC', key, msg);
    return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.warn('generateSignature failed, falling back to empty sig', e);
    return '';
  }
};

const performRedirect = (url: string, openInNewTab?: boolean) => {
  if (openInNewTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
};

const canUseSharedCookie = (): boolean => {
  const base = (import.meta.env.VITE_APP_DOMAIN as string) || '';
  return !!base && !import.meta.env.DEV && base.split('.').length >= 2;
};

const getRootDomain = (): string => {
  const base = (import.meta.env.VITE_APP_DOMAIN as string) || window.location.hostname;
  return base.replace(/^https?:\/\//, '');
};
