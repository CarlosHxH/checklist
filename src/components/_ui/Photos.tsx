import { Box, Typography } from "@mui/material";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Image from 'next/image';

type photosType = {
  id: string;
  type: string;
  photo: string;
  description: string;
}[];


const Photos: React.FC<{ photos: photosType, title: string }> = ({ photos, title }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <PhotoProvider>
        <Box mt={2} style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {photos.map((photo) => (
            <PhotoView key={photo.id} src={photo.photo}>
              <Image width={100} height={100} src={photo.photo} alt={photo.type} />
            </PhotoView>
          ))}
        </Box>
      </PhotoProvider>
    </Box>
  )
}
export default Photos;