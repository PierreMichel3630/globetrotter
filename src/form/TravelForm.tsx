import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { DateField } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { insertCountryTravel, insertTravel } from "src/api/globetrotter";
import { MessageSnackbar } from "src/components/Snackbar";
import { AutocompleteCountry } from "src/components/input/AutocompleteCountry";
import { useApp } from "src/context/AppProvider";
import { CountryTravelInsert } from "src/models/CountryTravel";
import { TravelInsert } from "src/models/Travel";
import { Country } from "src/models/country/Country";
import * as Yup from "yup";

interface CountryTravelForm {
  country: Country | null;
  startdate: Date | null;
  enddate: Date | null;
}

interface Props {
  onValid: () => void;
}
export const TravelForm = ({ onValid }: Props) => {
  const { t } = useTranslation();
  const { addTravel } = useApp();

  const [message, setMessage] = useState("");

  const initialValue: {
    name: string;
    countries: Array<CountryTravelForm>;
  } = {
    name: "",
    countries: [{ country: null, startdate: null, enddate: null }],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.mixed().required(t("form.createtravel.requiredname")),
    countries: Yup.array().of(
      Yup.object().shape({
        country: Yup.mixed()
          .required(t("form.createtravel.typeerrorcountry"))
          .typeError(t("form.createtravel.typeerrorcountry")),
        startdate: Yup.date()
          .required(t("form.createtravel.requiredstartdate"))
          .typeError(t("form.createtravel.typeerrordate")),
        enddate: Yup.date()
          .required(t("form.createtravel.requiredenddate"))
          .typeError(t("form.createtravel.typeerrordate")),
      })
    ),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const travelInsert: TravelInsert = {
          name: values.name,
          enddate: null,
          startdate: null,
        };
        insertTravel(travelInsert).then((res) => {
          const travel = res.data;
          if (travel !== null) {
            const promises = values.countries.map((country) => {
              const countryInsert: CountryTravelInsert = {
                country: country.country!.id,
                travel: travel.id,
                startdate: country.startdate,
                enddate: country.enddate,
              };
              return insertCountryTravel(countryInsert);
            });
            Promise.all(promises).then(() => {
              addTravel();
              onValid();
            });
          } else {
            setMessage(t("commun.error"));
          }
        });
      } catch (err) {
        setMessage(t("commun.error"));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.name && formik.errors.name)}
          >
            <InputLabel htmlFor="name-input">
              {t("form.createtravel.name")}
            </InputLabel>
            <OutlinedInput
              id="name-input"
              type="name"
              value={formik.values.name}
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createtravel.name")}
              inputProps={{}}
            />
            {formik.touched.name && formik.errors.name && (
              <FormHelperText error id="error-name">
                {formik.errors.name}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {formik.values.countries.map((country, index) => {
          const touched =
            formik.touched &&
            formik.touched.countries &&
            formik.touched.countries[index]
              ? (formik.touched.countries![index] as {
                  country?: boolean;
                  startdate?: boolean;
                  enddate?: boolean;
                })
              : {};
          const errors =
            formik.errors &&
            formik.errors.countries &&
            formik.errors.countries[index]
              ? (formik.errors.countries![index] as {
                  country?: string;
                  startdate?: string;
                  enddate?: string;
                })
              : {
                  country: undefined,
                  startdate: undefined,
                  enddate: undefined,
                };

          return (
            <Fragment key={index}>
              {formik.values.countries.length > 1 && (
                <Grid item xs={12}>
                  <Divider>
                    {t("commun.country")} {index + 1}
                  </Divider>
                </Grid>
              )}
              <Grid item xs={12}>
                <AutocompleteCountry
                  label={t("form.createtravel.country")}
                  value={country.country}
                  onChange={(value) => {
                    formik.setFieldValue(
                      `countries[${index}].country`,
                      value,
                      true
                    );
                  }}
                  onBlur={() =>
                    formik.setFieldTouched(`countries[${index}].country`)
                  }
                  error={touched.country ? errors.country : undefined}
                />
              </Grid>
              <Grid item xs={12}>
                <DateField
                  label={t("form.createtravel.startdate")}
                  value={country.startdate}
                  onChange={(value) => {
                    formik.setFieldValue(
                      `countries[${index}].startdate`,
                      value
                    );
                  }}
                  onBlur={() =>
                    formik.setFieldTouched(`countries[${index}].startdate`)
                  }
                  fullWidth
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      error:
                        touched.startdate !== undefined &&
                        Boolean(errors.startdate),
                      helperText: touched.startdate && errors.startdate,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <DateField
                  label={t("form.createtravel.enddate")}
                  value={country.enddate}
                  onChange={(value) => {
                    formik.setFieldValue(`countries[${index}].enddate`, value);
                  }}
                  onBlur={() =>
                    formik.setFieldTouched(`countries[${index}].enddate`)
                  }
                  fullWidth
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      error:
                        touched.enddate !== undefined &&
                        Boolean(errors.enddate),
                      helperText: touched.enddate && errors.enddate,
                    },
                  }}
                />
              </Grid>
              {formik.values.countries.length > 1 && (
                <Grid item xs={12}>
                  <Button
                    disableElevation
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      const newValue = [...formik.values.countries];
                      newValue.splice(index, 1);
                      formik.setFieldValue("countries", newValue);
                    }}
                  >
                    {t("commun.delete")}
                  </Button>
                </Grid>
              )}
            </Fragment>
          );
        })}
        <Grid item xs={12}>
          <Button
            disableElevation
            fullWidth
            variant="contained"
            color="success"
            onClick={() => {
              formik.setFieldValue("countries", [
                ...formik.values.countries,
                { country: null, startdate: null, enddate: null },
              ]);
            }}
          >
            {t("commun.addcountry")}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            disableElevation
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
          >
            {t("commun.validate")}
          </Button>
        </Grid>
      </Grid>
      <MessageSnackbar
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
      />
    </form>
  );
};
