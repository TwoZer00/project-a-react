import { Card, CardContent, Skeleton, Stack } from '@mui/material';
import React from 'react';

export default function PostListItemSkeleton() {
    return (
        <Card variant="outlined" sx={{ mb: 0.5 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
                <Stack sx={{ flex: 1 }} gap={0.5}>
                    <Skeleton width="50%" height={18} />
                    <Skeleton width="30%" height={14} />
                </Stack>
                <Skeleton width={80} height={20} />
            </CardContent>
        </Card>
    );
}
