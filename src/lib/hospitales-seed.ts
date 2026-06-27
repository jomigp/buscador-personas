// Seed COMPLETO de centros de salud de Venezuela (junio 2026).
// Fuentes: MPPS, IVSS, Gobernaciones, Wikipedia ES, callejero-venezuela.
// Incluye MPPS (hospitales publicos), IVSS, Barrio Adentro (CDI/CAT/SRI),
// Militares y Privados. 241 centros en 24 estados.
//
// El campo `tipo` combina la red y el subtipo (ej. "MPPS - Hospital",
// "BARRIO ADENTRO - CDI", "IVSS - Ambulatorio").

export type HospitalSeed = {
  centro_salud: string;
  estado_geografico: string;
  municipio: string;
  tipo: string;
};

export const HOSPITALES_SEED: HospitalSeed[] = [
  {
    "centro_salud": "Hospital \"Dr. José Gregorio Hernández\"",
    "estado_geografico": "AMAZONAS",
    "municipio": "Atures",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Militar Amazonas",
    "estado_geografico": "AMAZONAS",
    "municipio": "Atures",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Jesús Eduardo Angulo Rivas",
    "estado_geografico": "ANZOÁTEGUI",
    "municipio": "Anaco",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Luis Alberto Rojas",
    "estado_geografico": "ANZOÁTEGUI",
    "municipio": "Freites",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Ybrahím Rodríguez Rojas",
    "estado_geografico": "ANZOÁTEGUI",
    "municipio": "Piar",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Domingo Guzmán Lander",
    "estado_geografico": "ANZOÁTEGUI",
    "municipio": "Simón Bolívar",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario Dr. Luis Razetti",
    "estado_geografico": "ANZOÁTEGUI",
    "municipio": "Simón Bolívar",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Felipe Guevara Rojas",
    "estado_geografico": "ANZOÁTEGUI",
    "municipio": "Simón Rodríguez",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. César Rodríguez Rodríguez",
    "estado_geografico": "ANZOÁTEGUI",
    "municipio": "Sotillo",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Miguel Ángel Blanco\"",
    "estado_geografico": "APURE",
    "municipio": "Achaguas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital General Dr. Pablo Acosta Ortiz",
    "estado_geografico": "APURE",
    "municipio": "Fernando de Apure",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Carlos Luis González\"",
    "estado_geografico": "APURE",
    "municipio": "Pedro Camejo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital General José Antonio Páez",
    "estado_geografico": "APURE",
    "municipio": "Páez",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Cosmopolitan Salud",
    "estado_geografico": "ARAGUA",
    "municipio": "Girardot",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Central de Maracay",
    "estado_geografico": "ARAGUA",
    "municipio": "Girardot",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital José María Vargas (IVSS)",
    "estado_geografico": "ARAGUA",
    "municipio": "Girardot",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario \"Dr. Pedro Emilio Carrillo\"",
    "estado_geografico": "ARAGUA",
    "municipio": "Girardot",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Maternidad \"Dr. Rafael Castillo\"",
    "estado_geografico": "ARAGUA",
    "municipio": "Girardot",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Oswaldo Villalobos Póliz\"",
    "estado_geografico": "ARAGUA",
    "municipio": "José Félix Ribas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. José Ángel Bustamante\"",
    "estado_geografico": "ARAGUA",
    "municipio": "San Casimiro",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Edgar Parra Morales\"",
    "estado_geografico": "ARAGUA",
    "municipio": "Santiago Mariño",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Santos Aníbal Dominici\" (Cagua)",
    "estado_geografico": "ARAGUA",
    "municipio": "Sucre",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Rafael Zamora Arévalo\"",
    "estado_geografico": "ARAGUA",
    "municipio": "Zamora",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Central \"Dr. Luis Razetti\"",
    "estado_geografico": "BARINAS",
    "municipio": "Barinas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Materno Infantil \"Dr. Jesús Briceño Méndez\"",
    "estado_geografico": "BARINAS",
    "municipio": "Barinas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. José María Ortega\"",
    "estado_geografico": "BARINAS",
    "municipio": "Bolívar",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Roberto Vargas Escobar\"",
    "estado_geografico": "BARINAS",
    "municipio": "Pedraza",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Luis Razetti\" / Hospital de Puerto Ordaz",
    "estado_geografico": "BOLÍVAR",
    "municipio": "Caroní",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Raúl Leoni – Guaiparo",
    "estado_geografico": "BOLÍVAR",
    "municipio": "Caroní",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Alfredo Viso Tulia\" (El Callao)",
    "estado_geografico": "BOLÍVAR",
    "municipio": "El Callao",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Héctor Nouel Joubert",
    "estado_geografico": "BOLÍVAR",
    "municipio": "Heres",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Materno Infantil",
    "estado_geografico": "BOLÍVAR",
    "municipio": "Heres",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario \"Ruiz y Páez\"",
    "estado_geografico": "BOLÍVAR",
    "municipio": "Heres",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital del Tórax",
    "estado_geografico": "BOLÍVAR",
    "municipio": "Heres",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Jesús Castro Villasmil\"",
    "estado_geografico": "BOLÍVAR",
    "municipio": "Piar",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Aquiles Ayala\" (Tumeremo)",
    "estado_geografico": "BOLÍVAR",
    "municipio": "Sifontes",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Distrital de Bejuma",
    "estado_geografico": "CARABOBO",
    "municipio": "Bejuma",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Simón Bolívar",
    "estado_geografico": "CARABOBO",
    "municipio": "Diego Ibarra",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Ambulatorio Guacara-Yagua",
    "estado_geografico": "CARABOBO",
    "municipio": "Guacara",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Hospital Dr. Miguel Malpica",
    "estado_geografico": "CARABOBO",
    "municipio": "Guacara",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Ambulatorio Morón",
    "estado_geografico": "CARABOBO",
    "municipio": "Juan José Mora",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Hospital Tipo I de Morón",
    "estado_geografico": "CARABOBO",
    "municipio": "Juan José Mora",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Materno María Ibarra",
    "estado_geografico": "CARABOBO",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Ambulatorio Dra. Bélgica Tovar Herrera",
    "estado_geografico": "CARABOBO",
    "municipio": "Libertador (Tucuyito)",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Inversiones Cofradía",
    "estado_geografico": "CARABOBO",
    "municipio": "Libertador (Tucuyito)",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Ambulatorio Paraparal",
    "estado_geografico": "CARABOBO",
    "municipio": "Los Guayos",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Ambulatorio Dr. Luis Izaguirre Rodríguez",
    "estado_geografico": "CARABOBO",
    "municipio": "Mariara (Diego Ibarra)",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Hospital Metropolitano del Norte",
    "estado_geografico": "CARABOBO",
    "municipio": "Naguanagua",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Oncológico Dr. Miguel Pérez Carreño",
    "estado_geografico": "CARABOBO",
    "municipio": "Naguanagua",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Psiquiátrico Dr. José Ortega Durán (Psiquiátrico de Bárbula)",
    "estado_geografico": "CARABOBO",
    "municipio": "Naguanagua",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario Dr. Ángel Larralde (HUAL / \"Hospital Carabobo\")",
    "estado_geografico": "CARABOBO",
    "municipio": "Naguanagua",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario Dr. Ángel Larralde (HUAL)",
    "estado_geografico": "CARABOBO",
    "municipio": "Naguanagua (Bárbula)",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Ambulatorio Santa Rosa",
    "estado_geografico": "CARABOBO",
    "municipio": "Puerto Cabello",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Hospital Dr. Adolfo Prince Lara",
    "estado_geografico": "CARABOBO",
    "municipio": "Puerto Cabello",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. José Francisco Molina Sierra",
    "estado_geografico": "CARABOBO",
    "municipio": "Puerto Cabello",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Militar Francisco Isnardi",
    "estado_geografico": "CARABOBO",
    "municipio": "Puerto Cabello",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Policlínica El Morro",
    "estado_geografico": "CARABOBO",
    "municipio": "San Diego",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Ambulatorio Dr. Luis Rodríguez Panacci",
    "estado_geografico": "CARABOBO",
    "municipio": "San Joaquín",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Ambulatorio Dr. Emiliano Azcúnez",
    "estado_geografico": "CARABOBO",
    "municipio": "Valencia",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Ambulatorio Dr. Luis Guada Lacau",
    "estado_geografico": "CARABOBO",
    "municipio": "Valencia",
    "tipo": "IVSS - Ambulatorio"
  },
  {
    "centro_salud": "Ciudad Hospitalaria \"Dr. Enrique Tejera\" (CHET)",
    "estado_geografico": "CARABOBO",
    "municipio": "Valencia",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Materno Infantil Dr. José María Vargas",
    "estado_geografico": "CARABOBO",
    "municipio": "Valencia",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Instituto Docente de Oftalmología (IDO)",
    "estado_geografico": "CARABOBO",
    "municipio": "Valencia",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Mundo Trauma",
    "estado_geografico": "CARABOBO",
    "municipio": "Valencia",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Clínica Cojedes",
    "estado_geografico": "COJEDES",
    "municipio": "Ezequiel Zamora",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital General \"Dr. Egor Nucete\"",
    "estado_geografico": "COJEDES",
    "municipio": "Ezequiel Zamora",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Llano Salud APS",
    "estado_geografico": "COJEDES",
    "municipio": "Ezequiel Zamora",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital \"Eugenio Mariano González Padilla\"",
    "estado_geografico": "COJEDES",
    "municipio": "Lima Blanco",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Jesús Mata de Gregorio\" (Pedernales)",
    "estado_geografico": "DELTA AMACURO",
    "municipio": "Pedernales",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Luis Razetti\"",
    "estado_geografico": "DELTA AMACURO",
    "municipio": "Tucupita",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Policlínica Delta",
    "estado_geografico": "DELTA AMACURO",
    "municipio": "Tucupita",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "CDI 23 de Enero",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI Antímano",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI Caricuao",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI Catia",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI El Valle",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI La Vega",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI San Agustín",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "Hospital Militar \"Dr. Carlos Arvelo\"",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MILITAR - Hospital"
  },
  {
    "centro_salud": "Hospital Militar \"Dr. Vicente Salias\"",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MILITAR - Hospital"
  },
  {
    "centro_salud": "Policlínica Metropolitana",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Chacao",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Sanatrix",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Chacao",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Aquamater Maternidad Consciente",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Chacao (Chuao)",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Complejo Hemato-Oncológico Dr. Domingo Luciani",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "El Llanito",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Domingo Luciani",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "El Llanito (Petare)",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Ambulatorio Dr. Dilio Sequera Peraza",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Ambulatorio Dr. Ángel Vicente Ochoa",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. José María Vargas",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Leopoldo Manrique Terrero",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital General Dr. José Gregorio Hernández (Los Magallanes de Catia)",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital General Dr. José Ignacio Baldó (El Algodonal)",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital General de Lídice Dr. Jesús Yerena",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Materno Infantil de Caricuao",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Periférico de Catia",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Psiquiátrico de Caracas",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital de Niños J.M. de los Ríos",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Maternidad Concepción Palacios",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Servicio Oncológico Hospitalario IVSS",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Unidad de Psiquiatría Dr. Jesús Mata de Gregorio",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Urológico San Román",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Fénix Salud (Torre Centro Clínico)",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador (San Bernardino)",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital de Clínicas Caracas",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador (San Bernardino)",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Policlínica La Arboleda",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Libertador (San Bernardino)",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Dr. Miguel Pérez Carreño",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Los Ruices",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Pérez de León I",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Petare",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Pérez de León II",
    "estado_geografico": "DISTRITO CAPITAL",
    "municipio": "Petare",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Rafael Calles Sierra\"",
    "estado_geografico": "FALCÓN",
    "municipio": "Carirubana",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. José Gregorio Hernández\" (Churuguara)",
    "estado_geografico": "FALCÓN",
    "municipio": "Federación",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Adolfo Pons\"",
    "estado_geografico": "FALCÓN",
    "municipio": "Los Taques",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario \"Dr. Alfredo Van Grieken\"",
    "estado_geografico": "FALCÓN",
    "municipio": "Miranda",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Francisco Urdaneta Delgado\"",
    "estado_geografico": "GUÁRICO",
    "municipio": "Francisco de Miranda",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Israel Ranuarez Balza",
    "estado_geografico": "GUÁRICO",
    "municipio": "Juan Germán Roscio",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Eduardo Briceño Méndez\"",
    "estado_geografico": "GUÁRICO",
    "municipio": "Leonardo Infante",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Victorino Santaella\" (Altagracia)",
    "estado_geografico": "GUÁRICO",
    "municipio": "Monagas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Juan Aponte",
    "estado_geografico": "GUÁRICO",
    "municipio": "Rómulo Gallegos",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario Dr. Luis Razetti",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Anzoátegui",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Central de Maracay",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Aragua",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Universitario Ruiz y Páez",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Bolívar",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Ciudad Hospitalaria Dr. Enrique Tejera (CHET)",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Carabobo",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Dr. José María Vargas",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Distrito Capital",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital de Niños J.M. de los Ríos",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Distrito Capital",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Universitario Dr. Alfredo Van Grieken",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Falcón",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Central Antonio María Pineda",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Lara",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Universitario Antonio María Pineda",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Lara",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Dr. Manuel Núñez Tovar",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Monagas",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Universitario de Los Andes (IAHULA)",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Mérida",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Universitario Dr. Miguel Oráa (HUMO)",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Portuguesa",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Universitario Dr. Antonio Patricio de Alcalá (HUPAA)",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Sucre",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Central Dr. Ernesto Revenga",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Táchira",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital \"Dr. José María Vargas\" (La Guaira)",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Vargas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Simón Rodríguez\"",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Vargas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "IEQ Centro del Este CA",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Vargas",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Central Dr. Urquinaona",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Zulia",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital General del Sur Dr. Pedro Iturbe",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Zulia",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital Universitario de Maracaibo (HUM)",
    "estado_geografico": "LA GUAIRA (anteriormente Vargas)",
    "municipio": "Zulia",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital \"Dr. Luis Beltrán Leal\" (Sanare)",
    "estado_geografico": "LARA",
    "municipio": "Andrés Eloy Blanco",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Pastor Oropeza\"",
    "estado_geografico": "LARA",
    "municipio": "Iribarren",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Central \"Antonio María Pineda\"",
    "estado_geografico": "LARA",
    "municipio": "Iribarren",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Pediátrico \"Dr. Agustín Zubillaga\"",
    "estado_geografico": "LARA",
    "municipio": "Iribarren",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario \"Antonio María Pineda\"",
    "estado_geografico": "LARA",
    "municipio": "Iribarren",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "IEQ Centro del Este",
    "estado_geografico": "LARA",
    "municipio": "Iribarren",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital \"Dr. Félix Rodríguez Díaz\"",
    "estado_geografico": "LARA",
    "municipio": "Jiménez",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Rafael González Plaza\"",
    "estado_geografico": "LARA",
    "municipio": "Torres",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Hermógenes Rivero Saldívia",
    "estado_geografico": "MIRANDA",
    "municipio": "Acevedo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "CDI El Guapo",
    "estado_geografico": "MIRANDA",
    "municipio": "Andrés Bello (Barlovento)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "Ambulatorio Dr. José González Navarro",
    "estado_geografico": "MIRANDA",
    "municipio": "Baruta (La Trinidad)",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital General de Higuerote",
    "estado_geografico": "MIRANDA",
    "municipio": "Brión",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "CDI La Loma",
    "estado_geografico": "MIRANDA",
    "municipio": "Brión (Cúpira)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "Maternidad Cirila Vegas",
    "estado_geografico": "MIRANDA",
    "municipio": "Buroz",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Maternidad de Carrizal",
    "estado_geografico": "MIRANDA",
    "municipio": "Carrizal",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital José Ramón Figuera",
    "estado_geografico": "MIRANDA",
    "municipio": "Cristóbal Rojas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Santa Teresita de Jesús",
    "estado_geografico": "MIRANDA",
    "municipio": "Independencia",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Ambulatorio Los Teques",
    "estado_geografico": "MIRANDA",
    "municipio": "Libertador",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital General Dr. Victorino Santaella Ruiz",
    "estado_geografico": "MIRANDA",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Luis Razetti",
    "estado_geografico": "MIRANDA",
    "municipio": "Paz Castillo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Jesús León Rivas",
    "estado_geografico": "MIRANDA",
    "municipio": "Pedro Gual",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Francisco Rafael García",
    "estado_geografico": "MIRANDA",
    "municipio": "Plaza",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "CDI La Vaquera",
    "estado_geografico": "MIRANDA",
    "municipio": "Plaza (Guarenas)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI Oropeza",
    "estado_geografico": "MIRANDA",
    "municipio": "Plaza (Guarenas)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI San José",
    "estado_geografico": "MIRANDA",
    "municipio": "Plaza (Guarenas)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "Hospital Dr. Luis Salazar Domínguez",
    "estado_geografico": "MIRANDA",
    "municipio": "Plaza (Guarenas)",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Ernesto Regener",
    "estado_geografico": "MIRANDA",
    "municipio": "Páez",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "CDI San Antonio de Yare",
    "estado_geografico": "MIRANDA",
    "municipio": "Simón Bolívar",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "Hospital Materno Infantil del Este Dr. Yoel Valencia Parpacen",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Pérez de León II",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "CDI Río de Janeiro",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre (El Llanito)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "Hospital Dr. Domingo Luciani",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre (El Llanito)",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Unidad de Psiquiatría Dr. Jesús Mata de Gregorio",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre (Los Chorros)",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "CDI Barrio Bolívar",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre (Petare)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI La Urbina I y II",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre (Petare)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI Los Dos Caminos",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre (Petare)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI Paulo VI",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre (Petare)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "CDI San Miguel Arcángel",
    "estado_geografico": "MIRANDA",
    "municipio": "Sucre (Petare)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "Hospital General Simón Bolívar",
    "estado_geografico": "MIRANDA",
    "municipio": "Tomás Lander",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "CDI Cristóbal Rojas",
    "estado_geografico": "MIRANDA",
    "municipio": "Tomás Lander (Ocumare)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "Hospital Dr. Miguel Osío de Cúa",
    "estado_geografico": "MIRANDA",
    "municipio": "Urdaneta",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Ambulatorio Dr. Julio de Armas",
    "estado_geografico": "MIRANDA",
    "municipio": "Urdaneta (Cúa)",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Oscio",
    "estado_geografico": "MIRANDA",
    "municipio": "Urdaneta (Cúa)",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital General Eugenio P. D'Bellad",
    "estado_geografico": "MIRANDA",
    "municipio": "Zamora",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "CAT Antonio Treviño",
    "estado_geografico": "MIRANDA",
    "municipio": "Zamora (Guatire)",
    "tipo": "BARRIO ADENTRO - CAT"
  },
  {
    "centro_salud": "CDI Pedro José Doria",
    "estado_geografico": "MIRANDA",
    "municipio": "Zamora (Guatire)",
    "tipo": "BARRIO ADENTRO - CDI"
  },
  {
    "centro_salud": "Hospital Petrolero / PDVSA",
    "estado_geografico": "MONAGAS",
    "municipio": "",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Luis Daniel Beauperthuy\"",
    "estado_geografico": "MONAGAS",
    "municipio": "Caripe",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. José Gregorio Hernández\" (Punta de Mata)",
    "estado_geografico": "MONAGAS",
    "municipio": "Ezequiel Zamora",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Manuel Núñez Tovar\"",
    "estado_geografico": "MONAGAS",
    "municipio": "Maturín",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Eduardo Orta Marcano\"",
    "estado_geografico": "MÉRIDA",
    "municipio": "Alberto Adriani",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Alberto Zaccara",
    "estado_geografico": "MÉRIDA",
    "municipio": "Libertador",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario de Los Andes (IAHULA)",
    "estado_geografico": "MÉRIDA",
    "municipio": "Libertador",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Tulio Febres Cordero\" (Santa Bárbara)",
    "estado_geografico": "MÉRIDA",
    "municipio": "Obispos",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Juan Pablo Peña\"",
    "estado_geografico": "MÉRIDA",
    "municipio": "Rangel",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. José Gregorio Hernández\"",
    "estado_geografico": "MÉRIDA",
    "municipio": "Sucre",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Buenaventura García\"",
    "estado_geografico": "NUEVA ESPARTA",
    "municipio": "Arismendi",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Plácido Plaza\"",
    "estado_geografico": "NUEVA ESPARTA",
    "municipio": "Gómez",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Luis Ortega\"",
    "estado_geografico": "NUEVA ESPARTA",
    "municipio": "Maneiro",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Héctor Pouey\"",
    "estado_geografico": "NUEVA ESPARTA",
    "municipio": "Marcano",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Ricardo Longobardi\"",
    "estado_geografico": "PORTUGUESA",
    "municipio": "Araure",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. José Francisco Torrealba\"",
    "estado_geografico": "PORTUGUESA",
    "municipio": "Guanare",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Baudilio Lara\"",
    "estado_geografico": "PORTUGUESA",
    "municipio": "Páez",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario \"Dr. Miguel Oráa\" (HUMO)",
    "estado_geografico": "PORTUGUESA",
    "municipio": "Páez",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Celestino Hernández Placer\"",
    "estado_geografico": "SUCRE",
    "municipio": "",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Luis Figueroa\"",
    "estado_geografico": "SUCRE",
    "municipio": "Bermúdez",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Ramón Orozco Álvarez\"",
    "estado_geografico": "SUCRE",
    "municipio": "Cajigal",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Tulio Arends\"",
    "estado_geografico": "SUCRE",
    "municipio": "Sucre",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario \"Dr. Antonio Patricio de Alcalá\" (HUPAA)",
    "estado_geografico": "SUCRE",
    "municipio": "Sucre",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Manuel Enrique Tovar",
    "estado_geografico": "TRUJILLO",
    "municipio": "",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. José Santos Millán\"",
    "estado_geografico": "TRUJILLO",
    "municipio": "Boconó",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Carlos Solórzano Zerpa\"",
    "estado_geografico": "TRUJILLO",
    "municipio": "Pampánito",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Central de Trujillo \"Dr. Pedro Emilio Carrillo\"",
    "estado_geografico": "TRUJILLO",
    "municipio": "Trujillo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Florencio Jiménez\"",
    "estado_geografico": "TRUJILLO",
    "municipio": "Valera",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Felipe Guevara Rojas\" (Colón)",
    "estado_geografico": "TÁCHIRA",
    "municipio": "Ayacucho",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. José Gregorio Hernández\" (Frontera)",
    "estado_geografico": "TÁCHIRA",
    "municipio": "Bolívar",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Luis Razetti\" (Táriba)",
    "estado_geografico": "TÁCHIRA",
    "municipio": "Cárdenas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Manuel Anselmi\"",
    "estado_geografico": "TÁCHIRA",
    "municipio": "Jáuregui",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Central \"Dr. Ernesto Revenga\"",
    "estado_geografico": "TÁCHIRA",
    "municipio": "San Cristóbal",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Regional \"Dr. Patrocinio Peñuela Ruiz\"",
    "estado_geografico": "TÁCHIRA",
    "municipio": "San Cristóbal",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Raimundo Villasmil\"",
    "estado_geografico": "YARACUY",
    "municipio": "Bolívar",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Rafael Vicente Andrade\"",
    "estado_geografico": "YARACUY",
    "municipio": "Bruzual",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Julio Cruz Álvarez\"",
    "estado_geografico": "YARACUY",
    "municipio": "Peña",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Plácido Daniel Rodríguez Rivero\"",
    "estado_geografico": "YARACUY",
    "municipio": "San Felipe",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. Adolfo D'Empaire\"",
    "estado_geografico": "ZULIA",
    "municipio": "Cabimas",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "New Clínica D'Empaire",
    "estado_geografico": "ZULIA",
    "municipio": "Cabimas",
    "tipo": "PRIVADO - Clínica"
  },
  {
    "centro_salud": "Hospital \"Dr. Carlos Eduardo García\"",
    "estado_geografico": "ZULIA",
    "municipio": "Machiques de Perijá",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital \"Dr. José Prudencio Padilla\"",
    "estado_geografico": "ZULIA",
    "municipio": "Mara",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Central \"Dr. Urquinaona\"",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Clínico",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Coromoto",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Dr. Manuel Noriega Trigo",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Hospital General del Sur \"Dr. Pedro Iturbe\"",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Madre Rafols",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Materno Infantil de Cuatricentenario",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Materno Infantil de El Marite",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Militar",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Universitario de Maracaibo (HUM)",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital de Niños (Foundation Hospital of Pediatrics)",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital de Policías",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "IVSS Ambulatorio Norte de Maracaibo",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "IVSS - Hospital"
  },
  {
    "centro_salud": "Maternidad Castillo Plaza",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital Chiquinquirá",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo (Parroquia Chiquinquirá)",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Unidad de Radioterapia y Medicina Nuclear \"Dr. Jorge García Tamayo\"",
    "estado_geografico": "ZULIA",
    "municipio": "Maracaibo (Parroquia Chiquinquirá)",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "Hospital de Niños \"Dr. Jorge Lizarraga\" (Ciudad Ojeda)",
    "estado_geografico": "ZULIA",
    "municipio": "Valmore Rodríguez",
    "tipo": "MPPS - Hospital"
  },
  {
    "centro_salud": "AME Asistencia Médica (Punto Fijo/Falcón)",
    "estado_geografico": "ZULIA",
    "municipio": "—",
    "tipo": "PRIVADO - Clínica"
  }
];
