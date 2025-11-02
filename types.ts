
import { GOVERNORATES } from './constants';

export type Governorate = typeof GOVERNORATES[number];

export interface Craftsman {
  id: string;
  name: string;
  craft: string;
  governorate: Governorate;
  bio: string;
  avatar_url: string;
  header_image_url: string;
  portfolio: string[];
  rating: number;
  reviews: number;
  phone: string;
}