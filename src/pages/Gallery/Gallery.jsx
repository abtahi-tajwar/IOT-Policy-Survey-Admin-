import React from "react";
import GalleryClass from "../../firebase/Gallery";
import Loader from "../../components/Loader";
import { Button } from "@mui/material";
import BasicDialog from "../../components/BasicDialog";
import AddImage from "./AddImage";
import styled from "@emotion/styled";
import LoadingImage from '../../assets/loading.gif'

function Gallery() {
  const gallery = new GalleryClass();
  const [loading, setLoading] = React.useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isViewImageDialogOpen, setIsViewImageDialogOpen] =
    React.useState(false);
  const [currentImage, setCurrentImage] = React.useState(null);
  const [galleryImages, setGalleryImages] = React.useState([]);
  const [isLastPage, setIsLastPage] = React.useState(true);
  const [loadMoreLoading, setIsLoadMoreLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    gallery.get().then((res) => {
      setGalleryImages(res.response);
      setIsLastPage(res.isLastPage);
      setLoading(false);
    });
  }, []);
  const loadMore = () => {
    setIsLoadMoreLoading(true)
    gallery.get().then((res) => {
        setGalleryImages(res.response);
        setIsLastPage(res.isLastPage);
        setIsLoadMoreLoading(false);
    });
  }
  const viewImage = (image) => {
    setIsViewImageDialogOpen(true);
    setCurrentImage(image);
  };
  return (
    <Wrapper>
      <Loader isLoading={loading}>
        <div className="action">
          <Button
            variant="contained"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Upload New Image
          </Button>
        </div>
        <div className="images-container">
          {galleryImages.length === 0 ? (
            <h1>No Images Available</h1>
          ) : (
            <div className="image-gallery">
              {galleryImages.map((image) => (
                <img key={image.data.path} src={image.data.url} onClick={() => viewImage(image)} />
              ))}
            </div>
          )}
        </div>
        
        {!isLastPage && (
        <div className="load-more-container">
            {!loadMoreLoading ? (
                <Button variant="contained" onClick={loadMore}>
                    Load More
                </Button>
                ) : (
                <img src={LoadingImage} height="50px" />
            )}
        </div>
        )}
        
      </Loader>
      <BasicDialog open={isCreateDialogOpen} setOpen={setIsCreateDialogOpen}>
        <AddImage />
      </BasicDialog>
      <BasicDialog
        open={isViewImageDialogOpen}
        setOpen={setIsViewImageDialogOpen}
      >
        {currentImage && (
          <ImageViewer>
            <h3>{currentImage.data.name}</h3>
            <img src={currentImage.data.url} />
            <p>
              <i>{currentImage.data.url}</i>
            </p>
          </ImageViewer>
        )}
      </BasicDialog>
    </Wrapper>
  );
}
const ImageViewer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    text-align: center;
    img {
      max-width: 500px;
    }
`
const Wrapper = styled.div`
  .image-gallery {
    margin-top: 20px;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

    img {
      object-fit: cover;
      border-radius: 5px;
      cursor: pointer;
      width: 100%;
      aspect-ratio: 1 / 1;
      border: 1px solid black;
    }
  }
  .load-more-container {
    margin-top: 20px;
  }
`;

export default Gallery;
