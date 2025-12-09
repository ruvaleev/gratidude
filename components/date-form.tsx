import { DATE_FORMAT } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedDate } from "@/store/slices/dateSlice";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";

export default function DateForm() {
  const dispatch = useAppDispatch();
  
  const currentSelectedDate = useAppSelector((state) => state.date.selectedDate);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleDatePress = () => {
    if (Platform.OS === 'web') {
      return;
    }
    setIsDatePickerVisible(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate, DATE_FORMAT).format(DATE_FORMAT);
      dispatch(setSelectedDate(formattedDate));
    }
  };

  const handleConfirmDate = () => {
    setIsDatePickerVisible(false);
  };

  const handleCancelDate = () => {
    setIsDatePickerVisible(false);
  };

  const handlePreviousDay = () => {
    const previousDay = moment(currentSelectedDate, DATE_FORMAT).subtract(1, 'day').format(DATE_FORMAT);
    dispatch(setSelectedDate(previousDay));
  };

  const handleNextDay = () => {
    const nextDay = moment(currentSelectedDate, DATE_FORMAT).add(1, 'day').format(DATE_FORMAT);
    dispatch(setSelectedDate(nextDay));
  };

  const isToday = currentSelectedDate === moment().format(DATE_FORMAT);
  
  const formatMonth = (dateString: string) => {
    const date = moment(dateString, DATE_FORMAT);
    return date.format('MMMM D');
  };
  
  return (
    <>
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
                value={moment(currentSelectedDate, DATE_FORMAT).toDate()}
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
      <View style={styles.dateSection}>
        <View style={styles.dateNavigationContainer}>
          <Pressable 
            onPress={handlePreviousDay} 
            style={styles.dateNavButton}
            testID="previousDayButton"
          >
            <Ionicons name="chevron-back" size={20} color="#a8a29e" />
          </Pressable>
          <Pressable onPress={handleDatePress} style={styles.dateTextContainer}>
            <Text style={styles.dateText} testID="currentDate">
              {formatMonth(currentSelectedDate)}
            </Text>
          </Pressable>
          <Pressable 
            onPress={handleNextDay} 
            style={[styles.dateNavButton, isToday && styles.dateNavButtonDisabled]}
            disabled={isToday}
            testID="nextDayButton"
          >
            <Ionicons name="chevron-forward" size={20} color={isToday ? "#d6d3d1" : "#a8a29e"} />
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dateSection: {
    paddingBottom: 32,
    paddingHorizontal: 32,
    paddingTop: 16,
    alignItems: "center",
  },
  dateTextContainer: {
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 18,
    color: "#44403c", // stone-700
    fontWeight: "300",
    letterSpacing: 1,
  },
  dateNavigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
  },
  dateNavButton: {
    padding: 8,
  },
  dateNavButtonDisabled: {
    opacity: 0.5,
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
});
