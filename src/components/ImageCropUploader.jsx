import React, { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Dialog, IconButton, Button, Grid } from "@mui/material";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import { useEffect } from "react";
import PlaceholderImage from "../assets/ArticleImagePlaceholder.svg";
import BannerPlaceholderImage from "../assets/BannerImagePlaceholder.svg";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

function ImageCropUploader({
  image,
  setImage,
  type,
  aspectRatio,
  placeholderImage
}) {
  // const [image, setImage] = useState("");
  const [currentPage, setCurrentPage] = useState("choose-img");
  const [croppingStagedImage, setCroppingStagedImage] = useState("");
  const [imgAfterCrop, setImgAfterCrop] = useState("");
  const [fileInputOpen, setFileInputOpen] = useState(false);
  let derivedAspectRatio = null;
  let derivedPlaceholderImage = PlaceholderImage;

  if (aspectRatio) {
    derivedAspectRatio = aspectRatio;
  } else {
    if (type === "avatar") derivedAspectRatio = 1 / 1;
    else if (type === "banner") derivedAspectRatio = 3 / 1;
  }

  if (placeholderImage) {
    derivedPlaceholderImage = placeholderImage;
  } else {
    if (type === "avatar") derivedPlaceholderImage = PlaceholderImage;
    else if (type === "banner")
      derivedPlaceholderImage = BannerPlaceholderImage;
  }

  // Invoked when new image file is selected
  const onImageSelected = selectedImg => {
    setCurrentPage("crop-img");
    // setImage(selectedImg);
    setCroppingStagedImage(selectedImg);
  };

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = imgCroppedArea => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    let imageObj1 = new Image();
    imageObj1.src = croppingStagedImage;
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL("image/png");

      setImgAfterCrop(dataURL);
      canvasEle.toBlob(function (blob) {
        setImage(blob);
      }, "image/png");

      setCurrentPage("img-cropped");
    };
  };

  // Handle Cancel Button Click
  const onCropCancel = () => {
    setCurrentPage("choose-img");
    // setImage("");
  };

  useEffect(() => {
    console.log("Image", image);
  }, [image]);

  return (
    <Container>
      {currentPage === "crop-img" ? (
        <ImageCropper
          image={croppingStagedImage}
          onCropDone={onCropDone}
          onCropCancel={onCropCancel}
          aspectRatio={derivedAspectRatio}
        />
      ) : (
        <>
          <FileInput
            setImage={setImage}
            onImageSelected={onImageSelected}
            open={fileInputOpen}
            setOpen={setFileInputOpen}
          />
          <ImageUploaderContainer type={type}>
            {imgAfterCrop !== "" ? (
              <img src={imgAfterCrop} className="cropped-img" />
            ) : (
              (image instanceof Blob) ? <img src={URL.createObjectURL(image)}/> :
              <img
                src={!image ? derivedPlaceholderImage : image}
                className="cropped-img"
              />
            )}
            {/* <img src={(imgAfterCrop === "") ? PlaceholderImage : imgAfterCrop } className="cropped-img" /> */}
            {/* <button
                    onClick={() => {
                        setCurrentPage("crop-img");
                    }}
                    className="btn"
                >
                    Crop
                </button> */}

            <IconButton
              onClick={() => {
                setCurrentPage("choose-img");
                // setImage("");
                setFileInputOpen(true);
              }}
              // color="customThemeColor.white"
              // variant="outlined"
            >
              <div className="btn-icon">
                <AddAPhotoIcon sx={{ color: "customThemeColor.white" }} />
              </div>
            </IconButton>
          </ImageUploaderContainer>
        </>
      )}
    </Container>
  );
}

function FileInput({ onImageSelected, open, setOpen }) {
  const inputRef = useRef();

  const handleOnChange = event => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function (e) {
        onImageSelected(reader.result);
      };
    }
  };

  useEffect(() => {
    if (open) {
      inputRef.current.click();
      setOpen(false);
    }
  }, [open]);
  const onChooseImg = () => {
    inputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

function ImageCropper({ image, onCropDone, onCropCancel, aspectRatio }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  // const [aspectRatio, setAspectRatio] = useState(1 / 1);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onAspectRatioChange = event => {
    setAspectRatio(event.target.value);
  };
  return (
    <Dialog open={true}>
      <div style={{ height: 400, width: 600 }}>
        <Cropper
          image={image}
          aspect={aspectRatio}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              width: "100%",
              height: "80%",
              backgroundColor: "#fff"
            }
          }}
        />
      </div>

      <div className="action-btns">
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
            boxSizing: "border-box"
          }}
        >
          <Grid item xs>
            <Button
              onClick={onCropCancel}
              variant="outlined"
              sx={{ color: "primary.main" }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs>
            <Button
              variant="contained"
              onClick={() => {
                onCropDone(croppedArea);
              }}
            >
              Done
            </Button>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}

const Container = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

const ImageUploaderContainer = styled(Box)(({ theme, type }) => ({
  ...(type === "avatar" && {
    height: 113,
    width: 113,
    position: "relative",
    img: {
      height: "100%",
      width: "100%",
      overflow: "hidden",
      borderRadius: "50%",
      objectFit: "cover"
    }
  }),
  ...((type === "banner" || !type) && {
    height: 350,
    width: "100%",
    position: "relative",
    img: {
      height: "100%",
      width: "100%",
      overflow: "hidden",
      borderRadius: 10,
      objectFit: "cover"
    }
  }),
  ".btn-icon": {
    height: 40,
    width: 40,
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  ".MuiButtonBase-root": {
    position: "absolute",
    right: -10,
    bottom: -10
  }
}));

export default ImageCropUploader;
