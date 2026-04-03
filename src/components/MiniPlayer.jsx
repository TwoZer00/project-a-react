import { Pause, PlayArrow, QueueMusic, Radio, SkipNextOutlined, SkipPreviousOutlined } from '@mui/icons-material';
import { Box, Chip, Collapse, IconButton, LinearProgress, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AudioCover from './AudioCover';
import UserAvatar from './UserAvatar';

export default function MiniPlayer({ audio, initData, setInitData, audioRef, audioProgress, isPlaying, onPlay, onSkipNext, onSkipPrev, onSeek, onStopStation, playFromQueue, toHHMMSS }) {
    const [expanded, setExpanded] = useState(false);
    const [showQueue, setShowQueue] = useState(false);

    if (!audio) return null;

    const station = initData?.station;

    return (
        <Paper
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: (theme) => theme.zIndex.drawer + 2,
                borderRadius: 0,
            }}
        >
            {/* Progress bar at top of mini player */}
            <LinearProgress
                variant="determinate"
                value={audioProgress}
                color="primary"
                sx={{ height: 3, cursor: 'pointer' }}
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = ((e.clientX - rect.left) / rect.width) * 100;
                    onSeek(pct);
                }}
            />

            {/* Main mini player bar */}
            <Stack
                direction="row"
                alignItems="center"
                gap={1}
                sx={{ px: 2, py: 0.75, cursor: 'pointer' }}
                onClick={() => setExpanded(v => !v)}
            >
                {/* Cover / Avatar */}
                <Box sx={{ width: 40, height: 40, flexShrink: 0 }}>
                    {audio.cover ? (
                        <Box component="img" src={audio.cover} sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} />
                    ) : (
                        <UserAvatar username={audio.username} width={40} height={40} />
                    )}
                </Box>

                {/* Title + Artist */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={500} noWrap>
                        {audio.isInterlude ? `🎙️ ${audio.title}` : audio.title}
                    </Typography>
                    {!audio.isInterlude && (
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {audio.username}
                        </Typography>
                    )}
                </Box>

                {/* Station indicator */}
                {station && (
                    <Chip
                        icon={<Radio />}
                        label={`${(station.currentIndex || 0) + 1}/${station.queue.length}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                        onClick={(e) => { e.stopPropagation(); setShowQueue(v => !v); }}
                        onDelete={(e) => { e.stopPropagation(); onStopStation(); }}
                    />
                )}

                {/* Controls */}
                <Stack direction="row" alignItems="center" onClick={(e) => e.stopPropagation()}>
                    {station && (
                        <IconButton size="small" onClick={onSkipPrev} disabled={!station || station.currentIndex === 0}>
                            <SkipPreviousOutlined fontSize="small" />
                        </IconButton>
                    )}
                    <IconButton onClick={onPlay}>
                        {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    {station && (
                        <IconButton size="small" onClick={onSkipNext} disabled={!station || station.currentIndex >= station.queue.length - 1}>
                            <SkipNextOutlined fontSize="small" />
                        </IconButton>
                    )}
                </Stack>
            </Stack>

            {/* Expanded view */}
            <Collapse in={expanded}>
                <Stack sx={{ px: 2, pb: 1.5 }} gap={1}>
                    {/* Time */}
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                            {audioRef.current ? toHHMMSS(audioRef.current.currentTime) : '0:00'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {audioRef.current ? toHHMMSS(audioRef.current.duration) : '0:00'}
                        </Typography>
                    </Stack>

                    {/* Post link */}
                    {!audio.isInterlude && (
                        <Typography
                            variant="caption"
                            component={RouterLink}
                            to={`/post/${audio.id}`}
                            sx={{ color: 'primary.main', textDecoration: 'none' }}
                        >
                            Go to post →
                        </Typography>
                    )}

                    {/* Station info */}
                    {station && (
                        <Stack gap={0.5}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Radio fontSize="small" color="primary" />
                                <Typography variant="caption" fontWeight={500}>{station.name}</Typography>
                                <IconButton size="small" onClick={() => setShowQueue(v => !v)}>
                                    <QueueMusic fontSize="small" />
                                </IconButton>
                            </Stack>
                            <Collapse in={showQueue}>
                                <List dense disablePadding sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {station.queue.map((item, i) => (
                                        <ListItem
                                            key={i}
                                            disablePadding
                                            sx={{
                                                px: 1, py: 0.25,
                                                bgcolor: i === station.currentIndex ? 'action.selected' : 'transparent',
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                                opacity: i < station.currentIndex ? 0.5 : 1
                                            }}
                                            onClick={() => playFromQueue(i)}
                                        >
                                            <ListItemText primary={
                                                <Typography variant="caption" noWrap fontWeight={i === station.currentIndex ? 600 : 400}>
                                                    {item.isInterlude ? `🎙️ ${item.title}` : item.title}
                                                </Typography>
                                            } />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </Stack>
                    )}
                </Stack>
            </Collapse>
        </Paper>
    );
}
