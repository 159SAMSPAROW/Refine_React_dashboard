import React from 'react'
import { useTable } from '@pankod/refine-core';
import { Box, Stack, Typography } from '@pankod/refine-mui'
import { useNavigate } from '@pankod/refine-react-router-v6';
import { PropertyCard, CustomButton } from 'components'
import { Add } from '@mui/icons-material';

const AllProperties = () => {
  const navigate = useNavigate()
  const { 
    tableQueryResult: { data, isLoading, isError }
  } = useTable()

  const allProperties = data?.data ?? [] // si cette valeur est undefined, elle utilise un tableau vide comme valeur de remplacement
  
  if(isLoading) return <Typography>Loading...</Typography>
  if(isError) return <Typography>Error...</Typography>

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
      { allProperties.map((property) => (
        <PropertyCard
          key={property._id}
          id={property._id}
          title={property.title}
          price={property.price}
          location={property.location}
          photo={property.photo}
        />
      ))}
    </Box>
   </Box>
  );
}

export default AllProperties;
