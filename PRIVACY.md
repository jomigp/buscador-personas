# Privacidad y manejo de datos

Esta app maneja datos personales de personas en una emergencia, incluyendo posibles menores y personas fallecidas. El manejo responsable de estos datos es parte del diseño, no un añadido opcional.

## Principios
- **Minimización**: se recoge y muestra solo lo necesario para reunir a una familia. No agregar campos sensibles que no cumplan ese fin.
- **Finalidad única**: los datos existen para la reunificación familiar tras el sismo. No se usan para otros fines.
- **Fuente verificable**: cada registro indica quién lo cargó (`registrado_por`) y si está verificado por un centro.
- **Baja rápida**: un registro puede retirarse de inmediato de la vista pública.

## Quién puede hacer qué
- **Público**: solo lectura de casos abiertos. No puede crear ni editar nada.
- **Personal de salud autenticado**: crea y actualiza registros; puede marcar verificado y cerrar casos.
- La separación se garantiza técnicamente mediante RLS (ver `supabase/schema.sql`), no solo por la interfaz.

## Aviso de privacidad (texto base para el footer público)

> Este buscador existe para ayudar a las familias a localizar a sus seres queridos tras el terremoto del 24 de junio de 2026. La información proviene de personal de salud de los centros participantes. Mostramos solo los datos necesarios para la identificación. Si usted es familiar o representante de una persona listada y desea que su registro se retire o corrija, contáctenos en [CORREO/CANAL DE CONTACTO] y lo atenderemos a la brevedad. Los datos se conservarán únicamente durante la emergencia y se retirarán cuando dejen de ser necesarios.

Reemplazar `[CORREO/CANAL DE CONTACTO]` por un canal real y monitoreado.

## Baja de un registro
- En la práctica, marcar `caso_cerrado = true` retira el registro de la vista pública al instante.
- Debe existir un canal de contacto para que familiares o centros soliciten retiro o corrección.

## Datos especialmente sensibles
- **Menores**: mostrar el mínimo indispensable. Evitar detalles que faciliten su localización por terceros no autorizados.
- **Personas fallecidas**: tratar con respeto y sobriedad; coordinar con el centro la pertinencia de la publicación.

## Seguridad
- La `service_role key` de Supabase NUNCA se usa en el cliente ni se commitea.
- La `anon key` es pública por diseño; la seguridad real la da el RLS.
- Las claves de servicios externos (visión/OCR) viven solo en variables de entorno del servidor.
