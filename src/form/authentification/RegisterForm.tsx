import { useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signUpWithEmail } from "src/api/supabase";
import { useNavigate } from "react-router-dom";
import { MessageSnackbar } from "src/components/Snackbar";
import { useAuth } from "src/context/AuthProviderSupabase";
import { countUsernameProfile } from "src/api/supabase/profile";

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [errorLogin, setErrorLogin] = useState("");

  const initialValue = {
    email: "",
    username: "",
    password: "",
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("form.register.formatmail"))
      .max(255)
      .required(t("form.register.requiredmail")),
    username: Yup.string()
      .required(t("form.register.requiredusername"))
      .test("isUnique", t("form.register.uniqueusername"), async (value) => {
        const res = await countUsernameProfile(value);
        return res.count === 0;
      }),
    password: Yup.string()
      .min(6, t("form.register.minpassword"))
      .required(t("form.register.requiredpassword")),
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { error } = await signUpWithEmail(
          values.email,
          values.password,
          values.username,
          1
        );
        if (error) {
          setErrorLogin(t("commun.error"));
        } else {
          const {
            data: { user, session },
            error,
          } = await login(values.email, values.password);
          if (error) {
            setErrorLogin(t("commun.error"));
          }
          if (user && session) navigate("/map");
        }
      } catch (err) {
        setErrorLogin(t("commun.error"));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.email && formik.errors.email)}
          >
            <InputLabel htmlFor="register-email-input">
              {t("form.register.email")}
            </InputLabel>
            <OutlinedInput
              id="register-email-input"
              type="email"
              value={formik.values.email}
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.register.email")}
              inputProps={{}}
            />
            {formik.touched.email && formik.errors.email && (
              <FormHelperText error id="register-error-email">
                {formik.errors.email}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.username && formik.errors.username)}
          >
            <InputLabel htmlFor="register-username-input">
              {t("form.register.username")}
            </InputLabel>
            <OutlinedInput
              id="register-username-input"
              type="text"
              value={formik.values.username}
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.register.username")}
              inputProps={{}}
            />
            {formik.touched.username && formik.errors.username && (
              <FormHelperText error id="register-error-username">
                {formik.errors.username}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.password && formik.errors.password)}
          >
            <InputLabel htmlFor="register-password-input">
              {t("form.register.password")}
            </InputLabel>
            <OutlinedInput
              id="register-password-input"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label={t("form.register.password")}
              inputProps={{}}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText error id="register-error-password">
                {formik.errors.password}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {formik.errors.submit && (
          <Grid item xs={12}>
            <FormHelperText error>{formik.errors.submit}</FormHelperText>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            disableElevation
            type="submit"
            fullWidth
            size="large"
            variant="contained"
          >
            {t("form.register.continue")}
          </Button>
        </Grid>
      </Grid>
      <MessageSnackbar
        open={errorLogin !== ""}
        handleClose={() => setErrorLogin("")}
        message={errorLogin}
      />
    </form>
  );
};
