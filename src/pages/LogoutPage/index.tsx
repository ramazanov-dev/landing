import {useEffect} from "react";

import {useNavigate} from "react-router-dom";
import {fetch} from "~utils/fetch";
import mainStore from "../../store/main";

export default function LogoutPage() {
  /* Hooks */
  const $navigate = useNavigate();

  /* Send Logout api request */
  useEffect(() => {
    fetch("/client/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mainStore.sessionToken}`,
        "Content-Type": "application/json"
      }
    });
    mainStore.setSessionToken(null);
    $navigate("/login");
  }, []);

  /* DOM */
  return null;
}
