export const getApiErrorMessage = (error, fallbackMessage) => {
  const detail = error?.response?.data?.detail;

  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item) => item?.msg || item?.message)
      .filter(Boolean)
      .join(', ');
  }

  if (error?.message && error.message !== 'Network Error') {
    return error.message;
  }

  return fallbackMessage;
};
