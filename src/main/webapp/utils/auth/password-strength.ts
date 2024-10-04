export const calculatePasswordStrength = (password: string) => {
  let strength = 0;
  if (/[a-z]+/.test(password)) strength++;
  if (/[A-Z]+/.test(password)) strength++;
  if (/\d+/.test(password)) strength++;
  if (/[^\dA-Za-z]+/.test(password)) strength++;
  return strength;
};
