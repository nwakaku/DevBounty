import React from "react";
import { Group, Gem, TrendingUp } from "lucide-react";

export default function Potential() {
  return (
    <div className="py-2">
      <div className="px-8 py-2 space-y-12">
        <div className="flex  gap-4 p-2 shadow-lg shadow-lime-300/50 rounded-md">
          <Gem className="text-lime-300" size={"32px"} />
          <div>
            <h2 className="text-lg font-medium">Incentivize Contributions</h2>
            <p className="text-base text-slate-500">
              Attract and retain talented developers by offering Aptos-based rewards for resolving issues and
              contributing to your projects.
            </p>
          </div>
        </div>

        <div className="flex  gap-4 p-2 shadow-lg shadow-lime-300/50 rounded-md">
          <TrendingUp className="text-lime-300" size={"32px"} />

          <div>
            <h2 className="text-lg font-medium">Streamline Fund Management</h2>
            <p className="text-base text-slate-500">
              Easily allocate and distribute rewards through the decentralized Aptos blockchain, ensuring transparency
              and secure transactions.
            </p>
          </div>
        </div>

        <div className="flex  gap-4 p-2 shadow-lg shadow-lime-300/50 rounded-md">
          <Group className="text-lime-300" size={"32px"} />
          <div>
            <h2 className="text-lg font-medium">Foster Collaboration</h2>
            <p className="text-base text-slate-500">
              Encourage active participation and engagement within your open-source communities by providing tangible
              incentives for their efforts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
