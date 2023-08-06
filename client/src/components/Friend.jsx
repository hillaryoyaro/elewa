import { PersonAddOutlined,PersonRemoveOutlined } from "@mui/icons-material";
import { Box,IconButton,Typography,useTheme } from "@mui/material";
import { useDispatch,useSelector } from "react-redux";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";

//creating a friend component---parent component---
const Friend = ({friendId,name,subtitle,userPicturePath}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //Grab the Id from useSelector
    const { _id } = useSelector((state) => state.user);
    //Grab the token from useselector
    const token = useSelector((state) => state.token);
    //Grab friends from useSelector through attatched array
    const friends = useSelector((state) => state.user.friends);

    //To Grab the color for styling
    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    
    //Checking if the user are friends from parent component the trigger if friend or not
    const isFriend = friends.find((friend) => friend._id === friendId);
    console.log(isFriend);
    //Create a function that will create API call whether they will be able to add friend or not
    const patchFriend = async () => {
        const response = await fetch(`https://localhost:3001/users/${_id}/${friendId}`,{
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
        );
        const data = await response.json();
        //releasing out the data from our store---backend
        //calling ou the dispatch function to fetch data from the backend
        dispatch(setFriends({ friends:data }));
    };

    //Returning the UI for the User
    return (
       <FlexBetween>
         <FlexBetween gap="1rem">
            <UserImage image={userPicturePath} size="55px" />
            <Box
                onClick={() => { //navigate through a list of friends
                    navigate(`/profile/${friendId}`);
                    navigate(0);
                }}
            >
                <Typography
                    color={main}
                    variant="h5"
                    fontWeight="500"
                    sx={{
                        "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer"
                        }
                    }}
                >
                    {name}
                </Typography>
                <Typography color={medium} fontSize="0.75rem">
                    {subtitle}
                </Typography>
            </Box>
        </FlexBetween>
        {/**For remove and and the user**/}
        <IconButton
            onClick={() => patchFriend()} //call back function
            sx={{
                backgroundColor: primaryLight,
                p: "0.6rem"
            }}
        > 
            {isFriend ? (
                <PersonRemoveOutlined sx={{ color: primaryDark }}/>
            ) : (
                <PersonAddOutlined sx={{ color: primaryDark }}/>
            )}
        </IconButton>
       </FlexBetween>
    )

};

export default Friend;