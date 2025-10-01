export const showSuccessToast = (message: string) => {
  // For now using browser alert, can be replaced with a proper toast library later
  alert(`✅ ${message}`);
};

export const showErrorToast = (message: string) => {
  // For now using browser alert, can be replaced with a proper toast library later
  alert(`❌ ${message}`);
};