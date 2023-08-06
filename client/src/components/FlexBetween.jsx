import { Box } from "@mui/material";
import { styled } from "@mui/system";

//this style is fine if you are reusing css components
const FlexBetween = styled(Box)({
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
})

export default FlexBetween;