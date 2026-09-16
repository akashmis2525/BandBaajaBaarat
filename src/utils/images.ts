import { Assets } from '../constants/assets';

const map: Record<string, number> = {
  serviceDhol: Assets.serviceDhol,
  serviceBrassBand: Assets.serviceBrassBand,
  serviceDj: Assets.serviceDj,
  serviceBuggi: Assets.serviceBuggi,
  serviceMehndi: Assets.serviceMehndi,
  servicePhotography: Assets.servicePhotography,
  serviceDresses: Assets.serviceDresses,
  serviceJewellery: Assets.serviceJewellery,
  serviceShoes: Assets.serviceShoes,
  serviceClothes: Assets.serviceClothes,
  serviceDecorators: Assets.serviceDecorators,
  weddingMandapArt: Assets.weddingMandapArt,
  elephantBaaratArt: Assets.elephantBaaratArt,
  groomBaarat: Assets.groomBaarat,
  brideGroom: Assets.brideGroom,
};

export function resolveImage(imageKey?: string) {
  if (imageKey && map[imageKey]) return map[imageKey];
  return Assets.serviceDecorators;
}
