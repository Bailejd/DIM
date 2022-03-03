import PressTip from 'app/dim-ui/PressTip';
import { t } from 'app/i18next-t';
import { DimItem, DimPlug, DimSocket } from 'app/inventory/item-types';
import { isPluggableItem } from 'app/inventory/store/sockets';
import { DefItemIcon } from 'app/item/ItemIcon';
import { useD2Definitions } from 'app/manifest/selectors';
import { thumbsUpIcon } from 'app/shell/icons';
import AppIcon from 'app/shell/icons/AppIcon';
import { InventoryWishListRoll } from 'app/wishlists/wishlists';
import clsx from 'clsx';
import { ItemCategoryHashes } from 'data/d2/generated-enums';
import React from 'react';
import './ItemSockets.scss';
import { DimPlugTooltip } from './PlugTooltip';

export default function Plug({
  plug,
  item,
  socketInfo,
  wishlistRoll,
  hasMenu,
  onClick,
}: {
  plug: DimPlug;
  item: DimItem;
  socketInfo: DimSocket;
  wishlistRoll?: InventoryWishListRoll;
  hasMenu: boolean;
  onClick?(plug: DimPlug): void;
}) {
  const defs = useD2Definitions()!;

  // TODO: Do this with SVG to make it scale better!
  const modDef = defs.InventoryItem.get(plug.plugDef.hash);
  if (!modDef || !isPluggableItem(modDef)) {
    return null;
  }

  const itemCategories = plug?.plugDef.itemCategoryHashes || [];

  const doClick = onClick && (() => onClick(plug));

  const contents = <DefItemIcon itemDef={plug.plugDef} borderless={true} />;

  const tooltip = () => <DimPlugTooltip item={item} plug={plug} wishlistRoll={wishlistRoll} />;

  // Is this the currently active plug - either because it's what's slotted in game or the user has clicked to preview it
  const plugged = plug === socketInfo.plugged;
  const selectable = socketInfo.plugOptions.length > 1;

  return (
    <div
      key={plug.plugDef.hash}
      className={clsx('socket-container', {
        disabled: !plug.enabled,
        notChosen: !plugged,
        selectable,
        // This has been selected by the user but isn't the original plugged item
        selected: socketInfo.actuallyPlugged && plugged,
        // Another plug was selected by the user
        notSelected: socketInfo.actuallyPlugged && !plugged && plug === socketInfo.actuallyPlugged,
        notIntrinsic: !itemCategories.includes(ItemCategoryHashes.WeaponModsIntrinsic),
        cannotRoll: plug.cannotCurrentlyRoll,
      })}
      onClick={hasMenu || selectable ? doClick : undefined}
    >
      <PressTip tooltip={tooltip}>{contents}</PressTip>
      {wishlistRoll?.wishListPerks.has(plug.plugDef.hash) && (
        <AppIcon className="thumbs-up" icon={thumbsUpIcon} title={t('WishListRoll.BestRatedTip')} />
      )}
    </div>
  );
}
