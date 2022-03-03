import BungieImage from 'app/dim-ui/BungieImage';
import ClosableContainer from 'app/dim-ui/ClosableContainer';
import { t } from 'app/i18next-t';
import { D1GridNode, DimItem } from 'app/inventory/item-types';
import { bucketsSelector } from 'app/inventory/selectors';
import { AppIcon, plusIcon } from 'app/shell/icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import LoadoutBucketDropTarget from './LoadoutBuilderDropTarget';
import LoadoutBuilderItem from './LoadoutBuilderItem';
import LoadoutBuilderLocksDialog from './LoadoutBuilderLocksDialog';
import { ArmorTypes, D1ItemWithNormalStats, LockedPerkHash, PerkCombination } from './types';

interface Props {
  type: ArmorTypes;
  lockeditem: D1ItemWithNormalStats | null;
  lockedPerks: { [armorType in ArmorTypes]: LockedPerkHash };
  activePerks: PerkCombination;
  i18nItemNames: { [key: string]: string };
  onRemove({ type }: { type: string }): void;
  onPerkLocked(perk: D1GridNode, type: ArmorTypes, $event: React.MouseEvent): void;
  onItemLocked(item: DimItem): void;
}

export default function LoadoutBuilderLockPerk({
  type,
  lockeditem,
  i18nItemNames,
  activePerks,
  lockedPerks,
  onRemove,
  onPerkLocked,
  onItemLocked,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const buckets = useSelector(bucketsSelector)!;

  const closeDialog = () => setDialogOpen(false);
  const addPerkClicked = () => setDialogOpen(true);

  const doOnPerkLocked = (perk: D1GridNode, type: ArmorTypes, $event: React.MouseEvent) => {
    closeDialog();
    onPerkLocked(perk, type, $event);
  };

  const firstPerk = lockedPerks[type][Object.keys(lockedPerks[type])[0]];
  const hasLockedPerks = Object.keys(lockedPerks[type]).length > 0;

  return (
    <div className="locked-item">
      <LoadoutBucketDropTarget bucketHash={buckets.byType[type].hash} onItemLocked={onItemLocked}>
        {lockeditem === null ? (
          <div className="empty-item">
            <div className="perk-addition" onClick={addPerkClicked}>
              {hasLockedPerks ? (
                <div className="locked-perk-notification">
                  <BungieImage src={firstPerk.icon} title={firstPerk.description} />
                </div>
              ) : (
                <div className="perk-addition-text-container">
                  <AppIcon icon={plusIcon} />
                  <small className="perk-addition-text">{t('LB.LockPerk')}</small>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ClosableContainer className="lock-container" onClose={() => onRemove({ type })}>
            <LoadoutBuilderItem item={lockeditem} />
          </ClosableContainer>
        )}
        <div className="label">{i18nItemNames[type]}</div>
        {dialogOpen && (
          <LoadoutBuilderLocksDialog
            activePerks={activePerks}
            lockedPerks={lockedPerks}
            type={type}
            onPerkLocked={doOnPerkLocked}
            onClose={closeDialog}
          />
        )}
      </LoadoutBucketDropTarget>
    </div>
  );
}
