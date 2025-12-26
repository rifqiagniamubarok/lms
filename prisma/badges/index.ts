import badgeSeed from './badges.json';

export interface badgeOption {
  name: string;
  expPoints: number;
}

const badgesData: badgeOption[] = badgeSeed;
export default badgesData;
