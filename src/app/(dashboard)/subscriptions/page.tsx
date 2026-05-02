import { SubscriptionList } from "@/components/subscriptions/subscription-list";

export const metadata = {
  title: 'Subscription Plans - Pos-ms',
  description: 'Manage SaaS subscription tiers and custom plans',
};

export default function SubscriptionsPage() {
  return <SubscriptionList />;
}
