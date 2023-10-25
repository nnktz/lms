'use client';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions: React.FC<ChapterActionsProps> = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success('Chapter unpublished successfully');
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success('Chapter published successfully');
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
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success('Chapter deleted successfully');
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
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
