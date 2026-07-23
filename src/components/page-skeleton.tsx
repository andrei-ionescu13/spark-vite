import type { SkeletonProps } from '@mui/material';
import { Skeleton } from '@mui/material';

export const PageSkeleton = (props: SkeletonProps) => (
  <Skeleton
    height={250}
    sx={{ borderRadius: 1 }}
    variant="rectangular"
    width="100%"
    {...props}
  />
);
