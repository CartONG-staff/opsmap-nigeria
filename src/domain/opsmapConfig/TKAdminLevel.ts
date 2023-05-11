export enum TKAdminLevel {
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  ADMIN3 = "admin3",
  ADMIN4 = "admin4"
}

// ////////////////////////////////////////////////////////////////////////////
// Parent
// ////////////////////////////////////////////////////////////////////////////

export function hasParent(level: TKAdminLevel): boolean {
  switch (level) {
    case TKAdminLevel.ADMIN4:
    case TKAdminLevel.ADMIN3:
    case TKAdminLevel.ADMIN2:
      return true;
    case TKAdminLevel.ADMIN1:
      return false;
  }
}

export function parent(level: TKAdminLevel): TKAdminLevel | null {
  switch (level) {
    case TKAdminLevel.ADMIN4:
      return TKAdminLevel.ADMIN3;
    case TKAdminLevel.ADMIN3:
      return TKAdminLevel.ADMIN2;
    case TKAdminLevel.ADMIN2:
      return TKAdminLevel.ADMIN1;
    case TKAdminLevel.ADMIN1:
      return null;
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Child
// ////////////////////////////////////////////////////////////////////////////

export function hasChild(level: TKAdminLevel): boolean {
  switch (level) {
    case TKAdminLevel.ADMIN1:
    case TKAdminLevel.ADMIN2:
    case TKAdminLevel.ADMIN3:
      return true;
    case TKAdminLevel.ADMIN4:
      return false;
  }
}

export function child(level: TKAdminLevel): TKAdminLevel | null {
  switch (level) {
    case TKAdminLevel.ADMIN1:
      return TKAdminLevel.ADMIN2;
    case TKAdminLevel.ADMIN2:
      return TKAdminLevel.ADMIN3;
    case TKAdminLevel.ADMIN3:
      return TKAdminLevel.ADMIN4;
    case TKAdminLevel.ADMIN4:
      return null;
  }
}

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

export function arrayLevelToRoot(level: TKAdminLevel): Array<TKAdminLevel> {
  const levels: Array<TKAdminLevel> = [];
  let levelIterator: TKAdminLevel | null = level;
  while (levelIterator) {
    levels.push(levelIterator);
    levelIterator = parent(levelIterator);
  }

  return levels;
}

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

export function arrayRootToLevel(level: TKAdminLevel): Array<TKAdminLevel> {
  return arrayLevelToRoot(level).reverse();
}

export function arrayLevelToLeaf(level: TKAdminLevel): Array<TKAdminLevel> {
  const levels: Array<TKAdminLevel> = [];
  let levelIterator: TKAdminLevel | null = level;
  while (levelIterator) {
    levels.push(levelIterator);
    levelIterator = child(levelIterator);
  }

  return levels;
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
