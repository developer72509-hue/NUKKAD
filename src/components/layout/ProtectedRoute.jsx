import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAssuranceLevel } from '../../services/mfaService';
import LoadingState from '../states/LoadingState';

const ROLE_HOME = {
  customer: '/',
  shopkeeper: '/shopkeeper',
};

/**
 * Guards a route subtree. `allowedRoles` must match profiles.role
 * ('customer' | 'shopkeeper') — the DB-verified source of truth.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, emailVerified, role, loading } = useAuth();
  const location = useLocation();

  const [aalChecked, setAalChecked] = useState(false);
  const [needsMfa, setNeedsMfa] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setAalChecked(true);
      return;
    }
    let active = true;
    getAssuranceLevel()
      .then(({ currentLevel, nextLevel }) => {
        if (!active) return;
        setNeedsMfa(nextLevel === 'aal2' && currentLevel !== 'aal2');
      })
      .catch(() => {})
      .finally(() => active && setAalChecked(true));
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  if (loading || !aalChecked) return <LoadingState label="Checking your session…" />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!emailVerified) {
    return <Navigate to="/auth/verify" state={{ from: location }} replace />;
  }

  if (needsMfa) {
    return <Navigate to="/auth/2fa" state={{ from: location, role }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] ?? '/'} replace />;
  }

  return children;
}
