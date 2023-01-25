import ConnectWalletButton from "@/components/layout/ConnectWalletButton";
import Navbar from "./Navbar";

type Props = {
  children?: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>

      <Navbar />
      {children}
    </div>
  );
}
