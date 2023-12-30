import {
  AlertColor,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useState } from "react";
import { MessageSnackbar } from "src/components/Snackbar";

export const ForgotPasswordForm = () => {
  const { t } = useTranslation();

  const { passwordReset } = useAuth();

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const initialValue = {
    email: "",
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("form.forgotpassword.formatmail"))
      .max(255)
      .required(t("form.forgotpassword.requiredmail")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { error } = await passwordReset(values.email);
        if (error) {
          setMessage(
            error.name === "AuthApiError"
              ? t("form.forgotpassword.limitsendemail")
              : t("commun.error")
          );
          setSeverity("error");
        } else {
          setMessage(t("form.forgotpassword.successsendmail"));
          setSeverity("success");
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.email && formik.errors.email)}
          >
            <InputLabel htmlFor="login-email-input">
              {t("form.login.email")}
            </InputLabel>
            <OutlinedInput
              id="login-email-input"
              type="email"
              value={formik.values.email}
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.login.email")}
              inputProps={{}}
            />
            {formik.touched.email && formik.errors.email && (
              <FormHelperText error id="login-error-email">
                {formik.errors.email}
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
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            {t("form.forgotpassword.continue")}
          </Button>
        </Grid>
      </Grid>
      <MessageSnackbar
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
        severity={severity}
      />
    </form>
  );
};
