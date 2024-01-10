import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { insertReport } from "src/api/supabase/report";
import { useMessage } from "src/context/MessageProvider";
import { ReportInsert } from "src/models/Report";
import * as Yup from "yup";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  onValid: () => void;
}
export const ReportForm = ({ onValid }: Props) => {
  const { t } = useTranslation();

  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    type: number;
    message: string;
  } = {
    type: 0,
    message: "",
  };

  const validationSchema = Yup.object().shape({
    type: Yup.number().required(t("form.report.requiredtype")),
    message: Yup.string().required(t("form.report.requiredmessage")),
  });

  const types = [
    {
      value: 0,
      label: t("form.report.typeerrortechnique"),
    },
    {
      value: 1,
      label: t("form.report.typeerrortraduction"),
    },
    {
      value: 2,
      label: t("form.report.typeerrorinformation"),
    },
    {
      value: 3,
      label: t("form.report.typeevolution"),
    },
    {
      value: 4,
      label: t("form.report.typeother"),
    },
  ];

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const reportInsert: ReportInsert = {
          type: types[values.type].label,
          message: values.message,
        };
        insertReport(reportInsert).then((res) => {
          if (res.data !== null) {
            onValid();
          } else {
            setSeverity("error");
            setMessage(t("commun.error"));
          }
        });
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });
  console.log(formik.errors);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.type && formik.errors.type)}
          >
            <TextField
              id="type-input"
              select
              value={formik.values.type}
              name="type"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.report.type")}
            >
              {types.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {formik.touched.type && formik.errors.type && (
              <FormHelperText error id="error-type">
                {formik.errors.type}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.message && formik.errors.message)}
          >
            <InputLabel htmlFor="message-input">
              {t("form.report.message")}
            </InputLabel>
            <OutlinedInput
              id="message-input"
              value={formik.values.message}
              name="message"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.report.message")}
              inputProps={{}}
              multiline
              maxRows={5}
              minRows={5}
            />
            {formik.touched.message && formik.errors.message && (
              <FormHelperText error id="error-message">
                {formik.errors.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            disableElevation
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
          >
            {t("commun.validate")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
