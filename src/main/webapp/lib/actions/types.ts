import { LucideIcon } from 'lucide-react';
/**
 * Reprezentuje pojedynczy element menu akcji wraz z jego właściwościami.
 *
 * @template T - Typ elementu, na którym wykonywana jest akcja
 * @param {Object} ActionItem
 * @param {string} ActionItem.label - Tekst wyświetlany dla elementu menu
 * @param {LucideIcon} ActionItem.Icon - Komponent ikony z biblioteki Lucide
 * @param {(item: T) => void} ActionItem.onClick - Funkcja wywoływana po kliknięciu, otrzymuje element jako parametr
 * @param {'default' | 'destructive'} [ActionItem.variant='default'] - Wariant stylistyczny elementu menu
 *
 * @example
 * ```tsx
 * const deleteAction: ActionItem<User> = {
 *   label: "Usuń użytkownika",
 *   Icon: Trash2,
 *   onClick: (user) => handleUserDelete(user.id),
 *   variant: "destructive"
 * };
 * ```
 */
export type ActionItem<T> = {
  label: string;
  Icon: LucideIcon;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
};

/**
 * Właściwości podstawowego komponentu menu.
 *
 * @template T - Typ elementu, na którym wykonywane są akcje
 * @param {Object} props
 * @param {ActionItem<T>[]} props.actions - Lista dostępnych akcji w menu
 * @param {T} props.item - Element, na którym będą wykonywane akcje
 * @param {boolean} [props.disabled]
 *
 * @example
 * ```tsx
 * const menuProps: BaseMenuProperties<User> = {
 *   actions: [editAction, deleteAction],
 *   item: currentUser,
 *   disabled: !hasPermission
 * };
 * ```
 */
export interface BaseMenuProperties<T> {
  actions: ActionItem<T>[];
  item: T;
  disabled?: boolean;
}
