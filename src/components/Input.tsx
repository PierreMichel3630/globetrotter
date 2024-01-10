import { IconButton, InputBase, Paper } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import { SearchResult, SearchResultBlock } from "./SearchResultBlock";

interface PropsBaseInput {
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
}

export const BaseInput = ({ value, clear, onChange }: PropsBaseInput) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: percent(100),
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value !== "" && (
        <IconButton
          type="button"
          size="small"
          aria-label="clear"
          onClick={() => clear()}
        >
          <ClearIcon sx={{ width: 15, height: 15 }} />
        </IconButton>
      )}
    </Paper>
  );
};

interface PropsSearchInput {
  value: string;
  onChange: (value: string) => void;
  submit: () => void;
  clear: () => void;
}

export const SearchInput = ({
  value,
  clear,
  onChange,
  submit,
}: PropsSearchInput) => {
  const { t } = useTranslation();

  return (
    <Paper
      component="form"
      variant="outlined"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: percent(100),
      }}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={t("header.search.input")}
        inputProps={{ "aria-label": t("header.search.input") }}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value !== "" && (
        <IconButton
          type="button"
          size="small"
          aria-label="clear"
          onClick={() => clear()}
        >
          <ClearIcon sx={{ width: 15, height: 15 }} />
        </IconButton>
      )}
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={() => submit()}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

interface PropsBasicSearchInput {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
}

export const BasicSearchInput = ({
  label,
  value,
  clear,
  onChange,
}: PropsBasicSearchInput) => (
  <Paper
    variant="outlined"
    sx={{
      p: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: percent(100),
    }}
  >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder={label ?? ""}
      inputProps={{ "aria-label": label ?? "" }}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    {value !== "" && (
      <IconButton
        type="button"
        size="small"
        aria-label="clear"
        onClick={() => clear()}
      >
        <ClearIcon sx={{ width: 15, height: 15 }} />
      </IconButton>
    )}
  </Paper>
);

interface PropsAutocompleteInput {
  isSelect: boolean;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
  results: Array<SearchResult>;
}
export const AutocompleteInput = ({
  isSelect,
  placeholder,
  value,
  clear,
  onChange,
  results,
}: PropsAutocompleteInput) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const unFocus = () => setFocused(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        unFocus();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <Paper
        elevation={3}
        sx={{
          p: "4px 8px",
          display: "flex",
          alignItems: "center",
          borderRadius: px(50),
        }}
      >
        {isSelect && (
          <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={() => clear()} />
        )}
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          inputProps={{ "aria-label": placeholder }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
        />
        <SearchIcon />
        {value !== "" && (
          <ClearIcon sx={{ cursor: "pointer" }} onClick={() => clear()} />
        )}
      </Paper>
      {results.length > 0 && focused && (
        <SearchResultBlock
          results={results}
          onSelect={() => setFocused(false)}
        />
      )}
    </div>
  );
};
