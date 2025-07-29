import {Card} from "@/components/ui/card";
import Navbar from "@/components/navbar";
import FileUpload from "@/components/file-upload";

export default function Home() {
    return (
        <html>
            <div className="min-h-screen bg-white text-black flex flex-col">
                <Navbar />

                <main className="flex-1 container mx-auto px-4 py-12">
                    {/* Hero Section */}
                    <div className="mb-16 mt-8">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
                            PSYCHE<span className="text-purple-600">SYNC</span>
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl font-mono">Discover your true personality type through AI analysis of your conversations. Join the hub. Find your perfect personality match.</p>
                    </div>

                    {/* Data Import Component */}
                    <Card className="border-4 border-black p-8 md:p-12 max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">UPLOAD YOUR DATA</h2>
                        <p className="text-lg mb-8 font-mono">Export your ChatGPT conversation history and upload it below. Our AI will analyze your communication patterns to determine your unique personality type.</p>

                        <FileUpload />
                    </Card>

                    {/* Features Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="border-t-4 border-black pt-4">
                            <h3 className="text-2xl font-bold mb-3">DISCOVER YOURSELF</h3>
                            <p className="font-mono">Get insights beyond traditional personality tests based on your real communication patterns.</p>
                        </div>
                        <div className="border-t-4 border-black pt-4">
                            <h3 className="text-2xl font-bold mb-3">FIND YOUR TRIBE</h3>
                            <p className="font-mono">Connect with others who share your unique personality traits and communication style.</p>
                        </div>
                        <div className="border-t-4 border-black pt-4">
                            <h3 className="text-2xl font-bold mb-3">PERSONALIZED RECS</h3>
                            <p className="font-mono">Receive tailored product and content recommendations perfect for your personality type.</p>
                        </div>
                    </div>
                </main>

                <footer className="border-t-4 border-black py-8">
                    <div className="container mx-auto px-4">
                        <p className="font-mono text-center">© {new Date().getFullYear()} PersonAi — Find Your Perfect Personality</p>
                    </div>
                </footer>
            </div>
        </html>
    );
}
