import { menuCategories, type MenuCategory } from "../../lib/menu";

type MenuFiltersProps = {
  selected: MenuCategory;
  onChange: (category: MenuCategory) => void;
};

export default function MenuFilters({ selected, onChange }: MenuFiltersProps) {
  return (
    <div className="menu-filters" role="group" aria-label="Filter products by category">
      {menuCategories.map((category) => (
        <button key={category} type="button" aria-pressed={selected === category} onClick={() => onChange(category)}>
          {category}
        </button>
      ))}
    </div>
  );
}
