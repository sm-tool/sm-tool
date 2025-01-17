import { ActionItem } from '@/lib/actions/types.ts';
import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import { useMemo } from 'react';
import { Pencil, SquareDashed, Trash2 } from 'lucide-react';
import {
  EventInstance,
  eventInstanceFormDTO,
} from '@/features/event-instance/types.ts';
import {
  useDeleteEvent,
  useUpdateEvent,
} from '@/features/event-instance/queries.ts';
import { useThreadOffset } from '@/features/thread/queries.ts';
import { convertToEventInstanceForm } from '@/features/event-instance/utils/convert-to-event-instance-form.ts';

export const useEventPanelActions = (): ActionItem<EventInstance>[] => {
  const { open, close } = useDialog();
  const updateEvent = useUpdateEvent();
  const offsetEvent = useThreadOffset();
  const deleteEventMutation = useDeleteEvent();

  return useMemo(
    () => [
      {
        label: 'Edit event description',
        Icon: Pencil,
        onClick: (event: EventInstance) => {
          const formData = convertToEventInstanceForm(event);
          open({
            type: 'autoForm',
            title: 'Edit event description',
            description: 'Make changes to event title or description',
            data: formData,
            zodObjectToValidate: eventInstanceFormDTO,
            onSubmit: async data => {
              await updateEvent.mutateAsync({ id: event.id, data: data });
            },
          });
        },
      },
      {
        label: 'Change event type to idle',
        Icon: SquareDashed,
        variant: 'default',
        onClick: (data: EventInstance) => {
          const formData = convertToEventInstanceForm(data);
          open({
            type: 'confirm',
            variant: 'default',
            title: 'Change event type to idle',
            description:
              'Would you like to change the event type to idle?\n\nThis type cannot change attributes or associations.\n\nChanging types may delete your existing changes present on this event, continue?',
            onConfirm: async () => {
              await updateEvent.mutateAsync({
                id: formData.id,
                data: {
                  ...formData,
                  attributeChanges: [],
                  associationChanges: [],
                },
              });
              close();
            },
          });
        },
      },
      {
        label: 'Delete event',
        Icon: Trash2,
        variant: 'destructive',
        onClick: (data: EventInstance) => {
          open({
            type: 'confirm',
            variant: 'destructive',
            title: 'Delete event',
            description:
              'Are you sure you want to delete this event? This action will udone all changes to both attributes and associations done in this event',
            onConfirm: async () => {
              await deleteEventMutation.mutateAsync({ event: data });
              close();
            },
          });
        },
      },
    ],
    [open, updateEvent, offsetEvent],
  );
};
