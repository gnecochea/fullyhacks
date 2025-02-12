"use client";

import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Loading from "@/components/loading";
import SchoolSuggestion from "./school-suggestion";
import { useRouter } from "next/navigation";
import { applicationSchema } from "@/schemas/application";

interface ApplicationState {
  name: string;
  email?: string;
  preferredEmail: string;
  pronouns: string;
  school: string;
  phone: string;
  major: string;
  gradYear: string;
  education: string;
  skill: string;
  response: string;
  food: string;
  agree: boolean;
}

interface FormAction {
  type: string;
  payload?: any;
}

// Reuse existing application schema from /schemas
// and include additional fields
const schema = applicationSchema.concat(
  yup.object({
    over18: yup.bool().oneOf([true], "You must be 18 or older!"),
    waiver: yup.bool().oneOf([true], "You must agree to the waiver!")
  })
);

type FormData = yup.InferType<typeof schema>;

const initialState: ApplicationState = {
  name: "",
  email: "",
  preferredEmail: "",
  pronouns: "she/her",
  school: "",
  phone: "",
  major: "",
  gradYear: "2023",
  education: "Bachelor",
  skill: "0",
  response: "",
  food: "Vegan",
  agree: false
};

const reducer = (
  state: ApplicationState,
  action: FormAction
): ApplicationState => {
  switch (action.type) {
    case "SAVE_DRAFT":
      const { name, value } = action.payload;
      localStorage.setItem(name, value);
      return { ...state, [name]: value };
    case "LOAD_DRAFT":
      const data = localStorage.getItem("formData");
      if (data) {
        const parsedData = JSON.parse(data);
        return {
          ...state,
          ...parsedData
        };
      }
      return state;
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_SCHOOL":
      return { ...state, school: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PREFERRED_EMAIL":
      return { ...state, preferredEmail: action.payload };
    case "SET_PRONOUNS":
      return { ...state, pronouns: action.payload };
    case "SET_PHONE":
      return { ...state, phone: action.payload };
    case "SET_MAJOR":
      return { ...state, major: action.payload };
    case "SET_GRADYEAR":
      return { ...state, gradYear: action.payload };
    case "SET_EDUCATION":
      return { ...state, education: action.payload };
    case "SET_SKILL":
      return { ...state, skill: action.payload };
    case "SET_RESPONSE":
      return { ...state, response: action.payload };
    case "SET_FOOD":
      return { ...state, food: action.payload };
    case "SET_AGREE":
      return { ...state, agree: action.payload };
    default:
      return state;
  }
};

interface ApplicationProps {
  url: string;
}

const ApplicationForm: React.FC<ApplicationProps> = (props) => {
  const { url } = props;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [foodState, setFood] = useState("");
  const userId = url?.split("/").pop()?.split("?")[0] || "";
  const [application, dispatch] = useReducer(
    reducer,
    initialState,
    (initialState: ApplicationState) => {
      const persistedState: any = { ...initialState } as ApplicationState;
      if (typeof localStorage !== "undefined") {
        Object.entries(initialState).forEach(([key, value]) => {
          const persistedValue = localStorage.getItem(key);
          if (persistedValue) {
            persistedState[key as keyof ApplicationState] = persistedValue;
          }
        });
      }
      return persistedState;
    }
  );
  const [githubLogin, setGithub] = useState("");
  const [isLoading, setLoading] = useState(false);
  const wordCount = application.response.trim().split(/\s+/).length;
  useEffect(() => {
    const getGithubLogin = async () => {
      const res = await axios.get(`https://api.github.com/user/${userId}`);
      setGithub(res.data.login);
    };
    for (let key in initialState) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        dispatch({
          type: "SAVE_DRAFT",
          payload: { name: key, value: value }
        });
      }
    }
    getGithubLogin();
  }, [userId]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (application.food == "other") {
        application.food = foodState;
      }
      const newApplication = {
        ...application,
        gradYear: parseInt(application.gradYear),
        skill: parseInt(application.skill),
        github: githubLogin
      };
      await axios.post("/api/application", newApplication);
      setLoading(false);
      router.push("/portal");
    } catch (error) {
      setLoading(false);
      router.push("/error");
    }
  };

  return (
    <>
      <form className="md:w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="my-10 flex flex-col">
          <p className="font-medium">Full name</p>
          <input
            {...register("name")}
            name="name"
            value={application.name}
            onChange={(e) => {
              dispatch({
                type: "SAVE_DRAFT",
                payload: { name: "name", value: e.target.value }
              });
              dispatch({ type: "SET_NAME", payload: e.target.value });
            }}
            className={`form-input ${errors.name ? "error-form" : ""}`}
            type="text"
            placeholder="John Doe"
          />
          <p className="error-msg">{errors.name?.message}</p>
          <p className="font-medium">School email (optional)</p>
          <input
            {...register("email")}
            name="email"
            value={application.email}
            onChange={(e) => {
              dispatch({
                type: "SAVE_DRAFT",
                payload: { name: "email", value: e.target.value }
              });
              dispatch({ type: "SET_EMAIL", payload: e.target.value });
            }}
            className={`form-input ${errors.email ? "error-form" : ""}`}
            type="text"
            placeholder="jdoe@csu.fullerton.edu"
          />
          <p className="error-msg">{errors.email?.message}</p>
          <p className="font-medium">Preferred email</p>
          <input
            {...register("preferredEmail")}
            name="preferredEmail"
            value={application.preferredEmail}
            onChange={(e) => {
              dispatch({
                type: "SAVE_DRAFT",
                payload: { name: "preferredEmail", value: e.target.value }
              });
              dispatch({
                type: "SET_PREFERRED_EMAIL",
                payload: e.target.value
              });
            }}
            className={`form-input ${
              errors.preferredEmail ? "error-form" : ""
            }`}
            type="text"
            placeholder="john-doe@gmail.com"
          />
          <p className="error-msg">{errors.preferredEmail?.message}</p>
          <p className="font-medium">School</p>
          <SchoolSuggestion
            register={register}
            errors={errors}
            dispatch={dispatch}
            application={application}
            setValue={setValue}
          />
          <p className="error-msg">{errors.school?.message}</p>
          <p className="font-medium">Github</p>
          <input
            className="form-input"
            disabled
            type="text"
            value={githubLogin}
          />
          <p className="font-medium">Pronouns</p>
          <select
            onChange={(e) => {
              dispatch({ type: "SET_PRONOUNS", payload: e.target.value });
              dispatch({
                type: "SAVE_DRAFT",
                payload: { name: "pronouns", value: e.target.value }
              });
            }}
            name="pronouns"
            value={application.pronouns}
            className="form-input">
            <option className="form-option" value="she/her">
              she/her
            </option>
            <option className="form-option" value="he/him">
              he/him
            </option>
            <option className="form-option" value="they/them">
              they/them
            </option>
            <option className="form-option" value="other">
              other
            </option>
          </select>
          <p className="font-medium">Phone number</p>
          <input
            {...register("phone")}
            name="phone"
            value={application.phone}
            onChange={(e) => {
              dispatch({ type: "SET_PHONE", payload: e.target.value });
              dispatch({
                type: "SAVE_DRAFT",
                payload: { name: "phone", value: e.target.value }
              });
            }}
            className={`form-input ${errors.phone ? "error-form" : ""}`}
            type="text"
            placeholder="000-111-2222"
          />
          <p className="error-msg">{errors.phone?.message}</p>
          <p className="font-medium">Major</p>
          <input
            {...register("major")}
            name="major"
            value={application.major}
            onChange={(e) => {
              dispatch({ type: "SET_MAJOR", payload: e.target.value });
              dispatch({
                type: "SAVE_DRAFT",
                payload: { name: "major", value: e.target.value }
              });
            }}
            className={`form-input ${errors.major ? "error-form" : ""}`}
            type="text"
            placeholder="Computer Science"
          />
          <p className="error-msg">{errors.major?.message}</p>
          <p className="font-medium">Graduation year</p>
          <input
            {...register("gradYear")}
            name="gradYear"
            value={application.gradYear}
            onChange={(e) => {
              dispatch({ type: "SET_GRADYEAR", payload: e.target.value });
              dispatch({
                type: "SAVE_DRAFT",
                payload: { name: "gradYear", value: e.target.value }
              });
            }}
            className={`form-input ${errors.gradYear ? "error-form" : ""}`}
            type="text"
            placeholder="2025"
          />
          <p className="error-msg">{errors.gradYear?.message}</p>
          <p className="font-medium">Education level</p>
          <select
            onChange={(e) => {
              dispatch({ type: "SET_EDUCATION", payload: e.target.value });
              dispatch({
                type: "SAVE_DRAFT",
                payload: { name: "education", value: e.target.value }
              });
            }}
            value={application.education}
            name="education"
            className="form-input">
            <option className="form-option" value="Bachelor">
              Bachelor
            </option>
            <option className="form-option" value="Master">
              Master
            </option>
          </select>
          <p className="font-medium">Skill level</p>
          <select
            name="skill"
            value={application.skill}
            onChange={(e) => {
              dispatch({
                type: "SET_SKILL",
                payload: parseInt(e.target.value)
              });
              dispatch({
                type: "SAVE_DRAFT",
                payload: { name: "skill", value: e.target.value }
              });
            }}
            className="form-input">
            <option className="form-option" value={1}>
              No experience
            </option>
            <option className="form-option" value={2}>
              Beginner
            </option>
            <option className="form-option" value={3}>
              Intermediate
            </option>
            <option className="form-option" value={4}>
              Master
            </option>
          </select>
          <p className="font-medium">Why do you want to attend FullyHacks?</p>
          <div className="relative flex flex-col">
            <textarea
              {...register("response")}
              value={application.response}
              name="response"
              className={`form-input h-[300px] resize-none ${
                errors.response ? "error-form" : ""
              }`}
              onChange={(e) => {
                dispatch({ type: "SET_RESPONSE", payload: e.target.value });
                dispatch({
                  type: "SAVE_DRAFT",
                  payload: { name: "response", value: e.target.value }
                });
              }}
              placeholder="50-500 words"
            />
            <p className="absolute bottom-8 right-4">{wordCount} words</p>
            <p className="error-msg">{errors.response?.message}</p>
          </div>
          <p className="font-medium">Food choice</p>
          <select
            name="food"
            value={application.food}
            onChange={(e) => {
              dispatch({ type: "SET_FOOD", payload: e.target.value });
            }}
            className="form-input">
            <option className="form-option" value="vegan">
              Vegan
            </option>
            <option className="form-option" value="non-veg">
              Non-veg
            </option>
            <option className="form-option" value="vegetarian">
              Vegetarian
            </option>
            <option className="form-option" value="other">
              Other
            </option>
          </select>
          <p className="font-medium">
            If you choose <span className="font-semibold">other</span>, please
            specify or N/A
          </p>
          <input
            name="food"
            value={foodState}
            onChange={(e) => {
              setFood(e.target.value);
            }}
            className="form-input"
            type="text"
            placeholder="non-dairy,..."
          />
          <div className="mt-4 flex flex-col gap-4">
            <p>
              Because of limitations imposed by CSUF, we are legally not allowed
              to host minors (those under 18) for Fullyhacks 2024. By checking
              the box, you affirm that you are and will be 18 years or older by
              February 24th, 2024.{" "}
            </p>
            <p className="font-medium text-white">
              We will be checking School ID. If you are a minor, you won&apos;t
              be allowed to attend.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <input
              {...register("over18")}
              name="over18"
              onChange={(e) => {
                dispatch({ type: "SET_AGREE", payload: e.target.checked });
              }}
              type="checkbox"
              className="checkbox bg-[#F587FF]"
            />
            <p className="font-medium">
              I&apos;m 18 or older by February 24th, 2024
            </p>
          </div>
          <p className="error-msg">{errors.over18?.message}</p>
          <div className="mt-4 flex items-center gap-4">
            <input
              {...register("waiver")}
              name="waiver"
              onChange={(e) => {
                dispatch({ type: "SET_AGREE", payload: e.target.checked });
              }}
              type="checkbox"
              className="checkbox bg-[#F587FF]"
            />
            <p className="font-medium">
              I agree to
              <a className="font-semibold" target="_blank" href="/waiver">
                {" the terms of the waiver"}
              </a>
            </p>
          </div>
          <p className="error-msg">{errors.waiver?.message}</p>
          {isLoading ? (
            <button className="mt-8 mr-auto flex w-[100px] justify-center rounded-md bg-[#E149A9] p-2 font-semibold hover:bg-[#ac307e] hover:duration-200 hover:ease-in-out">
              <Loading isLoading={isLoading} />
            </button>
          ) : (
            <button className="mt-8 mr-auto w-[100px] rounded-md bg-[#E149A9] p-2 font-semibold text-white hover:bg-[#ac307e] hover:duration-200 hover:ease-in-out md:text-md">
              Submit
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default ApplicationForm;
