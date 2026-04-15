import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { AppRouter } from '@/app';
import { setAuthTokenProvider } from '@/shared/api';
import { getAuthToken } from '@/shared/lib/store';

setAuthTokenProvider(getAuthToken);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
