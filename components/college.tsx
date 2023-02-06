import { ImageList, ImageListItem } from "@mui/material";

const RenderMedia = (image: { url: string; name: string; mime: string }) => {
  switch (image.mime.split("/")[0]) {
    case "video":
        return (
            <img src={`${image.url}/ik-video.mp4/ik-thumbnail.jpg?tr=h-250,w-250,c-at_max`} loading="lazy" />
        );
    default:
      return (
        <img src={`${image.url}?tr=h-250,w-250,c-at_max`} loading="lazy" />
      );
  }
};

export const CollegeUi = (props: {
  images: { url: string; name: string; mime: string }[];
}) => {
  return (
    <ImageList sx={{ width: 1000, height: 500 }} cols={3} rowHeight={164}>
      {props.images.map((image) => (
        <ImageListItem key={image.name}>
          <RenderMedia {...image} />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
