import React, { useState } from "react";

const App = () => {
  const defaultValues = {
    firstName: {
      id: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "First Name...",
      value: "",
      isError: false,
      errorMsg: "First Name can't be empty",
    },
    lastName: {
      id: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Last Name...",
      value: "",
      isError: false,
      errorMsg: "Last Name can't be empty",
    },
    email: {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "abc@gmail.com",
      value: "",
      isError: false,
      errorMsg: "Enter a valid email address",
    },
    password: {
      id: "password",
      label: "Password",
      type: "text",
      placeholder: "Create Password",
      value: "",
      isError: false,
      errorMsg:
        "Password must be at least 8 characters with uppercase, lowercase, number & special character",
    },
    confirmPassword: {
      id: "confirmPassword",
      label: "Confirm Password",
      type: "text",
      placeholder: "Confirm Password...",
      value: "",
      isError: false,
      errorMsg: "Confirm password is required",
      mismatchMsg: "Passwords does not match",
    },
  };

  const [formData, setFormData] = useState(defaultValues);
  const [isPassMatch, setIsPassMatch] = useState(true);
  const [errors, setErrors] = useState([]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleInput = (e) => {
    const key = e.target.id;
    const value = e.target.value;
    setFormData((prev) => {
      let isError = !value; //false hai tho true karo vice versa
      // email verification
      if (key === "email" && value) {
        isError = !emailRegex.test(value);
      }
      // password validation
      if (key === "password" && value) {
        isError = !passwordRegex.test(value);
      }
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          value: value,
          isError: isError,
        },
      };
      //password match
      const pass = key === "password" ? value : updated.password.value;
      const confirmPass =
        key === "confirmPassword" ? value : updated.confirmPassword.value;
      setIsPassMatch(pass === confirmPass);
      setErrors(generateErrors(updated));
      return updated;
    });
  };

  const isValidForm = () => {
    const copyFormData = { ...formData };
    Object.keys(copyFormData).forEach((key) => {
      const obj = copyFormData[key];
      obj.isError = !obj.value;
    });
    setFormData(copyFormData);
    setErrors(generateErrors(copyFormData));
  };

  const generateErrors = (data) => {
    let errorList = [];
    Object.keys(data).forEach((key) => {
      const obj = data[key];
      if (!obj.value) {
        errorList.push(obj.errorMsg);
      }
      // ✅ email regex fail
      else if (key === "email" && !emailRegex.test(obj.value)) {
        errorList.push("Enter a valid email address");
      }
      // 3. PASSWORD (ONLY WHEN VALUE EXISTS)
      else if (key === "password") {
        if (!passwordRegex.test(obj.value)) {
          errorList.push(
            "Password must be at least 8 characters with uppercase, lowercase, number & special character",
          );
        }
      }
    });
    // 5. PASSWORD MATCH (only when both filled)
    if (
      data.password.value &&
      data.confirmPassword.value &&
      data.password.value !== data.confirmPassword.value
    ) {
      errorList.push(data.confirmPassword.mismatchMsg);
    }
    return errorList;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isValidForm();
    console.log(formData);
  };

  return (
    <div className="flex flex-col w-full justify-center items-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-2">From Validation</h1>
      <div className="w-120 items-center border border-gray-300 p-6 shadow-xl outline-none rounded-md">
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="w-full flex flex-col gap-1 "
        >
          {Object.keys(formData).map((key, idx) => {
            const { id, label, type, placeholder, isError, errorMsg, value } =
              formData[key];

            return (
              <div key={idx} className="flex flex-col font-semibold gap-1">
                <label>{label}</label>

                <input
                  onChange={handleInput}
                  id={id}
                  value={value}
                  placeholder={placeholder}
                  type={type}
                  autoComplete={type === "password" ? "new-password" : "off"}
                  className={`w-full h-9 border border-gray-400 pl-2 ${
                    isError && "border-red-400"
                  }`}
                />
              </div>
            );
          })}

          <ul className="mt-1 border-gray-400 text-red-400 list-disc pl-5 space-y-1">
            {errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>

          {/* ✅ button map ke bahar */}
          <button
            type="submit"
            className="mt-3 w-full h-10 bg-blue-400 text-white active:bg-blue-200 cursor-pointer pl-3 outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
