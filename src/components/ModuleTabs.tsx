import useSound from '@/hooks/useSound';

type ModuleType = 'numbers' | 'addition' | 'subtraction';

interface ModuleTabsProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const modules = [
  { id: 'numbers' as ModuleType, label: '123', emoji: '✏️', name: 'Numbers' },
  { id: 'addition' as ModuleType, label: '+', emoji: '➕', name: 'Addition' },
  { id: 'subtraction' as ModuleType, label: '-', emoji: '➖', name: 'Subtraction' },
];

const ModuleTabs = ({ activeModule, onModuleChange }: ModuleTabsProps) => {
  const { playClick } = useSound();

  const handleClick = (moduleId: ModuleType) => {
    playClick();
    onModuleChange(moduleId);
  };

  const getTabStyles = (moduleId: ModuleType, isActive: boolean) => {
    const baseStyles = 'tab-button flex flex-col items-center gap-1 min-w-[80px] md:min-w-[100px]';
    
    if (isActive) {
      switch (moduleId) {
        case 'numbers':
          return `${baseStyles} active bg-numbers-accent text-primary-foreground`;
        case 'addition':
          return `${baseStyles} active bg-addition-accent text-primary-foreground`;
        case 'subtraction':
          return `${baseStyles} active bg-subtraction-accent text-primary-foreground`;
      }
    }
    
    switch (moduleId) {
      case 'numbers':
        return `${baseStyles} bg-numbers text-numbers-accent hover:bg-numbers-accent/20`;
      case 'addition':
        return `${baseStyles} bg-addition text-addition-accent hover:bg-addition-accent/20`;
      case 'subtraction':
        return `${baseStyles} bg-subtraction text-subtraction-accent hover:bg-subtraction-accent/20`;
    }
  };

  return (
    <div className="flex justify-center gap-3 p-4">
      {modules.map((module) => (
        <button
          key={module.id}
          onClick={() => handleClick(module.id)}
          className={getTabStyles(module.id, activeModule === module.id)}
        >
          <span className="text-2xl">{module.emoji}</span>
          <span className="text-xs md:text-sm font-semibold">{module.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ModuleTabs;
