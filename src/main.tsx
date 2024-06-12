import ReactDOM from "react-dom/client";
import App from "~components/App";

import {BrowserRouter} from "react-router-dom";
import {IconsCollection} from "~components/Icon";

import "./styles/main.css";
import "./styles/misc.css";
import "./styles/typography.css";
import "./styles/inputs.css";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <IconsCollection />
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
