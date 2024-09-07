import MidSection from "./components/mid";
import TopSection from "./components/top";
import BotSection from "./components/bot";
import CrudoSection from "./components/crudo";

export default function Home() {
  return (
    <main>
      <div className="h-screen p-3">
        <TopSection />
        <MidSection />
        <BotSection />
      </div>
      <div className="mt-4">
        <CrudoSection />
      </div>
    </main>
  );
}
