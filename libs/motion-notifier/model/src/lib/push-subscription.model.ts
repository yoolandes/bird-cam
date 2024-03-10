export interface PushSubscriptionHolder {
  id: number;
  pushSubscriptionJSON: PushSubscriptionJSON;
}

export type CreatePushSubscriptionHolderDto = Omit<
  PushSubscriptionHolder,
  'id'
>;
