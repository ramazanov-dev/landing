import {QueryClient} from "@tanstack/react-query";
import mainStore from "./store/main";
import {fetch} from "./utils/fetch";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({queryKey: [url], signal}) => {
        if(typeof url === "string") {
          const headers = new Headers();

          headers.set("Content-Type", "application/json");

          if(mainStore.sessionToken) {
            headers.set("Authorization", `Bearer ${mainStore.sessionToken}`);
          }

          const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers,
            signal
          });

          if(!response.ok || response.status === 401) {
            mainStore.setSessionToken(null);
            return null;
          }

          const {data} = (await response.json()) as {data: unknown};

          return data;
        }
        throw new Error("Invalid QueryKey");
      }
    }
  }
});
