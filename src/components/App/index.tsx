import {observer} from "mobx-react-lite";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import AccountSecurityPage from "../../pages/AccountSecurityPage";
import DepositPage from "../../pages/DepositPage";
import ExchangePage from "../../pages/ExchangePage";
import KycAddressPage from "../../pages/KycAddressPage";
import KycDocumentsPage from "../../pages/KycDocumentsPage";
import KycDonePage from "../../pages/KycDonePage";
import KycPage from "../../pages/KycPage";
import KycPersonalPage from "../../pages/KycPersonalPage";
import KycPhotoPage from "../../pages/KycPhotoPage";
import KycSoiPage from "../../pages/KycSoiPage";
import ProfilePage from "../../pages/ProfilePage";
import TransactionsPage from "../../pages/TransactionsPage";
import TransferPage from "../../pages/TransferPage";
import WalletPage from "../../pages/WalletPage";
import WithdrawPage from "../../pages/WithdrawPage";
import SignInPage from "../../pages/signInPage";
import Aside from "../Aside";
import styles from "./index.module.css";

import classNames from "classnames";
import {useEffect, useState} from "react";
import LandingPage from "../../pages/LandingPage";
import LogoutPage from "../../pages/LogoutPage";
import mainStore from "../../store/main";

function App() {
  /* Hooks */
  const $location = useLocation();

  /* Landing page DOM */
  return <LandingPage />;

  // if ($location.pathname === '/') {
  //   return <LandingPage />;
  // }

  // if (!mainStore.sessionToken) {
  //   return <SignInPage />;
  // }

  /* DOM */
  // return (
  //   <div className={styles.App}>
  //     <Aside />
  //     <main className={styles.main}>
  //       <Routes>
  //         <Route path="/wallet" element={<WalletPage />} />
  //         <Route path="/transactions" element={<TransactionsPage />} />
  //         <Route path="/withdraw" element={<WithdrawPage />} />
  //         <Route path="/transfer" element={<TransferPage />} />
  //         <Route path="/deposit" element={<DepositPage />} />
  //         <Route path="/exchange" element={<ExchangePage />} />
  //         <Route path="/profile" element={<ProfilePage />} />
  //         <Route path="/kyc" element={<KycPage />} />
  //         <Route path="/kyc/personal" element={<KycPersonalPage />} />
  //         <Route path="/kyc/address" element={<KycAddressPage />} />
  //         <Route path="/kyc/documents" element={<KycDocumentsPage />} />
  //         <Route path="/kyc/photo" element={<KycPhotoPage />} />
  //         <Route path="/kyc/soi" element={<KycSoiPage />} />
  //         <Route path="/kyc/done" element={<KycDonePage />} />
  //         <Route path="/account-security" element={<AccountSecurityPage />} />
  //         <Route path="/logout" element={<LogoutPage />} />
  //         <Route path="*" element={<Navigate to="/wallet" />} />
  //       </Routes>
  //     </main>
  //
  //     {/* Notifications wrapper */}
  //     <div
  //       className={classNames(styles.notificationsWrapper, {
  //         isLeftAligned: !mainStore.sessionToken
  //       })}>
  //       {mainStore.notifications.map((notification) => (
  //         <div key={notification.id} className={styles.notification}>
  //           <div className={styles.notificationTitle}>{notification.title}</div>
  //           <div className={styles.notificationContents}>
  //             {notification.contents}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
}

export default observer(App);
