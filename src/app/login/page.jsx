import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../store/services/authApi";
import { loginSuccess } from "../store/slices/authSlice";
import { useState } from "react";

export default function Login() {
  const [loginUser] = useLoginUserMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser({ email, password });
    console.log("Login Response:", response);

    if (response.data) {
        dispatch(loginSuccess(response.data)); // Store user data
      }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
