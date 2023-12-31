import { Autocomplete, Box, TextField } from "@mui/material";

import { useState } from "react";
import { useApp } from "src/context/AppProvider";
import { Country } from "src/models/country/Country";
import { sortByName } from "src/utils/sort";

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
  const [inputValue, setInputValue] = useState("");

  const countriesSort = countries.sort(sortByName);
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
      getOptionLabel={(option) => (option ? option.name.fra : "")}
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
          {option.name.fra}
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
