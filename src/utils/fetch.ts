export const validateStatus = async (response: Response) => {
  if(response.status >= 200 && response.status < 300) {
    return response.json();
  }
  throw await response.text();
};

const apiFetch: typeof fetch = (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  const absoluteUrl = [import.meta.env.VITE_API_URL, input.toString()]
    .map((segment) => (segment.charAt(0) === "/" ? segment.slice(1) : segment))
    .join("/");

  return fetch(absoluteUrl, init);
};
export {apiFetch as fetch};
