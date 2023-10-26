'use client';

import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';

import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

export const CourseEnrollButton: React.FC<CourseEnrollButtonProps> = ({
  courseId,
  price,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(res.data.url);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      size='sm'
      className='w-full md:w-auto'>
      Enroll for {formatPrice(price)}
    </Button>
  );
};
