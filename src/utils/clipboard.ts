export const copyToClipboard = (value: string) => {
  if(!navigator.clipboard) {
    return Promise.reject(new Error("API not supported"));
  }
  if(value) {
    return navigator.clipboard.writeText(value);
  }
  return Promise.reject(new Error("Cannot copy a empty text"));
};
