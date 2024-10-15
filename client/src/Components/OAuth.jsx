import { app } from "../firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { signInFaliure, signInStart, signInSuccess } from "../redux/user/userSilce";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleCLick = async () => {
    try {
      dispatch(signInStart())
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      console.log(result);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(signInFaliure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
        if (error.code === "auth/popup-blocked") {
          console.log(
            "Popup was blocked. Try allowing popups or use a redirect method."
          );
        } else {
          console.log("could not sign in with google", error);
        }

    }
  };

  return (
    <button
      onClick={handleGoogleCLick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    >
      continue with google
    </button>
  );
};

export default OAuth;
