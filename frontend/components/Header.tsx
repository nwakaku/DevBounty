import { useNavigate } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Header() {

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-8 py-4  mx-auto w-full flex-wrap">
      <div onClick={() => navigate("/")}>
        <h1 className="flex justify-center items-center text-xl cursor-pointer ">
          <Avatar>
            <AvatarImage src={"https://res.cloudinary.com/dgbreoalg/image/upload/v1728310382/devbounty_ozadmc.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          DevBounty
        </h1>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <WalletSelector />
      </div>
    </div>
  );
}
