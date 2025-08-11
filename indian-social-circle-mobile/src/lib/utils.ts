import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type StyleValue = ViewStyle | TextStyle | ImageStyle | undefined | null | false;
type StyleArray = (StyleValue | StyleValue[])[];

/**
 * React Native compatible style merging utility
 * Merges multiple styles into a single style object
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <View style={cn(styles.container, styles.card)} />
 * 
 * // Conditional styling
 * <View style={cn(styles.container, isActive && styles.active)} />
 * 
 * // Multiple conditionals
 * <View style={cn(
 *   styles.base,
 *   isActive && styles.active,
 *   isDisabled && styles.disabled
 * )} />
 * ```
 */
export function cn(...styles: StyleArray): ViewStyle | TextStyle | ImageStyle {
  const mergedStyle: any = {};
  
  const flattenStyles = (styleArray: StyleArray): StyleValue[] => {
    const flat: StyleValue[] = [];
    
    for (const item of styleArray) {
      if (Array.isArray(item)) {
        flat.push(...flattenStyles(item));
      } else if (item) {
        flat.push(item);
      }
    }
    
    return flat;
  };
  
  const flatStyles = flattenStyles(styles);
  
  // Merge all styles, later styles override earlier ones
  for (const style of flatStyles) {
    if (style && typeof style === 'object') {
      Object.assign(mergedStyle, style);
    }
  }
  
  return mergedStyle;
}

/**
 * Utility to combine multiple styles into an array for the style prop
 * Useful when you need to pass an array of styles
 * 
 * @example
 * ```tsx
 * // Array-based styling
 * <View style={cnArray(styles.container, isActive && styles.active)} />
 * 
 * // With existing arrays
 * <View style={cnArray(styles.base, [styles.item, isActive && styles.active])} />
 * ```
 */
export function cnArray(...styles: StyleArray): (ViewStyle | TextStyle | ImageStyle)[] {
  const flattenStyles = (styleArray: StyleArray): StyleValue[] => {
    const flat: StyleValue[] = [];
    
    for (const item of styleArray) {
      if (Array.isArray(item)) {
        flat.push(...flattenStyles(item));
      } else if (item) {
        flat.push(item);
      }
    }
    
    return flat;
  };
  
  return flattenStyles(styles).filter(Boolean) as (ViewStyle | TextStyle | ImageStyle)[];
}

/**
 * Utility to conditionally apply styles based on a conditions object
 * 
 * @example
 * ```tsx
 * <View style={conditionalStyle(styles.base, {
 *   [styles.active]: isActive,
 *   [styles.disabled]: isDisabled,
 *   [styles.highlighted]: isHighlighted
 * })} />
 * ```
 */
export function conditionalStyle(
  baseStyle: ViewStyle | TextStyle | ImageStyle,
  conditionals: Record<string, boolean>
): ViewStyle | TextStyle | ImageStyle {
  const finalStyle = { ...baseStyle };
  
  for (const [style, condition] of Object.entries(conditionals)) {
    if (condition && typeof style === 'object') {
      Object.assign(finalStyle, style);
    }
  }
  
  return finalStyle;
}

/**
 * Legacy function for backward compatibility with web-based className approach
 * Returns an empty string since React Native doesn't use className
 */
export function className(...inputs: any[]): string {
  return '';
}