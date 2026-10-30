import { useContext, useState } from "react";
import { AuthContext } from "../auth/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const initialForm = {
  email: "",
  password: "",
};

export const LoginPage = () => {
  const { authState, login } = useContext(AuthContext);

  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();
  


  const { email, password } = form;

  const onSingIn = async () => {
    const result = login(email, password);
    if(result){
        navigate('/', {
            replace: true
        })
    }
  };
  const onInputChange = (event: any) => {
    const input = event.target;
    setForm({
      ...form,
      [input.name]: input.value,
    });

    console.log(input.name);
  };

  return (
    <>
      <div>
        <form>
          {/* Email input */}
          <div data-mdb-input-init className="form-outline mb-4">
            <input
              type="email"
              name="email"
              id="form2Example1"
              className="form-control"
              onChange={onInputChange}
            />
            <label className="form-label" htmlFor="form2Example1">
              Correo Electronico
            </label>
          </div>

          {/* Password input */}
          <div data-mdb-input-init className="form-outline mb-4">
            <input
              type="password"
              name="password"
              id="form2Example2"
              className="form-control"
              onChange={onInputChange}
            />
            <label className="form-label" htmlFor="form2Example2">
              Contraseña
            </label>
          </div>

          {/* Submit button */}
          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn btn-primary btn-block mb-4"
            onClick={onSingIn}
          >
            Sign in
          </button>
        </form>
      </div>
    </>
  );
};
