const COMMON_PASSWORDS = new Set([
  'password', 'password1', '12345678', '123456789', 'qwerty123',
  'letmein', 'welcome1', 'admin123', 'iloveyou', 'password123',
]);

/**
 * Returns { valid, issues: string[] }. This runs in the browser, so it
 * can't check against a live leaked-password database (that needs a
 * server-side call, which is what Supabase's own "leaked password
 * protection" setting does) — this only catches the cheapest, most
 * common weak-password mistakes before the request even goes out.
 */
export function checkPasswordStrength(password) {
  const issues = [];

  if (password.length < 10) issues.push('At least 10 characters');
  if (!/[a-z]/.test(password)) issues.push('A lowercase letter');
  if (!/[A-Z]/.test(password)) issues.push('An uppercase letter');
  if (!/[0-9]/.test(password)) issues.push('A number');
  if (!/[^a-zA-Z0-9]/.test(password)) issues.push('A symbol');
  if (COMMON_PASSWORDS.has(password.toLowerCase())) issues.push('Not a commonly used password');

  return { valid: issues.length === 0, issues };
}

/**
 * Scores password strength for UI feedback (a meter/bar), separate from
 * the pass/fail rule check above. This is intentionally lenient/gradual —
 * it does NOT relax the hard requirements in checkPasswordStrength, it
 * just tells the user how far along they are.
 *
 * Returns { score, label } where score is 0-4:
 *   0 = Very weak, 1 = Weak, 2 = Fair, 3 = Good, 4 = Strong
 */
export function scorePasswordStrength(password) {
  if (!password) return { score: 0, label: 'Very weak' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    score = 0;
  }

  score = Math.max(0, Math.min(4, score));
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] };
}
