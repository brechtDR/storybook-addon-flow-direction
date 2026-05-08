import { PHYSICAL_PROPERTY_MAP } from './property-map';

function directionalSuggestionFromValue(
  property: string,
  value: string,
  fallbackMap: Record<string, string>,
): string | null {
  const mapped = fallbackMap[value];
  if (!mapped) {
    return null;
  }
  return `${property}: ${mapped}`;
}

function scrollSnapTypeSuggestion(value: string): string | null {
  const axisMap: Record<string, string> = {
    x: 'inline',
    y: 'block',
  };

  const tokens = value.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return null;
  }

  let hasAxisToken = false;
  const mappedTokens = tokens.map((token) => {
    const normalized = token.toLowerCase();
    const mapped = axisMap[normalized];
    if (!mapped) {
      return normalized;
    }
    hasAxisToken = true;
    return mapped;
  });

  if (!hasAxisToken) {
    return null;
  }

  return `scroll-snap-type: ${mappedTokens.join(' ')}`;
}

function axisPairSuggestion(property: 'overflow' | 'overscroll-behavior', value: string): string | null {
  const tokens = value.split(/\s+/).filter(Boolean);
  if (tokens.length !== 2) {
    return null;
  }
  return `${property}-inline: ${tokens[0]}; ${property}-block: ${tokens[1]}`;
}

export function getLogicalSuggestion(property: string, value: string): string | null {
  const normalizedProperty = property.toLowerCase();
  const normalizedValue = value.trim().toLowerCase();
  const mappedProperty = PHYSICAL_PROPERTY_MAP[normalizedProperty];

  if (mappedProperty) {
    return mappedProperty;
  }

  if (normalizedProperty === 'text-align') {
    if (normalizedValue === 'left') {
      return 'text-align: start';
    }
    if (normalizedValue === 'right') {
      return 'text-align: end';
    }
  }

  if (normalizedProperty === 'float' || normalizedProperty === 'clear') {
    return directionalSuggestionFromValue(normalizedProperty, normalizedValue, {
      left: 'inline-start',
      right: 'inline-end',
    });
  }

  if (normalizedProperty === 'resize') {
    return directionalSuggestionFromValue(normalizedProperty, normalizedValue, {
      horizontal: 'inline',
      vertical: 'block',
    });
  }

  if (normalizedProperty === 'scroll-snap-type') {
    return scrollSnapTypeSuggestion(normalizedValue);
  }

  if (normalizedProperty === 'overflow') {
    return axisPairSuggestion('overflow', normalizedValue);
  }

  if (normalizedProperty === 'overscroll-behavior') {
    return axisPairSuggestion('overscroll-behavior', normalizedValue);
  }

  return null;
}
