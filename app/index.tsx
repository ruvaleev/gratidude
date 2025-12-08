import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import "../i18n";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSelectedDate } from "../store/slices/dateSlice";
import { addGratitude } from "../store/slices/gratitudesSlice";
import { addPraise } from "../store/slices/praisesSlice";

export default function Index() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const gratitudes = useAppSelector((state) => state.gratitudes.items);
  const praises = useAppSelector((state) => state.praises.items);
  const selectedDateISO = useAppSelector((state) => state.date.selectedDate);
  
  const [gratitudeText, setGratitudeText] = useState("");
  const [praiseText, setPraiseText] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(selectedDateISO));

  const handleGratitudeSubmit = () => {
    if (gratitudeText.trim()) {
      dispatch(addGratitude(gratitudeText));
      setGratitudeText("");
    }
  };

  const handlePraiseSubmit = () => {
    if (praiseText.trim()) {
      dispatch(addPraise(praiseText));
      setPraiseText("");
    }
  };

  const handleDatePress = () => {
    setTempDate(new Date(selectedDateISO));
    setIsDatePickerVisible(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirmDate = () => {
    dispatch(setSelectedDate(tempDate.toISOString()));
    setIsDatePickerVisible(false);
  };

  const handleCancelDate = () => {
    setIsDatePickerVisible(false);
  };

  const selectedDate = new Date(selectedDateISO);
  const formattedDate = selectedDate.toLocaleDateString();
  
  return (
    <View style={styles.container}>
      <Pressable onPress={handleDatePress} style={styles.dateContainer}>
        <Text style={styles.dateText} testID="currentDate">
          {formattedDate}
        </Text>
      </Pressable>

      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelDate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerTitle}>Select Date</Text>
            
            <View testID="datePicker">
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCancelDate}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleConfirmDate}
                testID="confirmDateButton"
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("index.gratitudePlaceholder")}
          value={gratitudeText}
          onChangeText={setGratitudeText}
        />
        <Pressable style={styles.button} onPress={handleGratitudeSubmit}>
          <Text style={styles.buttonText}>{t("index.gratitudeSubmitButton")}</Text>
        </Pressable>
      </View>

      <View style={styles.gratitudesList} testID="gratitudesList">
        {gratitudes.map((gratitude, index) => (
          <Text key={index} style={styles.gratitudeItem}>
            {gratitude}
          </Text>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("index.praisePlaceholder")}
          value={praiseText}
          onChangeText={setPraiseText}
        />
        <Pressable style={[styles.button, styles.praiseButton]} onPress={handlePraiseSubmit}>
          <Text style={styles.buttonText}>{t("index.praiseSubmitButton")}</Text>
        </Pressable>
      </View>

      <View style={styles.praisesList} testID="praisesList">
        {praises.map((praise, index) => (
          <Text key={index} style={styles.praiseItem}>
            {praise}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  dateContainer: {
    alignItems: "center",
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  datePickerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  confirmButton: {
    backgroundColor: "#34C759",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  praiseButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  gratitudesList: {
    marginBottom: 20,
  },
  gratitudeItem: {
    fontSize: 16,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  praisesList: {
    marginBottom: 20,
  },
  praiseItem: {
    fontSize: 16,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
  },
});
