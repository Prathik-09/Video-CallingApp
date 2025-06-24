import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import Notification from "./pages/Notification.jsx";
import {Routes,Route, Navigate} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout  from "./components/Layout.jsx";
import { useThemeStore } from "./store/usethemeStore.js";
function App() {

  //Tanstack query
    const{isLoading,authUser}=useAuthUser();
    const isAuthenticated=Boolean(authUser);
    const isOnboarded=authUser?.isonBoarded;
    const {theme}=useThemeStore();
    if(isLoading){
      return <PageLoader/>;
    }
    
  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated&&isOnboarded? (<Layout showSidebar={true}><HomePage/></Layout>) :<Navigate to={!isAuthenticated?"/login":"/onboarding"}/>}/>
        <Route path="/signup" element={!isAuthenticated?<SignUp />:<Navigate to={isOnboarded?"/":"/onboarding"}/>} />
        <Route path="/login" element={!isAuthenticated?<Login/>:<Navigate to={isOnboarded?"/":"/onboarding"}/>} />
        <Route path="/notifications" element={isAuthenticated && isOnboarded ?(
          <Layout showSidebar={true}>
            <Notification/>
          </Layout>
        ) :(<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)}/>
        
        <Route path="/call/:id" element={
          isAuthenticated && isOnboarded ?
          (
            <CallPage/>
          ):(
            <Navigate to={!isAuthenticated ? "/login":"/onboarding"}/>
          )
        } />
        <Route path="/chat/:id" element={isAuthenticated&&isOnboarded?(
          <Layout showSidebar={false}>
            <ChatPage/>
          </Layout>
        ):(
          <Navigate to={!isAuthenticated?"/login":"/onboarding"}/>
        )} />
        <Route path="/onboarding" element={isAuthenticated?(!isOnboarded?<Onboarding/>:<Navigate to="/"/>):(<Navigate to="/login"/>)} />
      </Routes>
<Toaster />
      
    </div>
  )
}

export default App;
