import ButtonAccount from "@/components/ButtonAccount";
import StatsOverview from "@/components/basketball/StatsOverview";
import QuickGameEntry from "@/components/basketball/QuickGameEntry";
import RecentGames from "@/components/basketball/RecentGames";
import ProgressTracking from "@/components/basketball/ProgressTracking";
import RagChat from "@/components/ai/RagChat";
import DocumentUpload from "@/components/ai/DocumentUpload";
import VoiceConsole from "@/components/ai/VoiceConsole";
import { LiveAPIProvider } from "@/components/ai/LiveAPIContext";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
export default async function Dashboard() {
  // TODO: Fetch user's player data from MongoDB
  // const session = await getServerSession(authOptions);
  // const playerData = await Player.findOne({ userId: session?.user?.id });

  return (
    <LiveAPIProvider apiKey={process.env.GEMINI_API_KEY || ""}>
      <main className="min-h-screen p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold">
                Basketball Stats Tracker
              </h1>
              <p className="text-base-content/70 mt-2">Track, analyze, and improve your game</p>
            </div>
            <ButtonAccount />
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap gap-3">
            <label htmlFor="quick-entry-modal" className="btn btn-success">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Quick Game Entry
            </label>
            <button className="btn btn-primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Export Stats
            </button>
            <button className="btn btn-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Upload Video
            </button>
          </div>

          {/* Stats Overview Cards */}
          <StatsOverview />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Game Entry & Upload */}
            <div className="lg:col-span-2 space-y-6">
              <QuickGameEntry />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUpload />
                <ProgressTracking />
              </div>
              <RecentGames />
            </div>

            {/* Right Column: AI Coach */}
            <div className="lg:col-span-1 space-y-6">
              <VoiceConsole />
              <RagChat />
            </div>
          </div>
        </div>

        {/* Quick Entry Modal */}
        <input type="checkbox" id="quick-entry-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Quick Game Entry</h3>
            <QuickGameEntry isModal={true} />
          </div>
          <label className="modal-backdrop" htmlFor="quick-entry-modal">Close</label>
        </div>
      </main>
    </LiveAPIProvider>
  );
}
