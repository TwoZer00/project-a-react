import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function EmptyState({ icon, message, actionLabel, actionTo }) {
    return (
        <Stack alignItems="center" justifyContent="center" gap={2} sx={{ py: 8, opacity: 0.7, width: '100%' }}>
            {icon && <Typography sx={{ fontSize: 48, lineHeight: 1 }}>{icon}</Typography>}
            <Typography variant="body1" color="text.secondary" textAlign="center">{message}</Typography>
            {actionLabel && actionTo && (
                <Button component={RouterLink} to={actionTo} variant="outlined" size="small">
                    {actionLabel}
                </Button>
            )}
        </Stack>
    );
}
