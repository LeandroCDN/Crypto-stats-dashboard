import MidSection from "./components/mid";
import TopSection from "./components/top";
import BotSection from "./components/bot";

export default function Home() {
  return (
    <main className="h-screen p-3">
      <div className="h-20 min-w-20 gradient-border-mask  rounded-xl m-5  flex items-center pl-5 ">
        <p>aplicale los estilos a este</p>
      </div>

      <TopSection />
      <MidSection />
      <BotSection />
    </main>
  );
}
