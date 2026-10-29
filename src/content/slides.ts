import type { LucideIcon } from 'lucide-react';
import {
  AtSign,
  CalendarDays,
  ChevronsRight,
  Clock,
  FileSpreadsheet,
  MessageSquareMore,
  MicOff,
  Move,
  Shield,
  Star,
  Timer,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';

/**
 * Texto enriquecido mínimo:
 *  - `*texto*`  → cursiva (anglicismos: as is, to be, kickoff, wording)
 *  - `**texto**` → palabra clave resaltada en cian y negrita
 * Todo el texto se escribe en minúscula/oración; las mayúsculas las pone CSS.
 */
export type Rich = string;

export type Tone = 'light' | 'dark';

/** Posición del arco de fondo (el hilo visual de la presentación). */
export type ArcVariant = 'cover' | 'sweep-top' | 'statement' | 'low' | 'credential' | 'timeline-a' | 'timeline-b' | 'cta' | 'video' | 'none';

export type StageKey = 'arranque' | 'diagnostico' | 'codiseno' | 'justificacion' | 'consolidacion' | 'adopcion';

export interface Stage {
  label: string;
  color: string;
}

/** Colores de etapa: idénticos en las dos fases. */
export const stages: Record<StageKey, Stage> = {
  arranque: { label: 'Arranque', color: '#00A9CE' },
  diagnostico: { label: 'Diagnóstico', color: '#7880CC' },
  codiseno: { label: 'Co-diseño', color: '#1DD2DD' },
  justificacion: { label: 'Justificación', color: '#2AAFBF' },
  consolidacion: { label: 'Consolidación', color: '#B5679B' },
  adopcion: { label: 'Adopción', color: '#1A2340' },
};

interface SlideBase {
  /** Título que se anuncia en la región aria-live. */
  announce: string;
  tone: Tone;
  arc: ArcVariant;
}

export interface CoverSlide extends SlideBase {
  kind: 'cover';
  titleLines: string[];
  image: string;
  imageAlt: string;
  logo: string;
  logoAlt: string;
  footer: string;
}

export interface DiagnosisCard {
  icon: LucideIcon;
  /** Si existe, el título se arma como "<valor animado> <sufijo>". */
  stat?: { value: number; suffix: string };
  heading?: string;
  body: Rich;
}

export interface DiagnosisSlide extends SlideBase {
  kind: 'diagnosis';
  eyebrow: Rich;
  title: string;
  cards: DiagnosisCard[];
}

export interface StatementSlide extends SlideBase {
  kind: 'statement';
  eyebrow: string;
  text: Rich;
}

export interface Pillar {
  icon: LucideIcon;
  name: string;
  description: string;
}

export interface PillarsSlide extends SlideBase {
  kind: 'pillars';
  eyebrow: string;
  title: string;
  pillars: Pillar[];
  impactLabel: string;
  impacts: string[];
}

export interface RoleSlide extends SlideBase {
  kind: 'role';
  eyebrow: string;
  title: string;
  roleLabel: string;
  roleName: string;
  roleIcon: LucideIcon;
  description: string;
  responsibilitiesLabel: string;
  responsibilities: { icon: LucideIcon; text: string }[];
  dedication: { icon: LucideIcon; prefix: string; value: number; suffix: string };
}

export interface Milestone {
  n: number;
  stage: StageKey;
  title: Rich;
  description: Rich;
  date: string;
}

export interface TimelineSlide extends SlideBase {
  kind: 'timeline';
  eyebrow: string;
  title: Rich;
  milestones: Milestone[];
  /** Índice (0-based) del hito actual, marcado con "Estamos aquí". */
  currentIndex?: number;
  currentLabel: string;
  /** Mini barra de progreso global (sólo en la Fase 2). */
  phaseProgress?: {
    /** Nombre accesible de la barra. */
    label: string;
    phases: { name: string; detail: string }[];
    activeIndex: number;
  };
  legend: StageKey[];
  dateIcon: LucideIcon;
}

export interface CtaSlide extends SlideBase {
  kind: 'cta';
  title: string;
  meeting: {
    icon: LucideIcon;
    title: string;
    participantsLabel: string;
    participants: string;
    duration: { icon: LucideIcon; text: string };
  };
  deliverable: { icon: LucideIcon; title: string; text: string };
}

export interface VideoSlide extends SlideBase {
  kind: 'video';
  title: string;
  src: string;
  poster: string;
  videoLabel: string;
  caption: Rich;
}

export interface ClosingSlide extends SlideBase {
  kind: 'closing';
  /** Animación del logotipo (se reproduce una vez, sin sonido). */
  video: string;
  /** Primer cuadro del video (se ve mientras carga). */
  poster: string;
  /** Último cuadro: se muestra fijo con movimiento reducido o si el navegador bloquea el video. */
  finalFrame: string;
  /** Color de fondo del video, para que se funda con la slide. */
  background: string;
  logoAlt: string;
  text: string;
}

export type SlideData =
  | CoverSlide
  | DiagnosisSlide
  | StatementSlide
  | PillarsSlide
  | RoleSlide
  | TimelineSlide
  | CtaSlide
  | VideoSlide
  | ClosingSlide;

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

export const ui = {
  deckLabel: 'Estrategia de notificaciones · TEC360',
  prev: 'Slide anterior',
  next: 'Slide siguiente',
  fullscreenEnter: 'Pantalla completa',
  fullscreenExit: 'Salir de pantalla completa',
  progressLabel: 'Progreso de la presentación',
  announce: (n: number, total: number, title: string) => `Slide ${n} de ${total}: ${title}`,
  dotsLabel: 'Ir a una slide',
  goTo: (n: number, title: string) => `Ir a la slide ${n}: ${title}`,
};

export const slides: SlideData[] = [
  {
    kind: 'cover',
    announce: 'Estrategia de notificaciones',
    tone: 'dark',
    arc: 'cover',
    titleLines: ['Estrategia de', 'notificaciones'],
    image: asset('portada.jpg'),
    imageAlt: 'Dos personas trabajan juntas frente a una laptop, sentadas en un sillón azul.',
    logo: asset('tec360-logo.png'),
    logoAlt: 'TEC360',
    footer: '®2026',
  },
  {
    kind: 'diagnosis',
    announce: 'Radiografía al día de hoy',
    tone: 'light',
    arc: 'sweep-top',
    eyebrow: 'Este es nuestro *as is*',
    title: 'Radiografía al día de hoy',
    cards: [
      {
        icon: AtSign,
        stat: { value: 121, suffix: 'envíos' },
        body: 'Hoy existen 121 correos que puede recibir el aprendedor, desde la atracción hasta el cierre y la insignia.',
      },
      {
        icon: MicOff,
        heading: 'No existe una voz',
        body: 'A lo largo de todos los envíos, el *wording*, el saludo y las palabras utilizadas varían.',
      },
      {
        icon: MessageSquareMore,
        heading: 'Tecnología fragmentada',
        body: 'Se utilizan diferentes herramientas de envío.',
      },
    ],
  },
  {
    kind: 'statement',
    announce: 'Objetivo',
    tone: 'light',
    arc: 'statement',
    eyebrow: 'Objetivo · Hacia dónde vamos',
    text:
      '**Transformar** la estrategia de notificaciones de TEC360 en un modelo **multiplataforma**, **ágil** y **estandarizado**, que **eleve la efectividad** de la comunicación y permita al aprendedor **personalizar** y **decidir** cómo quiere ser notificado a lo largo de su experiencia con TEC360.',
  },
  {
    kind: 'pillars',
    announce: 'Necesidades',
    tone: 'light',
    arc: 'low',
    eyebrow: 'Buscamos que esto suceda',
    title: 'Necesidades',
    pillars: [
      { icon: Timer, name: 'Eficientizar', description: 'Reducir la cantidad de notificaciones que reciben los aprendedores.' },
      { icon: Shield, name: 'Unificar', description: 'No trabajar por silos.' },
      { icon: Star, name: 'Homologar', description: 'Tono, imagen y voz.' },
      { icon: Move, name: 'Personalización', description: 'Darle al aprendedor la capacidad de definir cómo vive su comunicación.' },
    ],
    impactLabel: 'Impacto',
    impacts: [
      'Mejora significativamente la experiencia del aprendedor',
      'Mejora el acompañamiento',
      'Ayuda al aprendedor a priorizar dónde poner su atención',
    ],
  },
  {
    kind: 'role',
    announce: 'Roles específicos del funcional',
    tone: 'light',
    arc: 'credential',
    eyebrow: 'Qué esperamos de cada participante y cuánto tiempo implica',
    title: 'Roles específicos del funcional',
    roleLabel: 'Rol',
    roleName: 'Funcional',
    roleIcon: Wrench,
    description: 'Acompaña el día a día del desarrollo.',
    responsibilitiesLabel: 'Responsabilidades',
    responsibilities: [
      { icon: CalendarDays, text: 'Asistir a reuniones de desarrollo' },
      { icon: ChevronsRight, text: 'Tomar decisiones de avance' },
      { icon: TrendingUp, text: 'Dar seguimiento al desarrollo de la estrategia' },
    ],
    dedication: { icon: Clock, prefix: 'Dedicación:', value: 4, suffix: 'horas al mes' },
  },
  {
    kind: 'timeline',
    announce: 'Roadmap · Fase 1',
    tone: 'light',
    arc: 'timeline-a',
    eyebrow: 'Fase 1 · Definición de reglas de negocio',
    title: '*Roadmap*',
    currentIndex: 0,
    currentLabel: 'Estamos aquí',
    legend: ['arranque', 'diagnostico', 'codiseno', 'justificacion', 'consolidacion', 'adopcion'],
    dateIcon: CalendarDays,
    milestones: [
      {
        n: 1,
        stage: 'arranque',
        title: '*Kickoff* de estrategia',
        description: 'Dar a conocer el paso a paso para desarrollar la estrategia y lo que necesitamos de cada actor.',
        date: '29 de octubre de 2026',
      },
      {
        n: 2,
        stage: 'diagnostico',
        title: 'Sesiones por equipo',
        description: 'Sacar la “radiografía” de cada equipo involucrado: conocer por qué y cómo envían sus correos.',
        date: '5 al 15 de noviembre de 2026',
      },
      {
        n: 3,
        stage: 'diagnostico',
        title: 'Limpieza de correos y definición de limitantes',
        description:
          'Definir qué correos se eliminan, se mueven de plataforma o se modifican, y qué limitantes tendremos en cada plataforma.',
        date: '15 al 25 de noviembre de 2026',
      },
      {
        n: 4,
        stage: 'codiseno',
        title: 'Toque de base con equipos',
        description:
          'Compartir con cada equipo el análisis de sus correos y definir tono, narrativas, plataformas y el *template* de llenado: nuestro principal insumo para la estrategia *to be*.',
        date: '25 de noviembre al 10 de diciembre de 2026',
      },
      {
        n: 5,
        stage: 'justificacion',
        title: '¿Por qué necesitamos este cambio?',
        description:
          'Dimensionar el valor de la transformación, las capacidades requeridas y la ruta de decisión para una evolución relevante para el aprendedor, sostenible para la operación y estratégica para TEC360.',
        date: '18 de diciembre de 2026',
      },
    ],
  },
  {
    kind: 'timeline',
    announce: 'Roadmap · Fase 2',
    tone: 'light',
    arc: 'timeline-b',
    eyebrow: 'Fase 2 · Ajustes y desarrollo de la estrategia',
    title: '*Roadmap*',
    currentLabel: 'Estamos aquí',
    legend: ['arranque', 'diagnostico', 'codiseno', 'justificacion', 'consolidacion', 'adopcion'],
    dateIcon: CalendarDays,
    phaseProgress: {
      label: 'Fase 1 → Fase 2',
      phases: [
        { name: 'Fase 1', detail: 'Definición de reglas de negocio' },
        { name: 'Fase 2', detail: 'Ajustes y desarrollo de la estrategia' },
      ],
      activeIndex: 1,
    },
    milestones: [
      {
        n: 6,
        stage: 'codiseno',
        title: 'Redefinición de estrategia',
        description: 'Con base en el *template* que nos compartan, redefiniremos y crearemos una sola estrategia de notificaciones.',
        date: '5 al 10 de enero de 2027',
      },
      {
        n: 7,
        stage: 'consolidacion',
        title: 'Ensamblado y pulido',
        description: 'De la mano de los equipos, pulir la estrategia y homologarla en un solo camino.',
        date: '10 al 17 de enero de 2027',
      },
      {
        n: 8,
        stage: 'consolidacion',
        title: 'Socialización de la estrategia y creación de HU (MB)',
        description: 'Compartir la estrategia final con los equipos y crear las historias de usuario (HU) que habilitarán la estrategia.',
        date: '18 al 30 de enero de 2027',
      },
      {
        n: 9,
        stage: 'adopcion',
        title: 'Socialización con el equipo de Transformación Digital',
        description: 'Comenzar pláticas con el equipo de Transformación Digital (TD) para la habilitación de la estrategia.',
        date: 'Primera semana de febrero de 2027',
      },
    ],
  },
  {
    kind: 'cta',
    announce: 'Siguiente paso y entregable',
    tone: 'dark',
    arc: 'cta',
    title: 'Siguiente paso y entregable',
    meeting: {
      icon: Users,
      title: 'Reunión de radiografía',
      participantsLabel: 'Participantes:',
      participants: 'líderes funcionales y sus designados',
      duration: { icon: Clock, text: 'Duración: 30 a 60 minutos' },
    },
    deliverable: { icon: FileSpreadsheet, title: 'Entregable', text: 'Excel de envíos' },
  },
  {
    kind: 'video',
    announce: 'Radiografía de envío',
    tone: 'light',
    arc: 'video',
    title: 'Radiografía de envío',
    src: asset('radiografia-demo.mp4'),
    poster: asset('radiografia-poster.jpg'),
    videoLabel: 'Video: mini demo del template de radiografía de correos',
    caption: 'Mini demo del *template* de radiografía de correos para equipos funcionales.',
  },
  {
    kind: 'closing',
    announce: 'Cierre',
    tone: 'light',
    arc: 'none',
    video: asset('tec360-cierre.mp4'),
    poster: asset('tec360-cierre-poster.jpg'),
    finalFrame: asset('tec360-cierre-final.jpg'),
    background: '#FEFEFE',
    logoAlt: 'TEC360',
    text: 'TEC360 · 2026®',
  },
];
