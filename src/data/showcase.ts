export type ShowcaseId =
  | 'footify-landing'
  | 'footify-app'
  | 'savys-tips'
  | 'dam'
  | 'elte'
  | 'petofi-aszod';

export type ShowcaseKind = 'project' | 'work' | 'study';
export type ShowcaseFilter = 'all' | 'project' | 'study';
export type ImageFit = 'cover' | 'contain';

export interface ShowcaseItem {
  id: ShowcaseId;
  kind: ShowcaseKind;
  image: string;
  imageFit: ImageFit;
  imageBg: string;
  year: string;
  link: string;
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: 'footify-landing',
    kind: 'project',
    image: '/images/landing.png',
    imageFit: 'contain',
    imageBg: 'bg-[#07100c]',
    year: '2024',
    link: 'https://footify.hu',
  },
  {
    id: 'footify-app',
    kind: 'project',
    image: '/images/footifyApp.png',
    imageFit: 'contain',
    imageBg: 'bg-black',
    year: '2024',
    link: 'https://github.com/gaspardani87/Footify',
  },
  {
    id: 'savys-tips',
    kind: 'project',
    image: '/images/showcase/savys-tips-premium.png',
    imageFit: 'contain',
    imageBg: 'bg-[#c70f24]',
    year: '2026',
    link: 'https://savystips.com',
  },
  {
    id: 'dam',
    kind: 'work',
    image: '/images/dam_office.jpg',
    imageFit: 'cover',
    imageBg: 'bg-[#101214]',
    year: '2026-present',
    link: 'https://damit.hu',
  },
  {
    id: 'elte',
    kind: 'study',
    image: '/images/showcase/elte-logo.svg',
    imageFit: 'contain',
    imageBg: 'bg-white',
    year: '2025-now',
    link: 'https://elte.hu',
  },
  {
    id: 'petofi-aszod',
    kind: 'study',
    image: '/images/showcase/petofi-building.jpg',
    imageFit: 'cover',
    imageBg: 'bg-[#141414]',
    year: '2020-2025',
    link: 'https://vac-petofi.www.intezmeny.edir.hu/',
  },
];
