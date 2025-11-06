import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import InputBox from "../component/ui/InputBox";
import api from "../api/api";
import { toast } from "react-toastify";

interface showModalProps {
  onHide: () => void;
  onShowRegister: () => void;
}

const Register: React.FC<showModalProps> = ({ onHide, onShowRegister }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [role, setRole] = useState<string>("user");



  const handleRegister = async () => {
    try {
      if (!name || !email || !password || !address || !role) {
            return;
      }
      const data = {
        name: name,
        email: email,
        password: password,
        address: address,
        role: role
      }
      const response = await api.post("/auth/register", data);
      if (response.status === 201) {
        toast.success("Registration successful!");
        onHide();
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("Email already registered!");
      } else {
        toast.error("Registration failed. Try again!");
      }
    }
  }

  return (
    <div className="p-3">
     
      <form>
        <div className="row">
          <div className="col">
            <InputBox
              label="Full Name"
              placeholder="Enter your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <InputBox
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row">

          <div className="col">
            <InputBox
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">
              Registering as <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">Customer</option>
              <option value="employee">Join as Employee</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">
            Address <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            placeholder="Enter your address"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="terms" />
          <label className="form-check-label" htmlFor="terms">
            I agree to the{" "}
            <a href="#" className="text-decoration-none">
              Terms & Conditions
            </a>
          </label>
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary px-5" onClick={handleRegister}>
            Create Account
          </button>
        </div>
        <div className="text-center mt-3">
          Already have an account?{" "}
          <a href="#" className="text-decoration-none" onClick={onShowRegister}>
            Log in
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;
