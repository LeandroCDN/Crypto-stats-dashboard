import MidSection from "./components/mid";
import TopSection from "./components/top";
import BotSection from "./components/bot";

export default function Home() {
  return (
    <main className="h-screen p-3">
      <TopSection />
      <MidSection />
      <BotSection />
    </main>
  );
}
