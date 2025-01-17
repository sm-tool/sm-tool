export const parseAutoFormDescription = (
  description: string | number | boolean | undefined,
) => {
  if (description === undefined || description === true) {
    return {
      label: '',
      description: null,
    };
  }

  const descriptionString = description.toString();

  if (!descriptionString.includes('#')) {
    return {
      label: descriptionString,
      description: null,
    };
  }

  const [label, helpText] = descriptionString.split('#', 2).map(s => s.trim());
  return {
    label: label || '',
    description: helpText || null,
  };
};
