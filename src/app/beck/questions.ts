// src/app/beck/questions.ts

export interface Opcion {
  optionId: string; // identificador único (ej. "1-0", "16-1a")
  valor: number; // puntuación según BDI-II (0,1,2,3)
  texto: string;
}

export interface Pregunta {
  id: number;
  texto: string;
  opciones: Opcion[];
}

export const preguntas: Pregunta[] = [
  {
    id: 1,
    texto: "Tristeza",
    opciones: [
      { optionId: "1-0", valor: 0, texto: "No me siento triste." },
      {
        optionId: "1-1",
        valor: 1,
        texto: "Me siento triste gran parte del tiempo.",
      },
      { optionId: "1-2", valor: 2, texto: "Me siento triste todo el tiempo." },
      {
        optionId: "1-3",
        valor: 3,
        texto:
          "Me siento tan triste o soy tan infeliz que no puedo soportarlo.",
      },
    ],
  },
  {
    id: 2,
    texto: "Pesimismo",
    opciones: [
      {
        optionId: "2-0",
        valor: 0,
        texto: "No estoy desalentado respecto de mi futuro.",
      },
      {
        optionId: "2-1",
        valor: 1,
        texto:
          "Me siento más desalentado respecto de mi futuro que lo que solía estarlo.",
      },
      {
        optionId: "2-2",
        valor: 2,
        texto: "No espero que las cosas funcionen para mí.",
      },
      {
        optionId: "2-3",
        valor: 3,
        texto:
          "Siento que no hay esperanza para mi futuro y que sólo puede empeorar.",
      },
    ],
  },
  {
    id: 3,
    texto: "Fracaso",
    opciones: [
      { optionId: "3-0", valor: 0, texto: "No me siento como un fracasado." },
      {
        optionId: "3-1",
        valor: 1,
        texto: "He fracasado más de lo que hubiera debido.",
      },
      {
        optionId: "3-2",
        valor: 2,
        texto: "Cuando miro hacia atrás, veo muchos fracasos.",
      },
      {
        optionId: "3-3",
        valor: 3,
        texto: "Siento que como persona soy un fracaso total.",
      },
    ],
  },
  {
    id: 4,
    texto: "Pérdida de Placer",
    opciones: [
      {
        optionId: "4-0",
        valor: 0,
        texto:
          "Obtengo tanto placer como siempre por las cosas de las que disfruto.",
      },
      {
        optionId: "4-1",
        valor: 1,
        texto: "No disfruto tanto de las cosas como solía hacerlo.",
      },
      {
        optionId: "4-2",
        valor: 2,
        texto: "Obtengo muy poco placer de las cosas que solía disfrutar.",
      },
      {
        optionId: "4-3",
        valor: 3,
        texto:
          "No puedo obtener ningún placer de las cosas de las que solía disfrutar.",
      },
    ],
  },
  {
    id: 5,
    texto: "Sentimientos de Culpa",
    opciones: [
      {
        optionId: "5-0",
        valor: 0,
        texto: "No me siento particularmente culpable.",
      },
      {
        optionId: "5-1",
        valor: 1,
        texto:
          "Me siento culpable respecto de varias cosas que he hecho o que debería haber hecho.",
      },
      {
        optionId: "5-2",
        valor: 2,
        texto: "Me siento bastante culpable la mayor parte del tiempo.",
      },
      {
        optionId: "5-3",
        valor: 3,
        texto: "Me siento culpable todo el tiempo.",
      },
    ],
  },
  {
    id: 6,
    texto: "Sentimientos de Castigo",
    opciones: [
      {
        optionId: "6-0",
        valor: 0,
        texto: "No siento que esté siendo castigado.",
      },
      {
        optionId: "6-1",
        valor: 1,
        texto: "Siento que tal vez pueda ser castigado.",
      },
      { optionId: "6-2", valor: 2, texto: "Espero ser castigado." },
      {
        optionId: "6-3",
        valor: 3,
        texto: "Siento que estoy siendo castigado.",
      },
    ],
  },
  {
    id: 7,
    texto: "Disconformidad con uno mismo",
    opciones: [
      {
        optionId: "7-0",
        valor: 0,
        texto: "Siento acerca de mí lo mismo que siempre.",
      },
      {
        optionId: "7-1",
        valor: 1,
        texto: "He perdido la confianza en mí mismo.",
      },
      { optionId: "7-2", valor: 2, texto: "Estoy decepcionado conmigo mismo." },
      { optionId: "7-3", valor: 3, texto: "No me gusto a mí mismo." },
    ],
  },
  {
    id: 8,
    texto: "Autocrítica",
    opciones: [
      {
        optionId: "8-0",
        valor: 0,
        texto: "No me critico ni me culpo más de lo habitual.",
      },
      {
        optionId: "8-1",
        valor: 1,
        texto: "Estoy más crítico conmigo mismo de lo que solía estarlo.",
      },
      {
        optionId: "8-2",
        valor: 2,
        texto: "Me critico a mí mismo por todos mis errores.",
      },
      {
        optionId: "8-3",
        valor: 3,
        texto: "Me culpo a mí mismo por todo lo malo que sucede.",
      },
    ],
  },
  {
    id: 9,
    texto: "Pensamientos o Deseos Suicidas",
    opciones: [
      {
        optionId: "9-0",
        valor: 0,
        texto: "No tengo ningún pensamiento de matarme.",
      },
      {
        optionId: "9-1",
        valor: 1,
        texto: "He tenido pensamientos de matarme, pero no lo haría.",
      },
      { optionId: "9-2", valor: 2, texto: "Querría matarme." },
      {
        optionId: "9-3",
        valor: 3,
        texto: "Me mataría si tuviera la oportunidad de hacerlo.",
      },
    ],
  },
  {
    id: 10,
    texto: "Llanto",
    opciones: [
      {
        optionId: "10-0",
        valor: 0,
        texto: "No lloro más de lo que solía hacerlo.",
      },
      {
        optionId: "10-1",
        valor: 1,
        texto: "Lloro más de lo que solía hacerlo.",
      },
      { optionId: "10-2", valor: 2, texto: "Lloro por cualquier pequeñez." },
      {
        optionId: "10-3",
        valor: 3,
        texto: "Siento ganas de llorar pero no puedo.",
      },
    ],
  },
  {
    id: 11,
    texto: "Agitación",
    opciones: [
      {
        optionId: "11-0",
        valor: 0,
        texto: "No estoy más inquieto o tenso que lo habitual.",
      },
      {
        optionId: "11-1",
        valor: 1,
        texto: "Me siento más inquieto o tenso que lo habitual.",
      },
      {
        optionId: "11-2",
        valor: 2,
        texto:
          "Estoy tan inquieto o agitado que me es difícil quedarme quieto.",
      },
      {
        optionId: "11-3",
        valor: 3,
        texto:
          "Estoy tan inquieto o agitado que tengo que estar siempre en movimiento o haciendo algo.",
      },
    ],
  },
  {
    id: 12,
    texto: "Pérdida de Interés",
    opciones: [
      {
        optionId: "12-0",
        valor: 0,
        texto: "No he perdido el interés en otras actividades o personas.",
      },
      {
        optionId: "12-1",
        valor: 1,
        texto: "Estoy menos interesado que antes en otras personas o cosas.",
      },
      {
        optionId: "12-2",
        valor: 2,
        texto: "He perdido casi todo el interés en otras personas o cosas.",
      },
      {
        optionId: "12-3",
        valor: 3,
        texto: "Me es difícil interesarme por algo.",
      },
    ],
  },
  {
    id: 13,
    texto: "Indecisión",
    opciones: [
      {
        optionId: "13-0",
        valor: 0,
        texto: "Tomo mis propias decisiones tan bien como siempre.",
      },
      {
        optionId: "13-1",
        valor: 1,
        texto: "Me resulta más difícil que de costumbre tomar decisiones.",
      },
      {
        optionId: "13-2",
        valor: 2,
        texto:
          "Encuentro mucha más dificultad que antes para tomar decisiones.",
      },
      {
        optionId: "13-3",
        valor: 3,
        texto: "Tengo problemas para tomar cualquier decisión.",
      },
    ],
  },
  {
    id: 14,
    texto: "Desvalorización",
    opciones: [
      { optionId: "14-0", valor: 0, texto: "No siento que yo no sea valioso." },
      {
        optionId: "14-1",
        valor: 1,
        texto:
          "No me considero a mí mismo tan valioso y útil como solía considerarme.",
      },
      {
        optionId: "14-2",
        valor: 2,
        texto: "Me siento menos valioso cuando me comparo con otros.",
      },
      { optionId: "14-3", valor: 3, texto: "Siento que no valgo nada." },
    ],
  },
  {
    id: 15,
    texto: "Pérdida de Energía",
    opciones: [
      {
        optionId: "15-0",
        valor: 0,
        texto: "Tengo tanta energía como siempre.",
      },
      {
        optionId: "15-1",
        valor: 1,
        texto: "Tengo menos energía que la que solía tener.",
      },
      {
        optionId: "15-2",
        valor: 2,
        texto: "No tengo suficiente energía para hacer demasiado.",
      },
      {
        optionId: "15-3",
        valor: 3,
        texto: "No tengo energía suficiente para hacer nada.",
      },
    ],
  },
  {
    id: 16,
    texto: "Cambios en los Hábitos de Sueño",
    opciones: [
      {
        optionId: "16-0",
        valor: 0,
        texto: "No he experimentado ningún cambio en mis hábitos de sueño.",
      },
      {
        optionId: "16-1a",
        valor: 1,
        texto: "Duermo un poco más que lo habitual.",
      },
      {
        optionId: "16-1b",
        valor: 1,
        texto: "Duermo un poco menos que lo habitual.",
      },
      {
        optionId: "16-2a",
        valor: 2,
        texto: "Duermo mucho más que lo habitual.",
      },
      {
        optionId: "16-2b",
        valor: 2,
        texto: "Duermo mucho menos que lo habitual.",
      },
      {
        optionId: "16-3a",
        valor: 3,
        texto: "Duermo la mayor parte del día.",
      },
      {
        optionId: "16-3b",
        valor: 3,
        texto:
          "Me despierto 1-2 horas más temprano y no puedo volver a dormirme.",
      },
    ],
  },

  {
    id: 17,
    texto: "Irritabilidad",
    opciones: [
      {
        optionId: "17-0",
        valor: 0,
        texto: "No estoy tan irritable que lo habitual.",
      },
      {
        optionId: "17-1",
        valor: 1,
        texto: "Estoy más irritable que lo habitual.",
      },
      {
        optionId: "17-2",
        valor: 2,
        texto: "Estoy mucho más irritable que lo habitual.",
      },
      { optionId: "17-3", valor: 3, texto: "Estoy irritable todo el tiempo." },
    ],
  },
  {
    id: 18,
    texto: "Cambios en el Apetito",
    opciones: [
      {
        optionId: "18-0",
        valor: 0,
        texto: "No he experimentado ningún cambio en mi apetito.",
      },
      {
        optionId: "18-1a",
        valor: 1,
        texto: "Mi apetito es un poco menor que lo habitual.",
      },
      {
        optionId: "18-1b",
        valor: 1,
        texto: "Mi apetito es un poco mayor que lo habitual.",
      },
      {
        optionId: "18-2a",
        valor: 2,
        texto: "Mi apetito es mucho menor que antes.",
      },
      {
        optionId: "18-2b",
        valor: 2,
        texto: "Mi apetito es mucho mayor que lo habitual.",
      },
      {
        optionId: "18-3a",
        valor: 3,
        texto: "No tengo apetito en absoluto.",
      },
      {
        optionId: "18-3b",
        valor: 3,
        texto: "Quiero comer todo el día.",
      },
    ],
  },
  {
    id: 19,
    texto: "Dificultad de Concentración",
    opciones: [
      {
        optionId: "19-0",
        valor: 0,
        texto: "Puedo concentrarme tan bien como siempre.",
      },
      {
        optionId: "19-1",
        valor: 1,
        texto: "No puedo concentrarme tan bien como habitualmente.",
      },
      {
        optionId: "19-2",
        valor: 2,
        texto: "Me es difícil mantener la mente en algo por mucho tiempo.",
      },
      {
        optionId: "19-3",
        valor: 3,
        texto: "Encuentro que no puedo concentrarme en nada.",
      },
    ],
  },
  {
    id: 20,
    texto: "Cansancio o Fatiga",
    opciones: [
      {
        optionId: "20-0",
        valor: 0,
        texto: "No estoy más cansado o fatigado que lo habitual.",
      },
      {
        optionId: "20-1",
        valor: 1,
        texto: "Me fatigo o me canso más fácilmente que lo habitual.",
      },
      {
        optionId: "20-2",
        valor: 2,
        texto:
          "Estoy demasiado fatigado o cansado para hacer muchas de las cosas que solía hacer.",
      },
      {
        optionId: "20-3",
        valor: 3,
        texto:
          "Estoy demasiado fatigado o cansado para hacer la mayoría de las cosas que solía hacer.",
      },
    ],
  },
  {
    id: 21,
    texto: "Pérdida de Interés en el Sexo",
    opciones: [
      {
        optionId: "21-0",
        valor: 0,
        texto: "No he notado ningún cambio reciente en mi interés por el sexo.",
      },
      {
        optionId: "21-1",
        valor: 1,
        texto: "Estoy menos interesado en el sexo de lo que solía estarlo.",
      },
      {
        optionId: "21-2",
        valor: 2,
        texto: "Estoy mucho menos interesado en el sexo.",
      },
      {
        optionId: "21-3",
        valor: 3,
        texto: "He perdido completamente el interés en el sexo.",
      },
    ],
  },
];
