import { useState } from 'react'
import { useGetIdentity } from '@pankod/refine-core'
import { FieldValues, useForm } from '@pankod/refine-react-hook-form'
import Form from 'components/common/Form'
import { useNavigate } from '@pankod/refine-react-router-v6'

const CreateProperty = () => {

  const navigate = useNavigate()
  const { data: user } = useGetIdentity()
  const [propertyImage, setPropertyImage] = useState({name: '', url: ''})
  const { refineCore : {onFinish, formLoading }, register, handleSubmit } = useForm()

/* handleImageChange  prend un fichier image, le lit et le transforme en une chaîne de caractères sous forme de données URL,
    puis met à jour l'état de l'élément image avec cette URL.*/ 

  const handleImageChange = (file: File) => {   
    
    const reader = (readFile: File) => new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.readAsDataURL(readFile);
  }) 
  reader(file).then((result: string) => setPropertyImage({ name: file?.name, url: result })); 
};

/* onFinishHandler =  Si une image a été sélectionnée, la fonction soumet les données à la fonction onFinish avec l'URL de l'image
 et l'e-mail de l'utilisateur.*/
  const onFinishHandler = async (data: FieldValues) => {
    if(!propertyImage.name) return alert('Please upload a property image')
    await onFinish({ ...data, photo: propertyImage.url, email: user.email})
  }

  return (
    <Form
      type='Edit'
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      propertyImage={propertyImage}
      onFinishHandler={onFinishHandler}
      
    />
  );
}

export default CreateProperty;