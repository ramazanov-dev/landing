import {DateTime} from "luxon";
import {makeAutoObservable} from "mobx";
import {makePersistable} from "mobx-persist-store";
import {ReactNode} from "react";

export interface NotificationModel {
  id: string;
  title: ReactNode;
  contents: ReactNode;
}

class MainStore {
  sessionToken: string | null = null;
  smsConfirmationCooldown: DateTime | null = null;
  notifications: NotificationModel[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "mainStore",
      storage: window.localStorage,
      properties: [
        {
          key: "sessionToken",
          serialize: (value) => {
            return value ?? "null";
          },
          deserialize: (value) => {
            return value === "null" ? null : value;
          }
        },
        {
          key: "smsConfirmationCooldown",
          serialize: (value: typeof this.smsConfirmationCooldown) => {
            if(DateTime.isDateTime(value)) {
              return value.toISO();
            }

            return JSON.stringify(value);
          },
          deserialize: (value: string) => {
            if(value === "null") return null;

            return DateTime.fromISO(value);
          }
        } as never
      ]
    });
  }

  setSessionToken(newSessionToken: typeof this.sessionToken) {
    this.sessionToken = newSessionToken;
  }

  setSmsConfirmationCooldown(
    newSmsConfirmationCooldown: typeof this.smsConfirmationCooldown
  ) {
    this.smsConfirmationCooldown = newSmsConfirmationCooldown;
  }

  setNotifications(newNotifications: NotificationModel[]) {
    this.notifications = newNotifications;
  }

  addNotification(notification: NotificationModel) {
    this.notifications = [...this.notifications, notification];
  }

  removeNotification(notificationId: NotificationModel["id"]) {
    this.notifications = [...this.notifications].filter(
      (notification) => notification.id !== notificationId
    );
  }
}

export default new MainStore();
