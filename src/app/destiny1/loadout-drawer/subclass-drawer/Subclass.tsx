import { DimItem } from 'app/inventory/item-types';
import { applySocketOverrides, SocketOverrides } from 'app/inventory/store/override-sockets';
import { useD2Definitions } from 'app/manifest/selectors';
import React, { useCallback, useMemo } from 'react';
import LoadoutDrawerItem from '../LoadoutDrawerItem';
import ItemSocketsSubclass from './ItemSocketsSubclass';
import styles from './Subclass.m.scss';

export function Subclass({
  subclass,
  socketOverrides,
  onApplySocketOverrides,
  equip,
  remove,
}: {
  subclass: DimItem;
  socketOverrides: SocketOverrides;
  equip(item: DimItem, e: React.MouseEvent): void;
  remove(item: DimItem, e: React.MouseEvent): void;
  onApplySocketOverrides(item: DimItem, socketOverrides: SocketOverrides): void;
}) {
  const defs = useD2Definitions();

  const subclassWithOverrides = useMemo(() => {
    const socketOverridesWithDefaultPlugs: SocketOverrides = { ...socketOverrides };

    for (const socket of subclass.sockets?.allSockets || []) {
      if (!socketOverridesWithDefaultPlugs[socket.socketIndex]) {
        socketOverridesWithDefaultPlugs[socket.socketIndex] =
          socket.socketDefinition.singleInitialItemHash;
      }
    }

    return applySocketOverrides(defs!, subclass, socketOverridesWithDefaultPlugs);
  }, [defs, socketOverrides, subclass]);

  const updateSocketOverrides = useCallback(
    (overrides: SocketOverrides) => {
      onApplySocketOverrides(subclass, overrides);
    },
    [subclass, onApplySocketOverrides]
  );

  return (
    <div className={styles.container}>
      <div className={styles.subclass}>
        <LoadoutDrawerItem item={subclassWithOverrides} equip={equip} remove={remove} />
      </div>
      <ItemSocketsSubclass
        subclass={subclassWithOverrides}
        socketOverrides={socketOverrides}
        updateSocketOverrides={updateSocketOverrides}
      />
    </div>
  );
}
