"use client";

import DesktopNetwork from "./DesktopNetwork";
import MobileNetwork from "./MobileNetwork";

interface EcosystemNetworkProps {
  inView: boolean;
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
}

// Desktop and mobile are genuinely different experiences (hover-revealed radial
// network vs. tap-driven carousel), not one layout scaled down — both render so
// SSR output doesn't depend on viewport, and Tailwind breakpoints pick the visible one.
export default function EcosystemNetwork({ inView, activeId, onActiveChange }: EcosystemNetworkProps) {
  return (
    <div style={{ width: "100%" }}>
      <div className="hidden lg:flex items-center justify-center">
        <DesktopNetwork inView={inView} activeId={activeId} onActiveChange={onActiveChange} />
      </div>
      <div className="lg:hidden">
        <MobileNetwork inView={inView} activeId={activeId} onActiveChange={onActiveChange} />
      </div>
    </div>
  );
}
