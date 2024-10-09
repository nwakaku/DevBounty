import { Header } from "./components/Header";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "twitter-clone-1a212.firebaseapp.com",
  databaseURL: "https://twitter-clone-1a212-default-rtdb.firebaseio.com",
  projectId: "twitter-clone-1a212",
  storageBucket: "twitter-clone-1a212.appspot.com",
  messagingSenderId: "117742663297",
  appId: "1:117742663297:web:82dfdfa374cd3bd18fff80",
  measurementId: "G-NPVXH9PR94"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      <div className="flex flex-col flex-col bg-[#111128] min-h-screen font-nunito">
        <div className="w-full ">{children}</div>
      </div>
    </>
  );
};

export default Layout;
