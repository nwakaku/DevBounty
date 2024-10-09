import React from "react";
import { Group, Gem, TrendingUp } from "lucide-react";

export default function Potential() {
  return (
    <div className="py-2">
      <div className="px-8 py-2 space-y-12">
        <div className="flex items-center  gap-4 p-2 shadow-lg shadow-blue-500 rounded-md bg-[#111128]">
          <Gem className="text-blue-500" size={60} />
          <div>
            <h2 className="text-lg font-medium">Incentivize Contributions</h2>
            <p className="text-base text-slate-500">
              Attract and retain talented developers by offering Aptos-based rewards for resolving issues and
              contributing to your projects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-2 shadow-lg shadow-[#6EE7B7] rounded-md bg-[#111128]">
          <TrendingUp className="text-lime-300" size={60} />

          <div>
            <h2 className="text-lg font-medium">Streamline Fund Management</h2>
            <p className="text-base text-slate-500">
              Easily allocate and distribute rewards through the decentralized Aptos blockchain, ensuring transparency
              and secure transactions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-2 shadow-lg shadow-red-300 rounded-md bg-[#111128]">
          <Group className="text-red-300" size={60} />
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
