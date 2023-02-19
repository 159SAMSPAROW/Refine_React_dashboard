import { useTable } from '@pankod/refine-core';
import { Box, Stack, Typography, TextField, Select, MenuItem } from '@pankod/refine-mui'
import { useNavigate } from '@pankod/refine-react-router-v6';
import { PropertyCard, CustomButton } from 'components'
import { Add } from '@mui/icons-material';
import { useMemo } from 'react'

const AllProperties = () => {
  const navigate = useNavigate()
  const { 
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    setPageSize,
    pageCount,
    sorter, setSorter,
    filters, setFilters,
  } = useTable()

  const allProperties = data?.data ?? [] // si data est undefined, elle utilise un tableau vide comme valeur de remplacement
  const currentPrice = sorter.find((item) => item.field === 'price')?.order // extrait l'ordre de tri
  
  const toggleSort = (field: string) => {
    setSorter([{ field, order: currentPrice === 'asc' ? 'desc' : 'asc'}])
  }/* Sert à inverser l'ordre de tri actuel (ascendant ou descendant) */

  const currentFilterValues = useMemo(() => {// Sert à mémoriser les valeurs de filtre actuelles pour les utiliser ultérieurement
    const logicalFilters = filters.flatMap((item) => ('field' in item ? item : []))

    return {
      title: logicalFilters.find((item) => item.field === 'title')?.value || '',
      propertyType: logicalFilters.find((item) => item.field === 'propertyType')?.value || '',
    }
  }, [filters])

  if(isLoading) return <Typography>Loading...</Typography>
  if(isError) return <Typography>Error...</Typography>

  return (
   <Box>
    <Box mt='20px' sx={{ display: 'flex', flexWrap: 'wrap', gap:3}}>
      <Stack direction='column' width='100%'>
        <Typography fontSize={25} fontWeight={700} color='#11142d'>
          {!allProperties.length ? 'There are no properties' : 'All Properties'}
        </Typography>
        <Box mb={2} mt={3} display='flex' width='84%' justifyContent='space-between' flexWrap='wrap'>
          <Box display='flex' gap={2} flexWrap='wrap' mb={{ xs: '20px', sm: 0}}>
            <CustomButton 
              title={`Sort Price ${currentPrice === 'asc' ? '↑' : '↓'}`}
              handleClick={() => toggleSort('price')}
              backgroundColor='#475be8'
              color='#fcfcfc'
            />
            <TextField
              variant='outlined'
              color='info'
              placeholder='Search by title'
              value={currentFilterValues.title}

// => Permet de rechercher une propriété par son intitulé
// Ce onChange sert à mettre à jour les filtres de recherche avec une recherche de type "contains"
// sur le champ title, en utilisant la valeur saisie par l'utilisateur dans le champ de recherche.              
              onChange={(e) => {
                setFilters([
                  {
                    field: 'title',
                    operator: 'contains',
                    value: e.currentTarget.value ? e.currentTarget.value : undefined
                  }
                ])
              }}
            />
            <Select 
              variant='outlined'
              color='info'
              displayEmpty
              required
              inputProps={{'aria-label' : 'Without label'}}
              defaultValue=''
              value={currentFilterValues.propertyType}

// => Permet d' afficher les propriétés par type
// Ce onChange met à jour le tableau de filtres de la
// composante avec un nouveau filtre basé sur la valeur sélectionnée 
              onChange={(e) => {
                setFilters([
                  {
                    field: 'propertyType',
                    operator: 'eq',
                    value: e.target.value 
                  }
                ],'replace')
              }}
            >
              <MenuItem value=''>All</MenuItem>
              {['Apartement', 'Villa', 'Farmhouse', 'Condos', 'Townhouse', 'Duplex', 'Studio', 'Chalet'].map((type) =>(
                <MenuItem key={type} value={type.toLowerCase()}>{type}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Stack>
    </Box>
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
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
{/*CustomButton configuré pour retourné a la page précédente si le numero de page est supérieur a 1 */}
    <Box display='flex' gap={2} mt={3} flexWrap='wrap'>
        <CustomButton
          title='Previous'
          handleClick={() => setCurrent((prev) => prev - 1)}
          backgroundColor='#475be8'
          color='#fcfcfc'
          disabled={!(current > 1)}
        />
{/* Affichage du numero de la page actuelle sur le nombre de page total */}
        <Box display={{ xs: 'hidden', sm: 'flex' }} alignItems='center' gap='5px'>
          Page{' '}<strong>{current} of {pageCount}</strong>
        </Box>
{/*CustomButton configuré pour passé a la page suivante si le numero de page est égal au nombre de page total */}        
        <CustomButton
          title='Next'
          handleClick={() => setCurrent((prev) => prev + 1)}
          backgroundColor='#475be8'
          color='#fcfcfc'
          disabled={current === pageCount}
        />
{/*Select qui permet d' afficher entre 10 et 50 item par page */}
        <Select
          variant='outlined'
          color='info'
          displayEmpty
          required
          inputProps={{'aria-label' : 'Without label'}}
          defaultValue={10}
          onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : 10)}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <MenuItem key={size} value={size}>Show {size}</MenuItem>
          ))}
        </Select>
    </Box>
   </Box>
  );
}

export default AllProperties;
