"use client";

// import Features from "@/components/landing/Features";
// import Potential from "@/components/landing/Potential";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Features from "./components/landing/Features";
import Potential from "./components/landing/Potential";
import { useNavigate, useNavigation } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div className="overflow-y-auto md:overflow-y-hidden md:flex flex-col md:flex-row relative h-screen justify-between bg-[#090916] text-white items-center font-nunito">
        <div className="w-full xl:w-2/4 h-full py-6 px-4 md:px-1 flex relative">
          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/dgbreoalg/image/upload/v1728465228/9067193_r2kwzy.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundBlendMode: "multiply",
            }}
          ></div>

          {/* Content */}
          <div className="flex flex-col justify-between w-full z-10">
            <div className="md:px-8">
              <h1 className="text-md md:text-xl font-nunito font-semibold">DevBounty</h1>
            </div>
            <div className="w-full space-y-8">
              <div className="flex justify-start items-center w-full md:px-8">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-6xl text-white font-bold">
                    Aptos
                    <br /> Open-Source{" "}
                    <span className="text-[#6EE7B7]">
                      <br /> Project Funding
                    </span>
                  </h2>
                  <p className="text-gray-300 text-xl">
                    Create bounties in your GitHub issues and reward contributors when you merge pull requests
                  </p>
                  <div>
                    <Button
                      onClick={() => navigate("/home")}
                      size="sm"
                      className="px-12 font-semibold bg-[#4F46E5] hover:bg-lime-800"
                    >
                      Launch App
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-full px-8">
                <div className="flex justify-between items-center gap-2 w-full">
                  <div className="space-y-2">
                    <h4 className="text-gray-300 font-medium">Awarded</h4>
                    <p className="text-sm md:text-xl text-white">
                      <span className="font-semibold">2,123</span> Bounties
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-gray-300 font-medium">Totalling</h4>
                    <p className="text-sm md:text-xl font-semibold text-white">$269,738 .00</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-gray-300 font-medium">To</h4>
                    <p className="text-sm md:text-xl text-white">
                      <span className="font-semibold">487</span> Contributors
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-gray-300 font-medium">From</h4>
                    <p className="text-sm md:text-xl text-white">
                      <span className="font-semibold">2</span> Countries
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-4 w-full px-8">
              <p className="text-sm text-gray-300">
                {new Date().getFullYear()} Aptops_Rewards, Public Benefits Corporation
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full h-full xl:w-2/4 flex-col items-center py-12 px-4">
          <div className="w-full flex justify-center items-center">
            <Tabs defaultValue="feature" className="w-full">
              <TabsList className="w-full bg-slate-700 text-white">
                <TabsTrigger
                  value="feature"
                  className="w-1/2 data-[state=active]:text-white data-[state=active]:bg-[#4F46E5]"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="potential"
                  className="w-1/2 data-[state=active]:text-white data-[state=active]:bg-[#4F46E5]"
                >
                  Open Source Potentials
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  className="w-1/2 data-[state=active]:text-white data-[state=active]:bg-[#4F46E5]"
                >
                  Activities
                </TabsTrigger>
              </TabsList>
              <TabsContent value="feature" className="py-4">
                <Features />
              </TabsContent>
              <TabsContent value="potential" className="py-4">
                <Potential />
              </TabsContent>
              <TabsContent value="activities" className="py-4">
                <p>Coming soon...</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
