// src/components/TagFilter.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "../theme/colors";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onToggleTag,
}) => {
  if (tags.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filter by opponent:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsScroll}
      >
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, isSelected && styles.tagSelected]}
              onPress={() => onToggleTag(tag)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 10,
  },
  tagsScroll: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  tagSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  tagText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  tagTextSelected: {
    color: colors.background,
    fontWeight: "600",
  },
});
