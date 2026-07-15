import { Platform, ScrollView, ScrollViewProps } from 'react-native';

type Props = ScrollViewProps;

let KeyboardAwareScrollView: any = null;
try { KeyboardAwareScrollView = require('react-native-keyboard-controller').KeyboardAwareScrollView; } catch {}

const hasKeyboardController = KeyboardAwareScrollView !== null;

export function KeyboardAwareScrollViewCompat({
  children,
  keyboardShouldPersistTaps = 'handled',
  ...props
}: Props) {
  if (Platform.OS === 'web' || !hasKeyboardController) {
    return (
      <ScrollView
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
