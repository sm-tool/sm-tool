import { ActionItem } from '@/lib/actions/types.ts';
import useDialog from '@/lib/modal-dialog/hooks/use-dialog.tsx';
import { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
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

export const useEventPanelIdleActions = (): ActionItem<EventInstance>[] => {
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
