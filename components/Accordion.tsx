import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface AccordionProps {
  title: string;
  initiallyOpen?: boolean;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  initiallyOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <View className="rounded-2xl border border-[#E1E4EB] bg-white">
      <TouchableOpacity
        onPress={() => setOpen((prev) => !prev)}
        className="flex-row items-center justify-between px-4 py-4"
      >
        <Text className="text-base font-semibold text-[#1A201D]">{title}</Text>
        <Text className="text-lg text-[#6C7280]">{open ? '˄' : '˅'}</Text>
      </TouchableOpacity>
      {open && <View className="border-t border-[#E1E4EB] px-4 py-4">{children}</View>}
    </View>
  );
};
