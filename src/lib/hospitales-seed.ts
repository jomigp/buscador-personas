// Seed de hospitales publicos de Venezuela extraidos del Monitor de
// Hospitales de Convite AC (junio 2026). 171 hospitales publicos.
//
// Usado por getDistinctValues() para que el autocomplete de los formularios
// tenga sugerencias desde el primer paciente - antes de que se cargue
// ningun registro real.
//
// No es exhaustivo ni oficial. La idea es reducir errores de tipeo y dar
// consistencia a los nombres. Los centros que no esten aca se pueden
// agregar manualmente - se acumulan en la BD y aparecen junto a estos.

export type HospitalSeed = {
  centro_salud: string;
  estado_geografico: string;
  municipio: string;
  tipo: string;
};

export const HOSPITALES_SEED: HospitalSeed[] = [
  {
    "centro_salud": "Hospital Dr. Jose Gregorio Hernandez",
    "estado_geografico": "Amazonas",
    "municipio": "Autonomo Atures",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Jesus Eduardo Angulo Rivas",
    "estado_geografico": "Anzoátegui",
    "municipio": "Anaco",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Rafael Rangel",
    "estado_geografico": "Anzoátegui",
    "municipio": "Aragua",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Antonio Jose Rondon Lugo",
    "estado_geografico": "Anzoátegui",
    "municipio": "Manuel Ezequiel Bruzual",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Pedro Gomez Rolingson",
    "estado_geografico": "Anzoátegui",
    "municipio": "Piritu",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Luis Razetti",
    "estado_geografico": "Anzoátegui",
    "municipio": "Simon Bolivar",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Dr. Francisco Antonio Risqu Ez",
    "estado_geografico": "Apure",
    "municipio": "Achaguas",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Lorenza Castillo",
    "estado_geografico": "Apure",
    "municipio": "Pedro Camejo",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Romulo Gallegos",
    "estado_geografico": "Apure",
    "municipio": "Romulo Gallegos Urbana",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Jose Antonio Paez",
    "estado_geografico": "Apure",
    "municipio": "Paez",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Pablo Acosta Ortiz",
    "estado_geografico": "Apure",
    "municipio": "San Fernando",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Nuestra Señora De La Caridad",
    "estado_geografico": "Aragua",
    "municipio": "San Sebastian",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital . Jose Rangel (Corposalud) Hospit Al Villa De Cura Cura Av. Bolivar",
    "estado_geografico": "Aragua",
    "municipio": "Zamora",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Hospital Central de Maracay",
    "estado_geografico": "Aragua",
    "municipio": "Girardot",
    "tipo": ""
  },
  {
    "centro_salud": "Hospital Dr. Jesus Arnoldo Camacho Peña",
    "estado_geografico": "Barinas",
    "municipio": "Alberto Arvelo Torrealba",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Jose Leon Tapia",
    "estado_geografico": "Barinas",
    "municipio": "Antonio Jose De Sucre",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Luis Razeti",
    "estado_geografico": "Barinas",
    "municipio": "Barinas",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Primero De D",
    "estado_geografico": "Barinas",
    "municipio": "Barinas",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Nuestra Señora Del Car Men",
    "estado_geografico": "Barinas",
    "municipio": "Olivar",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Francisco Lazo Marti",
    "estado_geografico": "Barinas",
    "municipio": "Edraza",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Manuel Heredia Salas",
    "estado_geografico": "Barinas",
    "municipio": "Ojas",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital COMPLEJO HOSPITALARIO UNIVERSITARIO RUIZ Y PÁEZ",
    "estado_geografico": "Bolívar",
    "municipio": "Heres",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Dr. Americo Babo",
    "estado_geografico": "Bolívar",
    "municipio": "nd",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Raul Leoni O. (Ivss)",
    "estado_geografico": "Bolívar",
    "municipio": "Caroni",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital 25 De Marzo I Bolívar",
    "estado_geografico": "Bolívar",
    "municipio": "nd",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Uyapar (Ivss)",
    "estado_geografico": "Bolívar",
    "municipio": "Caroni",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Dr. Arnoldo Gabaldon",
    "estado_geografico": "Bolívar",
    "municipio": "Cedeño",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Rosario Vera Zurita",
    "estado_geografico": "Bolívar",
    "municipio": "nd",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Militar Dr. Cesar Ares Bello D Estriban",
    "estado_geografico": "Bolívar",
    "municipio": "nd",
    "tipo": "militar"
  },
  {
    "centro_salud": "Hospital Hector Nouel Joubert (Ivss)",
    "estado_geografico": "Bolívar",
    "municipio": "Heres",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Guri Ormesa",
    "estado_geografico": "Bolívar",
    "municipio": "Bolivariano Angostura",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Bejuma",
    "estado_geografico": "Carabobo",
    "municipio": "Bejuma",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Miguel Malpica",
    "estado_geografico": "Carabobo",
    "municipio": "Guacara",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Vía",
    "estado_geografico": "Carabobo",
    "municipio": "Naguanagua",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Dr. Francisco Molina Sierra (Iv Ss)",
    "estado_geografico": "Carabobo",
    "municipio": "Puerto Cabello",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Enrique Tejera",
    "estado_geografico": "Carabobo",
    "municipio": "Valencia",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital La Mon Umental La Monumental Valencia",
    "estado_geografico": "Carabobo",
    "municipio": "Valencia",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Joaquina De Rotondaro",
    "estado_geografico": "Cojedes",
    "municipio": "Tinaquillo",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Juan Aponte - El Baul",
    "estado_geografico": "Cojedes",
    "municipio": "Girardot",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Entrada A La Ciudad De Las Vegas Av Bolívar",
    "estado_geografico": "Cojedes",
    "municipio": "Romulo Gallegos",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Egor Nucette H. De San Car Los",
    "estado_geografico": "Cojedes",
    "municipio": "Ezequiel Zamora",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Luis Gomez Zabaleta",
    "estado_geografico": "Delta Amacuro",
    "municipio": "Antonio Diaz",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Complejo Hospitalario Dr. Luis Razetti",
    "estado_geografico": "Delta Amacuro",
    "municipio": "Tucupita",
    "tipo": ""
  },
  {
    "centro_salud": "Hospital Ricardo Baquero Gonzalez",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Jose Maria Vargas",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Av. San Martin Av. San Martín",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital J.m. De Los Rios",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Jose Ignacio Baldo (Algodonal)",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "militar"
  },
  {
    "centro_salud": "Hospital Materno Infantil Pastor Oropeza De Caricuao",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Jesus Yerena",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Cardiologico Infantil",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Av. Anauco Av. Anauco",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Francisco Antonio Risquez",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Carlos Arvelo (Hosp. Militar )",
    "estado_geografico": "Distrito Capital",
    "municipio": "Bolivariano Libertador",
    "tipo": "militar"
  },
  {
    "centro_salud": "Hospital Hospital Perez Carreño",
    "estado_geografico": "Distrito Capital",
    "municipio": "Distrito Capital",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital San Luis",
    "estado_geografico": "Falcón",
    "municipio": "Bolivar",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Simon Bolivar",
    "estado_geografico": "Falcón",
    "municipio": "Bolivar",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Tn. Pedro M Chirinos (Defensa)",
    "estado_geografico": "Falcón",
    "municipio": "Carirubana",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Dr. Juvenal Bracho El Cardon (Ivss) Comunidad Cardon Sector Maraven",
    "estado_geografico": "Falcón",
    "municipio": "Carirubana",
    "tipo": ""
  },
  {
    "centro_salud": "Hospital Rafael Calle Sierra (Ivss) Ho Spital Punta Cardon Punto Fijo",
    "estado_geografico": "Falcón",
    "municipio": "Carirubana",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Dr. Enrique Zavala",
    "estado_geografico": "Falcón",
    "municipio": "Dabajuro",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Egmidio Rios",
    "estado_geografico": "Falcón",
    "municipio": "Federacion",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Carlos Diez Del Ciervo Ho Spital Ju Dibana Prolongacion Av. El Centro",
    "estado_geografico": "Falcón",
    "municipio": "Los Taques",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Ped. Jesus Garcia Coello (Ivss) Ho Spital Ju Dibana Sector Judibana Judibana",
    "estado_geografico": "Falcón",
    "municipio": "Los Taques",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Romulo Farias Ho Spital Me Ne De Mauroa Calle Democracia Diagonal Comando",
    "estado_geografico": "Falcón",
    "municipio": "Mauroa",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr.alfredo Van Grieken",
    "estado_geografico": "Falcón",
    "municipio": "Miranda",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Rafael Gallardo (Ivss)",
    "estado_geografico": "Falcón",
    "municipio": "Miranda",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Jose Maria Espinoza",
    "estado_geografico": "Falcón",
    "municipio": "Miranda",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Lino Arevalo",
    "estado_geografico": "Falcón",
    "municipio": "Silva",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Francisco Bustamante",
    "estado_geografico": "Falcón",
    "municipio": "Zamora",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital HOSPITAL GENERAL DR. ISRAEL RANUÁREZ BALZA",
    "estado_geografico": "Guárico",
    "municipio": "Juan German Roscio",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Rafael Zamora Arevalo",
    "estado_geografico": "Guárico",
    "municipio": "Leonardo Infante",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Dr. Pedro Del Corral",
    "estado_geografico": "Guárico",
    "municipio": "Jose Felix Ribas",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital D R. Francisco Troconis",
    "estado_geografico": "Guárico",
    "municipio": "Pedro Zaraza",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital D R. Francisco Antonio Risquez",
    "estado_geografico": "Guárico",
    "municipio": "Julian Mellado",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital D R. Jose Francisco Urdaneta D",
    "estado_geografico": "Guárico",
    "municipio": "Francisco De Miranda",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr Jose Maria Vargas (Ivss)",
    "estado_geografico": "La Guaira",
    "municipio": "Vargas",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital HOSPITAL DR. PASTOR OROPEZA R.",
    "estado_geografico": "Lara",
    "municipio": "Iribarren",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital HOSPITAL CENTRAL UNIVERSITARIO DR. ANTONIO MARÍA PINEDA",
    "estado_geografico": "Lara",
    "municipio": "Iribarren",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Dr. Jose Maria Bengoa",
    "estado_geografico": "Lara",
    "municipio": "Andres Eloy Blanco",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Rafael Antonio Gil",
    "estado_geografico": "Lara",
    "municipio": "Crespo",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Esp. Ped. Agustin Zubillaga",
    "estado_geografico": "Lara",
    "municipio": "Iribarren",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Central Univ. Dr. Antonio Maria Pi Neda Ubicado En La Zona Centro Norte. En Av.",
    "estado_geografico": "Lara",
    "municipio": "Iribarren",
    "tipo": ""
  },
  {
    "centro_salud": "Hospital Dr. Juan Daza Pereira (Ivss)",
    "estado_geografico": "Lara",
    "municipio": "Iribarren",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital La Carucieña Hospita L Urb. La Carucieña Sector I - Av. 4 Esquina Calle 8 Sector Ii Telefono",
    "estado_geografico": "Lara",
    "municipio": "Iribarren",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Pastor Oropeza (Ivss) Hospita L Andres E Loy Blanco Av. L Av. La Salle Entre Av. Florencio Jimenez Y",
    "estado_geografico": "Lara",
    "municipio": "Iribarren",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Dr. Baudilio Lara",
    "estado_geografico": "Lara",
    "municipio": "Jimenez",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Egidio Montesino Ho Spital El Tocuyo -66 El Tocuyo",
    "estado_geografico": "Lara",
    "municipio": "Moran",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Armando Velasquez Mago",
    "estado_geografico": "Lara",
    "municipio": "Simon Planas",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Pastor Oropeza",
    "estado_geografico": "Lara",
    "municipio": "Torres",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Luis Ignacio Montero Hospit Al Siquis Ique 9 Siquisique",
    "estado_geografico": "Lara",
    "municipio": "Urdaneta",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital El Vigia",
    "estado_geografico": "Mérida",
    "municipio": "Alberto Adriani",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Tulio Febres Cordero (La Azulita)",
    "estado_geografico": "Mérida",
    "municipio": "Andres Bello",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Puerto Rico Sector Puerto Rico Mérida",
    "estado_geografico": "Mérida",
    "municipio": "Antonio Pinto Salinas",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Canagua Ho Spital Canagua Bolivar Farmacia Canagua Media Cuadra Plaza",
    "estado_geografico": "Mérida",
    "municipio": "Arzobispo Chacon",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Santo Domingo",
    "estado_geografico": "Mérida",
    "municipio": "Cardenal Quintero",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Rafael Rangel",
    "estado_geografico": "Mérida",
    "municipio": "Miranda",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Francisco V. Gutierrez (Mucuchies)",
    "estado_geografico": "Mérida",
    "municipio": "Rangel",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Bailadores",
    "estado_geografico": "Mérida",
    "municipio": "Rivas Davila",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Lagunillas",
    "estado_geografico": "Mérida",
    "municipio": "Sucre",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital San Jose De Tovar Ho Spital San Jose Carrera 4 Ta Av. Tachira El Llano Tovar Mérida Táchira",
    "estado_geografico": "Mérida",
    "municipio": "Tovar",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Universitario De Los Andes",
    "estado_geografico": "Mérida",
    "municipio": "Libertador",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Dr. Hermogenes Rivero Saldivia",
    "estado_geografico": "Miranda",
    "municipio": "Acevedo",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Higuerote",
    "estado_geografico": "Miranda",
    "municipio": "Brion",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Ti Po I Carriz Al Capital Cementer Maternidad De Bajo Riesgo Y Atencion Calle Principal De Carrrizal Diagonal Al",
    "estado_geografico": "Miranda",
    "municipio": "Carrizal",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. V Ictorino Santaella",
    "estado_geografico": "Miranda",
    "municipio": "Guaicaipuro",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Santa Teresita De Jesus",
    "estado_geografico": "Miranda",
    "municipio": "Independencia",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. E Rnesto Regener",
    "estado_geografico": "Miranda",
    "municipio": "Paez",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. L Uis Razetti",
    "estado_geografico": "Miranda",
    "municipio": "Paz Castillo",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Jesus Leon Rivas",
    "estado_geografico": "Miranda",
    "municipio": "Dro Gual",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Luis Salazar Dominguez (Ivss)",
    "estado_geografico": "Miranda",
    "municipio": "Aza",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Perez De Leon Ii",
    "estado_geografico": "Miranda",
    "municipio": "Cre",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital T Ipo Ii La Urbina Calle",
    "estado_geografico": "Miranda",
    "municipio": "Cre",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Domin Go Luciani (Ivss)",
    "estado_geografico": "Miranda",
    "municipio": "Cre",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Dr. M Iguel Osio",
    "estado_geografico": "Miranda",
    "municipio": "Urdaneta",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital HOSPITAL UNIVERSITARIO DR. MANUEL NÚÑEZ TOVAR",
    "estado_geografico": "Monagas",
    "municipio": "Maturín",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Dr. David Espinoza Rojas",
    "estado_geografico": "Nueva Esparta",
    "municipio": "Arismendi",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Agustin Rafael Hernandez",
    "estado_geografico": "Nueva Esparta",
    "municipio": "Marcano",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Central Dr. Luis Ortega (Ivss)",
    "estado_geografico": "Nueva Esparta",
    "municipio": "Mariño",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Dr. Armando Mata Sanchez",
    "estado_geografico": "Nueva Esparta",
    "municipio": "Tubores",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital De Agua Blanca",
    "estado_geografico": "Portuguesa",
    "municipio": "Agua Blanca",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Jesus M. Casal Ramos",
    "estado_geografico": "Portuguesa",
    "municipio": "Araure",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Dr. Oswaldo Barrios",
    "estado_geografico": "Portuguesa",
    "municipio": "Esteller",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Capital Guanare Ipasme Guanare Unidades Casco Central Guanare Av. Limonero (Al Lado Del Hospital) Con",
    "estado_geografico": "Portuguesa",
    "municipio": "Guanare",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Universitario Dr. Miguel O Raa",
    "estado_geografico": "Portuguesa",
    "municipio": "Guanare",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Dr. Raul Humberto De P Ascuali",
    "estado_geografico": "Portuguesa",
    "municipio": "Ospino",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Armando Delgado Monte Ro",
    "estado_geografico": "Portuguesa",
    "municipio": "Turen",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Pedro R. Figallo",
    "estado_geografico": "Sucre",
    "municipio": "Arismendi",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Santos Anibal Dominicci",
    "estado_geografico": "Sucre",
    "municipio": "Bermudez",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital I Yaguaraparo",
    "estado_geografico": "Sucre",
    "municipio": "Cajigal",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Virgen Del Valle",
    "estado_geografico": "Sucre",
    "municipio": "Cruz Salmeron Acosta",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Freddy Mocary De Irapa",
    "estado_geografico": "Sucre",
    "municipio": "Mariño",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Luis D. Beauperthuy",
    "estado_geografico": "Sucre",
    "municipio": "Montes",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Diego Carbonell Hospit Al Comuni Dad Cariaco Cariaco",
    "estado_geografico": "Sucre",
    "municipio": "Ribero",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Julio Rodriguez Hospit Al Parroq Uia Altagracia Altagracia",
    "estado_geografico": "Sucre",
    "municipio": "Sucre",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital U. Antonio Patricio De Alcala",
    "estado_geografico": "Sucre",
    "municipio": "Sucre",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Dr. Andres Gutierrez Solis",
    "estado_geografico": "Sucre",
    "municipio": "Valdez",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Hospital Central San Cristobal",
    "estado_geografico": "Táchira",
    "municipio": "San Cristóbal",
    "tipo": ""
  },
  {
    "centro_salud": "Hospital HOSPITAL DR. PEDRO EMILIO CARRILLO",
    "estado_geografico": "Trujillo",
    "municipio": "Valera",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Maria Arcelis Alvarez",
    "estado_geografico": "Trujillo",
    "municipio": "Rafael Rangel",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Jose Vasallo Cortez",
    "estado_geografico": "Trujillo",
    "municipio": "Sucre",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Jose Elias Landinez",
    "estado_geografico": "Yaracuy",
    "municipio": "Bolivar",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Tiburcio Garrido",
    "estado_geografico": "Yaracuy",
    "municipio": "Bruzual",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital P Adre Oliveros Hospita L Nirgua (Capital)",
    "estado_geografico": "Yaracuy",
    "municipio": "Nirgua",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital D R. Placido Daniel Rodriguez",
    "estado_geografico": "Yaracuy",
    "municipio": "San Felipe",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital UNIVERSITARIO DE MARACAIBO",
    "estado_geografico": "Zulia",
    "municipio": "Maracaibo",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Isla De Toas",
    "estado_geografico": "Zulia",
    "municipio": "Almirante Padilla",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital El Guayabo Ho Spital El Guayabo Es Av. Principal El Guayabo Al Lado Del",
    "estado_geografico": "Zulia",
    "municipio": "Catatumbo",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Santa Barbara",
    "estado_geografico": "Zulia",
    "municipio": "Colon",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital De",
    "estado_geografico": "Zulia",
    "municipio": "Jesus Enrique Lossada",
    "tipo": "militar"
  },
  {
    "centro_salud": "Hospital Concepcion Dr. Jose Maria Varg As",
    "estado_geografico": "Zulia",
    "municipio": "Jesus Enrique Lossada",
    "tipo": "militar"
  },
  {
    "centro_salud": "Hospital Casigua El Cubo",
    "estado_geografico": "Zulia",
    "municipio": "Jesus Maria Semprun",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital La Concepcion Urdaneta",
    "estado_geografico": "Zulia",
    "municipio": "La Cañada De Urdaneta",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Dr. Pedro Garcia Clara (Ivss)",
    "estado_geografico": "Zulia",
    "municipio": "Lagunillas",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Nuestra Señora Del Carmen",
    "estado_geografico": "Zulia",
    "municipio": "Machiques De Perija",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital San Rafael De Mara",
    "estado_geografico": "Zulia",
    "municipio": "Mara",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Central Dr. Urquinaona",
    "estado_geografico": "Zulia",
    "municipio": "Maracaibo",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital De Niños",
    "estado_geografico": "Zulia",
    "municipio": "Maracaibo",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Pedro Iturbe (General Del S Ur)",
    "estado_geografico": "Zulia",
    "municipio": "Maracaibo",
    "tipo": "IV"
  },
  {
    "centro_salud": "Hospital Ministerio Del Poder Popular Para Las Comunas",
    "estado_geografico": "Zulia",
    "municipio": "Maracaibo",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Adolfo Pons (Ivss)",
    "estado_geografico": "Zulia",
    "municipio": "Maracaibo",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Nuestra Señora De Chiquinquira",
    "estado_geografico": "Zulia",
    "municipio": "Maracaibo",
    "tipo": "III"
  },
  {
    "centro_salud": "Hospital Francisco Eugenio Bus Tamante Urb. Cuatricentenario Barrio Segunda",
    "estado_geografico": "Zulia",
    "municipio": "Maracaibo",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Matern. Inf. Dr. Raul Leoni (E)",
    "estado_geografico": "Zulia",
    "municipio": "Maracaibo",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Hugo Parra Leon",
    "estado_geografico": "Zulia",
    "municipio": "Miranda",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Sinamaica",
    "estado_geografico": "Zulia",
    "municipio": "Guajira",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Guajira Centro De Diagnostico Integral Paraguaipoa Centros De Diagnóstico Integra L Paraguaipoa Campo San Indigena Bolivariano Av.principal De Paraguaipoa.sector",
    "estado_geografico": "Zulia",
    "municipio": "Guajira",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Nuestra Señora Del Rosario",
    "estado_geografico": "Zulia",
    "municipio": "Rosario De Perija",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Matern. Inf. Dr. Rafael Belloso (E )",
    "estado_geografico": "Zulia",
    "municipio": "San Francisco",
    "tipo": "II"
  },
  {
    "centro_salud": "Hospital Dr. Senen Castillo Reverol",
    "estado_geografico": "Zulia",
    "municipio": "Santa Rita",
    "tipo": "I"
  },
  {
    "centro_salud": "Hospital Parroquia Romulo Gallego",
    "estado_geografico": "Zulia",
    "municipio": "Sucre",
    "tipo": "I"
  }
];
