import React from "react";
import { LogIn, CodeXml, LucideIcon } from "lucide-react";

interface GradientIconProps {
  icon: LucideIcon;
  size?: number;
}

const GradientIcon: React.FC<GradientIconProps> = ({ icon: Icon, size = 50 }) => {
  return (
    <>
      <svg width="0" height="0">
        <linearGradient id="limeToBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4ade80" }} />
          <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
        </linearGradient>
      </svg>
      <Icon size={size} style={{ stroke: "url(#limeToBlue)" }} />
    </>
  );
};

const GradientLogInIcon = () => <GradientIcon icon={LogIn} />;
const GradientCodeXmlIcon = () => <GradientIcon icon={CodeXml} />;

export { GradientIcon, GradientLogInIcon, GradientCodeXmlIcon };
