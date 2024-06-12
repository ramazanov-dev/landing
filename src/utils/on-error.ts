import mainStore from "../store/main.ts";
import {getRandomNumber} from "./misc.ts";

export default function onError(error: Response) {
  let errorMessage = `Unknown error (${error})`;
  let errorCode: number | null = null;

  if(error instanceof Error) {
    errorMessage = error.message ?? String(error);
  }

  if(error instanceof Response) {
    errorCode = error.status;

    if(errorCode === 400) {
      errorMessage = "Please check you filled form correctly";
    } else if(errorCode === 401) {
      errorMessage = "Can't authorize this request. Sign in again";
      mainStore.setSessionToken(null);
    } else {
      errorMessage = error.statusText;
    }
  }

  console.error(error);

  mainStore.addNotification({
    id: getRandomNumber(0, 9999999).toString(16),
    title: `Error${errorCode ? ` #${errorCode}` : ""}`,
    contents: errorMessage
  });
}
