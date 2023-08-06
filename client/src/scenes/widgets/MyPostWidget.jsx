import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  MicOutlined,
  MoreHorizOutlined,
  ImageOutlined,
} from "@mui/icons-material";
//import Material Components
import { 
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery } from "@mui/material";

  import Dropzone from "react-dropzone";
  import FlexBetween from "components/FlexBetween";
  import UserImage from "components/UserImage";
  import WidgetWrapper from "components/WidgetWrapper";

  import { useState } from "react";
  import { useDispatch,useSelector } from "react-redux";
  import { setPosts } from "state"

  const MyPostWidget = ({ picturePath }) => {
      //create a bunch of state
      const dispatch = useDispatch();
      const [isImage ,setIsImage] = useState(false);
      //theactual state image
      const [ image,setImage ] = useState(null);
      const [ post ,setPost ] = useState("");//represents the actual post content
      //Grabing our colors we use palette
      const { palette } = useTheme();
      //Grab id from our store using userSelector state sending to the backend to determine who is postin the content
      const { _id } = useSelector((state) => state.user)
      //Get token to be used to authorize this user to call this API
      const token = useSelector((state) => state.token);
      //setting is NonMobile
      const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
      const mediumMain = palette.neutral.mediumMain;
      const medium = palette.neutral.medium;

      //Creating a function that will handle our post and create API callls
      const handlePost = async () => {
          //using form data--since we are passing images
          const formData = new FormData();
          //Appending property manually and some values
          formData.append("UserId",_id);
          formData.append("description",post);//pass post to description key
          if (image) {
              formData.append("picture",image);//pass image to picture key of our map
              formData.append("picturePath",image.name);//adding image name as well to determine the path of the image
          }
          //creating our API that will send the post information to backend
          const response = await fetch(`https://localhost:3001/posts`,{
              method: "POST",
              headers: { Authorization:`Bearer ${token}`},
              body: formData,
          });
          //Backend will return a list of updated post if we remember that
          const posts = await response.json();
          dispatch(setPosts({posts}));
          setImage(null);//set image of null once we make API calls in each state
          setPost("");//set Post of empty string once we make API calls in each state
      }

      return (
          <WidgetWrapper>
            <FlexBetween gap="1.5rem">
              <UserImage image={picturePath} /> {/**cicle with profile user**/}
              <InputBase
                placeholder="What's on your mind..."
                onChange={(e) => setPost(e.target.value)}
                value={post}
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem 2rem",
                }}
              />
            </FlexBetween>
            {isImage && (
              <Box
                border={`1px solid ${medium}`}
                borderRadius="5px"
                mt="1rem"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps }) => (
                    <FlexBetween>
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        width="100%"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!image ? (
                          <p>Add Image Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{image.name}</Typography>
                            <EditOutlined/>
                          </FlexBetween>
                        )}
                      </Box>
                      {image && (
                        <IconButton
                          onClick={() => setImage(null)}
                          sx={{ width: "15%" }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </FlexBetween>
                  )}
                </Dropzone>
              </Box>
            )}
      
            <Divider sx={{ margin: "1.25rem 0" }} />
      
            <FlexBetween>
              <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                <ImageOutlined sx={{ color: mediumMain }} />
                <Typography
                  color={mediumMain}
                  sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                >
                  Image
                </Typography>
              </FlexBetween>
      
              {isNonMobileScreens ? (
                <>
                  <FlexBetween gap="0.25rem">
                    <GifBoxOutlined sx={{ color: mediumMain }} />
                    <Typography color={mediumMain}>Clip</Typography>
                  </FlexBetween>
      
                  <FlexBetween gap="0.25rem">
                    <AttachFileOutlined sx={{ color: mediumMain }} />
                    <Typography color={mediumMain}>Attachment</Typography>
                  </FlexBetween>
      
                  <FlexBetween gap="0.25rem">
                    <MicOutlined sx={{ color: mediumMain }} />
                    <Typography color={mediumMain}>Audio</Typography>
                  </FlexBetween>
                </>
              ) : (
                <FlexBetween gap="0.25rem">
                  <MoreHorizOutlined sx={{ color: mediumMain }} />
                </FlexBetween>
              )}
      
              <Button
                disabled={!post}
                onClick={handlePost}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                }}
              >
                POST
              </Button>
            </FlexBetween>
          </WidgetWrapper>
        );
      };
export default MyPostWidget;        