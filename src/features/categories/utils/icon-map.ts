import {
  UtensilsCrossed,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Plane,
  Dog,
  Shirt,
  Gift,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Plane,
  Dog,
  Shirt,
  Gift,
  Wrench,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

export function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? ShoppingCart;
}

export const CATEGORY_COLORS = [
  "#f97316",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#06b6d4",
];
