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
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail } from "src/api/supabase";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setMessage, setSeverity } = useMessage();

  const initialValue = {
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("form.register.formatmail"))
      .max(255)
      .required(t("form.register.requiredmail")),
    firstname: Yup.string().required(t("form.register.requiredfirstname")),
    lastname: Yup.string().required(t("form.register.requiredlastname")),
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
          values.firstname,
          values.lastname,
          1
        );
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          const {
            data: { user, session },
            error,
          } = await login(values.email, values.password);
          if (error) {
            setSeverity("error");
            setMessage(t("commun.error"));
          }
          if (user && session) navigate("/origincountry");
        }
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
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
        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.firstname && formik.errors.firstname)}
          >
            <InputLabel htmlFor="register-firstname-input">
              {t("form.register.firstname")}
            </InputLabel>
            <OutlinedInput
              id="register-firstname-input"
              type="text"
              value={formik.values.firstname}
              name="firstname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.register.firstname")}
              inputProps={{}}
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <FormHelperText error id="register-error-firstname">
                {formik.errors.firstname}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.lastname && formik.errors.lastname)}
          >
            <InputLabel htmlFor="register-lastname-input">
              {t("form.register.lastname")}
            </InputLabel>
            <OutlinedInput
              id="register-lastname-input"
              type="text"
              value={formik.values.lastname}
              name="lastname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.register.lastname")}
              inputProps={{}}
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <FormHelperText error id="register-error-lastname">
                {formik.errors.lastname}
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
    </form>
  );
};
