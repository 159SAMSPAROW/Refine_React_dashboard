import React from 'react'
import { useTable } from '@pankod/refine-core';
import { Box, Stack, Typography } from '@pankod/refine-mui'
import { useNavigate } from '@pankod/refine-react-router-v6';
import { PropertyCard, CustomButton } from 'components'
import { Add } from '@mui/icons-material';

const AllProperties = () => {
const navigate = useNavigate()

  return (
   <Box>
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Typography fontSize={25} fontWeight={700} color='#11142d'>
        Toutes les propriétés
      </Typography>
      <CustomButton 
        title='Ajouter une propriété' 
        handleClick={() => navigate('/properties/create')}
        backgroundColor='#475be8'
        color='#fcfcfc' 
        icon={<Add />}
      />
    </Stack>
    <Box mt='20px' sx={{ display: 'flex', flexWrap: 'wrap', gap: 3}}>

    </Box>
   </Box>
  );
}

export default AllProperties;
