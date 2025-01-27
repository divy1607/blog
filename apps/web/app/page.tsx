import LoginButton from "./components/LoginButton";
import RegisterButton from "./components/RegisterButton";

export default function Home() {

  return (
    <div className="flex">
      <LoginButton />
      <RegisterButton />
    </div>
  );
}
