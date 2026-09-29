import React from 'react';
import { Box, Typography, Avatar, Card } from '@mui/material';
import { getProfileUrl } from '../../api/tmdb';

const CastList = ({ cast = [] }) => {
  if (!cast || cast.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Cast information is not available.
      </Typography>
    );
  }

  // Show top 12 cast members
  const topCast = cast.slice(0, 12);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 1.5,
        pt: 0.5,
        '::-webkit-scrollbar': {
          height: 6,
        },
        '::-webkit-scrollbar-thumb': {
          borderRadius: 4,
          bgcolor: 'rgba(255,255,255,0.15)',
        },
      }}
    >
      {topCast.map((actor) => (
        <Card
          key={actor.id || actor.cast_id}
          sx={{
            minWidth: 120,
            maxWidth: 120,
            flexShrink: 0,
            textAlign: 'center',
            p: 1.5,
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Avatar
            src={getProfileUrl(actor.profile_path)}
            alt={actor.name}
            sx={{
              width: 72,
              height: 72,
              mx: 'auto',
              mb: 1.2,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: '0.82rem',
              lineHeight: 1.2,
              mb: 0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={actor.name}
          >
            {actor.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: '0.72rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.2,
            }}
            title={actor.character}
          >
            {actor.character || 'Role unspecified'}
          </Typography>
        </Card>
      ))}
    </Box>
  );
};

export default CastList;
