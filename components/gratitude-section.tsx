import "@/i18n";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import selectGratitudesByDate from "@/store/selectors/selectGratitudesByDate";
import { addGratitude } from "@/store/slices/gratitudesSlice";
import { useTranslation } from "react-i18next";
import Section from "./section";

export default function GratitudeSection() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const currentSelectedDate = useAppSelector((state) => state.date.selectedDate);
  const gratitudes = useAppSelector((state) => selectGratitudesByDate(state, currentSelectedDate));

  const handleGratitudeSubmit = (value: string) => {
    dispatch(addGratitude({ date: currentSelectedDate, text: value }))
  };
  
  return (
    <Section
      title={t("index.gratitudeTitle")}
      items={gratitudes}
      sectionId="gratitudes"
      onSubmit={handleGratitudeSubmit}
      buttonText={t("index.thank")}
    />
  );
}
