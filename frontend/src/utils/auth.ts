import { jwtDecode } from 'jwt-decode';

export const handleProtectedDownload = (link: string) => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    window.dispatchEvent(new Event('force-login'));
    return;
  }

  try {
    // Optional: check if token is expired
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new Event('force-login'));
      return;
    }
    
    window.open(link, '_blank');
  } catch (error) {
    localStorage.removeItem('auth_token');
    window.dispatchEvent(new Event('force-login'));
  }
};

