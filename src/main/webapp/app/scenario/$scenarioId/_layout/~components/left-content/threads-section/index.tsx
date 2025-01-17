import StatusComponent from '@/components/ui/common/data-load-states/status-component';
import { useThreads } from '@/features/thread/queries.ts';
import { Thread } from '@/features/thread/types.ts';
import ThreadCatalogCard from '@/features/thread/components/thread-catalog-card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/shadcn/accordition.tsx';
import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area.tsx';
import DialogWrapper from '@/lib/modal-dialog/components/dialog-wrapper.tsx';

const ThreadsSection = () => {
  const threads = useThreads();

  return (
    <DialogWrapper>
      <StatusComponent<Thread[]> useQuery={threads}>
        {threads => (
          <ScrollArea>
            <Accordion
              type='multiple'
              defaultValue={['Global thread', 'Generic threads']}
              className='w-full h-svh pr-2'
            >
              <AccordionItem value='Global thread'>
                <AccordionTrigger>
                  <div className='flex-1 flex justify-center text-2xl font-bold'>
                    Global Thread
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ThreadCatalogCard data={threads![0]} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='Generic threads' className='flex flex-col'>
                <AccordionTrigger>
                  <div className='flex-1 flex justify-center text-2xl font-bold'>
                    Generic threads
                  </div>
                </AccordionTrigger>
                <AccordionContent className='flex-1'>
                  <div className='flex flex-col gap-y-6'>
                    {threads!
                      .slice(1)
                      .sort((a, b) => a.startTime - b.startTime)
                      .map(thread => (
                        <ThreadCatalogCard data={thread} key={thread.id} />
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <ScrollBar />
          </ScrollArea>
        )}
      </StatusComponent>
    </DialogWrapper>
  );
};

export default ThreadsSection;
