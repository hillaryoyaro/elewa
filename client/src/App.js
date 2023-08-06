import { BrowserRouter,Navigate,Routes,Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline,ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";

//import state from "scenes/state";

function App() {
  const mode = useSelector ((state) => state.mode);//help to grab the value we created at initial state
  const theme = useMemo (() => createTheme(themeSettings(mode)),[mode]);//setting up our theme.
  const isAuth = Boolean(useSelector((state) => state.token));//if token exist we are authorized by use Selector
  return <div className="app">
    <BrowserRouter>
    <ThemeProvider theme={theme}> 
    <CssBaseline/> {/**Setting ou Css to basic**/}
    <Routes>
      <Route path="/" element={ <LoginPage/>}/>
      <Route 
        path="/home" 
        element={ isAuth ? <HomePage/> :<Navigate to ="/"/>}
      />
      <Route 
        path="/profile/userId:"
        element={ isAuth ? <ProfilePage/> :<Navigate to="/"/>}
      /> 
      </Routes>
    </ThemeProvider>
    </BrowserRouter>
  </div>;
}

export default App;
