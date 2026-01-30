import { useState } from 'react';
import ModuleTabs from '@/components/ModuleTabs';
import NumbersModule from '@/components/NumbersModule';
import AdditionModule from '@/components/AdditionModule';
import SubtractionModule from '@/components/SubtractionModule';

type ModuleType = 'numbers' | 'addition' | 'subtraction';

const Index = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('numbers');

  const renderModule = () => {
    switch (activeModule) {
      case 'numbers':
        return <NumbersModule />;
      case 'addition':
        return <AdditionModule />;
      case 'subtraction':
        return <SubtractionModule />;
      default:
        return <NumbersModule />;
    }
  };

  const getModuleBackground = () => {
    switch (activeModule) {
      case 'numbers':
        return 'bg-numbers/30';
      case 'addition':
        return 'bg-addition/30';
      case 'subtraction':
        return 'bg-subtraction/30';
      default:
        return 'bg-background';
    }
  };

  return (
    <div className={`min-h-screen ${getModuleBackground()} transition-colors duration-500`}>
      {/* Header */}
      <header className="py-4 px-4 text-center">
        <h1 className="font-fredoka text-3xl md:text-4xl lg:text-5xl gradient-rainbow bg-clip-text text-transparent leading-tight">
          ✨ Math Fun! ✨
        </h1>
        <p className="font-nunito text-muted-foreground mt-1 text-sm md:text-base">
          Learn numbers, addition & subtraction!
        </p>
      </header>

      {/* Module Tabs */}
      <ModuleTabs 
        activeModule={activeModule} 
        onModuleChange={setActiveModule} 
      />

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto">
        {renderModule()}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="font-nunito text-xs text-muted-foreground">
          Made with 💖 for little learners
        </p>
      </footer>
    </div>
  );
};

export default Index;
