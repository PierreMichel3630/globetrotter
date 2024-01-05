import { Typography, TypographyProps } from "@mui/material";
import { useUser } from "src/context/UserProvider";
import { JsonLanguage } from "src/models/Language";

interface Props extends TypographyProps {
  value: JsonLanguage;
}
export const JsonLanguageBlock = ({ value, ...props }: Props) => {
  const { language } = useUser();
  const label = value[language.iso] ? value[language.iso] : value.fra;
  return <Typography {...props}>{label}</Typography>;
};

interface PropsArray extends TypographyProps {
  value: Array<JsonLanguage>;
}
export const JsonLanguageArrayBlock = ({ value, ...props }: PropsArray) => {
  const { language } = useUser();
  return (
    <Typography {...props}>
      {value
        .map((el) => {
          const label = el[language.iso] ? el[language.iso] : el.fra;
          return label;
        })
        .join(", ")}
    </Typography>
  );
};
