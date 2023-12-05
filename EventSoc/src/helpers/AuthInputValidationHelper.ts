export function validEmail(email: string) {
  const emailPattern = /^[^\s@]+@warwick.ac.uk$/; // Form a@warwick.ac.uk
  return emailPattern.test(email.toLowerCase());
}

export function validPassword(password: string) {
  return password.length >= 6;
}
