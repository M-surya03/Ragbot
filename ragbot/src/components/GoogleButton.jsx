import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../api/authService";
import { useNavigate, useLocation } from "react-router-dom";

export default function GoogleButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSuccess = async (credentialResponse) => {
    try {
      const payload = JSON.parse(
        atob(credentialResponse.credential.split(".")[1]),
      );

      const res = await googleLogin(payload.email);

      localStorage.setItem("token", res.data.token);
      if (res.data.setPasswordRequired) {
        navigate("/set-password", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      alert("Google login failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GoogleLogin onSuccess={handleSuccess} onError={() => alert("Error")} />
    </div>
  );
}
