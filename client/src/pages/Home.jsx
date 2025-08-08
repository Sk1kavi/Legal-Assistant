export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold text-indigo-600">Legal Assistant</h1>
        
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-gray-50">
        <div className="max-w-xl mb-10 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Legal Help, Simplified
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Speak with a legal chatbot in your own language, file complaints, and connect with lawyers. All in one simple platform.
          </p>
          <a
            href="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-6 py-3 rounded transition"
          >
            Get Started
          </a>
        </div>
        <img
          src="data:image/jpeg;base64,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"
          alt="Justice"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
      </section>

      {/* Features */}
      <section className="px-6 md:px-20 py-16 bg-white text-center">
        <h3 className="text-3xl font-bold mb-12">What We Offer</h3>
        <div className="grid md:grid-cols-3 gap-10 text-left">
          <div>
            <h4 className="text-xl font-semibold text-indigo-600 mb-2">Multilingual Chatbot</h4>
            <p className="text-gray-700">
              Get legal help in your own language, anytime. Just type or speak.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-indigo-600 mb-2">File Complaints Easily</h4>
            <p className="text-gray-700">
              Submit legal complaints online and track their status.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-indigo-600 mb-2">Connect with Lawyers</h4>
            <p className="text-gray-700">
              Verified lawyers manage your case with status updates and direct communication.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 bg-gray-100">
        © 2025 Legal Assistant. All rights reserved.
      </footer>
    </div>
  );
}
