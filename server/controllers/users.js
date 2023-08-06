import User from "../models/User.js";

//**READ from CRUD --logics--  */
export const getUser = async (req,res) => {
    try{
        //Get the id
        const { id } = req.params;
        //use the id to grab user information
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(err){
        res.status(404).json({message: err.message});
    }
}

//Get User Friends
export const getUserFriends = async (req,res) => {
    try{
        const { id } = req.params;
        //grab user information
        const user = await User.findById(id);
        //grab friends using Promise because we are going to make multiple API calls to the database
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        //Formating in a proper way for frontend
        const formattedFriends = friends.map(
            ({ _id,firstName,lastName, occupation,location,picturePath }) => {
                return { _id,firstName,lastName, occupation,location,picturePath };
            }
        );
        //sending the data to frontend
        res.status(200).json(formattedFriends);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

/**UPDATE**/
export const addRemoveFriend = async (req,res) => {
    try{
        //Get the  userId and the friendId from the body
        const { id,friendId } = req.params;
        //Grabbing the current user
        const user = await User.findById(id);
        //Grabbing the friend information
        const friend = await User.findById(friendId);

        //remove the friendId if is part of user list
        if (user.friends.includes(friendId)) {
            //remove the friendId
            user.friends = user.friends.filter((id) => id !== friendId);
            //remove the crrent id
            friend.friends = friend.friends.filter((id) => id !== id);
        }else{
            //if not included we add them to the friend list by push
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();


        //grab friends using Promise because we are going to make multiple API calls to the database
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        //Formating in a proper way for frontend
        const formattedFriends = friends.map(
            ({ _id,firstName,lastName, occupation,location,picturePath }) => {
                return { _id,firstName,lastName, occupation,location,picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}