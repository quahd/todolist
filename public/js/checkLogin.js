const checkLogin = () => {
    if(!localStorage.getItem("userLoggedIn")){
        window.location.href = "../page/login.html"
    }
}
export default checkLogin;
