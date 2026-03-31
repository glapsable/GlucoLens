export interface FoodItem {
  name: string;
  weight_g: number;
  carbs_g: number;
}

export interface ScanResult {
  id: string;
  timestamp: Date;
  label: string;
  total_carbs_g: number;
  items: FoodItem[];
  image_url: string;
}
