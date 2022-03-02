import { t } from 'app/i18next-t';
import { PluggableInventoryItemDefinition } from 'app/inventory/item-types';
import { groupModsByModType, sortModGroups } from 'app/loadout/mod-utils';
import React, { useMemo } from 'react';
import SavedModCategory from './SavedModCategory';
import styles from './SavedMods.m.scss';

interface Props {
  /** The loadouts saved mods hydrated. */
  savedMods: PluggableInventoryItemDefinition[];
  /** Opens the mod picker sheet with a supplied query to filter the mods. */
  onOpenModPicker(query?: string): void;
  /** Removes a mod from the loadout via the mods item hash. */
  removeModByHash(itemHash: number): void;
}

/**
 * Component for managing mods associated to a loadout.
 */
function SavedMods({ savedMods, onOpenModPicker, removeModByHash }: Props) {
  // Turn savedMods into an array of mod groups where each group is
  const groupedMods = useMemo(() => {
    const indexedMods = groupModsByModType(savedMods);
    return Object.values(indexedMods).sort(sortModGroups);
  }, [savedMods]);

  if (!savedMods.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.title}>{t('Loadouts.Mods')}</div>
      </div>
      <div className={styles.categories}>
        {groupedMods.map((group) =>
          group?.length ? (
            <SavedModCategory
              key={group[0].plug.plugCategoryHash}
              mods={group}
              onRemove={(index: number) => removeModByHash(index)}
              onOpenModPicker={onOpenModPicker}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

export default SavedMods;
