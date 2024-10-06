import { Header } from "./components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      <div className="flex items-center justify-center flex-col ">
        <div className="w-full ">{children}</div>
      </div>
    </>
  );
};

export default Layout;
