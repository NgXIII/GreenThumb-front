import { Search, X } from 'lucide-react';
import {useRef, type ChangeEvent, type FC, type JSX} from 'react';
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Composant de recherche avec icône et bouton clear
 *
 * @param value - Valeur actuelle de la recherche
 * @param onChange - Callback appelé quand la valeur change
 * @param placeholder - Texte placeholder (optionnel)
 * @param className - Classes CSS additionnelles (optionnel)
 * @returns Élément JSX du champ de recherche
 */
const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Rechercher...",
  className
}): JSX.Element => {
  // Référence vers l'input pour le focus
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Efface la recherche et redonne le focus
   * @returns void
   */
  const handleClear = (): void => {
    onChange('');
    inputRef.current?.focus();
  };

  /**
   * Handler pour les changements de valeur
   * @param e - Événement de changement de l'input
   * @returns void
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Icône search */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gt-text-muted pointer-events-none z-10">
        <Search className="w-4 h-4" />
      </div>

      {/* Input de recherche */}
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />

      {/* Bouton clear (affiché seulement si value non vide) */}
      {value && (
        <button
          onClick={handleClear}
          type="button"
          className="
            absolute right-3 top-1/2 -translate-y-1/2 z-10
            text-gt-text-muted hover:text-gt-text
            transition-colors duration-200
          "
          aria-label="Effacer la recherche"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
