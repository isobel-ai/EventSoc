export function validEmail(email: string) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Form a@b.c
  return emailPattern.test(email.toLowerCase());
}

export function validPassword(password: string) {
  return password.length >= 6;
}
