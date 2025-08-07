export interface BaseCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryWithCount extends BaseCategory {
  _count: {
    products: number;
  };
}

export interface CategoryWithChildren extends BaseCategory {
  children?: CategoryWithChildren[]; // Recursive for subcategories
  sortOrder: number;
  isActive: boolean;
  parentId?: string | null;
}

export interface CategoryWithRelations extends BaseCategory {
  sortOrder: number;
  isActive: boolean;
  children: CategoryWithRelations[];
  products: { id: string }[];
  parentId?: string | null;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface Filters {
  search: string;
  parentId: string;
  status: string;
}
