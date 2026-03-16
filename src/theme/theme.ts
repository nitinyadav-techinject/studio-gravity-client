import { colors } from './colors';
import { typography } from './typography';

export const theme = {
    colors,
    typography,
    spacing: {
        container: '2rem',
        sidebar: '280px',
        topbar: '64px',
    },
    borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
    },
};

export type Theme = typeof theme;

/**
 * Injects theme values into CSS variables.
 * This allows Tailwind and other CSS to use the values dynamically.
 */
export const injectTheme = () => {
    const root = document.documentElement;

    // Colors
    Object.entries(theme.colors).forEach(([category, values]) => {
        if (typeof values === 'string') {
            root.style.setProperty(`--${category}`, values);
        } else {
            Object.entries(values).forEach(([name, value]) => {
                const key = name === 'DEFAULT' ? `--${category}` : `--${category}-${name}`;
                root.style.setProperty(key, value);
            });
        }
    });

    // Typography
    Object.entries(theme.typography.fontFamily).forEach(([name, value]) => {
        root.style.setProperty(`--font-${name}`, value);
    });

    // Border Radius
    Object.entries(theme.borderRadius).forEach(([name, value]) => {
        root.style.setProperty(`--radius-${name}`, value);
    });

    // Spacing
    Object.entries(theme.spacing).forEach(([name, value]) => {
        root.style.setProperty(`--spacing-${name}`, value);
    });
};
