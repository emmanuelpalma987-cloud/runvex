import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../utils/theme';

interface Props extends TextInputProps {
  label?: string;
  secureEntry?: boolean;
}

export default function RunvexInput({ label, secureEntry, style, ...rest }: Props) {
  const [shown, setShown] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="rgba(255,255,255,0.4)"
          secureTextEntry={secureEntry && !shown}
          {...rest}
        />
        {secureEntry && (
          <TouchableOpacity onPress={() => setShown(s => !s)} style={styles.eye}>
            <Text style={styles.eyeText}>{shown ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  label: {
    fontFamily: FONTS.daysOne,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
    paddingLeft: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    height: 48,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.daysOne,
    fontSize: 16,
    color: COLORS.text,
  },
  eye: {
    padding: 4,
  },
  eyeText: {
    fontSize: 18,
  },
});
