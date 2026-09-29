import React from 'react';
import { Grid, Card, CardContent, Skeleton, Box } from '@mui/material';

const LoadingSkeleton = ({ count = 10 }) => {
  return (
    <Grid container spacing={2.5}>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} sx={{ display: 'flex' }}>
          <Card
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              sx={{ paddingTop: '150%' }}
              animation="wave"
            />
            <CardContent sx={{ p: 1.5, flexGrow: 1 }}>
              <Skeleton variant="text" width="85%" height={24} animation="wave" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Skeleton variant="text" width="35%" height={18} animation="wave" />
                <Skeleton variant="text" width="25%" height={18} animation="wave" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingSkeleton;
