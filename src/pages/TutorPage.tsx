// src/pages/TutorPage.tsx
import { Header } from "@/components/Header";
import { TutorView } from "@/components/TutorView";

const TutorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <TutorView />
        </div>
      </main>
    </div>
  );
};

export default TutorPage;
