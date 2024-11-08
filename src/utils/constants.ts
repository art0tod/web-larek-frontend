import { Category } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const cardCategory: Record<Category, string> = {
  [Category.SoftSkill]: "card__category_soft",
  [Category.HardSkill]: "card__category_hard",
  [Category.Button]: "card__category_button",
  [Category.Additional]: "card__category_additional",
  [Category.Other]: "card__category_other"
}

