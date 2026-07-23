import {
  CheckboxMenu,
  type CheckboxMenuOption,
} from '@/components/checkbox-menu';
import type { Language } from '@/types/translations';

interface LanguagesMenuProps {
  languages: Language[];
  selectedLanguageCodes: string[];
  onSelect: any;
}

export const LanguagesMenu = ({
  languages,
  selectedLanguageCodes,
  onSelect,
}: LanguagesMenuProps) => {
  const options: CheckboxMenuOption[] = languages.map((language) => ({
    label: language.name,
    value: language.code,
  }));

  return (
    <CheckboxMenu
      buttonLabel="Languages"
      optionsKey="language"
      options={options}
      onSelect={onSelect}
      verifyIsChecked={(_: any, value: any) =>
        selectedLanguageCodes?.includes(value)
      }
    />
  );
};
