import { primitives } from './primitives'

export const semantic = {
  color: {
    background: {
      default: primitives.color.neutral[50],
      surface: primitives.color.neutral[0],
      subtle:  primitives.color.neutral[100],
      muted:   primitives.color.neutral[200],
    },
    text: {
      default:   primitives.color.neutral[900],
      secondary: primitives.color.neutral[600],
      muted:     primitives.color.neutral[400],
      inverse:   primitives.color.neutral[0],
      brand:     primitives.color.rose[500],
    },
    border: {
      default: primitives.color.neutral[200],
      strong:  primitives.color.neutral[300],
      brand:   primitives.color.rose[300],
      focus:   primitives.color.rose[500],
    },
    brand: {
      default: primitives.color.rose[500],
      hover:   primitives.color.rose[600],
      active:  primitives.color.rose[700],
      subtle:  primitives.color.rose[50],
      muted:   primitives.color.rose[100],
    },
    status: {
      success: primitives.color.green[500],
      successBg: primitives.color.green[50],
      warning: primitives.color.amber[500],
      warningBg: primitives.color.amber[50],
      error:   primitives.color.rose[500],
      errorBg: primitives.color.rose[50],
      info:    primitives.color.blue[500],
      infoBg:  primitives.color.blue[50],
    },
  },
  space: {
    component: {
      xs: primitives.space[1],
      sm: primitives.space[2],
      md: primitives.space[4],
      lg: primitives.space[6],
      xl: primitives.space[8],
    },
    layout: {
      sm:  primitives.space[4],
      md:  primitives.space[8],
      lg:  primitives.space[12],
      xl:  primitives.space[16],
      '2xl': primitives.space[20],
    },
  },
  radius: {
    component: primitives.radius.md,
    card:      primitives.radius.lg,
    modal:     primitives.radius.xl,
    pill:      primitives.radius.full,
    tag:       primitives.radius.full,
  },
  shadow: {
    card:      primitives.shadow.sm,
    cardHover: primitives.shadow.md,
    modal:     primitives.shadow.xl,
    dropdown:  primitives.shadow.lg,
  },
  font: {
    family: {
      sans: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Geist Mono", "Fira Code", monospace',
    },
    size: {
      label:   primitives.fontSize.xs,
      caption: primitives.fontSize.sm,
      body:    primitives.fontSize.md,
      bodyLg:  primitives.fontSize.lg,
      h4:      primitives.fontSize.lg,
      h3:      primitives.fontSize.xl,
      h2:      primitives.fontSize['2xl'],
      h1:      primitives.fontSize['3xl'],
      display: primitives.fontSize['4xl'],
    },
    weight: primitives.fontWeight,
    lineHeight: primitives.lineHeight,
  },
} as const