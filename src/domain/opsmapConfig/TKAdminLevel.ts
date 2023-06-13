import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

export enum TKAdminLevel {
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  ADMIN3 = "admin3",
  ADMIN4 = "admin4"
}

const TKAdminLevelDepth: Record<TKAdminLevel, number> = {
  [TKAdminLevel.ADMIN1]: 1,
  [TKAdminLevel.ADMIN2]: 2,
  [TKAdminLevel.ADMIN3]: 3,
  [TKAdminLevel.ADMIN4]: 4
};

function isBelow(level1: TKAdminLevel, level2: TKAdminLevel): boolean {
  return TKAdminLevelDepth[level1] > TKAdminLevelDepth[level2];
}

// Sort root first
export function sortAdminLevelsRootFirst(
  levels: Array<TKAdminLevel>
): Array<TKAdminLevel> {
  return levels.sort((level1: TKAdminLevel, level2: TKAdminLevel): number => {
    if (level1 === level2) {
      return 0;
    } else {
      return isBelow(level1, level2) ? 1 : -1;
    }
  });
}

// ////////////////////////////////////////////////////////////////////////////
// Parent
// ////////////////////////////////////////////////////////////////////////////

export function parent(level: TKAdminLevel): TKAdminLevel | null {
  const levels = TKConfigurationModule.configuration.spatial.adminLevels;
  const index = levels.findIndex(item => item == level);
  return index > 0 ? levels[index - 1] : null;
}

function child(level: TKAdminLevel): TKAdminLevel | null {
  const levels = TKConfigurationModule.configuration.spatial.adminLevels;
  const index = levels.findIndex(item => item == level);
  return index < levels.length - 1 ? levels[index + 1] : null;
}

export function root(): TKAdminLevel | null {
  const levels = TKConfigurationModule.configuration.spatial.adminLevels;
  return levels.length > 0 ? levels[0] : null;
}

export function isRoot(level: TKAdminLevel): boolean {
  const rootLevel = root();
  if (!rootLevel) {
    return false;
  }
  return rootLevel === level;
}

export function leaf(): TKAdminLevel | null {
  const levels = TKConfigurationModule.configuration.spatial.adminLevels;
  return levels.length > 0 ? levels[levels.length - 1] : null;
}
export function isLeaf(level: TKAdminLevel): boolean {
  const leafLevel = leaf();
  if (!leafLevel) {
    return false;
  }
  return leafLevel === level;
}

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

export function arrayRootToLevel(level: TKAdminLevel): Array<TKAdminLevel> {
  const levels = TKConfigurationModule.configuration.spatial.adminLevels;
  const index = levels.findIndex(item => item == level);
  return index > -1 ? levels.slice(undefined, index + 1) : [];
}

export function arrayLevelToRoot(level: TKAdminLevel): Array<TKAdminLevel> {
  return arrayRootToLevel(level).reverse();
}

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

export function arrayLevelToLeaf(level: TKAdminLevel): Array<TKAdminLevel> {
  const levels = TKConfigurationModule.configuration.spatial.adminLevels;
  const index = levels.findIndex(item => item == level);
  return index > -1 ? levels.slice(index, undefined) : [];
}

export function arrayLevelBelowToLeaf(
  level: TKAdminLevel
): Array<TKAdminLevel> {
  const levelBelow = child(level);
  if (levelBelow) {
    return arrayLevelToLeaf(levelBelow);
  }
  return [];
}

export function arrayLevelUpToRoot(level: TKAdminLevel): Array<TKAdminLevel> {
  const levelUp = parent(level);
  if (levelUp) {
    return arrayLevelToRoot(levelUp);
  }
  return [];
}

export function arrayLeafToLevel(level: TKAdminLevel): Array<TKAdminLevel> {
  return arrayLevelToLeaf(level).reverse();
}

export function arrayRootToLeaf(): Array<TKAdminLevel> {
  return [...TKConfigurationModule.configuration.spatial.adminLevels];
}

export function arrayLeafToRoot(): Array<TKAdminLevel> {
  return arrayRootToLeaf().reverse();
}
// ////////////////////////////////////////////////////////////////////////////
// Closets ancester
// ////////////////////////////////////////////////////////////////////////////

export function closestAncesterInAdminLevelMap(
  level: TKAdminLevel
): TKAdminLevel | null {
  const mapLevels = TKConfigurationModule.configuration.spatial.adminLevelsMap;
  for (const localLevel of arrayLevelToRoot(level)) {
    if (mapLevels.includes(localLevel)) {
      return localLevel;
    }
  }
  return null;
}
