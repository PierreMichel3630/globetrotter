import { Autocomplete, Box, TextField } from "@mui/material";

import { useState } from "react";
import { useApp } from "src/context/AppProvider";
import { Country } from "src/models/country/Country";
import { sortByName } from "src/utils/sort";
import { JsonLanguageBlock } from "../typography/JsonLanguageBlock";
import { useUser } from "src/context/UserProvider";

interface Props {
  error?: string;
  label?: string;
  placeholder?: string;
  value: Country | null;
  onChange: (value: Country | null) => void;
  onBlur?: () => void;
}
export const AutocompleteCountry = ({
  error,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
}: Props) => {
  const { countries } = useApp();
  const { language } = useUser();
  const [inputValue, setInputValue] = useState("");

  const countriesSort = countries.sort((a, b) => sortByName(language, a, b));
  return (
    <Autocomplete
      id="autocompleteCountry"
      fullWidth
      options={countriesSort}
      autoHighlight
      value={value}
      onChange={(_, newValue: Country | null) => {
        onChange(newValue);
        setInputValue("");
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => (option ? option.name[language.iso] : "")}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
          key={option.id}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={option.flag}
            src={option.flag}
            alt=""
          />
          <JsonLanguageBlock variant="h6" value={option.name} />
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label ?? ""}
          placeholder={placeholder ?? ""}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
          onBlur={onBlur}
          error={error !== undefined}
          helperText={error}
        />
      )}
    />
  );
};
