// pages/teacher/tools/flashcard-builder.js
import Sidebar from '../../../components/Sidebar';

export default function TeacherFlashcardBuilderComingSoon() {
  const role = 'teacher';

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main content */}
      <main className="flex-1 p-12 flex flex-col items-center justify-center gap-12">
        
        {/* Header */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center border-t-8 border-yellow-400 flex flex-col items-center gap-6">
          <div className="text-9xl animate-bounce">🃏📚</div>
          <h1 className="text-5xl font-extrabold text-gray-900">Flashcard Builder Coming Soon!</h1>
          <p className="text-gray-700 text-xl max-w-2xl">
            Teachers will soon be able to create interactive flashcards for students to study and practice.  
            Engage your students with personalized quizzes and learning tools!
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-orange-400 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🎯 Create Custom Flashcards</h2>
            <p className="text-gray-600 text-lg">
              Add terms, definitions, and images to design your own flashcard decks for students to practice.
            </p>
          </div>
          <div className="text-8xl animate-spin">📝</div>
        </div>

        {/* Engagement Section */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-green-400 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🏆 Tournaments & Learning Games</h2>
            <p className="text-gray-600 text-lg">
              Students will compete, practice, and earn rewards with your flashcards. Make learning fun and interactive!
            </p>
          </div>
          <div className="text-8xl animate-bounce">🎮</div>
        </div>

      </main>
    </div>
  );
}
