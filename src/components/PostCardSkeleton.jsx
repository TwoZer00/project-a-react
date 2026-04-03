import { Card, CardActions, CardContent, CardHeader, Skeleton, Stack } from '@mui/material';
import React from 'react';

export default function PostCardSkeleton() {
    return (
        <Card sx={{ marginY: 2 }}>
            <CardHeader
                avatar={<Skeleton variant="circular" width={40} height={40} />}
                title={<Skeleton width="40%" />}
                subheader={<Skeleton width="25%" />}
            />
            <CardContent sx={{ paddingY: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                <Skeleton width="15%" height={20} />
                <Stack direction="row" gap={1}>
                    <Skeleton variant="rounded" width={60} height={24} />
                    <Skeleton variant="rounded" width={50} height={24} />
                    <Skeleton variant="rounded" width={70} height={24} />
                </Stack>
                <Skeleton width="70%" height={32} />
                <Skeleton width="90%" />
                <Skeleton width="60%" />
            </CardContent>
            <CardActions sx={{ gap: 2 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton width={30} />
                <Skeleton width={30} />
            </CardActions>
        </Card>
    );
}
