'use client';
import Image from 'next/image';
import Footer from './Footer';
import Header from './Header';
import { useRouter } from 'next/navigation';

interface UiProps {
  isLoading: boolean;
  selectedGame: string;
  onGameSelect: (game: string) => void;
}

const Ui: React.FC<UiProps> = ({ isLoading, selectedGame, onGameSelect }) => {
  const router = useRouter();

  const handleGameSelect = (game: string) => {
    onGameSelect(game);
    router.push(`/${game}`);
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-sm">
        <div className="relative min-h-screen pb-24 bg-background px-6 py-4">
          {/* Top Navigation */}
          <Header />

          {/* Sphere Container */}
          <div className="relative mt-12">
            <div className="relative mx-auto aspect-square w-48 rounded-3xl border-2 border-foreground bg-background shadow-[0_0_15px_rgba(66,65,255,0.25)]">
              <img
                src="/basenet/circle.gif"
                alt="Wireframe Sphere"
                className="h-full w-full object-fill rounded-3xl"
              />
            </div>
          </div>

          {/* Games Section */}
          <div className="mt-12">
            <div className="w-full text-lg font-bold text-center">GAMES</div>
          </div>

          {/* Game Cards */}
          {[
            { name: 'Paws of Fury', image: '/gameimg/cat.png', route: 'unity4' },
            { name: 'Base Ballz', image: '/gameimg/baseballz1.png', route: 'unity2' },
            { name: 'Base Neko', image: '/gameimg/bASE_NEKO_lg.png', route: 'unity6' },
            { name: 'Builders Bounce', image: '/gameimg/buildersbounce.png', route: 'unity3' },
          ].map((game, index) => (
            <div
              key={index}
              className="mt-8 flex items-center justify-between rounded-xl border-2 border-foreground bg-background p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-lg bg-center bg-cover"
                  style={{
                    backgroundImage: `url(${game.image})`,
                    border: '2px solid var(--foreground)',
                  }}
                ></div>
                <span className="font-semibold">{game.name}</span>
              </div>
              <button
                className="rounded-lg border-2 border-foreground px-6 py-2 text-sm font-medium text-foreground"
                onClick={() => handleGameSelect(game.route)}
                disabled={isLoading}
              >
                PLAY
              </button>
            </div>
          ))}

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Ui;
