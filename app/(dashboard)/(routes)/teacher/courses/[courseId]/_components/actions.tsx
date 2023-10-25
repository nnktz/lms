'use client';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useConfettiStore } from '@/hooks/use-confetti-store';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions: React.FC<ActionsProps> = ({
  disabled,
  courseId,
  isPublished,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const confetti = useConfettiStore();

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success('Course unpublished successfully');
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success('Course published successfully');
        confetti.onOpen();
      }

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success('Course deleted successfully');
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant='outline'
        size='sm'>
        {isPublished ? 'Unpublished' : 'Published'}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button
          size='sm'
          disabled={isLoading}>
          <Trash className='w-4 h-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
};
