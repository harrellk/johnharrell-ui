import type { ReactNode } from "react";

export default function DashboardLayout(props: { children: ReactNode }) {
  return <div className="p-6">{props.children}</div>;
}