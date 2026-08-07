import "@/i18n";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import selectPraisesByDate from "@/store/selectors/selectPraisesByDate";
import { addPraise } from "@/store/slices/praisesSlice";
import { useTranslation } from "react-i18next";
import Section from "./section";

export default function PraisesSection({
  onFieldFocus,
}: {
  onFieldFocus?: (offsetY: number) => void;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const currentSelectedDate = useAppSelector((state) => state.date.selectedDate);
  const praises = useAppSelector((state) => selectPraisesByDate(state, currentSelectedDate));

  const handlePraiseSubmit = (value: string) => {
    dispatch(addPraise({ date: currentSelectedDate, text: value }));
  };
  
  return (
    <Section
      title={t("index.praiseTitle")}
      items={praises}
      sectionId="praises"
      onSubmit={handlePraiseSubmit}
      buttonText={t("index.praise")}
      onFieldFocus={onFieldFocus}
    />
  );
}
